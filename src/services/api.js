// Client for the ShopAI API (API Gateway + Lambda, see backend/ and docs/cloud-migration.md).
// VITE_API_BASE_URL in .env.local points at the deployed stack's ApiUrl output.
import { getFromStorage, STORAGE_KEYS } from './db';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

export const isApiConfigured = Boolean(BASE_URL);

// Throws an Error carrying the HTTP status (err.status). Sends the session token when signed in.
export const apiFetch = async (path, { method = 'GET', body } = {}) => {
  if (!BASE_URL) throw new Error('The backend is not configured: set VITE_API_BASE_URL in .env.local and restart npm run dev.');
  const token = getFromStorage(STORAGE_KEYS.SESSION, null)?.token;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body && JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  // Expired or invalid session: drop it and show the login screen
  if (res.status === 401 && token) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.reload();
  }
  if (!res.ok) throw Object.assign(new Error(data.message || `Request failed (${res.status})`), { status: res.status });
  return data;
};

// Resolves to null instead of throwing when the record doesn't exist (or belongs to someone else).
export const orNull = (promise) => promise.catch(err => {
  if (err.status === 404 || err.status === 403) return null;
  throw err;
});

export const query = (params) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null));
  return search.size ? `?${search}` : '';
};
