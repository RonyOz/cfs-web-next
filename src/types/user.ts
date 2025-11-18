export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  twoFactorEnabled?: boolean;
  productsCount?: number;
  totalOrders?: number;
  ordersThisMonth?: number;
  products?: Array<{ id: string; name?: string; price?: number; stock?: number; imageUrl?: string }>;
  phoneNumber?: string | null;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  phoneNumber?: string;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  phoneNumber?: string | null;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface UserProfile extends User {
  createdAt?: string;
  updatedAt?: string;
}
