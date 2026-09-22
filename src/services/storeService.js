import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

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
      handle: storeData.handle || storeData.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
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
    return newStore;
  },

  updateStore: async (storeId, updates) => {
    const stores = getFromStorage(STORAGE_KEYS.STORES);
    const index = stores.findIndex(s => s.id === storeId);
    if (index !== -1) {
      stores[index] = { ...stores[index], ...updates };
      saveToStorage(STORAGE_KEYS.STORES, stores);
      return stores[index];
    }
    return null;
  },

  getActiveStoreId: () => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STORE_ID);
  },

  setActiveStoreId: (storeId) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, storeId);
  }
};
