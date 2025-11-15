// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cfs-api.onrender.com/api/v1';

// Authentication
export const TOKEN_KEY = 'cfs_auth_token';
export const USER_KEY = 'cfs_user';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth', // Alias for backwards compatibility
  SIGNUP: '/auth', // Alias for backwards compatibility
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  PRODUCT_NEW: '/products/new',
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PROFILE: '/profile',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No estás autorizado para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION: 'Por favor, verifica los datos ingresados.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: '¡Bienvenido!',
  SIGNUP: '¡Cuenta creada exitosamente!',
  LOGOUT: 'Sesión cerrada correctamente.',
  PRODUCT_CREATED: 'Producto creado exitosamente.',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente.',
  PRODUCT_DELETED: 'Producto eliminado exitosamente.',
  ORDER_CREATED: 'Orden creada exitosamente.',
  ORDER_CANCELLED: 'Orden cancelada exitosamente.',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente.',
  TWO_FACTOR_ENABLED: 'Autenticación de dos factores habilitada.',
  TWO_FACTOR_DISABLED: 'Autenticación de dos factores deshabilitada.',
} as const;
