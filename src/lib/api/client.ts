/**
 * Axios Client Configuration
 * Centralized HTTP client with interceptors for authentication
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL, TOKEN_KEY } from '@/config/constants';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Get token from localStorage or cookie
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // TODO: Handle specific error cases
    // - 401: Redirect to login
    // - 403: Show forbidden message
    // - 500: Show server error message
    
    if (error.response?.status === 401) {
      // TODO: Clear auth state and redirect to login
      console.error('Unauthorized - redirecting to login');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
