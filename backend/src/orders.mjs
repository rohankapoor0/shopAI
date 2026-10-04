// Checkout, order tracking/fulfillment, returns and per-store customer analytics.
import { db, TABLES, HttpError, scanAll, getItem, putWithNewId, randomId, today, stockStatus } from './lib.mjs';

const STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
const ORDER_STATUSES = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const RETURN_STATUSES = ['Requested', 'Approved', 'Pickup Scheduled', 'Returned', 'Refunded', 'Rejected'];
const MAX_CART_LINES = 30;
const FREE_SHIPPING_ABOVE = 1500;
const SHIPPING_FEE = 99;
const DISCOUNT_ABOVE = 3000;

const text = (value, max) => String(value ?? '').trim().slice(0, max);
const newestFirst = (list) => list.sort((a, b) => String(b.createdAt ?? b.date).localeCompare(String(a.createdAt ?? a.date)));

// cancelledAt: the stage the order had reached when it was cancelled (keeps that progress visible)
const buildTrackingUpdates = (currentStatus, cancelledAt) => {
  const toStage = (status) => STAGES.indexOf(status === 'Placed' ? 'Order Placed' : status);
  const isCancelled = currentStatus === 'Cancelled';
  const currentIndex = isCancelled ? toStage(cancelledAt ?? 'Placed') : toStage(currentStatus);
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

  const updates = STAGES.map((stage, idx) => {
    if (idx < currentIndex || (isCancelled && idx === currentIndex)) return { stage, date: 'Completed', completed: true, current: false };
    if (idx === currentIndex) return { stage, date: now, completed: true, current: true };
    return { stage, date: isCancelled ? 'Cancelled' : 'Pending', completed: false, current: false };
  });
  return isCancelled ? [...updates, { stage: 'Cancelled', date: now, completed: true, current: true }] : updates;
};

// Puts stock back (cancellations, returns). A product deleted meanwhile is skipped.
const restock = async (productId, quantity) => {
  try {
    const { Attributes } = await db.update({
      TableName: TABLES.products,
      Key: { id: productId },
      UpdateExpression: 'ADD #stock :q',
      ConditionExpression: 'attribute_exists(#id)',
      ExpressionAttributeNames: { '#stock': 'stock', '#id': 'id' },
      ExpressionAttributeValues: { ':q': quantity },
      ReturnValues: 'ALL_NEW'
    });
    await db.update({
      TableName: TABLES.products,
      Key: { id: productId },
      UpdateExpression: 'SET #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': stockStatus(Attributes.stock) }
    });
  } catch (err) {
    if (err.name !== 'ConditionalCheckFailedException') throw err;
  }
};

const metricsUpdate = (storeId, salesDelta, ordersDelta) => ({
  TableName: TABLES.stores,
  Key: { id: storeId },
  UpdateExpression: 'ADD #m.#sales :s, #m.#orders :o',
  ExpressionAttributeNames: { '#m': 'metrics', '#sales': 'totalSales', '#orders': 'totalOrders' },
  ExpressionAttributeValues: { ':s': salesDelta, ':o': ordersDelta }
});

// Saves the record only if nobody changed its status since it was read, so side effects run once.
const saveIfStatusUnchanged = async (TableName, item, previousStatus) => {
  try {
    await db.put({
      TableName,
      Item: item,
      ConditionExpression: '#s = :prev',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':prev': previousStatus }
    });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') throw new HttpError(409, 'This record was just updated by someone else. Reload and try again.');
    throw err;
  }
};

// --- Orders ---

export const listOrders = async ({ user, query }) => {
  const orders = await scanAll(TABLES.orders);
  if (query.storeId) {
    if (user.role !== 'admin') throw new HttpError(403, 'Admin access required');
    return newestFirst(orders.filter(o => o.storeId === query.storeId));
  }
  return newestFirst(orders.filter(o => o.customerId === user.sub));
};

export const getOrder = async ({ user, params }) => {
  const order = await getItem(TABLES.orders, { id: params.id });
  if (!order) throw new HttpError(404, 'Order not found');
  if (user.role !== 'admin' && order.customerId !== user.sub) throw new HttpError(403, 'This order belongs to another account');
  return order;
};

const parseCart = (items) => {
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'Your cart is empty');
  if (items.length > MAX_CART_LINES) throw new HttpError(400, `At most ${MAX_CART_LINES} different products per order`);
  const quantities = new Map();
  for (const line of items) {
    const id = text(line?.productId, 40);
    const quantity = Number(line?.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) throw new HttpError(400, 'Invalid cart item');
    quantities.set(id, (quantities.get(id) ?? 0) + quantity);
  }
  return quantities;
};

