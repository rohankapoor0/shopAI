// Local dev backend for the AI shopping assistant: POST /assistant -> Azure OpenAI.
// Implements the contract in docs/ai-assistant.md. Run with `npm run server` (reads server/.env.local).
import { createServer } from 'node:http';
import { INITIAL_PRODUCTS } from '../src/services/initialData.js';

const { AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT, ALLOWED_ORIGIN = 'http://localhost:5173', PORT = 8787 } = process.env;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, '');
const HOST = process.env.HOST ?? '127.0.0.1';
const API_VERSION = '2024-10-21';
const MAX_HISTORY = 10;
const MAX_CONTENT = 2000;
const MAX_CATALOG = 200;
const MAX_BODY_BYTES = 256 * 1024;
const AZURE_TIMEOUT_MS = 20000;

if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT) {
  console.error('Missing AZURE_OPENAI_* settings. Create server/.env.local (see docs/ai-assistant.md).');
  process.exit(1);
}

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Compact, prompt-safe product row. Accepts seed products or the catalog the browser sends.
const toCatalogRow = (p) => ({
  id: String(p.id).slice(0, 40),
  name: String(p.name ?? '').slice(0, 120),
  category: String(p.category ?? '').slice(0, 40),
  price: Number(p.price) || 0,
  rating: Number(p.rating) || 0,
  storeName: String(p.storeName ?? '').slice(0, 60),
  inStock: Number(p.stock) > 0
});

// The app's live catalog is in the browser's localStorage, so the client sends it with each request.
// The seed catalog is the fallback; swap both for a DynamoDB Scan once products move to the cloud.
const SEED_CATALOG = INITIAL_PRODUCTS.map(toCatalogRow);

const parseCatalog = (catalog) => {
  if (!Array.isArray(catalog) || catalog.length === 0) return SEED_CATALOG;
  return catalog.filter(p => p && p.id && p.name).slice(0, MAX_CATALOG).map(toCatalogRow);
};

const systemPrompt = (products) => `You are ShopAI's shopping assistant for an Indian multi-vendor marketplace. Prices are in INR.
Only recommend products from this catalog (JSON): ${JSON.stringify(products)}
Never recommend products whose inStock is false unless the user asks about them by name; then say they are out of stock.
Returns: 7-day doorstep pickup. Free delivery on orders above ₹1,500.
If you don't know something (e.g. a specific order's status), say so and point the user to the Orders page.
Answer in at most 4 short sentences.
Respond as JSON: {"reply": string, "productIds": string[]} (productIds = ids from the catalog you recommend, max 4).`;

const toHistory = (messages) => messages
  .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
  .slice(-MAX_HISTORY)
  .map(({ role, content }) => ({ role, content: content.slice(0, MAX_CONTENT) }));

// Turns the model's message into { reply, productIds }, tolerating non-JSON or partial output.
const parseModelReply = (choice, knownIds) => {
  if (choice?.finish_reason === 'content_filter' || !choice?.message?.content) {
    return { reply: "Sorry, I can't help with that. Ask me about products, delivery or returns.", productIds: [] };
  }
  let parsed;
  try {
    parsed = JSON.parse(choice.message.content);
  } catch {
    parsed = null;
  }
  if (!parsed || typeof parsed !== 'object' || typeof parsed.reply !== 'string' || !parsed.reply.trim()) {
    throw new Error(`Unusable model output (finish_reason ${choice.finish_reason})`);
  }
  // Keep only ids that really exist, so the UI never links to made-up products.
  const productIds = (Array.isArray(parsed.productIds) ? parsed.productIds : [])
    .filter(id => knownIds.has(id))
    .slice(0, 4);
  return { reply: parsed.reply.trim(), productIds: [...new Set(productIds)] };
};

const askAssistant = async (history, products) => {
  let res;
  try {
    res = await fetch(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_API_KEY },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt(products) }, ...history],
          max_tokens: 600,
          temperature: 0.4,
          response_format: { type: 'json_object' }
        }),
        signal: AbortSignal.timeout(AZURE_TIMEOUT_MS)
      }
    );
  } catch (err) {
    if (err.name === 'TimeoutError') throw new HttpError(504, 'Assistant timed out');
    throw err;
  }
  if (res.status === 429) throw new HttpError(429, 'Assistant is busy, please try again shortly');
  if (!res.ok) throw new Error(`Azure OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return parseModelReply(data.choices?.[0], new Set(products.map(p => p.id)));
};

const send = (res, status, body) => {
  res.writeHead(status, { ...cors, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

// Answers 413 first, then drops the connection so the rest of the upload is never read.
const sendTooLarge = (req, res, message) => {
  res.writeHead(413, { ...cors, 'Content-Type': 'application/json', 'Connection': 'close' });
  res.end(JSON.stringify({ message }), () => req.destroy());
};

// Collects raw Buffers (so multi-byte UTF-8 split across chunks survives) and stops reading past the limit.
const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      req.pause();
      req.removeAllListeners('data');
      reject(new HttpError(413, 'Request body too large'));
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
});

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }
  // Not new URL(): a leading "//" would be read as a host. Collapse slashes and drop the query instead.
  const pathname = req.url.split('?')[0].replace(/\/{2,}/g, '/').replace(/(.)\/$/, '$1');
  if (req.method !== 'POST' || pathname !== '/assistant') {
    return send(res, 404, { message: 'Not found' });
  }

  try {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch (err) {
      throw err instanceof HttpError ? err : new HttpError(400, 'Invalid JSON body');
    }

    const history = Array.isArray(body?.messages) ? toHistory(body.messages) : [];
    if (history.length === 0 || history.at(-1).role !== 'user') {
      throw new HttpError(400, 'messages must end with a user message');
    }

    send(res, 200, await askAssistant(history, parseCatalog(body.catalog)));
  } catch (err) {
    if (err instanceof HttpError && err.status === 413) return sendTooLarge(req, res, err.message);
    if (err instanceof HttpError) return send(res, err.status, { message: err.message });
    console.error(err);
    send(res, 500, { message: 'Assistant unavailable' });
  }
}).listen(PORT, HOST, () => console.log(`ShopAI assistant on http://${HOST}:${PORT}/assistant (deployment: ${AZURE_OPENAI_DEPLOYMENT})`));
