import { User } from './user';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  seller: {
    id: string;
    username: string;
  } | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
}
