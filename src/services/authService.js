import { getFromStorage, STORAGE_KEYS } from './db';
import { userService } from './userService';

// ponytail: hardcoded built-in admin, prototype only; replace with real auth (e.g. Cognito) later
const ADMIN_USER = { id: 'ADMIN', name: 'Admin', username: 'admin', role: 'admin' };
const ADMIN_PASSWORD = 'admin';

export const authService = {
  // Accepts the admin username or a registered user's email. Returns the signed-in user, or null.
  login: async (identifier, password) => {
    const id = identifier.trim();
    const user = id === ADMIN_USER.username
      ? (password === ADMIN_PASSWORD ? ADMIN_USER : null)
      : await userService.verifyCredentials(id, password);
    if (user) localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getCurrentUser: () => getFromStorage(STORAGE_KEYS.SESSION, null),

  isAdmin: (user) => user?.role === 'admin'
};
