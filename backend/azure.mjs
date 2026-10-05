// Azure Static Web Apps managed API (Azure Functions v4): serves the Lambda handler at /api/*,
// backed by dynalite, an in-memory DynamoDB inside this process, seeded from initialData.js.
// Needs JWT_SECRET, ADMIN_PASSWORD, DEMO_PASSWORD (+ AZURE_OPENAI_* for the assistant) as app settings.
// ponytail: data lives in this instance's memory, so it resets on cold start and isn't shared across
// instances; point AWS_ENDPOINT_URL_DYNAMODB at a real DynamoDB (and drop dynalite) when persistence matters.
import { app } from '@azure/functions';
import dynalite from 'dynalite';

const DYNALITE_PORT = 4567;

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
  const { db, getItem } = await import('./src/lib.mjs');
  emulateTransactWrite(db, getItem);
  const { setupTables } = await import('./tables.mjs');
  await setupTables();
  return (await import('./src/index.mjs')).handler;
};

const ready = setup();
ready.catch(err => console.error('API setup failed:', err));

// Translates the Functions request into the API Gateway event the Lambda handler expects.
export const apiHandler = async (req) => {
  const lambda = await ready;
  const url = new URL(req.url);
  const headers = Object.fromEntries(req.headers);
  // Static Web Apps reserves Authorization for its own auth, so the site sends the session token as X-Session-Token
  if (headers['x-session-token']) headers.authorization = `Bearer ${headers['x-session-token']}`;
  const out = await lambda({
    requestContext: { http: { method: req.method } },
    rawPath: url.pathname.replace(/^\/api(?=\/)/, ''),
    headers,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: (await req.text()) || undefined
  });
  return { status: out.statusCode, headers: out.headers, body: out.body };
};

app.http('api', {
  route: '{*path}',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: apiHandler
});
