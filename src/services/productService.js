import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

export const productService = {
  getProducts: async (filters = {}) => {
    let products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    
    if (filters.storeId) {
      products = products.filter(p => p.storeId === filters.storeId);
    }
    if (filters.category && filters.category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.storeName.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minRating !== undefined) {
      products = products.filter(p => p.rating >= filters.minRating);
    }
    if (filters.sortBy) {
      if (filters.sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'popularity') {
        products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      }
    }
    return products;
  },

  getProductById: async (productId) => {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    return products.find(p => p.id === productId);
  },

  getProductsByStore: async (storeId) => {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    return products.filter(p => p.storeId === storeId);
  },

  addProduct: async (productData) => {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    const newId = `PROD-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct = {
      id: newId,
      storeId: productData.storeId,
      storeName: productData.storeName || 'My Store',
      name: productData.name,
      category: productData.category || 'General',
      price: Number(productData.price) || 999,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Math.round((Number(productData.price) || 999) * 1.3),
      discount: productData.discount || '20% OFF',
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(productData.stock) || 10,
      status: Number(productData.stock) > 5 ? 'In Stock' : (Number(productData.stock) > 0 ? 'Low Stock' : 'Out of Stock'),
      sales: 0,
      image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      description: productData.description || 'Premium quality verified item crafted for lasting durability.',
      features: productData.features || ['Premium materials', 'Quality guaranteed', 'Standard warranty']
    };

    const updated = [newProduct, ...products];
    saveToStorage(STORAGE_KEYS.PRODUCTS, updated);

    // Also update store's productsCount
    const stores = getFromStorage(STORAGE_KEYS.STORES);
    const storeIdx = stores.findIndex(s => s.id === productData.storeId);
    if (storeIdx !== -1) {
      stores[storeIdx].productsCount = (stores[storeIdx].productsCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.STORES, stores);
    }

    return newProduct;
  },

  updateProduct: async (productId, updates) => {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      const updatedItem = { ...products[index], ...updates };
      if (updates.stock !== undefined) {
        const stockNum = Number(updates.stock);
        updatedItem.status = stockNum > 5 ? 'In Stock' : (stockNum > 0 ? 'Low Stock' : 'Out of Stock');
      }
      products[index] = updatedItem;
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    }
    return null;
  },

  deleteProduct: async (productId) => {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    const target = products.find(p => p.id === productId);
    const filtered = products.filter(p => p.id !== productId);
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);

    if (target) {
      const stores = getFromStorage(STORAGE_KEYS.STORES);
      const storeIdx = stores.findIndex(s => s.id === target.storeId);
      if (storeIdx !== -1 && stores[storeIdx].productsCount > 0) {
        stores[storeIdx].productsCount -= 1;
        saveToStorage(STORAGE_KEYS.STORES, stores);
      }
    }
    return true;
  }
};
