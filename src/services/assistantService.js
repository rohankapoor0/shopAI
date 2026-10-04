// AI shopping assistant: the single seam between the chat UI and Azure OpenAI (POST /assistant on the Lambda).
// The request/response contract is described in docs/ai-assistant.md.
import { apiFetch } from './api';

const MAX_HISTORY = 10;

export const assistantService = {
  // messages: [{ role: 'user' | 'assistant', content: string }], oldest first.
  // Resolves to { reply: string, productIds: string[] }. Throws on network/server errors.
  sendMessage: async (messages) => {
    const history = messages.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content }));
    const data = await apiFetch('/assistant', { method: 'POST', body: { messages: history } });
    return { reply: data.reply ?? '', productIds: data.productIds ?? [] };
  }
};
