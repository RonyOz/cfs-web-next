/**
 * Order Store
 * Zustand store for managing orders and cart state
 * 
 * Academic Requirement: State Management (10%)
 * - Centralized orders state
 * - Shopping cart state
 * - Loading and error states
 * 
 * TODO: Implement all store actions
 * TODO: Add cart persistence (localStorage)
 * TODO: Add order validation logic
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CreateOrderData, CreateOrderItem } from '@/types';

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
        // TODO: Implement add to cart
        // Check if item already exists in cart
        // If exists, update quantity
        // If not, add new item
        // Validate stock availability
        const cart = get().cart;
        const existingItem = cart.find((i) => i.productId === item.productId);

        if (existingItem) {
          // Update quantity
          set({
            cart: cart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({ cart: [...cart, item] });
        }
      },

      removeFromCart: (productId) => {
        // TODO: Implement remove from cart
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        }));
      },

      updateCartItemQuantity: (productId, quantity) => {
        // TODO: Implement update cart item quantity
        // Validate quantity > 0 and <= stock
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        // TODO: Implement clear cart
        set({ cart: [] });
      },

      getCartTotal: () => {
        // TODO: Calculate cart total
        const cart = get().cart;
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Order State Setters
      setOrders: (orders) => set({ orders }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // API Actions (TODO: Implement)
      fetchOrders: async () => {
        // TODO: Implement fetch orders
        // set({ loading: true, error: null });
        // try {
        //   const orders = await getOrders();
        //   set({ orders, loading: false });
        // } catch (error) {
        //   set({ error: 'Error al cargar órdenes', loading: false });
        // }
        throw new Error('Not implemented');
      },

      fetchOrderById: async (id) => {
        // TODO: Implement fetch order by ID
        // set({ loading: true, error: null });
        // try {
        //   const order = await getOrderById(id);
        //   set({ loading: false });
        //   return order;
        // } catch (error) {
        //   set({ error: 'Error al cargar orden', loading: false });
        //   throw error;
        // }
        throw new Error('Not implemented');
      },

      createOrder: async (data) => {
        // TODO: Implement create order
        // Business Rules:
        // - Validate stock availability
        // - Ensure not ordering own products
        // - Calculate total
        // set({ loading: true, error: null });
        // try {
        //   const order = await createOrder(data);
        //   set((state) => ({
        //     orders: [order, ...state.orders],
        //     cart: [], // Clear cart after successful order
        //     loading: false,
        //   }));
        // } catch (error) {
        //   set({ error: 'Error al crear orden', loading: false });
        //   throw error;
        // }
        throw new Error('Not implemented');
      },

      deleteOrder: async (id) => {
        // TODO: Implement delete/cancel order
        // Can only delete orders with status 'pending'
        // set({ loading: true, error: null });
        // try {
        //   await deleteOrder(id);
        //   set((state) => ({
        //     orders: state.orders.filter((o) => o.id !== id),
        //     loading: false,
        //   }));
        // } catch (error) {
        //   set({ error: 'Error al cancelar orden', loading: false });
        //   throw error;
        // }
        throw new Error('Not implemented');
      },
    }),
    {
      name: 'order-storage', // localStorage key for cart persistence
      // TODO: Configure which parts of state to persist
      // partialize: (state) => ({ cart: state.cart }),
    }
  )
);
