// POST /assistant -> Azure OpenAI. Contract: docs/ai-assistant.md. Answers are grounded on the Products table.
import { TABLES, HttpError, scanAll } from './lib.mjs';

const API_VERSION = '2024-10-21';
const MAX_HISTORY = 10;
const MAX_CONTENT = 2000;
const MAX_CATALOG = 200;
const AZURE_TIMEOUT_MS = 20000;

// Compact, prompt-safe product row
const toCatalogRow = (p) => ({
  id: String(p.id).slice(0, 40),
  name: String(p.name ?? '').slice(0, 120),
  category: String(p.category ?? '').slice(0, 40),
  price: Number(p.price) || 0,
  rating: Number(p.rating) || 0,
  storeName: String(p.storeName ?? '').slice(0, 60),
  inStock: Number(p.stock) > 0
});

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
  const productIds = (Array.isArray(parsed.productIds) ? parsed.productIds : []).filter(id => knownIds.has(id));
  return { reply: parsed.reply.trim(), productIds: [...new Set(productIds)].slice(0, 4) };
};

export const ask = async ({ body }) => {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, '');
  const { AZURE_OPENAI_API_KEY: apiKey, AZURE_OPENAI_DEPLOYMENT: deployment } = process.env;
  if (!endpoint || !apiKey || !deployment) throw new HttpError(503, 'The assistant is not configured');

  const history = Array.isArray(body.messages) ? toHistory(body.messages) : [];
  if (history.length === 0 || history.at(-1).role !== 'user') throw new HttpError(400, 'messages must end with a user message');

  const products = (await scanAll(TABLES.products)).slice(0, MAX_CATALOG).map(toCatalogRow);

  let res;
  try {
    res = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${API_VERSION}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        messages: [{ role: 'system', content: systemPrompt(products) }, ...history],
        max_tokens: 600,
        temperature: 0.4,
        response_format: { type: 'json_object' }
      }),
      signal: AbortSignal.timeout(AZURE_TIMEOUT_MS)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') throw new HttpError(504, 'Assistant timed out');
    throw err;
  }
  if (res.status === 429) throw new HttpError(429, 'Assistant is busy, please try again shortly');
  if (!res.ok) throw new Error(`Azure OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return parseModelReply(data.choices?.[0], new Set(products.map(p => p.id)));
};
