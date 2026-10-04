# ShopAI — Implementation

How the frontend is built today. For the AWS backend (deploy, tables, routes) see [cloud-migration.md](cloud-migration.md). For status and next steps see [handoff.md](handoff.md).

## Stack

- React 19, Vite 8, `lucide-react` icons, `canvas-confetti`
- Plain CSS (`src/index.css`, `src/App.css`) plus inline styles; shared classes such as `clean-card`, `btn-primary` and `btn-secondary`
- No router library, no state library. Backend: AWS Lambda + API Gateway + DynamoDB + S3 (`backend/`)

## Layers

```
pages / components  ──>  services (async)  ──>  api.js (apiFetch)  ──>  API Gateway ──> Lambda ──> DynamoDB / S3 / Azure OpenAI
      (UI)              (one method = one route)   (token, errors)
```

- **UI** calls services, never `fetch` directly. `CartContext` is the only UI code that touches `localStorage` (the cart stays in the browser).
- **Services** (`src/services/*Service.js`): each method is one `apiFetch` call. `getStoreById`, `getProductById` and `getOrderById` resolve to `null` on 404/403 (`orNull`).
- **`api.js`**: `apiFetch(path, { method, body })` prefixes `VITE_API_BASE_URL`, sends the session token, and throws `Error` objects with `err.status` and the server's message. A 401 on a signed-in call clears the session and reloads to the login screen.
- **`db.js`**: `STORAGE_KEYS` (cart, session, dashboard store) plus `getFromStorage` / `saveToStorage`.
- **Business rules live in the Lambda** (`backend/src/`): pricing, stock, order splitting, return rules, admin checks.

## Routing (`src/App.jsx`)

`currentPath` state mirrors `window.location.pathname`. `navigate(path)` calls `history.pushState`; a `popstate` listener handles Back/Forward. `renderRoute()` decides what to show:

1. **Not signed in:** `/register` shows `Register`; every other path shows `Login`. After login the user stays on the path they asked for.
2. **`/dashboard/*` and admin:** `DashboardLayout` with the matching tab (`overview`, `products`, `orders`, `inventory`, `customers`, `returns`, `settings`).
3. **`/dashboard/*` and not admin:** "Admin access required" page.
4. **Marketplace routes** (wrapped in `Navbar` and `Footer`): `/`, `/stores`, `/store/:id`, `/products?category&search`, `/product/:id`, `/cart`, `/checkout`, `/order-success?orderId`, `/orders`, `/orders/:id`, `/profile`, `/sell`, `/sell/create`, and a fallback "Page Not Found".

## Authentication

Files: `src/services/authService.js`, `src/services/userService.js`, `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/components/AuthCard.jsx`, `backend/src/auth.mjs`.

- **Register:** `userService.register()` calls `POST /auth/register`. The Lambda validates the input, normalizes the email, hashes the password (PBKDF2-SHA256, 100,000 iterations, random salt) and stores it in the Users table. `validateRegistration()` also runs on the page for instant feedback. Rules: name required; email required and well-formed; password 8–128 characters; confirmation must match (page only). Phone is optional.
- **Login:** `authService.login(identifier, password)` calls `POST /auth/login`. The identifier is an email, or `admin` for the seeded admin. On success `{ token, user }` is saved in `localStorage["shopai_session_v3"]`. Wrong credentials resolve to `null`, and other failures throw (shown on the Login page).
- **Session:** `authService.getCurrentUser()` returns `session.user`. `App` keeps it in `currentUser` state. `authService.isAdmin(user)` only decides what the UI shows, because the Lambda checks the token's role on every admin route. Logout (Navbar icon, mobile menu, dashboard sidebar) clears the session.
- **After registering,** the user is signed in automatically and sent to `/`.

## Checkout (`src/pages/Checkout.jsx`)

