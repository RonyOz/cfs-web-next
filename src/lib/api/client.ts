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
    // Get token from localStorage (client-side only)
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
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Handle specific error cases
    switch (status) {
      case 401:
        // Unauthorized - Clear auth state and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?error=session_expired';
          }
        }
        console.error('Unauthorized - session expired');
        break;

      case 403:
        // Forbidden - User doesn't have permission
        console.error('Forbidden - insufficient permissions');
        if (typeof window !== 'undefined') {
          // You could show a toast notification here
          alert('No tienes permisos para realizar esta acción');
        }
        break;

      case 404:
        // Not found
        console.error('Resource not found:', message);
        break;

      case 422:
        // Validation error
        console.error('Validation error:', error.response?.data);
        break;

      case 500:
      case 502:
      case 503:
        // Server error
        console.error('Server error:', message);
        if (typeof window !== 'undefined') {
          // You could show a toast notification here
          alert('Error del servidor. Por favor, intenta más tarde.');
        }
        break;

      default:
        console.error('API Error:', message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;