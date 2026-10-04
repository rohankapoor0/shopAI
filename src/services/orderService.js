import { apiFetch, orNull, query } from './api';

export const orderService = {
  // Resolves to null when the order doesn't exist or belongs to another account.
  getOrderById: (orderId) => orNull(apiFetch(`/orders/${encodeURIComponent(orderId)}`)),

  // The signed-in shopper's orders
  getCustomerOrders: () => apiFetch('/orders'),

  getStoreOrders: (storeId) => apiFetch(`/orders${query({ storeId })}`),

  // The whole cart in one call: the Lambda prices it, checks stock, splits it into one order per store
  // and writes everything in one transaction. Resolves to { orders }. A stock problem throws with status 409.
  // payload: { items: [{ productId, quantity }], customerName, customerEmail, customerPhone, paymentMethod, shippingAddress }
  createOrders: (payload) => apiFetch('/orders', { method: 'POST', body: payload }),

  updateOrderStatus: (orderId, status) => apiFetch(`/orders/${encodeURIComponent(orderId)}/status`, { method: 'PATCH', body: { status } })
};
