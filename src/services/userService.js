// Registered user accounts (DynamoDB Users table via POST /auth/register).
import { apiFetch } from './api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Instant feedback on the Register page; the Lambda applies the same rules (backend/src/lib.mjs).
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

export const userService = {
  register: ({ name, email, phone, password }) =>
    apiFetch('/auth/register', { method: 'POST', body: { name, email, phone, password } })
};
