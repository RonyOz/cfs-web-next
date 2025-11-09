/**
 * Authentication API Functions
 * All auth-related API calls with JWT authentication
 * 
 * TODO: Implement all function bodies
 * TODO: Add proper error handling
 * TODO: Add request/response logging
 */

import apiClient from './client';
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  TwoFactorRequiredResponse,
  Enable2FAResponse,
  Verify2FARequest,
  MessageResponse,
} from '@/types';

/**
 * Sign up a new user
 * POST /auth/signup
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  // TODO: Implement signup logic
  // const response = await apiClient.post('/auth/signup', data);
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Login user and get JWT token
 * POST /auth/login
 * 
 * Note: If user has 2FA enabled and twoFactorCode is not provided,
 * the API will return { requires2FA: true, message: string }
 */
export const login = async (
  data: LoginRequest
): Promise<LoginResponse | TwoFactorRequiredResponse> => {
  // TODO: Implement login logic
  // const response = await apiClient.post('/auth/login', data);
  // 
  // if ('requires2FA' in response.data) {
  //   return response.data as TwoFactorRequiredResponse;
  // }
  // 
  // Store token in localStorage
  // localStorage.setItem(TOKEN_KEY, response.data.access_token);
  // 
  // return response.data as LoginResponse;
  throw new Error('Not implemented');
};

/**
 * Logout user
 * POST /auth/logout
 * 
 * Note: Client should also clear token from storage
 */
export const logout = async (): Promise<MessageResponse> => {
  // TODO: Implement logout logic
  // const response = await apiClient.post('/auth/logout');
  // Clear token from localStorage
  // localStorage.removeItem(TOKEN_KEY);
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Enable 2FA for authenticated user
 * POST /auth/2fa/enable
 * 
 * Returns QR code and secret for authenticator app
 */
export const enable2FA = async (): Promise<Enable2FAResponse> => {
  // TODO: Implement 2FA enable logic
  // const response = await apiClient.post('/auth/2fa/enable');
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Verify and activate 2FA
 * POST /auth/2fa/verify
 * 
 * User must provide the TOTP code from their authenticator app
 */
export const verify2FA = async (data: Verify2FARequest): Promise<MessageResponse> => {
  // TODO: Implement 2FA verification logic
  // const response = await apiClient.post('/auth/2fa/verify', data);
  // return response.data;
  throw new Error('Not implemented');
};

/**
 * Disable 2FA for authenticated user
 * POST /auth/2fa/disable
 */
export const disable2FA = async (): Promise<MessageResponse> => {
  // TODO: Implement 2FA disable logic
  // const response = await apiClient.post('/auth/2fa/disable');
  // return response.data;
  throw new Error('Not implemented');
};
