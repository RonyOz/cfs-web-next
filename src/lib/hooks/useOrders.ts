'use client';

import { useOrderStore } from '@/store/orderStore';

export const useOrders = () => {
  const orders = useOrderStore((state) => state.orders);
  const cart = useOrderStore((state) => state.cart);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchMyOrders = useOrderStore((state) => state.fetchMyOrders);
  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);
  const createOrder = useOrderStore((state) => state.createOrder);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);
  const addToCart = useOrderStore((state) => state.addToCart);
  const removeFromCart = useOrderStore((state) => state.removeFromCart);
  const updateCartItemQuantity = useOrderStore((state) => state.updateCartItemQuantity);
  const clearCart = useOrderStore((state) => state.clearCart);
  const getCartTotal = useOrderStore((state) => state.getCartTotal);

  return {
    orders,
    cart,
    loading,
    error,
    fetchOrders,
    fetchMyOrders,
    fetchOrderById,
    createOrder,
    deleteOrder,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
  };
};
