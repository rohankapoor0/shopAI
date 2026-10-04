import { STORAGE_KEYS } from './db';
import { apiFetch, orNull } from './api';

// Dispatched after store data changes so long-lived views (the dashboard sidebar) can reload.
export const STORES_CHANGED_EVENT = 'shopai:stores-changed';
const notifyStoresChanged = () => window.dispatchEvent(new Event(STORES_CHANGED_EVENT));

export const storeService = {
  getStores: () => apiFetch('/stores'),

  // Accepts a store id or handle; resolves to null when there is no such store.
  getStoreById: (storeId) => orNull(apiFetch(`/stores/${encodeURIComponent(storeId)}`)),

  createStore: async (storeData) => {
    const newStore = await apiFetch('/stores', { method: 'POST', body: storeData });
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, newStore.id);
    notifyStoresChanged();
    return newStore;
  },

  // Throws with a user-facing message when the name or handle is invalid.
  updateStore: async (storeId, updates) => {
    const updated = await apiFetch(`/stores/${encodeURIComponent(storeId)}`, { method: 'PATCH', body: updates });
    notifyStoresChanged();
    return updated;
  },

  // The dashboard layout falls back to the first store and saves it before any tab reads this.
  getActiveStoreId: () => localStorage.getItem(STORAGE_KEYS.ACTIVE_STORE_ID),

  setActiveStoreId: (storeId) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, storeId);
  }
};
