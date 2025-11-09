import { User } from './user';

// Auth Types
export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface TwoFactorRequiredResponse {
  requires2FA: true;
  message: string;
}

export interface Enable2FAResponse {
  secret: string;
  qrCode: string;
}

export interface Verify2FARequest {
  token: string;
}

export interface MessageResponse {
  message: string;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
