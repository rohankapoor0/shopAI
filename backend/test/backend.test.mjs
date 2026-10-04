// Run from backend/: npm test. Covers the parts that don't need DynamoDB: tokens, passwords, routing and auth checks.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';
const { signToken, verifyToken, newSalt, hashPassword, passwordMatches } = await import('../src/lib.mjs');
const { handler } = await import('../src/index.mjs');

const call = async (method, path, { token, body } = {}) => {
  const res = await handler({
    requestContext: { http: { method } },
    rawPath: path,
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body: body && JSON.stringify(body)
  });
  return { status: res.statusCode, body: JSON.parse(res.body) };
};

test('tokens round-trip and reject tampering and expiry', () => {
  const token = signToken({ sub: 'CUST-1', role: 'customer' });
  assert.equal(verifyToken(token).sub, 'CUST-1');

  const [head, body, sig] = token.split('.');
  const forged = Buffer.from(JSON.stringify({ sub: 'CUST-1', role: 'admin', exp: 9999999999 })).toString('base64url');
  assert.equal(verifyToken(`${head}.${forged}.${sig}`), null);
  assert.equal(verifyToken(`${head}.${body}.`), null);
  assert.equal(verifyToken('garbage'), null);

  const expired = signToken({ sub: 'x', role: 'customer' }).split('.');
  const expiredBody = Buffer.from(JSON.stringify({ sub: 'x', exp: 1 })).toString('base64url');
  assert.equal(verifyToken(`${expired[0]}.${expiredBody}.${expired[2]}`), null);
});

test('passwords hash with a salt and verify', async () => {
  const salt = newSalt();
  const user = { salt, passwordHash: await hashPassword('correct horse', salt) };
  assert.equal(await passwordMatches('correct horse', user), true);
  assert.equal(await passwordMatches('wrong horse', user), false);
});

test('router enforces sign-in and admin role', async () => {
  const customer = signToken({ sub: 'CUST-1', role: 'customer' });
  assert.equal((await call('GET', '/products')).status, 401);
  assert.equal((await call('PATCH', '/products/PROD-101', { token: customer, body: { price: 1 } })).status, 403);
  assert.equal((await call('GET', '/orders', { token: 'bad' })).status, 401);
  assert.equal((await call('GET', '/nope', { token: customer })).status, 404);
  assert.equal((await call('PUT', '/products', { token: customer })).status, 405);
  assert.equal((await handler({ requestContext: { http: { method: 'OPTIONS' } }, rawPath: '/auth/login', headers: {} })).statusCode, 204);
});

test('checkout splits a two-store cart and refuses short stock', async () => {
  const { db } = await import('../src/lib.mjs');
  const products = {
    A: { id: 'A', storeId: 'S1', storeName: 'One', name: 'Shoe', price: 2000, stock: 5, image: '' },
    B: { id: 'B', storeId: 'S2', storeName: 'Two', name: 'Mug', price: 1500, stock: 1, image: '' }
  };
  const writes = [];
  db.get = async ({ Key }) => ({ Item: products[Key.id] });
  db.transactWrite = async ({ TransactItems }) => { writes.push(TransactItems); };

  const customer = signToken({ sub: 'CUST-1', role: 'customer' });
  const checkout = {
    customerName: 'R', customerEmail: 'r@x.in', customerPhone: '1', paymentMethod: 'Cash on Delivery',
    shippingAddress: { address: 'a', city: 'c', state: 's', pincode: '1' }
  };

  // Subtotal 3500 > 3000: 10% discount (350), free shipping; split 2000:1500 -> 200 / 150
  const ok = await call('POST', '/orders', { token: customer, body: { ...checkout, items: [{ productId: 'A', quantity: 1 }, { productId: 'B', quantity: 1, price: 1 }] } });
  assert.equal(ok.status, 200);
  const [o1, o2] = ok.body.orders;
  assert.deepEqual([o1.totalAmount, o2.totalAmount], [1800, 1350]);
  assert.equal(o1.customerId, 'CUST-1');
  assert.equal(writes[0].length, 2 + 2 + 2); // 2 order puts, 2 stock updates, 2 store metrics updates
  assert.equal(writes[0][3].Update.ExpressionAttributeValues[':new'], 0); // B: 1 - 1
  // DynamoDB rejects reserved words (status, metrics, ...) in expressions, so every attribute name must be a #alias
  for (const op of writes[0].map(w => w.Put ?? w.Update)) {
    for (const expr of [op.UpdateExpression, op.ConditionExpression].filter(Boolean)) {
      assert.doesNotMatch(expr.replace(/\b(SET|ADD|attribute_not_exists|attribute_exists)\b/g, ''), /(^|[^#:\w])[a-zA-Z]/, expr);
    }
  }

  const short = await call('POST', '/orders', { token: customer, body: { ...checkout, items: [{ productId: 'B', quantity: 2 }] } });
  assert.deepEqual(short, { status: 409, body: { message: 'Mug: only 1 left' } });
});

test('cancelling an order restocks, un-counts the sale and reverses store metrics once', async () => {
  const { db } = await import('../src/lib.mjs');
  const order = { id: 'ORD-1', storeId: 'S1', status: 'Placed', totalAmount: 598, items: [{ productId: 'A', quantity: 2 }] };
  const updates = [];
  db.get = async () => ({ Item: { ...order } });
  db.put = async () => {};
  db.update = async (params) => { updates.push(params); return { Attributes: { stock: 7 } }; };

  const admin = signToken({ sub: 'ADMIN', role: 'admin' });
  const res = await call('PATCH', '/orders/ORD-1/status', { token: admin, body: { status: 'Cancelled' } });
  assert.equal(res.status, 200);
  const restock = updates.find(u => u.UpdateExpression.includes('#stock'));
  assert.deepEqual(restock.ExpressionAttributeValues, { ':q': 2, ':unsold': -2 });
  const metrics = updates.find(u => u.TableName.endsWith('stores'));
  assert.deepEqual(metrics.ExpressionAttributeValues, { ':s': -598, ':o': -1 });
});

test('input validation runs before any database access', async () => {
  const customer = signToken({ sub: 'CUST-1', role: 'customer' });
  const reg = await call('POST', '/auth/register', { body: { name: 'A', email: 'not-an-email', password: '12345678' } });
  assert.deepEqual(reg, { status: 400, body: { message: 'Enter a valid email address' } });
  assert.equal((await call('POST', '/auth/login', { body: { identifier: 'admin', password: '' } })).status, 401);
  assert.equal((await call('POST', '/orders', { token: customer, body: { items: [] } })).status, 400);
  assert.equal((await call('POST', '/orders', { token: customer, body: { items: [{ productId: 'PROD-101', quantity: 0 }] } })).status, 400);
  const missing = await call('POST', '/orders', { token: customer, body: { items: [{ productId: 'PROD-101', quantity: 1 }] } });
  assert.equal(missing.status, 400);
  assert.match(missing.body.message, /^Please fill in: Full Name/);
});
