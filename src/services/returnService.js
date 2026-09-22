import { getFromStorage, saveToStorage, STORAGE_KEYS } from './db';

export const returnService = {
  getReturns: async () => {
    return getFromStorage(STORAGE_KEYS.RETURNS);
  },

  getCustomerReturns: async (customerId = "CUST-1") => {
    const returns = getFromStorage(STORAGE_KEYS.RETURNS);
    return returns.filter(r => r.customerId === customerId);
  },

  getStoreReturns: async (storeId) => {
    const returns = getFromStorage(STORAGE_KEYS.RETURNS);
    return returns.filter(r => r.storeId === storeId);
  },

  createReturn: async (returnPayload) => {
    const returns = getFromStorage(STORAGE_KEYS.RETURNS);
    const newReturnId = `RET-${Math.floor(2000 + Math.random() * 8000)}`;

    const newReturn = {
      id: newReturnId,
      orderId: returnPayload.orderId,
      storeId: returnPayload.storeId,
      storeName: returnPayload.storeName,
      customerId: returnPayload.customerId || "CUST-1",
      customerName: returnPayload.customerName || "Rohan Kapoor",
      customerEmail: returnPayload.customerEmail || "rohan.kapoor@example.com",
      productId: returnPayload.productId,
      productName: returnPayload.productName,
      productImage: returnPayload.productImage,
      amount: returnPayload.amount,
      reason: returnPayload.reason,
      notes: returnPayload.notes || "",
      status: "Requested",
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newReturn, ...returns];
    saveToStorage(STORAGE_KEYS.RETURNS, updated);
    return newReturn;
  },

  updateReturnStatus: async (returnId, newStatus) => {
    const returns = getFromStorage(STORAGE_KEYS.RETURNS);
    const index = returns.findIndex(r => r.id === returnId);
    if (index !== -1) {
      returns[index].status = newStatus;
      returns[index].updatedAt = new Date().toISOString().split('T')[0];
      saveToStorage(STORAGE_KEYS.RETURNS, returns);
      return returns[index];
    }
    return null;
  }
};
