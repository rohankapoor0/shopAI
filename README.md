# ShopAI — Multi-Vendor E-Commerce Marketplace Prototype

A high-performance, polished functional prototype of **ShopAI**, a multi-vendor e-commerce marketplace platform built with React, Vite, Lucide Icons, and modern aesthetics.

Backed by **AWS**: DynamoDB for data, one Lambda behind an API Gateway HTTP API, S3 for product images, and **Azure OpenAI** for the shopping assistant (`backend/`, AWS SAM).

---

## Key Features

### Marketplace & Customer Experience
- **Curated Store Directory (`/stores`)**: Browse 5 verified independent stores across India with category filters and ratings.
- **Dedicated Storefronts (`/store/:storeId`)**: Individual merchant storefronts with custom banners, store info, verified customer reviews, and store-specific product catalogs.
- **Product Catalog & Filters (`/products`)**: Filter by category, price slider, minimum rating, and search keywords. Sort by popularity, rating, or price.
- **Product Details (`/product/:productId`)**: High-res imagery, INR pricing, stock availability, specifications, quantity selector, and "More from this store".
- **Cart & Simulated Checkout (`/cart`, `/checkout`)**: Real-time quantity controls, automatic free delivery threshold (> ₹1,500), simulated UPI, Card, and COD payments, with confetti celebration and order ID generation.
- **Visual Order Tracking (`/orders/:orderId`)**: Interactive 6-stage fulfillment stepper timeline:
  `Order Placed` -> `Confirmed` -> `Packed` -> `Shipped` -> `Out for Delivery` -> `Delivered`.
- **Customer Profile & Returns (`/profile`, `/orders`)**: Order history, saved addresses, and an interactive return request workflow.
- **AI Shopping Assistant**: Floating chat button on every marketplace page; hide/expand panel, suggestion chips, clickable product suggestions, answered by Azure OpenAI from live catalog data (see `docs/ai-assistant.md`).

### Merchant Platform & Dashboard
- **Seller Landing & Onboarding Wizard (`/sell`, `/sell/create`)**:
  - 5-step onboarding wizard for store name, category, owner details, origin location, and custom handle slug (`shopai.com/store/handle`).
  - Instant store activation with zero wait time.
- **Shopify-Style Store Dashboard (`/dashboard`)**:
  - **Overview**: Revenue cards, 7-day sales graph, fulfillment rates, and recent orders.
  - **Products (`/dashboard/products`)**: Add and edit product modals; newly added products immediately reflect on the public storefront.
  - **Inventory (`/dashboard/inventory`)**: Stock health badges and quick inline restock controls.
  - **Orders (`/dashboard/orders`)**: Store-specific orders with an interactive **Fulfillment Status Dropdown** that updates customer tracking in real time.
  - **Customers (`/dashboard/customers`)**: Shopper analytics and total store spend.
  - **Returns (`/dashboard/returns`)**: Manage, inspect, and approve customer return claims.
  - **Settings (`/dashboard/settings`)**: Update storefront branding and policies.

---

## Tech Stack & Architecture

- **Frontend**: React 19, Vite, Lucide React, Canvas Confetti, vanilla CSS
- **Backend** (`backend/`): AWS SAM template with DynamoDB (users, stores, products, orders, returns), one Node 22 Lambda behind an API Gateway HTTP API, an S3 bucket for product images, JWT auth
- **AI**: Azure OpenAI (`gpt-4.1-mini`) called from the Lambda
- **Browser state**: only the cart, the session token and the dashboard's selected store

---

## Getting Started

```bash
git clone https://github.com/rohankapoor0/shopAI.git
cd shopAI

# 1. Deploy the backend and seed it (needs AWS CLI + SAM CLI): see docs/cloud-migration.md
cd backend && npm install && sam build && sam deploy --guided && cd ..

# 2. Point the frontend at it
echo "VITE_API_BASE_URL=<ApiUrl from the stack outputs>" > .env.local

# 3. Run the frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Docs

- [docs/handoff.md](docs/handoff.md) — current status, accounts, known gaps, next steps
- [docs/implementation.md](docs/implementation.md) — how the frontend works (routing, auth, checkout, dashboard, data model)
- [docs/cloud-migration.md](docs/cloud-migration.md) — AWS backend: deploy, seed, DynamoDB tables, routes, how checkout/auth work
- [docs/ai-assistant.md](docs/ai-assistant.md) — the Azure OpenAI assistant route (contract, configuration, guardrails)
