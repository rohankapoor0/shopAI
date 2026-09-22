import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../services/db';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getFromStorage(STORAGE_KEYS.CART, []));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          storeId: product.storeId,
          storeName: product.storeName,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: quantity
        }];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const discount = subtotal > 3000 ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      shippingFee,
      discount,
      total,
      totalCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
