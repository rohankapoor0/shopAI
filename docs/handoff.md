# ShopAI — Handoff

Status as of 2026-10-04. Read this first. Then read [implementation.md](implementation.md) for how the frontend works and [cloud-migration.md](cloud-migration.md) for the AWS backend (deploy, tables, routes).

## What ShopAI is

A multi-vendor e-commerce marketplace **prototype**: React 19 + Vite on the frontend, AWS on the backend. Customers browse stores and products, check out, track orders and request returns. The admin manages every store from the Store Dashboard (products, inventory, orders, customers, returns, settings).

The backend follows the target architecture in `pic/dbs.jpeg`: **DynamoDB** for data, one **Lambda** behind an **API Gateway** HTTP API, **S3** for product images, and **Azure OpenAI** for the shopping assistant. It is defined in `backend/template.yaml` (AWS SAM, `ap-south-1`).

## Run it

```bash
# Backend (once, then after backend changes): see docs/cloud-migration.md
cd backend && npm install && sam build && sam deploy && cd ..

# Frontend: .env.local must contain VITE_API_BASE_URL=<ApiUrl stack output>
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint     # oxlint (pre-existing unused-import warnings, 0 errors)
cd backend && npm test   # backend unit checks, no AWS needed
```

Without `VITE_API_BASE_URL`, the login page shows "The backend is not configured…".

## Accounts (after running `backend/seed.mjs`)

| Account | How to sign in | Access |
|---|---|---|
| Admin | username `admin`, password = `ADMIN_PASSWORD` given to the seed script | Whole app **and** the Store Dashboard (all stores) |
| Seeded customers | e.g. `rohan.kapoor@example.com`, password = `DEMO_PASSWORD` | Marketplace, with the seeded orders, returns and saved addresses |
| New customers | Register at `/register` | Marketplace only. `/dashboard/*` shows "Admin access required" |

The whole app is behind login. `/register` is the only page reachable while signed out. Log out from the Navbar icon (desktop), the mobile menu or the dashboard sidebar.

## Done so far

- Marketplace: home, stores directory, storefronts, product catalog with filters, product details, cart, simulated checkout (UPI / Card / COD), order success, order tracking timeline, order history, profile, returns.
- Merchant: sell landing page, 5-step store onboarding, Store Dashboard (overview, products with S3 image upload, orders, inventory, customers, returns, settings).
- AWS backend: all data in DynamoDB. Real server-side auth (PBKDF2 + JWT, admin role enforced in the Lambda). Atomic checkout (one transaction for orders, stock and store metrics). Returns are allowed only on your own delivered orders. Order tracking is restricted to the order's owner or the admin.
- AI assistant answers through Azure OpenAI from the Lambda ([ai-assistant.md](ai-assistant.md)).
- Earlier: per-store orders with shipping and discount split by each store's share, stock deduction, checkout validation, dashboard load and error states, rating badge colors.

## Known gaps and limitations

1. **Frontend is not hosted yet.** It runs from `npm run dev`. Host it on S3 + CloudFront or Amplify and set the stack's `AllowedOrigin` to the site URL.
2. **Secrets are Lambda environment variables** (JWT secret, Azure key). Move them to Secrets Manager or SSM for production.
3. **Payments are simulated.** No gateway.
4. **Lookups use DynamoDB Scans.** Fine at prototype size. Add GSIs when tables grow (see cloud-migration.md).
5. **Image uploads have no size cap**, and store logos and banners are still URLs.
6. **Routing** is a hand-written `if` chain on `window.location.pathname` in `src/App.jsx`, not react-router.
7. **Frontend tests:** none. Backend has `backend/test/backend.test.mjs` (no AWS needed).

## How to verify (manual checklist)

- Signed out, open `/dashboard` → login screen. Wrong password → "Invalid username or password".
- Register with a bad email, short password or mismatched confirmation → inline errors. Register properly → signed in and on Home. The same email again → "An account with this email already exists".
- Log out from the Navbar (desktop icon, or the mobile menu) → login screen. Reload → still signed out.
- As a customer, open `/dashboard` → "Admin access required". Open another customer's order (e.g. `/orders/ORD-10452` when not signed in as Rohan) → "Order Not Found".
- Check out a cart from 2 stores → 2 orders. Stock drops in the Products table. Ordering more than the stock → "Not enough stock: … only N left", and no order is created.
- As admin, mark an order Delivered. As that customer, request a return, then as admin mark it Refunded → stock goes back up once, and store sales go down once.
- Dashboard → Products → Add, upload an image → the product shows on the storefront with the S3 image.
- Chat: ask "gift ideas under ₹2,000" → a reply plus clickable product rows.

## Where things are

| Path | What |
|---|---|
| `backend/template.yaml` | SAM template: tables, bucket, Lambda, HTTP API |
| `backend/src/` | Lambda: `index.mjs` (router + auth check), `auth.mjs`, `catalog.mjs`, `orders.mjs`, `assistant.mjs`, `lib.mjs` |
| `backend/seed.mjs` | Seeds the tables from `src/services/initialData.js` |
| `src/App.jsx` | Router, login gate, admin-only dashboard check |
| `src/services/` | API client (`api.js`) and one service per entity, each method one API call |
| `src/pages/`, `src/pages/dashboard/` | Screens |
| `src/components/` | Shared UI (Navbar, Footer, cards, ReturnModal, AuthCard, ChatWidget) |
| `src/context/CartContext.jsx` | Cart state (browser only) |
| `docs/`, `pic/` | These docs and the target architecture sketch |
