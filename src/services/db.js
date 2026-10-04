// Browser-only state. Everything else lives in DynamoDB behind the API (see api.js).
const STORAGE_KEYS = {
  CART: 'shopai_cart_v1',
  ACTIVE_STORE_ID: 'shopai_active_store_id_v1',
  SESSION: 'shopai_session_v3'
};

export const getFromStorage = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
};

export { STORAGE_KEYS };
