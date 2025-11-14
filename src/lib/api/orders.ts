import apiClient from './client';
import { Order, CreateOrderData, UpdateOrderData, MessageResponse } from '@/types';

interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

export const getOrders = async (params?: GetOrdersParams): Promise<Order[]> => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

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

export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderData
): Promise<Order> => {
  const response = await apiClient.patch(`/orders/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<MessageResponse> => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};
