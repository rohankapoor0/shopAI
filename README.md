# ShopAI — Multi-Vendor E-Commerce Marketplace Prototype

A high-performance, polished functional prototype of **ShopAI**, a multi-vendor e-commerce marketplace platform built with React, Vite, Lucide Icons, and modern aesthetics.

Designed with clean service abstractions (`src/services/`) for seamless future connection to **AWS Lambda** and **DynamoDB**.

---

## 🚀 Key Features

### 🛒 Marketplace & Customer Experience
- **Curated Store Directory (`/stores`)**: Browse 5 verified independent stores across India with category filters and ratings.
- **Dedicated Storefronts (`/store/:storeId`)**: Individual merchant storefronts with custom banners, store info, verified customer reviews, and store-specific product catalogs.
- **Product Catalog & Filters (`/products`)**: Filter by category, price slider, minimum rating, and search keywords. Sort by popularity, rating, or price.
- **Product Details (`/product/:productId`)**: High-res imagery, INR pricing, stock availability, specifications, quantity selector, and "More from this store".
- **Cart & Simulated Checkout (`/cart`, `/checkout`)**: Real-time quantity controls, automatic free delivery threshold (> ₹1,500), simulated UPI, Card, and COD payments, with confetti celebration and order ID generation.
- **Visual Order Tracking (`/orders/:orderId`)**: Interactive 6-stage fulfillment stepper timeline:
  `Order Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`.
- **Customer Profile & Returns (`/profile`, `/orders`)**: Order history, saved addresses, and an interactive return request workflow.

### 💼 Merchant Platform & Dashboard
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

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, Lucide React, Canvas Confetti
- **Styling**: Vanilla CSS with modern dark mode, glassmorphism, responsive mobile drawers, and CSS variables
- **State & Storage**: Frontend state + `localStorage` persistence
- **Service Layer**:
  - `storeService.js`
  - `productService.js`
  - `orderService.js`
  - `returnService.js`
  - `customerService.js`

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/rohankapoor0/shopAI.git
cd shopAI

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
