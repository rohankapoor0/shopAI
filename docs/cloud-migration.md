# ShopAI — Cloud Backend (AWS)

ShopAI's data and business logic run on AWS. The browser keeps only the cart, the session token and the dashboard's selected store.

| Service | Role in ShopAI |
|---|---|
| **Amazon DynamoDB** | All persistent data: users, stores (with their reviews), products, orders, returns |
| **AWS Lambda** | One function (`backend/src/index.mjs`) with a small router for every route |
| **Amazon API Gateway** | HTTP API, a single `ANY /{proxy+}` route to the Lambda; CORS and throttling (10 req/s, burst 20) |
| **Amazon S3** | Product images, uploaded straight from the browser with presigned URLs; the built website |
| **Amazon CloudFront** | Serves the website over HTTPS from the private site bucket, once enabled (`CloudFrontEnabled=true`) |
| **Azure OpenAI** | The shopping assistant (`POST /assistant`), called from the same Lambda |

Everything is defined in `backend/template.yaml` (AWS SAM), region `ap-south-1`.

## Deploy

Needs the AWS CLI v2, the AWS SAM CLI and Node 22. Run these from `backend/`:

```bash
aws configure sso             # once: IAM Identity Center sign-in, profile "shopai", region ap-south-1
aws sso login --profile shopai   # whenever the session expires (about every 8 h)
export AWS_PROFILE=shopai     # PowerShell: $env:AWS_PROFILE = "shopai"
npm install
sam build
sam deploy --guided           # first time: stack name "shopai", region ap-south-1, enter the parameters below
TABLE_PREFIX=shopai AWS_REGION=ap-south-1 ADMIN_PASSWORD='...' DEMO_PASSWORD='...' node seed.mjs
```

SSO setup (once, in the AWS console as the account owner): IAM Identity Center → Enable. Under Users, add yourself and accept the email invite. Under Permission sets, create one from `AdministratorAccess`. Under AWS accounts, assign your user to this account with that permission set. Copy the AWS access portal URL for `aws configure sso`.

Then put the `ApiUrl` stack output in the frontend's `.env.local` as `VITE_API_BASE_URL=...` and restart `npm run dev`.

Later deploys need only `sam build && sam deploy`. `samconfig.toml` and `.aws-sam/` are git-ignored.

**Website.** After `sam deploy`, publish the frontend from the repo root with `npm run deploy:web` (same `AWS_PROFILE`). The script reads the stack outputs, builds with that stack's `ApiUrl`, syncs `dist/` to the site bucket (hashed assets cached for a year, `index.html` re-checked on every visit) and invalidates CloudFront. It prints the `SiteUrl`. Unknown paths return `index.html`, so routes like `/orders/ORD-10452` work on reload.

New AWS accounts can't create CloudFront until AWS Support verifies them (`Your account must be verified before you can add new CloudFront resources`). So `CloudFrontEnabled` defaults to `false`, and the site is served by S3 website hosting over plain HTTP (`http://<bucket>.s3-website.ap-south-1.amazonaws.com`). After verification, run `sam deploy --parameter-overrides CloudFrontEnabled=true` and then `npm run deploy:web` again. The bucket becomes private and the site moves to an HTTPS `*.cloudfront.net` URL.

| Parameter | Value |
|---|---|
| `JwtSecret` | Any random string of 32+ characters. Changing it signs everyone out. |
| `AllowedOrigin` | `http://localhost:5173`: an extra origin for local development. The site URL (S3 website or CloudFront) is always allowed (API and S3 CORS). |
| `FrontendOrigin` | `https://calm-flower-04d0e4b00.1.azurestaticapps.net`: the frontend hosted on Azure Static Web Apps, allowed by API and S3 CORS. No trailing slash. |
| `CloudFrontEnabled` | `false` until AWS verifies the account for CloudFront, then `true` |
| `AzureOpenAiEndpoint` / `AzureOpenAiKey` / `AzureOpenAiDeployment` | The Azure OpenAI resource (`shopai-openai-6962`, deployment `gpt-4.1-mini`). Leave empty to disable the assistant (it returns 503). |

**Seeding** copies `src/services/initialData.js` into the tables. The admin is the Users item with key `admin`, so you sign in with username `admin` and `ADMIN_PASSWORD`. Each seeded customer (for example `rohan.kapoor@example.com`) signs in with `DEMO_PASSWORD`. Re-running the seed resets those seed items.

**Tests:** `cd backend && npm test` covers tokens, password hashing, routing, auth checks and input validation. None of these tests need AWS.

## DynamoDB tables

All tables are on-demand and named `<stack>-<name>`.

