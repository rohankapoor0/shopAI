# ShopAI — AI Assistant (Azure OpenAI)

The chat widget is connected to Azure OpenAI through the ShopAI Lambda (`POST /assistant`, in `backend/src/assistant.mjs`). It is deployed with the rest of the backend (see [cloud-migration.md](cloud-migration.md)).

## Pieces

| File | What it does |
|---|---|
| `src/components/ChatWidget.jsx` | Floating chat button (bottom-right on marketplace pages) that opens a panel. Hide and expand controls, suggestion chips, typing indicator, error bubble, product suggestion rows. |
| `src/services/assistantService.js` | `sendMessage(messages)` returns `{ reply, productIds }` through `apiFetch('/assistant')`. |
| `backend/src/assistant.mjs` | Validates the history, loads the catalog from the Products table, calls Azure OpenAI in JSON mode and keeps only real product ids. |

| Azure | Value |
|---|---|
| Resource group | `shopai-rg` (South India) |
| Azure OpenAI resource | `shopai-openai-6962` |
| Deployment | `gpt-4.1-mini` (GlobalStandard, 50K tokens/min) |

The endpoint, key and deployment are SAM parameters (`AzureOpenAiEndpoint`, `AzureOpenAiKey`, `AzureOpenAiDeployment`). Get the key with `az cognitiveservices account keys list -g shopai-rg -n shopai-openai-6962`. If they are empty, the route returns 503 and the widget shows its error bubble.

## API contract

### Request

`POST {VITE_API_BASE_URL}/assistant` with `Authorization: Bearer <token>` (signed-in users only).

```json
{
  "messages": [
    { "role": "user", "content": "Gift ideas under ₹2,000" },
    { "role": "assistant", "content": "Here are a few ideas…" },
    { "role": "user", "content": "Something for a runner?" }
  ]
}
```

- `messages` is oldest first, at most the last 10, each at most 2,000 characters, with `role` set to `user` or `assistant`. The last message must be from the user.
- Failed replies shown in the UI are not included.
- The catalog comes from DynamoDB on the server (at most 200 rows), so answers match live prices and stock.

### Success response (`200`)

```json
{ "reply": "The FitZone running shoes are a great pick…", "productIds": ["PROD-401", "PROD-402"] }
```

- `reply` is plain text, and line breaks are kept.
- `productIds` holds at most 4 ids, only ones that exist in the catalog. The UI shows them as clickable rows.

### Errors

Any non-2xx response is `{ "message": "..." }`. Examples: 400 for bad history, 429 when Azure is busy, 503 when the assistant isn't configured, 504 when Azure times out (20 s). The UI shows "Something went wrong. Please try again."

## Guardrails

- The Azure key exists only in the Lambda environment, never in the browser or git.
- Cost limits: `max_tokens: 600`, history trimmed to 10 × 2,000 characters, and API Gateway throttling (10 req/s, burst 20). Add an Azure spending alert.
- Content-filter refusals and unusable model output are handled in `parseModelReply`.
