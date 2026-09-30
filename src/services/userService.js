// Registered user accounts.
// Local stand-in for the DynamoDB `ShopAI_Users` table (partition key: email).
// Each method maps to one future API Gateway + Lambda endpoint — see docs/cloud-migration.md.
import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PBKDF2_ITERATIONS = 100000;

// Shared by the Register page (instant feedback) and register() (trust boundary; moves into Lambda).
export const validateRegistration = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name?.trim()) errors.name = 'Full name is required';
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (confirmPassword !== undefined && confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const toHex = (buffer) => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');

// ponytail: hashing in the browser is prototype-only; in production this runs inside the Lambda
// (Web Crypto is also available in Node 18+, so this function moves over unchanged) or is replaced by Cognito.
const hashPassword = async (password, saltHex) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array(saltHex.match(/../g).map(h => parseInt(h, 16)));
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS }, key, 256);
  return toHex(bits);
};

// Never return password material to callers
const toPublicUser = ({ passwordHash: _hash, salt: _salt, ...user }) => user;

export const userService = {
  // Future: POST /auth/register -> DynamoDB PutItem with ConditionExpression attribute_not_exists(email)
  register: async ({ name, email, phone, password }) => {
    const errors = validateRegistration({ name, email, password });
    if (Object.keys(errors).length > 0) {
      throw new Error(Object.values(errors)[0]);
    }

    const users = getFromStorage(STORAGE_KEYS.USERS);
    const normalizedEmail = normalizeEmail(email);
    if (users.some(u => u.email === normalizedEmail)) {
      throw new Error('An account with this email already exists');
    }

    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    const newUser = {
      id: `USER-${crypto.randomUUID()}`,
      email: normalizedEmail,
      name: name.trim(),
      phone: phone?.trim() || '',
      role: 'customer',
      createdAt: new Date().toISOString(),
      salt,
      passwordHash: await hashPassword(password, salt)
    };

    saveToStorage(STORAGE_KEYS.USERS, [...users, newUser]);
    return toPublicUser(newUser);
  },

  // Future: part of POST /auth/login -> DynamoDB GetItem { email }
  getUserByEmail: async (email) => {
    const user = getFromStorage(STORAGE_KEYS.USERS).find(u => u.email === normalizeEmail(email));
    return user ? toPublicUser(user) : null;
  },

  // Future: POST /auth/login (Lambda compares hashes and returns a session token)
  verifyCredentials: async (email, password) => {
    const user = getFromStorage(STORAGE_KEYS.USERS).find(u => u.email === normalizeEmail(email));
    if (!user) return null;
    const hash = await hashPassword(password, user.salt);
    return hash === user.passwordHash ? toPublicUser(user) : null;
  }
};
