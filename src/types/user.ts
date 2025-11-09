export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  twoFactorEnabled: boolean;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface UserProfile extends User {
  createdAt?: string;
  updatedAt?: string;
}
