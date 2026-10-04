import { apiFetch, orNull, query } from './api';

export const productService = {
  // filters: { storeId, category, search, minPrice, maxPrice, minRating, sortBy }
  getProducts: (filters = {}) => apiFetch(`/products${query(filters)}`),

  getProductById: (productId) => orNull(apiFetch(`/products/${encodeURIComponent(productId)}`)),

  getProductsByStore: (storeId) => apiFetch(`/products${query({ storeId })}`),

  addProduct: (productData) => apiFetch('/products', { method: 'POST', body: productData }),

  updateProduct: (productId, updates) => apiFetch(`/products/${encodeURIComponent(productId)}`, { method: 'PATCH', body: updates }),

  deleteProduct: (productId) => apiFetch(`/products/${encodeURIComponent(productId)}`, { method: 'DELETE' }),

  // Uploads straight to S3 with a presigned URL from the API; resolves to the public image URL.
  uploadImage: async (file) => {
    const { uploadUrl, url } = await apiFetch('/uploads/product-image', { method: 'POST', body: { contentType: file.type, size: file.size } });
    const res = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (!res.ok) throw new Error(`Image upload failed (${res.status})`);
    return url;
  }
};
