# ShopAI — Implementation

How the frontend is built today. For the backend plan see [cloud-migration.md](cloud-migration.md); for status and next steps see [handoff.md](handoff.md).

## Stack

- React 19, Vite 8, `lucide-react` icons, `canvas-confetti`
- Plain CSS (`src/index.css`, `src/App.css`) plus inline styles; shared classes such as `clean-card`, `btn-primary` and `btn-secondary`
- No router library, no state library, no backend

## Layers

```
pages / components  ──>  services (async)  ──>  db.js  ──>  localStorage
      (UI)               (business logic)      (JSON read/write, seed data)
```

- **UI** never touches `localStorage` directly (two exceptions: `CartContext` persists the cart itself, and `Storefront` reads reviews via `getFromStorage`). It calls services.
- **Services** (`src/services/*Service.js`) are all `async`, so replacing their bodies with `fetch()` calls to API Gateway will not change any caller.
- **`api.js`** holds `apiFetch()` for the future API Gateway backend. It is only active when `VITE_API_BASE_URL` is set, and today only `assistantService` uses it.
- **`db.js`** holds `STORAGE_KEYS`, `getFromStorage`, `saveToStorage` and `initDB()`, which seeds data from `initialData.js` on first load.

## Routing (`src/App.jsx`)

`currentPath` state mirrors `window.location.pathname`. `navigate(path)` calls `history.pushState`; a `popstate` listener handles Back/Forward. `renderRoute()` decides what to show:

1. **Not signed in:** `/register` shows `Register`; every other path shows `Login`. After login the user stays on the path they asked for.
2. **`/dashboard/*` and admin:** `DashboardLayout` with the matching tab (`overview`, `products`, `orders`, `inventory`, `customers`, `returns`, `settings`).
3. **`/dashboard/*` and not admin:** "Admin access required" page.
4. **Marketplace routes** (wrapped in the demo banner, `Navbar` and `Footer`): `/`, `/stores`, `/store/:id`, `/products?category&search`, `/product/:id`, `/cart`, `/checkout`, `/order-success?orderId`, `/orders`, `/orders/:id`, `/profile`, `/sell`, `/sell/create`, and a fallback "Page Not Found".

## Authentication

Files: `src/services/authService.js`, `src/services/userService.js`, `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/components/AuthCard.jsx`.

- **Admin:** hardcoded `admin` / `admin` in `authService`, role `admin`.
- **Customers:** created by `userService.register()`. Stored in `localStorage["shopai_users_v1"]` with a normalized (trimmed, lowercased) email, a random 16-byte salt, and a PBKDF2-SHA256 hash (100,000 iterations) via Web Crypto. The plain password is never stored. Role `customer`.
- **Login:** `authService.login(identifier, password)`. The identifier `admin` is checked against the hardcoded admin; anything else is treated as an email and checked with `userService.verifyCredentials()`. On success the public user object (no hash or salt) is saved in `localStorage["shopai_session_v2"]`.
- **Session:** `authService.getCurrentUser()` reads it; `App` keeps it in `currentUser` state; `authService.isAdmin(user)` checks `role === 'admin'`. Logout clears it.
- **Validation:** `validateRegistration()` in `userService.js` is used by the Register page for instant feedback and again inside `register()`, so the same rules will apply when the function moves into Lambda. Rules: name required; email required and well-formed; password at least 8 characters; confirmation must match. Phone is optional.
- **After registering,** the user is signed in automatically and sent to `/`.

## Checkout (`src/pages/Checkout.jsx`)

- **Required fields:** name, email, phone, address, city, state, PIN code; plus UPI ID when UPI is selected, or card number when Card is selected. COD needs nothing extra.
- **Validation:** `getMissingFields()` returns every blank (whitespace-only counts as blank) required field. If any are missing, `handlePlaceOrder` stops before creating an order, marks each field with a red border and "Required", and lists them above the Place Order button. Typing in a field clears its error. The form uses `noValidate` so these messages replace the browser's tooltips.
- **Orders:** the cart is grouped by `storeId` (`Object.groupBy`) and `orderService.createOrder` is called once per store. Cart-level shipping and discount go on the first order.
- **Payment:** simulated. Stored as `UPI (<id>)`, `Card (•••• 1234)` or `Cash on Delivery`.

## Orders (`src/services/orderService.js`)

