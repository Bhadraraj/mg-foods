// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    UPDATE_PROFILE: '/auth/profile',
  },
  
  // User Management
 
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/users/${id}/toggle-status`,
    PERMISSIONS: (id: string) => `/users/${id}/permissions`,
  },
  // Category Management
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    ITEMS: (id: string) => `/categories/${id}/items`,
  },
  
  // Vendor Management
  VENDORS: {
    BASE: '/vendors',
    BY_ID: (id: string) => `/vendors/${id}`,
  },
  
  // Items Management
  ITEMS: {
    BASE: '/items',
    BY_ID: (id: string) => `/items/${id}`,
  },
  
  // Customer Management
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id: string) => `/customers/${id}`,
  },
  
  // Labour Management
  LABOUR: {
    BASE: '/labour',
    BY_ID: (id: string) => `/labour/${id}`,
    TOGGLE_STATUS: (id: string) => `/labour/${id}/toggle-status`,
    ATTENDANCE: '/labour/attendance',
  },
  
  // Rack Management
  RACKS: {
    BASE: '/racks',
    BY_ID: (id: string) => `/racks/${id}`,
    ITEMS: (id: string) => `/racks/${id}/items`,
    REMOVE_ITEM: (rackId: string, itemId: string) => `/racks/${rackId}/items/${itemId}`,
  },
  
  // Purchase Management
  PURCHASES: {
    BASE: '/purchases',
    BY_ID: (id: string) => `/purchases/${id}`,
    STATUS: (id: string) => `/purchases/${id}/status`,
    STOCK_ENTRY: (id: string) => `/purchases/${id}/stock-entry`,
  },

  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
    TOGGLE_STATUS: (id: string) => `/roles/${id}/toggle-status`,
    PERMISSIONS: (id: string) => `/roles/${id}/permissions`,
  },

} as const;