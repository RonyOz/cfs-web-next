'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CreateOrderData, CreateOrderItem } from '@/types';
import {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder as apiCreateOrder,
  deleteOrder as apiDeleteOrder
} from '@/lib/api/orders';

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  stock: number;
}

interface OrderState {
  orders: Order[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;

  // Cart Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Order Actions
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  fetchOrders: () => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order>;
  createOrder: (data: CreateOrderData) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      cart: [],
      loading: false,
      error: null,

      // Cart Actions
      addToCart: (item) => {
        const cart = get().cart;
        const existingItem = cart.find((i) => i.productId === item.productId);

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          // Validate stock availability
          if (newQuantity > item.stock) {
            set({ error: 'No hay suficiente stock disponible' });
            return;
          }
          set({
            cart: cart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
            error: null,
          });
        } else {
          // Validate initial quantity
          if (item.quantity > item.stock) {
            set({ error: 'No hay suficiente stock disponible' });
            return;
          }
          set({ cart: [...cart, item], error: null });
        }
      },

      removeFromCart: (productId) => {
        // TODO: Implement remove from cart
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        }));
      },

      updateCartItemQuantity: (productId, quantity) => {
        const cart = get().cart;
        const item = cart.find((i) => i.productId === productId);

        if (!item) {
          set({ error: 'Producto no encontrado en el carrito' });
          return;
        }

        // Validate quantity
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          get().removeFromCart(productId);
          return;
        }

        if (quantity > item.stock) {
          set({ error: 'No hay suficiente stock disponible' });
          return;
        }

        set({
          cart: cart.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
          error: null,
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        const cart = get().cart;
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Order State Setters
      setOrders: (orders) => set({ orders }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // API Actions
      fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
          const orders = await getOrders();
          set({ orders, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar órdenes', loading: false });
          throw error;
        }
      },

      fetchMyOrders: async () => {
        set({ loading: true, error: null });
        try {
          const orders = await getMyOrders();
          set({ orders, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar mis órdenes', loading: false });
          throw error;
        }
      },

      fetchOrderById: async (id) => {
        set({ loading: true, error: null });
        try {
          const order = await getOrderById(id);
          set({ loading: false });
          return order;
        } catch (error) {
          set({ error: 'Error al cargar orden', loading: false });
          throw error;
        }
      },

      createOrder: async (data) => {
        set({ loading: true, error: null });
        try {
          const order = await apiCreateOrder(data);
          set((state) => ({
            orders: [order, ...state.orders],
            cart: [], // Clear cart after successful order
            loading: false,
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al crear orden';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      deleteOrder: async (id) => {
        set({ loading: true, error: null });
        try {
          await apiDeleteOrder(id);
          set((state) => ({
            orders: state.orders.filter((o) => o.id !== id),
            loading: false,
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al cancelar orden';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart
    }
  )
);