- `createOrder` generates an id like `ORD-12345`, sets status `Placed`, builds `trackingUpdates`, deducts each item's quantity from product stock (via `productService.updateProduct`, which also recomputes In / Low / Out of Stock), and adds to the store's `metrics.totalSales` and `totalOrders`.
- **Status flow:** Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered. The merchant changes it from Dashboard, then Orders; the customer's tracking page reads the same record.

## Store Dashboard (`src/pages/dashboard/`)

- `DashboardLayout` loads all stores, picks the active one (`storeService.getActiveStoreId()`, falling back to the first store), and shows loading, error (with Retry) or empty ("No stores yet") states.
- **Switching store** writes the active id and updates `currentStore`. Tab content is rendered inside `<React.Fragment key={currentStore.id}>`, so it remounts and every tab reloads its data for the new store. The old tab instance is discarded, so its late results can never show up. This is why rapid switching cannot leave stale data on screen.
- Each tab (`Overview`, `Products`, `Orders`, `Inventory`, `Customers`, `Returns`, `Settings`) reads the active store id on mount and loads only that store's records. Overview and Settings show "Store not found." if the id is invalid.

## AI chat widget (`src/components/ChatWidget.jsx`)

- **Where:** rendered once in `App.jsx` inside the marketplace layout, so it appears on every marketplace page but not on login/register or the dashboard. `position: fixed` bottom-right, `z-index: 90` (above the navbar, below `ReturnModal`).
- **States:** closed (round button) and open (panel 360×520). "Expand" grows it to 520×680 (capped to the viewport); "Hide" (or Escape) collapses it back to the button. Messages stay in component state while hidden and are lost on page reload. On phones (≤480px) the panel is full width, 75vh tall, and the expand button is hidden (CSS in `index.css`).
- **Messages:** `{ id, role: 'user' | 'assistant', content, products?, isError? }`. Empty state shows 3 suggestion chips. Enter sends, Shift+Enter adds a newline. A typing indicator shows while waiting. Errors appear as a red assistant bubble and are not sent back to the model.
- **Backend seam:** `assistantService.sendMessage(messages)` resolves `{ reply, productIds }`. Without `VITE_API_BASE_URL` it returns a "not connected yet" reply after about 0.6 s. With it, it calls `POST /assistant` through `apiFetch`. Product ids are resolved with `productService.getProductById` and shown as clickable rows (rating badge colored by `getRatingColors`); clicking one opens `/product/:id` and hides the panel.
- **Connecting Azure OpenAI:** see [ai-assistant.md](ai-assistant.md). No UI changes needed.

## Data model (localStorage)

| Key | Contents | Service |
|---|---|---|
| `shopai_stores_v1` | Stores (id `STORE-1001`…, handle, name, category, owner, location, metrics) | `storeService` |
| `shopai_products_v1` | Products (id `PROD-101`…, storeId, price, originalPrice, stock, status, image, description, features) | `productService` |
| `shopai_orders_v1` | Orders (id `ORD-…`, storeId, customer fields, items, totals, status, trackingUpdates) | `orderService` |
| `shopai_returns_v1` | Return requests (id `RET-…`, orderId, storeId, productId, reason, status) | `returnService` |
| `shopai_customers_v1` | Seeded shopper profiles used by dashboard analytics | `customerService` |
| `shopai_reviews_v1` | Store reviews (read-only seed data) | read directly by `Storefront` |
| `shopai_cart_v1` | Cart items | `CartContext` |
| `shopai_active_store_id_v1` | Dashboard's selected store | `storeService` |
| `shopai_active_user_v1` | Seeded "current customer" used by Profile | `customerService` |
| `shopai_users_v1` | Registered accounts (email, name, phone, role, salt, passwordHash) | `userService` |
| `shopai_session_v2` | Signed-in user (public fields only) | `authService` |

Seed data: `src/services/initialData.js` (5 stores, 26 products, 12 customers, 9 orders, 4 returns, 5 reviews).

## Conventions

- Keep UI logic in pages and data logic in services. New data access goes through a service method, never straight to `localStorage`.
- Every service method stays `async`, even when the local version is synchronous.
- IDs are strings with a prefix (`STORE-`, `PROD-`, `ORD-`, `RET-`, `USER-`).
- Money is in INR as plain numbers; format with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- `ponytail:` comments mark deliberate shortcuts that have a known limit and an upgrade path.
