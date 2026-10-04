// Stores, products and product image uploads.
import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { db, TABLES, HttpError, scanAll, getItem, putWithNewId, today, stockStatus } from './lib.mjs';

const s3 = new S3Client({});

const text = (value, max) => String(value ?? '').trim().slice(0, max);
const toHandle = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Handles are store URLs (/store/<handle>), so they must be unique; append a number on collision.
const uniqueHandle = (base, stores) => {
  const taken = new Set(stores.flatMap(s => [s.handle, s.id.toLowerCase()]));
  let handle = base || 'store';
  for (let n = 2; taken.has(handle); n++) handle = `${base || 'store'}${n}`;
  return handle;
};

// --- Stores ---

export const listStores = () => scanAll(TABLES.stores);

const findStore = async (idOrHandle) =>
  (await getItem(TABLES.stores, { id: idOrHandle })) ??
  (await scanAll(TABLES.stores)).find(s => s.handle === idOrHandle);

export const getStore = async ({ params }) => {
  const store = await findStore(params.id);
  if (!store) throw new HttpError(404, 'Store not found');
  return store;
};

export const createStore = async ({ body }) => {
  const name = text(body.name, 80);
  if (!name) throw new HttpError(400, 'Store name is required');
  const stores = await scanAll(TABLES.stores);
  const handle = uniqueHandle(toHandle(body.handle) || toHandle(name), stores);

  return putWithNewId(TABLES.stores, 'STORE', 1000, 10000, (id) => ({
    id,
    handle,
    name,
    category: text(body.category, 40) || 'Other',
    tagline: text(body.tagline, 160) || `${name} Official Store`,
    description: text(body.description, 1000) || 'Welcome to our official store on ShopAI.',
    logo: text(body.logo, 500) || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80',
    banner: text(body.banner, 500) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 0,
    productsCount: 0,
    reviews: [],
    owner: {
      name: text(body.ownerName, 80) || 'Store Owner',
      email: text(body.ownerEmail, 120) || 'owner@shopai.store',
      phone: text(body.ownerPhone, 30) || '+91 99999 88888'
    },
    location: {
      address: text(body.address, 200) || 'Commercial District',
      city: text(body.city, 60) || 'Bengaluru',
      state: text(body.state, 60) || 'Karnataka',
      pincode: text(body.pincode, 10) || '560001',
      country: text(body.country, 60) || 'India'
    },
    status: 'Active',
    createdAt: today(),
    metrics: { totalSales: 0, totalOrders: 0, totalCustomers: 0 }
  }));
};

const STORE_EDITABLE = ['name', 'tagline', 'description', 'logo', 'banner', 'handle', 'category', 'owner', 'location'];

export const updateStore = async ({ params, body }) => {
  const stores = await scanAll(TABLES.stores);
  const current = stores.find(s => s.id === params.id);
  if (!current) throw new HttpError(404, 'Store not found');

  const updates = Object.fromEntries(STORE_EDITABLE.filter(k => body[k] !== undefined).map(k => [k, body[k]]));
  const next = { ...current, ...updates };
  next.name = text(next.name, 80);
  if (!next.name) throw new HttpError(400, 'Store name is required');
  next.handle = toHandle(next.handle);
  if (!next.handle) throw new HttpError(400, 'Store handle is required');
  if (stores.some(s => s.id !== current.id && (s.handle === next.handle || s.id.toLowerCase() === next.handle))) {
    throw new HttpError(409, `The handle "${next.handle}" is already used by another store`);
  }

  // Products carry a copy of the store name
  if (next.name !== current.name) {
    const products = (await scanAll(TABLES.products)).filter(p => p.storeId === current.id);
    await Promise.all(products.map(p => db.update({
      TableName: TABLES.products,
      Key: { id: p.id },
      UpdateExpression: 'SET #n = :n',
      ExpressionAttributeNames: { '#n': 'storeName' },
      ExpressionAttributeValues: { ':n': next.name }
    })));
  }

  await db.put({ TableName: TABLES.stores, Item: next });
  return next;
};

// --- Products ---

export const listProducts = async ({ query }) => {
  let products = await scanAll(TABLES.products);
  const num = (v) => (v === undefined || v === '' ? undefined : Number(v));
  const minPrice = num(query.minPrice);
  const maxPrice = num(query.maxPrice);
  const minRating = num(query.minRating);

  if (query.storeId) products = products.filter(p => p.storeId === query.storeId);
  if (query.category && query.category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === query.category.toLowerCase());
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.storeName.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }
  if (minPrice !== undefined) products = products.filter(p => p.price >= minPrice);
  if (maxPrice !== undefined) products = products.filter(p => p.price <= maxPrice);
  if (minRating !== undefined) products = products.filter(p => p.rating >= minRating);

  const sorters = {
    'price-low': (a, b) => a.price - b.price,
    'price-high': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    popularity: (a, b) => (b.sales || 0) - (a.sales || 0)
  };
  return sorters[query.sortBy] ? products.sort(sorters[query.sortBy]) : products;
};