const REQUIRED_CHECKOUT_FIELDS = {
  customerName: 'Full Name', customerEmail: 'Email Address', customerPhone: 'Phone Number',
  address: 'Street Address', city: 'City', state: 'State', pincode: 'PIN Code', paymentMethod: 'Payment Method'
};

// POST /orders: the whole cart. Creates one order per store, decrements stock and updates store
// metrics in a single transaction. Prices come from the database, never from the client.
export const createOrders = async ({ user, body }) => {
  const quantities = parseCart(body.items);
  const address = body.shippingAddress ?? {};
  const fields = { ...body, ...address };
  const missing = Object.entries(REQUIRED_CHECKOUT_FIELDS).filter(([key]) => !text(fields[key], 200)).map(([, label]) => label);
  if (missing.length > 0) throw new HttpError(400, `Please fill in: ${missing.join(', ')}`);

  // Each attempt re-reads stock; the transaction only succeeds if no product's stock changed meanwhile.
  for (let attempt = 0; attempt < 3; attempt++) {
    const lines = await Promise.all([...quantities].map(async ([productId, quantity]) => ({
      productId, quantity, product: await getItem(TABLES.products, { id: productId })
    })));

    const shortfalls = lines
      .filter(l => !l.product || l.product.stock < l.quantity)
      .map(l => !l.product ? `${l.productId}: no longer available` : l.product.stock > 0 ? `${l.product.name}: only ${l.product.stock} left` : `${l.product.name}: out of stock`);
    if (shortfalls.length > 0) throw new HttpError(409, shortfalls.join(' • '));

    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const shippingFee = subtotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const discount = subtotal > DISCOUNT_ABOVE ? Math.round(subtotal * 0.1) : 0;

    // Cart-level shipping and discount are split by each store's share of the subtotal
    // (the last order takes the rounding remainder), so every order total stays non-negative.
    const groups = Object.values(Object.groupBy(lines, l => l.product.storeId));
    const usedIds = new Set();
    let shippingLeft = shippingFee;
    let discountLeft = discount;
    const createdAt = new Date().toISOString();

    const orders = groups.map((group, idx) => {
      const amount = group.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
      const isLast = idx === groups.length - 1;
      const groupShipping = isLast ? shippingLeft : Math.round(shippingFee * amount / subtotal);
      const groupDiscount = isLast ? discountLeft : Math.round(discount * amount / subtotal);
      shippingLeft -= groupShipping;
      discountLeft -= groupDiscount;
      let id;
      do id = randomId('ORD', 10000, 100000); while (usedIds.has(id));
      usedIds.add(id);
      return {
        id,
        date: today(),
        createdAt,
        storeId: group[0].product.storeId,
        storeName: group[0].product.storeName,
        customerId: user.sub,
        customerName: text(body.customerName, 100),
        customerEmail: text(body.customerEmail, 120),
        customerPhone: text(body.customerPhone, 30),
        items: group.map(l => ({ productId: l.product.id, name: l.product.name, price: l.product.price, quantity: l.quantity, image: l.product.image })),
        amount,
        shippingFee: groupShipping,
        discount: groupDiscount,
        totalAmount: amount + groupShipping - groupDiscount,
        paymentMethod: text(body.paymentMethod, 60),
        status: 'Placed',
        shippingAddress: {
          address: text(address.address, 200), city: text(address.city, 60),
          state: text(address.state, 60), pincode: text(address.pincode, 10)
        },
        expectedDelivery: 'In 3-5 business days',
        trackingUpdates: buildTrackingUpdates('Placed')
      };
    });

    const transactItems = [
      ...orders.map(order => ({ Put: { TableName: TABLES.orders, Item: order, ConditionExpression: 'attribute_not_exists(#id)', ExpressionAttributeNames: { '#id': 'id' } } })),
      ...lines.map(l => ({
        Update: {
          TableName: TABLES.products,
          Key: { id: l.product.id },
          UpdateExpression: 'SET #stock = :new, #s = :status ADD #sales :q',
          ConditionExpression: '#stock = :old',
          ExpressionAttributeNames: { '#stock': 'stock', '#s': 'status', '#sales': 'sales' },
          ExpressionAttributeValues: { ':new': l.product.stock - l.quantity, ':old': l.product.stock, ':status': stockStatus(l.product.stock - l.quantity), ':q': l.quantity }
        }
      })),
      ...orders.map(order => ({ Update: metricsUpdate(order.storeId, order.totalAmount, 1) }))
    ];

    try {
      await db.transactWrite({ TransactItems: transactItems });
      return { orders };
    } catch (err) {
      if (err.name !== 'TransactionCanceledException') throw err;
    }
  }
  throw new HttpError(409, 'Stock changed while placing your order. Please try again.');
};