| Table | Key | Notes |
|---|---|---|
| `users` | `email` | `{ email, id, name, phone, role, addresses, salt, passwordHash }`. Register uses `attribute_not_exists(email)`. |
| `stores` | `id` | Includes `metrics` (`totalSales`, `totalOrders`) and `reviews` (seed reviews, read-only). |
| `products` | `id` | `stock`, `status` (derived from stock) and `sales` are updated by checkout, cancellations and returns. |
| `orders` | `id` | One order per store per checkout. `customerId` is the user id. |
| `returns` | `id` | Has `restocked` and `refunded` flags, so stock and sales change only once. |

Lookups by store or customer use a `Scan` plus a filter in the Lambda (see the `ponytail:` note in `lib.mjs`). Add `StoreIndex` and `CustomerIndex` GSIs if the tables grow past a few thousand items.

## Routes

The Lambda checks the `Authorization: Bearer <token>` header itself. The "Auth" column says who may call each route.

| Method + path | Frontend caller | Auth |
|---|---|---|
| `POST /auth/register` | `userService.register` | public |
| `POST /auth/login` → `{ token, user }` | `authService.login` | public |
| `GET /stores` · `GET /stores/{idOrHandle}` | `storeService.getStores` / `getStoreById` | signed in |
| `POST /stores` | `storeService.createStore` (Sell → Create Store) | signed in |
| `PATCH /stores/{id}` | `storeService.updateStore` | admin |
| `GET /stores/{id}/customers` | `customerService.getStoreCustomers` | admin |
| `GET /products?storeId&category&search&minPrice&maxPrice&minRating&sortBy` · `GET /products/{id}` | `productService` | signed in |
| `POST /products` · `PATCH /products/{id}` · `DELETE /products/{id}` | `productService` | admin |
| `POST /uploads/product-image` → `{ uploadUrl, url }` | `productService.uploadImage` | admin |
| `POST /orders` (whole cart) → `{ orders }` | `orderService.createOrders` | signed in |
| `GET /orders` (mine) · `GET /orders/{id}` | `orderService.getCustomerOrders` / `getOrderById` | owner or admin |
| `GET /orders?storeId=` · `PATCH /orders/{id}/status` | `orderService.getStoreOrders` / `updateOrderStatus` | admin |
| `POST /returns` · `GET /returns` (mine) | `returnService.createReturn` / `getCustomerReturns` | signed in |
| `GET /returns?storeId=` · `PATCH /returns/{id}/status` | `returnService.getStoreReturns` / `updateReturnStatus` | admin |
| `POST /assistant` | `assistantService.sendMessage` | signed in |

Errors come back as `{ "message": "..." }` with a matching status (400, 401, 403, 404, 409 and so on). `apiFetch` throws them as `Error` objects with `err.status`. A 401 on a signed-in call clears the session and shows the login screen.

## How the important parts work

- **Auth.** Passwords use PBKDF2-SHA256 (100,000 iterations, 16-byte salt), compared with `timingSafeEqual`. Login returns an HS256 JWT valid for 12 h, holding `sub` (user id), `role`, `email` and `name`, signed with `node:crypto`. Admin routes check `role === 'admin'` on the server. The frontend's `isAdmin` only decides what to show.
- **Checkout is atomic.** `POST /orders` reads the products, re-prices the cart from the database (client prices are ignored), applies shipping (₹99 at ₹1,500 or less) and the 10% discount (above ₹3,000), and splits both across the per-store orders. It then runs one `TransactWriteItems`: every order Put, every stock update (condition `stock = <value read>`), and every store's `metrics` `ADD`. If stock changed meanwhile, it retries up to 3 times. Real shortages return 409 with "X: only N left".
- **Status changes.** Order and return updates are saved with a condition that the status is still the one that was read. Only then do they restock or adjust metrics, so a double click can't apply side effects twice.
- **Returns.** These are allowed only on your own Delivered orders, one open return per item. The refund amount comes from the order.
- **Images.** The presigned PUT expires after 5 minutes and accepts only JPEG, PNG, WebP or GIF up to 5 MB. The type and exact size are part of the signature, so S3 rejects any other file. Objects under `products/` are publicly readable.
- **Cancellations and returns** put the stock back and lower the product's `sales` count; store `metrics` are reversed once.

## Not done yet

- Secrets are plain Lambda environment variables. Move them to Secrets Manager or SSM for a real deployment.
- Store logo and banner still use URLs (only product images upload to S3).
- No custom domain on CloudFront yet (it uses the `*.cloudfront.net` URL).
- Payments are simulated.
