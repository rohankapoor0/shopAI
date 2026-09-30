# ShopAI — Handoff

Status as of 2026-09-30. Read this first, then [implementation.md](implementation.md) for how the code works and [cloud-migration.md](cloud-migration.md) for the AWS plan.

## What ShopAI is

A multi-vendor e-commerce marketplace **prototype** (React 19 + Vite). Customers browse stores and products, check out, track orders and request returns. The admin manages every store from the Store Dashboard (products, inventory, orders, customers, returns, settings).

There is **no backend yet**. All data lives in the browser's `localStorage`, behind async service functions in `src/services/` that are meant to be swapped for API calls (API Gateway + Lambda + DynamoDB).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint     # oxlint (about 96 pre-existing unused-import warnings, 0 errors)
```

Needs a modern browser (uses `Object.groupBy` and Web Crypto). Registration only works on `localhost` or HTTPS, because `crypto.subtle` requires a secure context.

## Accounts

| Account | How to sign in | Access |
|---|---|---|
| Admin | username `admin`, password `admin` (hardcoded in `src/services/authService.js`) | Whole app **and** the Store Dashboard (all stores) |
| Customer | Register at `/register`, then sign in with email + password | Marketplace only; `/dashboard/*` shows "Admin access required" |

The whole app is behind login. `/register` is the only page reachable while signed out.

To reset all local data, clear the site's `localStorage` in DevTools (keys start with `shopai_`). Seed data reloads on the next page load.

## Done so far

- Marketplace: home, stores directory, storefronts, product catalog with filters, product details, cart, simulated checkout (UPI / Card / COD), order success, order tracking timeline, order history, profile, returns.
- Merchant: sell landing page, 5-step store onboarding, Store Dashboard (overview, products, orders, inventory, customers, returns, settings).
- Fixes (commit `6866429`): dashboard no longer stuck loading on first visit; a multi-store cart creates one order per store; purchases reduce stock; tracking data for new orders is correct; only the last 4 card digits are stored.
- Commit `bf3d92c`: admin login gate; checkout blocks orders until required fields are filled; dashboard loading/error/empty states; store switching reloads the tab for the selected store.
- Commit `e09fc2b`: customer registration (`/register`), login by email, admin-only dashboard, docs. Commit `4c8e817`: product rating badges colored by score (green 4–5, orange 2–4, red below 2).
- AI chat widget UI: bottom-right button on marketplace pages that opens a chat panel, which can be hidden and expanded. It replies "not connected yet" until the Azure OpenAI backend exists ([ai-assistant.md](ai-assistant.md)).

## Known gaps and limitations

1. **Not secure.** Credentials, sessions and "hashed" passwords all live in the browser. Anyone can edit `localStorage` to become admin. Fine for a demo, not for real users.
2. **Registered users are not linked to shopper data yet.** Checkout pre-fills "Rohan Kapoor", orders use `customerId: "CUST-1"`, and `/profile` shows the seeded customer (`customerService.getCurrentUser`). Next step: use the signed-in user's id, name and email in Checkout, Orders and Profile.
3. **Cart-level discount and shipping** are applied to the first store's order when a cart spans several stores.
4. **Payments are simulated.** No gateway.
5. **Images** are Unsplash URLs; merchants cannot upload files (S3 is planned).
6. **No automated tests in the repo.** Verification so far was done with throwaway Playwright scripts (see "How to verify").
7. **Routing** is a hand-written `switch` on `window.location.pathname` in `src/App.jsx`, not react-router.
8. Lint shows about 96 warnings, nearly all unused imports from the original code.

## Suggested next steps (in order)

1. Link registered users to customer data (gap 2).
2. Build the backend following [cloud-migration.md](cloud-migration.md): DynamoDB tables, then Lambda + API Gateway for auth and users, then the other services one at a time.
3. Replace the hardcoded admin with a real admin role (a `role: 'admin'` user in the Users table, or Cognito groups).
4. S3 uploads for product images.
5. Connect the chat widget to Azure OpenAI: deploy the `/assistant` Lambda and set `VITE_API_BASE_URL` ([ai-assistant.md](ai-assistant.md)). The UI is done, and this can happen in parallel with the steps above.

## How to verify (manual checklist)

- Signed out, open `/dashboard` → login screen. Wrong password → "Invalid username or password".
- Register with a bad email, short password or mismatched confirmation → inline errors, no account created. Register properly → signed in and on Home.
- Register the same email again → "An account with this email already exists".
- As a customer, open `/dashboard` → "Admin access required".
- As admin, switch between all stores in the dashboard sidebar → header and tab content always show the same store.
- Checkout with a blank required field → "Please fill in: …", no order created. Valid checkout → order success page.
- Chat button bottom-right on marketplace pages (not on the dashboard). Open → suggestion chips; send → typing dots, then "not connected yet" reply. Expand/shrink, Hide and Escape work; reopening keeps the messages.

## Where things are

| Path | What |
|---|---|
| `src/App.jsx` | Router, login gate, admin-only dashboard check, demo banner |
| `src/services/` | Data layer (one file per entity) — the part that becomes the backend |
| `src/pages/`, `src/pages/dashboard/` | Screens |
| `src/components/` | Shared UI (Navbar, Footer, cards, ReturnModal, AuthCard, ChatWidget) |
| `src/services/assistantService.js`, `src/services/api.js` | AI assistant seam and API client (see ai-assistant.md) |
| `src/context/CartContext.jsx` | Cart state |
| `docs/` | These docs, plus the target architecture sketch (WhatsApp image) |
