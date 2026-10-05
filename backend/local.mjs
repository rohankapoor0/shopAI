// Local stand-in for API Gateway + Lambda, backed by DynamoDB Local (no AWS account needed).
// Start DynamoDB Local on :8000 first, then from backend/: node local.mjs  → API on http://localhost:3001
// First run creates the tables and seeds them (admin / admin1234, seeded customers / demo1234).
// Not available locally: the AI assistant (needs AZURE_OPENAI_*) and product image upload (needs S3).
import { createServer } from 'node:http';
import { setupTables } from './tables.mjs';

const env = {
  AWS_ENDPOINT_URL_DYNAMODB: 'http://localhost:8000',
  AWS_REGION: 'ap-south-1',
  AWS_ACCESS_KEY_ID: 'local',
  AWS_SECRET_ACCESS_KEY: 'local',
  TABLE_PREFIX: 'shopai',
  JWT_SECRET: 'local-dev-secret-that-is-at-least-32-characters',
  ADMIN_PASSWORD: 'admin1234',
  DEMO_PASSWORD: 'demo1234'
};
for (const [k, v] of Object.entries(env)) process.env[k] ??= v;

await setupTables();

const { handler } = await import('./src/index.mjs');
const PORT = process.env.PORT ?? 3001;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
};

createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const url = new URL(req.url, 'http://localhost');
  const out = await handler({
    requestContext: { http: { method: req.method } },
    rawPath: url.pathname,
    headers: req.headers,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: chunks.length ? Buffer.concat(chunks).toString('utf8') : undefined
  });
  res.writeHead(out.statusCode, { ...CORS, ...out.headers });
  res.end(out.body);
}).listen(PORT, () => console.log(`ShopAI API on http://localhost:${PORT}`));