- **Required fields:** name, email, phone, address, city, state, PIN code; plus UPI ID when UPI is selected, or card number when Card is selected. COD needs nothing extra.
- **Validation:** `getMissingFields()` returns every blank (whitespace-only counts as blank) required field. If any are missing, `handlePlaceOrder` stops before creating an order, marks each field with a red border and "Required", and lists them above the Place Order button. Typing in a field clears its error. The form uses `noValidate` so these messages replace the browser's tooltips.
- **Orders:** `orderService.createOrders()` sends the whole cart (`productId` + `quantity` only) to `POST /orders`. The Lambda re-prices it, checks stock, creates one order per store (shipping and discount split by each store's share of the subtotal) and decrements stock in one DynamoDB transaction. A stock shortfall comes back as a 409, shown above Place Order.
- **Payment:** simulated. Stored as `UPI (<id>)`, `Card (•••• 1234)` or `Cash on Delivery`.

## Orders (`backend/src/orders.mjs`)

- New orders get an id like `ORD-12345`, status `Placed`, `trackingUpdates`, and the store's `metrics.totalSales` / `totalOrders` are incremented in the same transaction.
- **Status flow:** Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered (or Cancelled, which is final, restocks the items and reverses the metrics). The merchant changes it from Dashboard, then Orders. The customer's tracking page reads the same record and only the owner or the admin can open it.
- **Returns:** only for the customer's own Delivered orders, one open return per item. Marking a return Returned or Refunded restocks once; Refunded also subtracts the amount from store sales once.

## Store Dashboard (`src/pages/dashboard/`)

- `DashboardLayout` loads all stores, picks the active one (the id saved in `localStorage`, falling back to the first store, which it then saves), and shows loading, error (with Retry) or empty ("No stores yet") states.
- **Switching store** writes the active id and updates `currentStore`. Tab content is rendered inside `<React.Fragment key={currentStore.id}>`, so it remounts and every tab reloads its data for the new store. The old tab instance is discarded, so its late results can never show up. This is why rapid switching cannot leave stale data on screen.
- Each tab (`Overview`, `Products`, `Orders`, `Inventory`, `Customers`, `Returns`, `Settings`) reads the active store id on mount and loads only that store's records. Overview and Settings show "Store not found." if the id is invalid.

## AI chat widget (`src/components/ChatWidget.jsx`)

- **Where:** rendered once in `App.jsx` inside the marketplace layout, so it appears on every marketplace page but not on login/register or the dashboard. `position: fixed` bottom-right, `z-index: 90` (above the navbar, below `ReturnModal`).
- **States:** closed (round button) and open (panel 360×520). "Expand" grows it to 520×680 (capped to the viewport); "Hide" (or Escape) collapses it back to the button. Messages stay in component state while hidden and are lost on page reload. On phones (≤480px) the panel is full width, 75vh tall, and the expand button is hidden (CSS in `index.css`).
- **Messages:** `{ id, role: 'user' | 'assistant', content, products?, isError? }`. Empty state shows 3 suggestion chips. Enter sends, Shift+Enter adds a newline. A typing indicator shows while waiting. Errors appear as a red assistant bubble and are not sent back to the model.
- **Backend:** `assistantService.sendMessage(messages)` calls `POST /assistant` through `apiFetch` and resolves `{ reply, productIds }`. Product ids are resolved with `productService.getProductById` and shown as clickable rows (rating badge colored by `getRatingColors`); clicking one opens `/product/:id` and hides the panel.
- **Azure OpenAI setup:** see [ai-assistant.md](ai-assistant.md).

## Data model

Server data is in DynamoDB (tables and item shapes: [cloud-migration.md](cloud-migration.md)). The browser keeps only:

| Key | Contents | Used by |
|---|---|---|
| `shopai_cart_v1` | Cart items | `CartContext` |
| `shopai_session_v3` | `{ token, user }` of the signed-in user | `authService`, `api.js` |
| `shopai_active_store_id_v1` | Dashboard's selected store | `storeService` |

Seed data: `src/services/initialData.js` (11 stores, 58 products, 12 customers, 9 orders, 4 returns, 11 reviews), loaded into DynamoDB by `backend/seed.mjs`.

## Conventions

- Keep UI logic in pages, API calls in services, and business rules and validation in the Lambda (the trust boundary).
- A new route: add it to `ROUTES` in `backend/src/index.mjs` (with its access level), then a service method that calls it.
- IDs are strings with a prefix (`STORE-`, `PROD-`, `ORD-`, `RET-`, `USER-`).
- Money is in INR as plain numbers; format with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- `ponytail:` comments mark deliberate shortcuts that have a known limit and an upgrade path.
