# ShopAI — AI Assistant (Azure OpenAI hookup)

The chat UI is finished. It needs one backend endpoint to become a real AI assistant. This page is for whoever builds that endpoint.

**What's needed:** deploy one Lambda behind `POST /assistant` that calls Azure OpenAI, then set `VITE_API_BASE_URL` in the frontend. **No React code has to change.**

## What already exists

| File | What it does |
|---|---|
| `src/components/ChatWidget.jsx` | Floating chat button (bottom-right on marketplace pages) that opens a panel. Hide and expand controls, suggestion chips, typing indicator, error bubble, product suggestion rows. |
| `src/services/assistantService.js` | The only place the UI talks to the AI. `sendMessage(messages)` returns `{ reply, productIds }`. |
| `src/services/api.js` | `apiFetch()` plus `isApiConfigured` (true when `VITE_API_BASE_URL` is set). |

**Until the backend exists**, `VITE_API_BASE_URL` is unset, so `assistantService` waits about 0.6 s and replies "The AI assistant isn't connected yet…". The UI is fully usable for demos in that state.

## API contract

### Request

```
POST {VITE_API_BASE_URL}/assistant
Content-Type: application/json
```

```json
{
  "messages": [
    { "role": "user", "content": "Gift ideas under ₹2,000" },
    { "role": "assistant", "content": "Here are a few ideas…" },
    { "role": "user", "content": "Something for a runner?" }
  ],
  "catalog": [
    { "id": "PROD-401", "name": "Apex Aero Responsive Running Shoes", "category": "Sports", "price": 4999, "rating": 4.7, "storeName": "FitZone", "stock": 19 }
  ]
}
```

- `messages` is oldest first, at most the last 10, in OpenAI chat format (`role` is `user` or `assistant`). The last message must be from the user.
- `catalog` (optional) is the live product list from the browser's localStorage, so answers match what the shopper sees (prices, stock, merchant-added products). The backend caps it at 200 rows and only links ids from it. Once products live in DynamoDB, the backend should load them itself and ignore this field.
- Failed replies shown in the UI are **not** included.
- There is no auth header yet (see Security).

### Success response (`200`)

```json
{
  "reply": "The FitZone running shoes are a great pick…",
  "productIds": ["PROD-401", "PROD-402"]
}
```

- `reply` (string, required): shown as the assistant's bubble. Plain text; line breaks are kept.
- `productIds` (string array, optional): ShopAI product ids. The UI looks them up with `productService.getProductById` and shows clickable rows (image, name, price, rating). Unknown ids are ignored. Send `[]` or omit it when there are none.

### Error response (any non-2xx)

```json
{ "message": "Human-readable reason" }
```

The UI shows a generic "Something went wrong. Please try again." bubble; the message goes to the browser console.

## Local dev backend (working now)

`server/assistant.mjs` is a dependency-free Node server (Node 22.9+) that implements this contract against the real Azure OpenAI resource. It grounds answers on the `catalog` the browser sends, falling back to the seed catalog in `src/services/initialData.js`. It listens on `127.0.0.1` only, allows a single CORS origin, caps request bodies at 256 KB and times out Azure calls after 20 s.

| Azure | Value |
|---|---|
| Resource group | `shopai-rg` (South India) |
| Azure OpenAI resource | `shopai-openai-6962` |
| Deployment | `gpt-4.1-mini` (GlobalStandard, 50K tokens/min) |

1. Create `server/.env.local` (git-ignored) with `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`, `ALLOWED_ORIGIN=http://localhost:5173` and `PORT=8787`. The key comes from `az cognitiveservices account keys list -g shopai-rg -n shopai-openai-6962`.
2. Create `.env.local` with `VITE_API_BASE_URL=http://localhost:8787`.
3. Run `npm run server` and `npm run dev` in two terminals.

The Lambda below is a starting point for production. Port the server's validation too: role filtering, the last-message-is-user check, the content-filter and malformed-JSON handling in `parseModelReply`, and the Azure timeout.

## Lambda sketch (Node.js 20+)

