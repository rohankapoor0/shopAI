import { apiFetch } from './api';
import { authService } from './authService';

export const customerService = {
  // The shopper is always the signed-in user (addresses come with the login response)
  getCurrentUser: () => ({ addresses: [], ...authService.getCurrentUser() }),

  getStoreCustomers: (storeId) => apiFetch(`/stores/${encodeURIComponent(storeId)}/customers`)
};
