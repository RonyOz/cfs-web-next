import apiClient from './client';
import { Product, ProductFormData, ProductFilters, MessageResponse } from '@/types';

export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.sellerId) params.append('sellerId', filters.sellerId);
  
  const response = await apiClient.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const response = await apiClient.post('/products', data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>
): Promise<Product> => {
  const response = await apiClient.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<MessageResponse> => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};
