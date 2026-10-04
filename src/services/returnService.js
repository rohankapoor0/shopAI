import { apiFetch, query } from './api';

export const returnService = {
  // The signed-in shopper's return requests
  getCustomerReturns: () => apiFetch('/returns'),

  getStoreReturns: (storeId) => apiFetch(`/returns${query({ storeId })}`),

  // payload: { orderId, productId, reason, notes }; the Lambda fills in the rest from the order
  createReturn: (payload) => apiFetch('/returns', { method: 'POST', body: payload }),

  updateReturnStatus: (returnId, status) => apiFetch(`/returns/${encodeURIComponent(returnId)}/status`, { method: 'PATCH', body: { status } })
};
