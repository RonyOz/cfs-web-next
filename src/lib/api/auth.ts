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
import { TOKEN_KEY } from '@/config/constants';

export const signup = async (data: SignupRequest): Promise<any> => {
  const response = await apiClient.post('/auth/signup', data);
  // The backend may return either the created user or { message, token }
  return response.data;
};

export const getProfile = async (): Promise<{ user: any }> => {
  const response = await apiClient.get('/auth/profile');
  return response.data as { user: any };
};

export const login = async (
  data: LoginRequest
): Promise<LoginResponse | TwoFactorRequiredResponse> => {
  const response = await apiClient.post('/auth/login', data);

  // Some backends may respond with { requires2FA: true, message }
  if (response.data && response.data.requires2FA) {
    return response.data as TwoFactorRequiredResponse;
  }

  // Otherwise return the login payload (access_token + user)
  return response.data as LoginResponse;
};

export const logout = async (): Promise<MessageResponse> => {
  const response = await apiClient.post('/auth/logout');
  // Note: callers (store) should clear token/storage
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    // ignore
  }

  return response.data as MessageResponse;
};

export const enable2FA = async (): Promise<Enable2FAResponse> => {
  const response = await apiClient.post('/auth/2fa/enable');
  return response.data as Enable2FAResponse;
};

export const verify2FA = async (data: Verify2FARequest): Promise<MessageResponse> => {
  const response = await apiClient.post('/auth/2fa/verify', data);
  return response.data as MessageResponse;
};

export const disable2FA = async (): Promise<MessageResponse> => {
  const response = await apiClient.post('/auth/2fa/disable');
  return response.data as MessageResponse;
};