export const updateOrderStatus = async ({ params, body }) => {
  const status = body.status;
  if (!ORDER_STATUSES.includes(status)) throw new HttpError(400, 'Unknown order status');
  const order = await getItem(TABLES.orders, { id: params.id });
  if (!order) throw new HttpError(404, 'Order not found');

  // A cancelled order has already been restocked and refunded, so it is final.
  if (order.status === status || order.status === 'Cancelled') return order;

  const previousStatus = order.status;
  const next = { ...order, status };
  if (status === 'Cancelled') {
    next.cancelledAt = previousStatus;
    next.expectedDelivery = 'Cancelled';
  } else if (status === 'Delivered') {
    next.expectedDelivery = 'Delivered Today';
  } else if (previousStatus === 'Delivered') {
    next.expectedDelivery = 'In 3-5 business days';
  }
  next.trackingUpdates = buildTrackingUpdates(status, next.cancelledAt);
  await saveIfStatusUnchanged(TABLES.orders, next, previousStatus);

  if (status === 'Cancelled') {
    for (const item of order.items) await restock(item.productId, item.quantity);
    await db.update(metricsUpdate(order.storeId, -order.totalAmount, -1));
  }
  return next;
};

// --- Returns ---

export const listReturns = async ({ user, query }) => {
  const returns = await scanAll(TABLES.returns);
  if (query.storeId) {
    if (user.role !== 'admin') throw new HttpError(403, 'Admin access required');
    return newestFirst(returns.filter(r => r.storeId === query.storeId));
  }
  return newestFirst(returns.filter(r => r.customerId === user.sub));
};

export const createReturn = async ({ user, body }) => {
  const order = await getItem(TABLES.orders, { id: text(body.orderId, 40) });
  if (!order || order.customerId !== user.sub) throw new HttpError(404, 'Order not found');
  if (order.status !== 'Delivered') throw new HttpError(400, 'Only delivered orders can be returned');
  const item = order.items.find(it => it.productId === body.productId);
  if (!item) throw new HttpError(400, 'That product is not part of this order');
  const alreadyOpen = (await scanAll(TABLES.returns)).some(r => r.orderId === order.id && r.productId === item.productId && r.status !== 'Rejected');
  if (alreadyOpen) throw new HttpError(409, 'A return for this item has already been requested');

  const now = new Date().toISOString();
  return putWithNewId(TABLES.returns, 'RET', 2000, 100000, (id) => ({
    id,
    orderId: order.id,
    storeId: order.storeId,
    storeName: order.storeName,
    customerId: order.customerId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    productId: item.productId,
    productName: item.name,
    productImage: item.image,
    quantity: item.quantity,
    amount: item.price * item.quantity,
    reason: text(body.reason, 60) || 'Other',
    notes: text(body.notes, 500),
    status: 'Requested',
    createdAt: now.split('T')[0],
    updatedAt: now.split('T')[0]
  }));
};

export const updateReturnStatus = async ({ params, body }) => {
  const status = body.status;
  if (!RETURN_STATUSES.includes(status)) throw new HttpError(400, 'Unknown return status');
  const ret = await getItem(TABLES.returns, { id: params.id });
  if (!ret) throw new HttpError(404, 'Return not found');
  if (ret.status === status) return ret;

  // The item is back once it is Returned (or Refunded): restock it once. Refunds come out of the store's sales once.
  const shouldRestock = (status === 'Returned' || status === 'Refunded') && !ret.restocked;
  const shouldRefund = status === 'Refunded' && !ret.refunded;
  const next = {
    ...ret,
    status,
    restocked: ret.restocked || shouldRestock,
    refunded: ret.refunded || shouldRefund,
    updatedAt: today()
  };
  await saveIfStatusUnchanged(TABLES.returns, next, ret.status);

  if (shouldRestock) await restock(ret.productId, ret.quantity ?? 1);
  if (shouldRefund) await db.update(metricsUpdate(ret.storeId, -(ret.amount || 0), 0));
  return next;
};

// --- GET /stores/{id}/customers: shoppers of one store, built from its non-cancelled orders ---

export const storeCustomers = async ({ params }) => {
  const orders = (await scanAll(TABLES.orders)).filter(o => o.storeId === params.id && o.status !== 'Cancelled');
  const customers = {};
  for (const order of orders) {
    const c = customers[order.customerId] ??= {
      id: order.customerId,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      ordersCount: 0,
      totalSpent: 0,
      lastOrder: order.date
    };
    c.ordersCount += 1;
    c.totalSpent += order.totalAmount;
    if (order.date > c.lastOrder) c.lastOrder = order.date;
  }
  return Object.values(customers);
};
