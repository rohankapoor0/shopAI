// ShopAI LocalStorage Service Layer & Database Abstraction
// Designed to be drop-in replaceable with AWS Lambda + DynamoDB later.

import {
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_RETURNS,
  INITIAL_REVIEWS
} from './initialData';

const STORAGE_KEYS = {
  STORES: 'shopai_stores_v1',
  PRODUCTS: 'shopai_products_v1',
  ORDERS: 'shopai_orders_v1',
  RETURNS: 'shopai_returns_v1',
  CUSTOMERS: 'shopai_customers_v1',
  REVIEWS: 'shopai_reviews_v1',
  CART: 'shopai_cart_v1',
  ACTIVE_STORE_ID: 'shopai_active_store_id_v1',
  ACTIVE_USER: 'shopai_active_user_v1'
};

// Initialize DB with seed data if not present
export const initDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STORES)) {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(INITIAL_STORES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RETURNS)) {
    localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(INITIAL_RETURNS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(INITIAL_CUSTOMERS[0]));
  }
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
