import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

export const customerService = {
  getCurrentUser: () => {
    return getFromStorage(STORAGE_KEYS.ACTIVE_USER, {
      id: "CUST-1",
      name: "Rohan Kapoor",
      email: "rohan.kapoor@example.com",
      phone: "+91 98190 44321"
    });
  },

  updateCurrentUser: (userData) => {
    saveToStorage(STORAGE_KEYS.ACTIVE_USER, userData);
    return userData;
  },

  getAllCustomers: async () => {
    return getFromStorage(STORAGE_KEYS.CUSTOMERS);
  },

  getStoreCustomers: async (storeId) => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    const storeOrders = orders.filter(o => o.storeId === storeId);
    
    // Group orders by customerId
    const customerMap = {};
    storeOrders.forEach(order => {
      if (!customerMap[order.customerId]) {
        customerMap[order.customerId] = {
          id: order.customerId,
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          ordersCount: 0,
          totalSpent: 0,
          lastOrder: order.date
        };
      }
      customerMap[order.customerId].ordersCount += 1;
      customerMap[order.customerId].totalSpent += order.totalAmount;
      if (new Date(order.date) > new Date(customerMap[order.customerId].lastOrder)) {
        customerMap[order.customerId].lastOrder = order.date;
      }
    });

    const storeCustomers = Object.values(customerMap);
    if (storeCustomers.length === 0) {
      // Return sample customers with 0 orders if brand new store
      const all = getFromStorage(STORAGE_KEYS.CUSTOMERS);
      return all.slice(0, 5).map(c => ({ ...c, ordersCount: 0, totalSpent: 0 }));
    }
    return storeCustomers;
  }
};
