// Single Lambda behind the HTTP API route ANY /{proxy+}. CORS (including preflight) is handled by API Gateway.
import { HttpError, verifyToken } from './lib.mjs';
import * as auth from './auth.mjs';
import * as catalog from './catalog.mjs';
import * as orders from './orders.mjs';
import * as assistant from './assistant.mjs';

const MAX_BODY_BYTES = 256 * 1024;

// [method, path pattern, handler, who may call: null = public, 'user' = signed in, 'admin']
const ROUTES = [
  ['POST', '/auth/register', auth.register, null],
  ['POST', '/auth/login', auth.login, null],

  ['GET', '/stores', catalog.listStores, 'user'],
  ['POST', '/stores', catalog.createStore, 'user'],
  ['GET', '/stores/:id', catalog.getStore, 'user'],
  ['PATCH', '/stores/:id', catalog.updateStore, 'admin'],
  ['GET', '/stores/:id/customers', orders.storeCustomers, 'admin'],

  ['GET', '/products', catalog.listProducts, 'user'],
  ['POST', '/products', catalog.addProduct, 'admin'],
  ['GET', '/products/:id', catalog.getProduct, 'user'],
  ['PATCH', '/products/:id', catalog.updateProduct, 'admin'],
  ['DELETE', '/products/:id', catalog.deleteProduct, 'admin'],
  ['POST', '/uploads/product-image', catalog.presignProductImage, 'admin'],

  ['GET', '/orders', orders.listOrders, 'user'],
  ['POST', '/orders', orders.createOrders, 'user'],
  ['GET', '/orders/:id', orders.getOrder, 'user'],
  ['PATCH', '/orders/:id/status', orders.updateOrderStatus, 'admin'],

  ['GET', '/returns', orders.listReturns, 'user'],
  ['POST', '/returns', orders.createReturn, 'user'],
  ['PATCH', '/returns/:id/status', orders.updateReturnStatus, 'admin'],

  ['POST', '/assistant', assistant.ask, 'user']
];

const matchRoute = (method, path) => {
  const parts = path.split('/').filter(Boolean);
  let pathMatched = false;
  for (const [routeMethod, pattern, handler, access] of ROUTES) {
    const routeParts = pattern.split('/').filter(Boolean);
    if (routeParts.length !== parts.length) continue;
    const params = {};
    const ok = routeParts.every((p, i) => p.startsWith(':') ? (params[p.slice(1)] = decodeURIComponent(parts[i]), true) : p === parts[i]);
    if (!ok) continue;
    pathMatched = true;
    if (routeMethod === method) return { handler, access, params };
  }
  throw new HttpError(pathMatched ? 405 : 404, pathMatched ? 'Method not allowed' : 'Not found');
};

const authenticate = (headers, access) => {
  if (!access) return null;
  const token = (headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  const user = verifyToken(token);
  if (!user) throw new HttpError(401, 'Please sign in again');
  if (access === 'admin' && user.role !== 'admin') throw new HttpError(403, 'Admin access required');
  return user;
};

const parseBody = (event) => {
  if (!event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) throw new HttpError(413, 'Request body too large');
  try {
    const body = JSON.parse(raw);
    return body && typeof body === 'object' ? body : {};
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
};

const respond = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  try {
    const method = event.requestContext.http.method;
    // ANY /{proxy+} also catches CORS preflights; API Gateway adds the CORS headers, the status just has to be 2xx.
    if (method === 'OPTIONS') return { statusCode: 204 };
    const { handler: routeHandler, access, params } = matchRoute(method, event.rawPath);
    const user = authenticate(event.headers ?? {}, access);
    const result = await routeHandler({ user, params, query: event.queryStringParameters ?? {}, body: parseBody(event) });
    return respond(200, result ?? {});
  } catch (err) {
    if (err instanceof HttpError) return respond(err.status, { message: err.message });
    console.error(err);
    return respond(500, { message: 'Something went wrong' });
  }
};
