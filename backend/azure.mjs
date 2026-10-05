// Azure Static Web Apps managed API (Azure Functions v4): serves the Lambda handler at /api/*,
// backed by dynalite, an in-memory DynamoDB inside this process.
// With AZURE_STORAGE_CONNECTION_STRING set, the data persists in Azure Blob Storage: the whole database is
// saved to data/shopai-data.json after every change and restored on cold start (first start seeds it),
// and product images upload to the public "images" container.
// Other app settings: JWT_SECRET, ADMIN_PASSWORD, DEMO_PASSWORD (first seed), AZURE_OPENAI_* (assistant).
// ponytail: one JSON snapshot, last save wins; if Azure runs two instances at once, one can overwrite the
// other's changes. Move to a real database (DynamoDB, Cosmos DB) when traffic needs more than one instance.
import { app } from '@azure/functions';
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import dynalite from 'dynalite';

const DYNALITE_PORT = 4567;
// POSTs that don't change any data, so they don't trigger a snapshot save
const READ_ONLY_POSTS = new Set(['/auth/login', '/assistant', '/uploads/product-image']);

const storage = process.env.AZURE_STORAGE_CONNECTION_STRING
  && BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const snapshotBlob = storage?.getContainerClient('data').getBlockBlobClient('shopai-data.json');
const imagesContainer = storage?.getContainerClient('images');

// dynalite has no TransactWriteItems: apply the items one at a time under a lock, undoing them all if any
// condition fails, and surface that the way DynamoDB does so orders.mjs retries as usual.
const emulateTransactWrite = (db, getItem) => {
  const keyOf = (TableName, item) => TableName.endsWith('-users') ? { email: item.email } : { id: item.id };
  let lock = Promise.resolve();
  db.transactWrite = ({ TransactItems }) => (lock = lock.catch(() => {}).then(async () => {
    const undo = [];
    try {
      for (const item of TransactItems) {
        const [op, params] = Object.entries(item)[0];
        const Key = params.Key ?? keyOf(params.TableName, params.Item);
        const before = await getItem(params.TableName, Key);
        if (op === 'Put') await db.put(params);
        else if (op === 'Update') await db.update(params);
        else if (op === 'Delete') await db.delete(params);
        else throw new Error(`transactWrite: ${op} is not supported here`);
        undo.push(before ? () => db.put({ TableName: params.TableName, Item: before }) : () => db.delete({ TableName: params.TableName, Key }));
      }
    } catch (err) {
      for (const revert of undo.reverse()) await revert();
      if (err.name === 'ConditionalCheckFailedException') throw Object.assign(new Error('Transaction cancelled'), { name: 'TransactionCanceledException' });
      throw err;
    }
  }));
};

// Saves are chained so they never overlap; each one writes the database as it is when it runs.
let saving = Promise.resolve();
const saveSnapshot = ({ TABLES, scanAll }) => (saving = saving.catch(() => {}).then(async () => {
  const data = Object.fromEntries(await Promise.all(Object.values(TABLES).map(async t => [t, await scanAll(t)])));
  const json = JSON.stringify(data);
  await snapshotBlob.upload(json, Buffer.byteLength(json), { blobHTTPHeaders: { blobContentType: 'application/json' } });
}));

// Browser uploads go straight to the public images container with a 5-minute write-only SAS URL.
// ponytail: unlike S3's signed Content-Length, a SAS can't cap the upload size, so the 5 MB limit relies
// on the declared size (admin-only route).
const signAzureImage = async (key) => {
  const blob = imagesContainer.getBlockBlobClient(key);
  const uploadUrl = await blob.generateSasUrl({ permissions: BlobSASPermissions.parse('cw'), expiresOn: new Date(Date.now() + 5 * 60 * 1000) });
  return { uploadUrl, url: blob.url, uploadHeaders: { 'x-ms-blob-type': 'BlockBlob' } };
};

const setup = async () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set in the app settings');
  // unref: the Functions host keeps the process alive; this lets tests exit
  await new Promise((resolve, reject) =>
    dynalite({ createTableMs: 0 }).listen(DYNALITE_PORT, '127.0.0.1', err => err ? reject(err) : resolve()).unref());
  Object.assign(process.env, {
    AWS_ENDPOINT_URL_DYNAMODB: `http://127.0.0.1:${DYNALITE_PORT}`,
    AWS_REGION: 'ap-south-1',
    AWS_ACCESS_KEY_ID: 'local',
    AWS_SECRET_ACCESS_KEY: 'local',
    TABLE_PREFIX: 'shopai'
  });
  // Imported only now: lib.mjs builds its DynamoDB client from the env above at import time.
  const lib = await import('./src/lib.mjs');
  emulateTransactWrite(lib.db, lib.getItem);
  const { createTables } = await import('./tables.mjs');
  await createTables();

  const snapshot = snapshotBlob && await snapshotBlob.exists()
    ? JSON.parse((await snapshotBlob.downloadToBuffer()).toString('utf8'))
    : null;
  if (snapshot) {
    for (const [table, items] of Object.entries(snapshot)) await lib.batchPutAll(table, items);
    console.log('Restored data from Blob Storage');
  } else {
    await import('./seed.mjs');
    if (snapshotBlob) await saveSnapshot(lib);
  }

  if (imagesContainer) (await import('./src/catalog.mjs')).imageStore.sign = signAzureImage;
  return { lambda: (await import('./src/index.mjs')).handler, lib };
};

const ready = setup();
ready.catch(err => console.error('API setup failed:', err));

// Translates the Functions request into the API Gateway event the Lambda handler expects.
export const apiHandler = async (req) => {
  const { lambda, lib } = await ready;
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api(?=\/)/, '');
  const headers = Object.fromEntries(req.headers);
  // Static Web Apps reserves Authorization for its own auth, so the site sends the session token as X-Session-Token
  if (headers['x-session-token']) headers.authorization = `Bearer ${headers['x-session-token']}`;
  const out = await lambda({
    requestContext: { http: { method: req.method } },
    rawPath: path,
    headers,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: (await req.text()) || undefined
  });
  // Persist before answering, so a change the user saw succeed survives a restart.
  // If the save fails this throws, the request returns 500, and the next successful save catches up.
  const changedData = ['POST', 'PATCH', 'DELETE'].includes(req.method) && out.statusCode < 300 && !READ_ONLY_POSTS.has(path);
  if (snapshotBlob && changedData) await saveSnapshot(lib);
  return { status: out.statusCode, headers: out.headers, body: out.body };
};

app.http('api', {
  route: '{*path}',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: apiHandler
});
