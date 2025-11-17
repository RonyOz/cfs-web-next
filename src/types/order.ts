import { Product } from './product';
import { User } from './user';

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DELIVERED = 'delivered',
  CANCELED = 'canceled'
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  priceAtPurchase: number;
  product: Product;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  buyer: {
    id: string;
    username: string;
  } | User;
  items: OrderItem[];
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderData {
  items: CreateOrderItem[];
}

export interface UpdateOrderData {
  status: OrderStatus;
}