```js
// assistant/index.mjs — POST /assistant
const { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT } = process.env;
const API_VERSION = '2024-10-21'; // check Azure docs for the current GA version

const cors = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export const handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body ?? '{}');
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ message: 'messages is required' }) };
    }

    // 1. Load a small product catalog to ground the answer (DynamoDB ShopAI_Products, or a filtered Query)
    const products = await loadProducts(); // [{ id, name, category, price, rating, storeName }]

    // 2. Ask Azure OpenAI
    const res = await fetch(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_API_KEY },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt(products) },
            ...messages.filter(m => m?.role === 'user' || m?.role === 'assistant').slice(-10).map(({ role, content }) => ({ role, content: String(content).slice(0, 2000) }))
          ],
          max_tokens: 400,
          temperature: 0.4,
          response_format: { type: 'json_object' }
        })
      }
    );
    if (!res.ok) throw new Error(`Azure OpenAI ${res.status}`);
    const data = await res.json();

    // 3. Return { reply, productIds } — keep only ids that really exist
    const parsed = JSON.parse(data.choices[0].message.content ?? '{}') ?? {};
    const known = new Set(products.map(p => p.id));
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        reply: String(parsed.reply ?? ''),
        productIds: (Array.isArray(parsed.productIds) ? parsed.productIds : []).filter(id => known.has(id)).slice(0, 4)
      })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ message: 'Assistant unavailable' }) };
  }
};

const systemPrompt = (products) => `You are ShopAI's shopping assistant for an Indian multi-vendor marketplace. Prices are in INR.
Only recommend products from this catalog (JSON): ${JSON.stringify(products)}
Returns: 7-day doorstep pickup. Free delivery on orders above ₹1,500.
If you don't know something (e.g. a specific order's status), say so and point the user to the Orders page.
Answer in at most 4 short sentences.
Respond as JSON: {"reply": string, "productIds": string[]} (productIds = ids from the catalog you recommend, max 4).`;
```

`loadProducts()` is left to the implementer. The simplest version is `Scan` on `ShopAI_Products`, projecting `id, name, category, price, rating, storeName` (about 26 products today). Filter it before sending if the catalog grows. See [cloud-migration.md](cloud-migration.md) for the tables.

## Configuration

| Where | Name | Example |
|---|---|---|
| Lambda env | `AZURE_OPENAI_ENDPOINT` | `https://my-shopai.openai.azure.com` |
| Lambda env (or Secrets Manager) | `AZURE_OPENAI_API_KEY` | from Azure portal, Keys and Endpoint |
| Lambda env | `AZURE_OPENAI_DEPLOYMENT` | the deployment name, e.g. `gpt-4o-mini` |
| Lambda env | `ALLOWED_ORIGIN` | `http://localhost:5173`, later the real site URL |
| Frontend `.env.local` | `VITE_API_BASE_URL` | `https://abc123.execute-api.ap-south-1.amazonaws.com` |

- In **API Gateway** (HTTP API), add the route `POST /assistant` to this Lambda and enable CORS for the frontend origin (methods `POST, OPTIONS`; header `Content-Type`).
- After editing `.env.local`, restart `npm run dev`. Vite reads env vars only at startup.

## Security and cost

- **Never** put the Azure key in the frontend or in git. It lives only in the Lambda environment or Secrets Manager.
- **Limit spend:** `max_tokens` caps output; the Lambda trims history to 10 messages of up to 2,000 characters; add API Gateway throttling (e.g. 5 requests per second per client) and an Azure spending alert.
- **No auth yet:** anyone who can reach the URL can call it. When the auth Lambdas exist, send the user's token (`apiFetch(..., { token })`) and reject anonymous calls.
- **Validate model output:** the sketch drops product ids that aren't in the catalog, so the UI never links to made-up products.

## Test it

1. Without a backend: open the app, click the chat button, send a message, and see the "isn't connected yet" reply.
2. With the Lambda deployed: `curl -X POST "$API/assistant" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"best rated electronics"}]}'` returns `{ "reply": "…", "productIds": [...] }`.
3. Set `VITE_API_BASE_URL`, restart `npm run dev`, and ask "gift ideas under ₹2,000": you get a real reply plus clickable product rows that open the product page.
4. Stop the Lambda or return a 500: the red "Something went wrong" bubble appears and the chat keeps working.
