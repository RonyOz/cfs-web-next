import apiClient from './client';
import { Order, CreateOrderData, UpdateOrderData, MessageResponse } from '@/types';

interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

// Obtener todas las órdenes (para admin)
export const getOrders = async (params?: GetOrdersParams): Promise<Order[]> => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

// Obtener mis órdenes (buyer) - endpoint específico para usuario autenticado
export const getMyOrders = async (params?: GetOrdersParams): Promise<Order[]> => {
  const response = await apiClient.get('/orders/my-orders', { params });
  return response.data;
};

// Obtener mis ventas (seller) - órdenes donde soy vendedor
export const getMySales = async (params?: GetOrdersParams): Promise<Order[]> => {
  const response = await apiClient.get('/orders/my-sales', { params });
  return response.data;
};

// Obtener orden por ID
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

// Crear nueva orden
export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  if (!data.items || data.items.length === 0) {
    throw new Error('La orden debe contener al menos un producto');
  }

  for (const item of data.items) {
    if (item.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
  }

  const response = await apiClient.post('/orders', data);
  return response.data;
};

// Actualizar estado de orden (seller o admin)
export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderData
): Promise<Order> => {
  const response = await apiClient.put(`/orders/${id}/status`, data);
  return response.data;
};

// Cancelar orden (buyer)
export const deleteOrder = async (id: string): Promise<MessageResponse> => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};


