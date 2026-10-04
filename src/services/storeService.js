import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

// Dispatched after store data changes so long-lived views (the dashboard sidebar) can reload.
export const STORES_CHANGED_EVENT = 'shopai:stores-changed';
const notifyStoresChanged = () => window.dispatchEvent(new Event(STORES_CHANGED_EVENT));

const toHandle = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Handles are store URLs (/store/<handle>), so they must be unique; append a number on collision.
const uniqueHandle = (base, stores) => {
  const taken = new Set(stores.flatMap(s => [s.handle, s.id.toLowerCase()]));
  let handle = base || 'store';
  for (let n = 2; taken.has(handle); n++) handle = `${base || 'store'}${n}`;
  return handle;
};

export const storeService = {
  getStores: async () => {
    return getFromStorage(STORAGE_KEYS.STORES);
  },

  getStoreById: async (storeId) => {
    const stores = getFromStorage(STORAGE_KEYS.STORES);
    return stores.find(s => s.id === storeId || s.handle === storeId);
  },

  createStore: async (storeData) => {
    const stores = getFromStorage(STORAGE_KEYS.STORES);
    const newStoreId = `STORE-${1000 + stores.length + 1}`;
    const newStore = {
      id: newStoreId,
      handle: uniqueHandle(toHandle(storeData.handle) || toHandle(storeData.name), stores),
      name: storeData.name,
      category: storeData.category || 'Other',
      tagline: storeData.tagline || `${storeData.name} Official Store`,
      description: storeData.description || 'Welcome to our official store on ShopAI.',
      logo: storeData.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80',
      banner: storeData.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 0,
      productsCount: 0,
      owner: {
        name: storeData.ownerName || 'Store Owner',
        email: storeData.ownerEmail || 'owner@shopai.store',
        phone: storeData.ownerPhone || '+91 99999 88888'
      },
      location: {
        address: storeData.address || 'Commercial District',
        city: storeData.city || 'Bengaluru',
        state: storeData.state || 'Karnataka',
        pincode: storeData.pincode || '560001',
        country: storeData.country || 'India'
      },
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      metrics: {
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0
      }
    };

    const updated = [newStore, ...stores];
    saveToStorage(STORAGE_KEYS.STORES, updated);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, newStore.id);
    notifyStoresChanged();
    return newStore;
  },

  // Throws with a user-facing message when the name or handle is invalid.
  updateStore: async (storeId, updates) => {
    const stores = getFromStorage(STORAGE_KEYS.STORES);
    const index = stores.findIndex(s => s.id === storeId);
    if (index === -1) return null;

    const next = { ...stores[index], ...updates };
    if (!String(next.name ?? '').trim()) throw new Error('Store name is required');
    next.name = next.name.trim();
    next.handle = toHandle(next.handle);
    if (!next.handle) throw new Error('Store handle is required');
    const clash = stores.some(s => s.id !== storeId && (s.handle === next.handle || s.id.toLowerCase() === next.handle));
    if (clash) throw new Error(`The handle "${next.handle}" is already used by another store`);

    // Products carry a copy of the store name
    if (next.name !== stores[index].name) {
      const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
      saveToStorage(STORAGE_KEYS.PRODUCTS, products.map(p => p.storeId === storeId ? { ...p, storeName: next.name } : p));
    }

    stores[index] = next;
    saveToStorage(STORAGE_KEYS.STORES, stores);
    notifyStoresChanged();
    return next;
  },

  getActiveStoreId: () => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STORE_ID) || getFromStorage(STORAGE_KEYS.STORES)[0]?.id;
  },

  setActiveStoreId: (storeId) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, storeId);
  }
};
