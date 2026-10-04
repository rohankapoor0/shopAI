import { getFromStorage, saveToStorage, generateUniqueId, STORAGE_KEYS } from './db';
import { productService } from './productService';

const STAGES = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

// cancelledAt: the stage the order had reached when it was cancelled (keeps that progress visible)
const buildTrackingUpdates = (currentStatus, cancelledAt) => {
  const toStage = (status) => STAGES.indexOf(status === "Placed" ? "Order Placed" : status);
  const isCancelled = currentStatus === "Cancelled";
  const currentIndex = isCancelled ? toStage(cancelledAt ?? "Placed") : toStage(currentStatus);
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const updates = STAGES.map((stage, idx) => {
    if (idx < currentIndex || (isCancelled && idx === currentIndex)) {
      return { stage, date: "Completed", completed: true, current: false };
    } else if (idx === currentIndex) {
      return { stage, date: now, completed: true, current: true };
    } else {
      return { stage, date: isCancelled ? "Cancelled" : "Pending", completed: false, current: false };
    }
  });
  return isCancelled ? [...updates, { stage: "Cancelled", date: now, completed: true, current: true }] : updates;
};

// Adds delta to a product's stock (negative to deduct), never going below zero.
const adjustStock = async (productId, delta) => {
  const product = await productService.getProductById(productId);
  if (product) {
    await productService.updateProduct(product.id, { stock: Math.max(0, product.stock + delta) });
  }
};

export const adjustStoreMetrics = (storeId, salesDelta, ordersDelta = 0) => {
  const stores = getFromStorage(STORAGE_KEYS.STORES);
  const store = stores.find(s => s.id === storeId);
  if (!store) return;
  store.metrics = store.metrics ?? { totalSales: 0, totalOrders: 0, totalCustomers: 0 };
  store.metrics.totalSales = Math.max(0, store.metrics.totalSales + salesDelta);
  store.metrics.totalOrders = Math.max(0, store.metrics.totalOrders + ordersDelta);
  saveToStorage(STORAGE_KEYS.STORES, stores);
};

export const orderService = {
  getOrders: async () => {
    return getFromStorage(STORAGE_KEYS.ORDERS);
  },

  getOrderById: async (orderId) => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    return orders.find(o => o.id === orderId);
  },

  getCustomerOrders: async (customerId = "CUST-1") => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    return orders.filter(o => o.customerId === customerId);
  },

  getStoreOrders: async (storeId) => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    return orders.filter(o => o.storeId === storeId);
  },

  createOrder: async (orderPayload) => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    const newOrderId = generateUniqueId('ORD', orders, 10000, 100000);

    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString().split('T')[0],
      storeId: orderPayload.storeId || "STORE-1001",
      storeName: orderPayload.storeName || "Urban Threads",
      customerId: orderPayload.customerId || "CUST-1",
      customerName: orderPayload.customerName || "Rohan Kapoor",
      customerEmail: orderPayload.customerEmail || "rohan.kapoor@example.com",
      customerPhone: orderPayload.customerPhone || "+91 98190 44321",
      items: orderPayload.items || [],
      amount: orderPayload.amount,
      shippingFee: orderPayload.shippingFee ?? 0,
      discount: orderPayload.discount ?? 0,
      totalAmount: orderPayload.totalAmount ?? orderPayload.amount,
      paymentMethod: orderPayload.paymentMethod || "UPI",
      status: "Placed",
      shippingAddress: orderPayload.shippingAddress,
      expectedDelivery: "In 3-5 business days",
      trackingUpdates: buildTrackingUpdates("Placed")
    };

    const updated = [newOrder, ...orders];
    saveToStorage(STORAGE_KEYS.ORDERS, updated);

    for (const item of newOrder.items) {
      await adjustStock(item.productId, -item.quantity);
    }
    adjustStoreMetrics(newOrder.storeId, newOrder.totalAmount, 1);

    return newOrder;
  },

  // Returns the cart lines that exceed current stock: [{ productId, name, requested, available }]
  getStockShortfalls: async (items) => {
    const shortfalls = [];
    for (const item of items) {
      const product = await productService.getProductById(item.productId);
      const available = product ? product.stock : 0;
      if (item.quantity > available) {
        shortfalls.push({ productId: item.productId, name: item.name, requested: item.quantity, available });
      }
    }
    return shortfalls;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    const order = orders[index];

    // A cancelled order has already been restocked and refunded, so it is final.
    if (order.status === newStatus || order.status === "Cancelled") return order;

    if (newStatus === "Cancelled") {
      order.cancelledAt = order.status;
      for (const item of order.items) {
        await adjustStock(item.productId, item.quantity);
      }
      adjustStoreMetrics(order.storeId, -order.totalAmount, -1);
      order.expectedDelivery = "Cancelled";
    } else if (newStatus === "Delivered") {
      order.expectedDelivery = "Delivered Today";
    } else if (order.status === "Delivered") {
      order.expectedDelivery = "In 3-5 business days";
    }
    order.status = newStatus;
    order.trackingUpdates = buildTrackingUpdates(newStatus, order.cancelledAt);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return order;
  }
};
