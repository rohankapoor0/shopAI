// Minimal client for the future API Gateway backend (see docs/cloud-migration.md).
// Set VITE_API_BASE_URL in .env.local to enable it; services fall back to local behaviour when it is unset.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const isApiConfigured = Boolean(BASE_URL);

export const apiFetch = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body && JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};
