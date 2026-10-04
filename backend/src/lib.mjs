// Shared helpers: DynamoDB client, errors, session tokens, password hashing, validation.
import { createHmac, pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const db = DynamoDBDocument.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
});

// Table names are `${stack}-users` etc. (see template.yaml); the seed script uses the same prefix.
const table = (name) => `${process.env.TABLE_PREFIX ?? 'shopai'}-${name}`;
export const TABLES = {
  get users() { return table('users'); },
  get stores() { return table('stores'); },
  get products() { return table('products'); },
  get orders() { return table('orders'); },
  get returns() { return table('returns'); }
};

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ponytail: full-table Scan, fine for a prototype catalog; add GSIs (StoreIndex, CustomerIndex) past a few thousand items.
export const scanAll = async (TableName) => {
  const items = [];
  let ExclusiveStartKey;
  do {
    const page = await db.scan({ TableName, ExclusiveStartKey });
    items.push(...page.Items);
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
};

export const getItem = async (TableName, Key) => (await db.get({ TableName, Key })).Item;

// Puts a new item under a random `${prefix}-<n>` id (min <= n < max), retrying on the rare collision.
export const putWithNewId = async (TableName, prefix, min, max, build) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const item = build(randomId(prefix, min, max));
    try {
      await db.put({ TableName, Item: item, ConditionExpression: 'attribute_not_exists(#id)', ExpressionAttributeNames: { '#id': 'id' } });
      return item;
    } catch (err) {
      if (err.name !== 'ConditionalCheckFailedException') throw err;
    }
  }
  throw new Error(`Could not allocate a ${prefix} id`);
};

export const randomId = (prefix, min, max) => `${prefix}-${Math.floor(min + Math.random() * (max - min))}`;

export const today = () => new Date().toISOString().split('T')[0];

export const stockStatus = (stock) => stock > 5 ? 'In Stock' : (stock > 0 ? 'Low Stock' : 'Out of Stock');

// --- Session tokens: HS256 JWT, signed with node:crypto ---
const TOKEN_TTL_SECONDS = 12 * 60 * 60;
const sign = (data) => createHmac('sha256', process.env.JWT_SECRET).update(data).digest();

export const signToken = (claims) => {
  const head = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...claims, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })).toString('base64url');
  return `${head}.${body}.${sign(`${head}.${body}`).toString('base64url')}`;
};

// Returns the claims, or null when the token is malformed, forged or expired. The header is ignored: always HS256.
export const verifyToken = (token) => {
  const [head, body, sig] = String(token ?? '').split('.');
  if (!head || !body || !sig) return null;
  const expected = sign(`${head}.${body}`);
  const given = Buffer.from(sig, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return claims.exp > Date.now() / 1000 ? claims : null;
  } catch {
    return null;
  }
};

// --- Passwords: PBKDF2-SHA256, same parameters the browser prototype used ---
const PBKDF2_ITERATIONS = 100000;
const pbkdf2Async = promisify(pbkdf2);

export const newSalt = () => randomBytes(16).toString('hex');

export const hashPassword = async (password, saltHex) =>
  (await pbkdf2Async(password, Buffer.from(saltHex, 'hex'), PBKDF2_ITERATIONS, 32, 'sha256')).toString('hex');

export const passwordMatches = async (password, user) => {
  const hash = Buffer.from(await hashPassword(password, user.salt), 'hex');
  const stored = Buffer.from(user.passwordHash, 'hex');
  return hash.length === stored.length && timingSafeEqual(hash, stored);
};

export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

// Same rules as src/services/userService.js validateRegistration (the Lambda package cannot import src/).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateRegistration = ({ name, email, password }) => {
  if (!String(name ?? '').trim()) return 'Full name is required';
  if (!String(email ?? '').trim()) return 'Email is required';
  if (!EMAIL_PATTERN.test(String(email).trim())) return 'Enter a valid email address';
  if (!password) return 'Password is required';
  if (String(password).length < 8) return 'Password must be at least 8 characters';
  return null;
};

// Never return password material
export const toPublicUser = ({ passwordHash: _hash, salt: _salt, ...user }) => user;
