// Run from backend/: npm test. Drives the Azure entry point (azure.mjs) end to end against in-memory dynalite.
import { test } from 'node:test';
import assert from 'node:assert/strict';

Object.assign(process.env, { JWT_SECRET: 'test-secret-that-is-at-least-32-characters-long', ADMIN_PASSWORD: 'admin-pass-123', DEMO_PASSWORD: 'demo-pass-123' });
const { apiHandler } = await import('../azure.mjs');

const call = async (method, path, { token, body } = {}) => {
  const res = await apiHandler(new Request(`https://example.test/api${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token && { 'x-session-token': token }) },
    body: body && JSON.stringify(body)
  }));
  return { status: res.status, body: JSON.parse(res.body) };
};

const checkout = (items) => ({
  items, customerName: 'Test', customerEmail: 't@example.com', customerPhone: '9999999999', paymentMethod: 'UPI',
  shippingAddress: { address: '1 Road', city: 'Pune', state: 'MH', pincode: '411001' }
});

test('admin signs in, checks out a two-store cart, and an oversell changes nothing', async () => {
  const login = await call('POST', '/auth/login', { body: { identifier: 'admin', password: 'admin-pass-123' } });
  assert.equal(login.status, 200);
  const token = login.body.token;

  const products = (await call('GET', '/products', { token })).body.filter(p => p.stock >= 2);
  const a = products[0];
  const b = products.find(p => p.storeId !== a.storeId);
  const placed = await call('POST', '/orders', { token, body: checkout([{ productId: a.id, quantity: 1 }, { productId: b.id, quantity: 2 }]) });
  assert.equal(placed.status, 200);
  assert.equal(placed.body.orders.length, 2);
  assert.equal((await call('GET', `/products/${a.id}`, { token })).body.stock, a.stock - 1);
  assert.equal((await call('GET', `/products/${b.id}`, { token })).body.stock, b.stock - 2);

  const oversell = await call('POST', '/orders', { token, body: checkout([{ productId: a.id, quantity: 1 }, { productId: b.id, quantity: 100 }]) });
  assert.equal(oversell.status, 409);
  assert.equal((await call('GET', `/products/${a.id}`, { token })).body.stock, a.stock - 1);
});

test('a failed condition rolls back the earlier writes of the transaction', async () => {
  const { db, getItem, TABLES } = await import('../src/lib.mjs');
  const before = await getItem(TABLES.products, { id: 'PROD-101' });
  await assert.rejects(db.transactWrite({ TransactItems: [
    { Put: { TableName: TABLES.orders, Item: { id: 'ORD-ROLLBACK' } } },
    { Update: { TableName: TABLES.products, Key: { id: 'PROD-101' }, UpdateExpression: 'SET #s = :s', ConditionExpression: '#s = :wrong',
      ExpressionAttributeNames: { '#s': 'stock' }, ExpressionAttributeValues: { ':s': 0, ':wrong': -1 } } }
  ] }), { name: 'TransactionCanceledException' });
  assert.equal(await getItem(TABLES.orders, { id: 'ORD-ROLLBACK' }), undefined);
  assert.deepEqual(await getItem(TABLES.products, { id: 'PROD-101' }), before);
});
