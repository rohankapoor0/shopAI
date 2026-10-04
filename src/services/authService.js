import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';
import { apiFetch } from './api';

// Session in localStorage: { token, user }. The token is a signed JWT checked by the Lambda on every call.
export const authService = {
  // Accepts "admin" or a registered user's email. Returns the signed-in user, or null for wrong credentials.
  login: async (identifier, password) => {
    try {
      const { token, user } = await apiFetch('/auth/login', { method: 'POST', body: { identifier: identifier.trim(), password } });
      saveToStorage(STORAGE_KEYS.SESSION, { token, user });
      return user;
    } catch (err) {
      if (err.status === 401) return null;
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getCurrentUser: () => getFromStorage(STORAGE_KEYS.SESSION, null)?.user ?? null,

  // UI only; the Lambda enforces admin routes itself
  isAdmin: (user) => user?.role === 'admin'
};
