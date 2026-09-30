import { STORAGE_KEYS } from './db';

// ponytail: hardcoded local credentials, prototype only; replace with real auth (e.g. Cognito) later
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export const authService = {
  login: (username, password) => {
    const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, ADMIN_USERNAME);
    return ok;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  isAuthenticated: () => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === ADMIN_USERNAME;
  }
};
