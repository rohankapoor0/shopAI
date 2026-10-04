// POST /auth/register and POST /auth/login. Users table: partition key email.
import { randomUUID } from 'node:crypto';
import {
  db, TABLES, HttpError, getItem, signToken, newSalt, hashPassword, passwordMatches,
  normalizeEmail, validateRegistration, toPublicUser
} from './lib.mjs';

const MAX_PASSWORD_LENGTH = 128;

export const register = async ({ body }) => {
  const error = validateRegistration(body);
  if (error) throw new HttpError(400, error);
  if (String(body.password).length > MAX_PASSWORD_LENGTH) throw new HttpError(400, 'Password is too long');

  const salt = newSalt();
  const user = {
    email: normalizeEmail(body.email),
    id: `USER-${randomUUID()}`,
    name: String(body.name).trim().slice(0, 100),
    phone: String(body.phone ?? '').trim().slice(0, 30),
    role: 'customer',
    addresses: [],
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hashPassword(String(body.password), salt)
  };
  try {
    await db.put({ TableName: TABLES.users, Item: user, ConditionExpression: 'attribute_not_exists(#email)', ExpressionAttributeNames: { '#email': 'email' } });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') throw new HttpError(409, 'An account with this email already exists');
    throw err;
  }
  return toPublicUser(user);
};

// identifier is an email, or "admin" for the seeded admin account.
export const login = async ({ body }) => {
  const password = String(body.password ?? '');
  const user = password && password.length <= MAX_PASSWORD_LENGTH
    ? await getItem(TABLES.users, { email: normalizeEmail(body.identifier) })
    : null;
  if (!user || !(await passwordMatches(password, user))) throw new HttpError(401, 'Invalid username or password');
  return {
    token: signToken({ sub: user.id, role: user.role, email: user.email, name: user.name }),
    user: toPublicUser(user)
  };
};
