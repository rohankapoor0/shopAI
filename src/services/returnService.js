import { getFromStorage, saveToStorage, generateUniqueId, STORAGE_KEYS } from './db';
import { productService } from './productService';
import { adjustStoreMetrics } from './orderService';

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
    const newReturnId = generateUniqueId('RET', returns, 2000, 10000);

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
      quantity: returnPayload.quantity ?? 1,
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
    if (index === -1) return null;
    const ret = returns[index];

    // The item is back once it is Returned (or Refunded); restock it once.
    if ((newStatus === "Returned" || newStatus === "Refunded") && !ret.restocked) {
      const product = await productService.getProductById(ret.productId);
      if (product) {
        await productService.updateProduct(product.id, { stock: product.stock + (ret.quantity ?? 1) });
      }
      ret.restocked = true;
    }
    // Refunds come out of the store's sales once.
    if (newStatus === "Refunded" && !ret.refunded) {
      adjustStoreMetrics(ret.storeId, -(ret.amount || 0));
      ret.refunded = true;
    }

    ret.status = newStatus;
    ret.updatedAt = new Date().toISOString().split('T')[0];
    saveToStorage(STORAGE_KEYS.RETURNS, returns);
    return ret;
  }
};
