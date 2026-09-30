# ShopAI — Cloud Migration Plan

How to move ShopAI from `localStorage` to AWS, following the target architecture in the sketch in this folder:

| Service | Role in ShopAI |
|---|---|
| **Amazon S3** | Product images and other uploads |
| **AWS Lambda** | Backend logic: auth, stores, products, orders, returns, customers |
| **Amazon API Gateway** | HTTP API the React app calls |
| **Amazon DynamoDB** | All persistent data |
| **Azure OpenAI** | One AI feature (shopping assistant or recommendations), called from Lambda |

The frontend does not need a rewrite. Every function in `src/services/` is already `async` and maps to one API route below. Replace each function body with an API call, one service at a time.

## 1. Frontend switch-over pattern

Add a tiny client, for example `src/services/api.js`:

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g. https://abc123.execute-api.ap-south-1.amazonaws.com

export const apiFetch = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body && JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};
```

Then, for example, in `userService.js`:

```js
register: (data) => apiFetch('/auth/register', { method: 'POST', body: data }),
```

Callers such as `Register.jsx` already `await` these methods and show `err.message`, so they keep working unchanged.

## 2. DynamoDB tables

Use one table per entity; it is simpler to reason about than a single-table design at this size. Billing mode: on-demand. Region: `ap-south-1` (Mumbai), since users and prices are in India.

| Table | Partition key | Sort key | GSIs (partition / sort) | Serves |
|---|---|---|---|---|
| `ShopAI_Users` | `email` (S) | none | `UserIdIndex`: `id` | register, login, profile |
| `ShopAI_Stores` | `id` (S) | none | `HandleIndex`: `handle` | store directory, storefront by id or handle, dashboard |
| `ShopAI_Products` | `id` (S) | none | `StoreIndex`: `storeId` | catalog, product page, store catalog, inventory |
| `ShopAI_Orders` | `id` (S) | none | `StoreIndex`: `storeId` / `date`; `CustomerIndex`: `customerId` / `date` | checkout, tracking, customer history, merchant orders |
| `ShopAI_Returns` | `id` (S) | none | `StoreIndex`: `storeId`; `CustomerIndex`: `customerId` | return requests, merchant review |
| `ShopAI_Reviews` | `storeId` (S) | `id` (S) | none | storefront reviews |

Notes:

- **Users.** Item shape matches what `userService.register()` stores today: `{ email, id, name, phone, role, createdAt, salt, passwordHash }`. Create the item with `PutItem` plus `ConditionExpression: attribute_not_exists(email)`, which is the server-side version of the "email already exists" check. Seeded customers (`shopai_customers_v1`) can become Users items with role `customer`, with `addresses` as a list attribute.
- **Products "search"** (category, price, rating, keyword) is currently done in memory. For the prototype, `Query StoreIndex` or `Scan` plus filtering in Lambda is fine for about 100 products. If the catalog grows, add OpenSearch.
- **Checkout must be atomic.** Create all per-store orders and decrement stock in one `TransactWriteItems`, with `ConditionExpression: stock >= :qty` on each product, so two shoppers cannot buy the last item. The browser version cannot guarantee this.
- **Store metrics** (`totalSales`, `totalOrders`): update them with `UpdateExpression: ADD` in the same transaction.
- **Cart** stays in the browser; it does not need a table.
- **Seeding:** a one-off script that reads `src/services/initialData.js` and `BatchWriteItem`s it into each table.

## 3. API Gateway routes to Lambda to existing service methods

HTTP API, JSON in and out. The "Auth" column says who may call each route.

| Method + path | Replaces | Auth |
|---|---|---|
| `POST /auth/register` | `userService.register` | public |
| `POST /auth/login` (returns `{ token, user }`) | `authService.login` / `userService.verifyCredentials` | public |
| `GET /me` | `authService.getCurrentUser` | signed in |
| `GET /stores` · `GET /stores/{idOrHandle}` | `storeService.getStores` / `getStoreById` | signed in |
| `POST /stores` · `PATCH /stores/{id}` | `storeService.createStore` / `updateStore` | admin |
| `GET /products?category&search&storeId` · `GET /products/{id}` | `productService.getProducts` / `getProductById` / `getProductsByStore` | signed in |
| `POST /products` · `PATCH /products/{id}` · `DELETE /products/{id}` | `productService.addProduct` / `updateProduct` / `deleteProduct` | admin |
| `POST /orders` (whole cart; Lambda splits it per store) | `orderService.createOrder` (loop in `Checkout.jsx`) | signed in |
| `GET /orders/{id}` · `GET /orders?customerId=me` | `orderService.getOrderById` / `getCustomerOrders` | owner or admin |
| `GET /orders?storeId=` · `PATCH /orders/{id}/status` | `orderService.getStoreOrders` / `updateOrderStatus` | admin |
| `POST /returns` · `GET /returns?customerId=me` | `returnService.createReturn` / `getCustomerReturns` | signed in |
| `GET /returns?storeId=` · `PATCH /returns/{id}/status` | `returnService.getStoreReturns` / `updateReturnStatus` | admin |
| `GET /stores/{id}/customers` | `customerService.getStoreCustomers` | admin |
| `POST /uploads/product-image` (returns presigned URL) | new | admin |
| `POST /assistant` | new (Azure OpenAI) | signed in |

The dashboard's "active store" stays a frontend concern; tabs pass the `storeId` to these routes.

## 4. Auth on the backend

- **Move** `validateRegistration` and `hashPassword` from `userService.js` into the register and login Lambdas. Web Crypto (`crypto.subtle`) exists in Node 18+, so the code copies over as-is. Compare hashes with `crypto.timingSafeEqual` there.
- **Sessions:** the login Lambda returns a signed JWT (short expiry) containing `sub` (user id) and `role`. The frontend stores the token in place of today's `shopai_session_v2` user object and sends it as `Authorization: Bearer …`.
- **Protect routes** with an API Gateway Lambda authorizer (or a JWT authorizer). Admin routes check `role === 'admin'` on the server, because the frontend's `isAdmin` check is only for UI.
- **Admin:** delete the hardcoded `admin`/`admin`. Create the admin as a Users item with `role: 'admin'` and a strong password.
- **Alternative:** Amazon Cognito user pools replace all of the above (sign-up, login, JWTs, admin group). This is more setup but no password code to own.

## 5. S3 for images

1. The admin selects a file in the Add or Edit Product modal.
2. The frontend calls `POST /uploads/product-image` with `{ fileName, contentType }`. Lambda returns a presigned `PUT` URL plus the final object URL.
3. The browser `PUT`s the file straight to S3, then saves the object URL as `product.image`.

The bucket stays private and is served through CloudFront. Allow only `image/*` content types and limit the size in the presign policy.

## 6. Azure OpenAI (one feature)

- **Keep the key server-side.** It lives in the `/assistant` Lambda's environment (or Secrets Manager); never ship it to the browser.
- **Suggested first feature:** a shopping assistant. The Lambda receives the question, fetches relevant products from DynamoDB (by category or keyword), and sends them plus the question to the Azure OpenAI chat deployment with a system prompt like "only recommend products from this list". It returns the answer and product ids, which the UI renders as `ProductCard`s.
- **Guardrails:** rate-limit per user in API Gateway and cap `max_tokens`.

## 7. Suggested order

1. Create the DynamoDB tables and seed them.
2. Build the auth Lambdas and API (`/auth/register`, `/auth/login`, `/me`); switch `userService` and `authService`.
3. Build read-only store and product routes; switch those services.
4. Build orders (transactional checkout) and returns.
5. Add the admin write routes and the authorizer role checks.
6. Add S3 uploads.
7. Add the Azure OpenAI assistant.

After each step the app keeps working: services not yet migrated still use `localStorage`.

## Environment variables (frontend)

| Name | Example | Used by |
|---|---|---|
| `VITE_API_BASE_URL` | `https://abc123.execute-api.ap-south-1.amazonaws.com` | `src/services/api.js` |

Put it in `.env.local`, which git already ignores through `*.local`.
