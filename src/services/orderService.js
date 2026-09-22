import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

const STAGES = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const buildTrackingUpdates = (currentStatus) => {
  const currentIndex = STAGES.indexOf(currentStatus);
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return STAGES.map((stage, idx) => {
    if (idx < currentIndex) {
      return { stage, date: "Completed", completed: true, current: false };
    } else if (idx === currentIndex) {
      return { stage, date: now, completed: true, current: true };
    } else {
      return { stage, date: "Pending", completed: false, current: false };
    }
  });
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
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

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
      shippingFee: 0,
      totalAmount: orderPayload.totalAmount || orderPayload.amount,
      paymentMethod: orderPayload.paymentMethod || "UPI",
      status: "Placed",
      shippingAddress: orderPayload.shippingAddress,
      expectedDelivery: "In 3-5 business days",
      trackingUpdates: buildTrackingUpdates("Placed")
    };

    const updated = [newOrder, ...orders];
    saveToStorage(STORAGE_KEYS.ORDERS, updated);

    // Update store metrics
    const stores = getFromStorage(STORAGE_KEYS.STORES);
    const storeIdx = stores.findIndex(s => s.id === newOrder.storeId);
    if (storeIdx !== -1) {
      stores[storeIdx].metrics.totalSales += newOrder.totalAmount;
      stores[storeIdx].metrics.totalOrders += 1;
      saveToStorage(STORAGE_KEYS.STORES, stores);
    }

    return newOrder;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      orders[index].trackingUpdates = buildTrackingUpdates(newStatus);
      if (newStatus === "Delivered") {
        orders[index].expectedDelivery = "Delivered Today";
      }
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return orders[index];
    }
    return null;
  }
};
