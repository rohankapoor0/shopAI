// One-off seed: copies src/services/initialData.js into the DynamoDB tables of a deployed stack.
// Usage (from backend/):  TABLE_PREFIX=shopai ADMIN_PASSWORD=... DEMO_PASSWORD=... AWS_REGION=ap-south-1 node seed.mjs
// Re-running overwrites the seed items (and resets their stock/metrics); other records are left alone.
import { db, TABLES, newSalt, hashPassword } from './src/lib.mjs';
import {
  INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_RETURNS, INITIAL_REVIEWS
} from '../src/services/initialData.js';

const { ADMIN_PASSWORD, DEMO_PASSWORD } = process.env;
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8 || !DEMO_PASSWORD || DEMO_PASSWORD.length < 8) {
  console.error('Set ADMIN_PASSWORD and DEMO_PASSWORD (at least 8 characters each).');
  process.exit(1);
}

const withPassword = async (user, password) => {
  const salt = newSalt();
  return { ...user, salt, passwordHash: await hashPassword(password, salt) };
};

// The admin's key is the literal "admin", so the Login page's "admin" username keeps working.
const users = [
  await withPassword({ email: 'admin', id: 'ADMIN', name: 'Admin', role: 'admin', addresses: [], createdAt: new Date().toISOString() }, ADMIN_PASSWORD),
  ...await Promise.all(INITIAL_CUSTOMERS.map(c => withPassword({
    email: c.email.toLowerCase(),
    id: c.id,
    name: c.name,
    phone: c.phone,
    role: 'customer',
    addresses: c.addresses ?? [],
    avatar: c.avatar,
    createdAt: new Date().toISOString()
  }, DEMO_PASSWORD)))
];

const stores = INITIAL_STORES.map(s => ({ ...s, reviews: INITIAL_REVIEWS.filter(r => r.storeId === s.id) }));

const writeAll = async (TableName, items) => {
  for (let i = 0; i < items.length; i += 25) {
    let RequestItems = { [TableName]: items.slice(i, i + 25).map(Item => ({ PutRequest: { Item } })) };
    while (Object.keys(RequestItems).length > 0) {
      const { UnprocessedItems } = await db.batchWrite({ RequestItems });
      RequestItems = UnprocessedItems ?? {};
    }
  }
  console.log(`${TableName}: ${items.length} items`);
};

await writeAll(TABLES.users, users);
await writeAll(TABLES.stores, stores);
await writeAll(TABLES.products, INITIAL_PRODUCTS);
await writeAll(TABLES.orders, INITIAL_ORDERS);
await writeAll(TABLES.returns, INITIAL_RETURNS);
console.log(`Done. Sign in as "admin" or e.g. "${INITIAL_CUSTOMERS[0].email}" with the demo password.`);
