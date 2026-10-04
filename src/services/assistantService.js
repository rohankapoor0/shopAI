// AI shopping assistant: the single seam between the chat UI and Azure OpenAI.
// The request/response contract and the Lambda to build are described in docs/ai-assistant.md.
import { apiFetch, isApiConfigured } from './api';
import { productService } from './productService';

const MAX_HISTORY = 10;

const NOT_CONNECTED_REPLY =
  "The AI assistant isn't connected yet. Once the Azure OpenAI backend is live, I'll be able to help you find products, compare options and answer questions about orders and returns.";

export const assistantService = {
  isConnected: isApiConfigured,

  // messages: [{ role: 'user' | 'assistant', content: string }], oldest first.
  // Resolves to { reply: string, productIds: string[] }. Throws on network/server errors.
  sendMessage: async (messages) => {
    const history = messages.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content }));

    if (!isApiConfigured) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { reply: NOT_CONNECTED_REPLY, productIds: [] };
    }

    // The live catalog is in localStorage until products move to the cloud, so send it for grounding.
    const catalog = (await productService.getProducts()).map(({ id, name, category, price, rating, storeName, stock }) => ({
      id, name, category, price, rating, storeName, stock
    }));
    const data = await apiFetch('/assistant', { method: 'POST', body: { messages: history, catalog } });
    return { reply: data.reply ?? '', productIds: data.productIds ?? [] };
  }
};
