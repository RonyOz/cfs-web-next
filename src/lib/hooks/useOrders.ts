'use client';

import { useOrderStore } from '@/store/orderStore';

export const useOrders = () => {
  const orders = useOrderStore((state) => state.orders);
  const sellerOrders = useOrderStore((state) => state.sellerOrders);
  const paginationMeta = useOrderStore((state) => state.paginationMeta);
  const cart = useOrderStore((state) => state.cart);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchMyOrders = useOrderStore((state) => state.fetchMyOrders);
  const fetchMySales = useOrderStore((state) => state.fetchMySales);
  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);
  const createOrder = useOrderStore((state) => state.createOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);
  const addToCart = useOrderStore((state) => state.addToCart);
  const removeFromCart = useOrderStore((state) => state.removeFromCart);
  const updateCartItemQuantity = useOrderStore((state) => state.updateCartItemQuantity);
  const clearCart = useOrderStore((state) => state.clearCart);
  const getCartTotal = useOrderStore((state) => state.getCartTotal);

  return {
    orders,
    sellerOrders,
    paginationMeta,
    cart,
    loading,
    error,
    fetchOrders,
    fetchMyOrders,
    fetchMySales,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
  };
};