export const getProduct = async ({ params }) => {
  const product = await getItem(TABLES.products, { id: params.id });
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
};

const toStock = (value, fallback) => {
  const n = Number(value);
  return value !== '' && value !== undefined && Number.isFinite(n) ? Math.max(0, Math.floor(n)) : fallback;
};
const toPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};
const toFeatures = (value) => Array.isArray(value) ? value.map(f => text(f, 120)).filter(Boolean).slice(0, 10) : undefined;

const adjustProductsCount = (storeId, delta) => db.update({
  TableName: TABLES.stores,
  Key: { id: storeId },
  UpdateExpression: 'ADD #count :d',
  ConditionExpression: 'attribute_exists(#id)',
  ExpressionAttributeNames: { '#count': 'productsCount', '#id': 'id' },
  ExpressionAttributeValues: { ':d': delta }
}).catch(err => { if (err.name !== 'ConditionalCheckFailedException') throw err; });

export const addProduct = async ({ body }) => {
  const store = await getItem(TABLES.stores, { id: String(body.storeId ?? '') });
  if (!store) throw new HttpError(400, 'Unknown store');
  const name = text(body.name, 160);
  if (!name) throw new HttpError(400, 'Product name is required');
  const price = toPrice(body.price) ?? 999;
  const stock = toStock(body.stock, 10);

  const product = await putWithNewId(TABLES.products, 'PROD', 1000, 100000, (id) => ({
    id,
    storeId: store.id,
    storeName: store.name,
    name,
    category: text(body.category, 40) || 'General',
    price,
    originalPrice: toPrice(body.originalPrice) ?? Math.round(price * 1.3),
    discount: text(body.discount, 20) || '20% OFF',
    rating: 5.0,
    reviewsCount: 1,
    stock,
    status: stockStatus(stock),
    sales: 0,
    image: text(body.image, 500) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: text(body.description, 2000) || 'Premium quality verified item crafted for lasting durability.',
    features: toFeatures(body.features) ?? ['Premium materials', 'Quality guaranteed', 'Standard warranty']
  }));
  await adjustProductsCount(store.id, 1);
  return product;
};

export const updateProduct = async ({ params, body }) => {
  const current = await getItem(TABLES.products, { id: params.id });
  if (!current) throw new HttpError(404, 'Product not found');
  const next = { ...current };
  if (body.name !== undefined) next.name = text(body.name, 160) || current.name;
  if (body.category !== undefined) next.category = text(body.category, 40) || current.category;
  if (body.price !== undefined) next.price = toPrice(body.price) ?? current.price;
  if (body.originalPrice !== undefined) next.originalPrice = toPrice(body.originalPrice) ?? current.originalPrice;
  if (body.discount !== undefined) next.discount = text(body.discount, 20);
  if (body.image !== undefined) next.image = text(body.image, 500) || current.image;
  if (body.description !== undefined) next.description = text(body.description, 2000);
  if (body.features !== undefined) next.features = toFeatures(body.features) ?? current.features;
  if (body.stock !== undefined) {
    next.stock = toStock(body.stock, current.stock);
    next.status = stockStatus(next.stock);
  }
  await db.put({ TableName: TABLES.products, Item: next });
  return next;
};

export const deleteProduct = async ({ params }) => {
  const { Attributes: deleted } = await db.delete({ TableName: TABLES.products, Key: { id: params.id }, ReturnValues: 'ALL_OLD' });
  if (deleted) await adjustProductsCount(deleted.storeId, -1);
  return { deleted: Boolean(deleted) };
};

// --- Image uploads: the browser PUTs the file straight to S3 with this presigned URL ---

const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

// ponytail: a presigned PUT can't cap file size; switch to createPresignedPost with content-length-range if uploads get abused.
export const presignProductImage = async ({ body }) => {
  const ext = IMAGE_TYPES[body.contentType];
  if (!ext) throw new HttpError(400, 'Only JPEG, PNG, WebP or GIF images are allowed');
  const bucket = process.env.BUCKET_NAME;
  const key = `products/${randomUUID()}.${ext}`;
  const uploadUrl = await getSignedUrl(s3, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: body.contentType }), { expiresIn: 300 });
  return { uploadUrl, url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` };
};
