// Builds the website and publishes it, with the API as managed Functions, to the Azure Static Web App.
// Run from the repo root after "az login": npm run deploy:azure
// The app's settings must hold JWT_SECRET, ADMIN_PASSWORD, DEMO_PASSWORD and AZURE_OPENAI_* (see backend/azure.mjs).
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const app = process.env.SWA_NAME || 'shopai-web';
const group = process.env.SWA_RESOURCE_GROUP || 'shopai-rg';
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });

// The Functions package: backend code laid out as in the repo (seed.mjs imports ../src/services/initialData.js)
const api = '.azure-api';
rmSync(api, { recursive: true, force: true });
cpSync('backend/src', `${api}/backend/src`, { recursive: true });
for (const file of ['azure.mjs', 'tables.mjs', 'seed.mjs']) cpSync(`backend/${file}`, `${api}/backend/${file}`);
cpSync('src/services/initialData.js', `${api}/src/services/initialData.js`);
const backend = JSON.parse(readFileSync('backend/package.json', 'utf8'));
writeFileSync(`${api}/package.json`, JSON.stringify({
  name: 'shopai-azure-api',
  private: true,
  type: 'module',
  main: 'backend/azure.mjs',
  dependencies: { ...backend.dependencies, '@azure/functions': backend.devDependencies['@azure/functions'], dynalite: backend.devDependencies.dynalite }
}, null, 2));
writeFileSync(`${api}/host.json`, JSON.stringify({ version: '2.0' }));
run('npm', ['install', '--omit=dev', '--no-fund', '--no-audit'], { cwd: api });

// Variables already in the environment win over .env.local, so the build calls the same-origin /api
run('npm', ['run', 'build'], { env: { ...process.env, VITE_API_BASE_URL: '/api' } });

const token = execFileSync('az', ['staticwebapp', 'secrets', 'list', '--name', app, '--resource-group', group, '--query', 'properties.apiKey', '-o', 'tsv'],
  { shell: true, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
run('npx', ['-y', '@azure/static-web-apps-cli@2', 'deploy', 'dist', '--api-location', api, '--api-language', 'node', '--api-version', '22', '--env', 'production'],
  { env: { ...process.env, SWA_CLI_DEPLOYMENT_TOKEN: token } });

const host = execFileSync('az', ['staticwebapp', 'show', '--name', app, '--resource-group', group, '--query', 'defaultHostname', '-o', 'tsv'],
  { shell: true, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
console.log(`\nPublished. Open https://${host}`);
