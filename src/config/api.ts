// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
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

  // Role Management
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
    TOGGLE_STATUS: (id: string) => `/roles/${id}/toggle-status`,
    PERMISSIONS: (id: string) => `/roles/${id}/permissions`,
  },
  
  // Category Management
 CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    ASSIGN_ITEMS: (categoryId: string) => `/categories/${categoryId}/items`,
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
  
  // Referrer Management
  REFERRERS: {
    BASE: '/referrers',
    BY_ID: (id: string) => `/referrers/${id}`,
  },
  
  // Labour Management
  LABOUR: {
    BASE: '/labour',
    BY_ID: (id: string) => `/labour/${id}`,
    TOGGLE_STATUS: (id: string) => `/labour/${id}/toggle-status`,
    ATTENDANCE: '/labour-attendance',
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

   // New endpoints for Offers, Coupons, and Referrer Points
  OFFERS: {
    BASE: '/offers',
    BY_ID: (id: string) => `/offers/${id}`,
    TOGGLE_STATUS: (id: string) => `/offers/${id}/toggle-status`,
  },

  COUPONS: {
    BASE: '/coupons',
    BY_ID: (id: string) => `/coupons/${id}`,
    TOGGLE_STATUS: (id: string) => `/coupons/${id}/toggle-status`,
    VALIDATE: '/coupons/validate',
    APPLY: '/coupons/apply',
  },
TABLES: {
    BASE: '/tables',
    BY_ID: (id: string) => `/tables/${id}`,
    CREATE_CHILD: (parentId: string) => `/tables/${parentId}/child`,
    UPDATE_STATUS: (id: string) => `/tables/${id}/status`,
    STATS: '/tables/stats',
  },
  TOKENS: {
    BASE: '/tokens',
    BY_ID: (id: string) => `/tokens/${id}`,
    UPDATE_PAYMENT: (id: string) => `/tokens/${id}/payment`,
    CANCEL: (id: string) => `/tokens/${id}/cancel`,
    // STATS: '/tokens/stats',
  },
   KOTS: {
    BASE: '/kots',
    BY_ID: (id: string) => `/kots/${id}`,
    ITEM_STATUS: (kotId: string, kotItemId: string) => `/kots/${kotId}/items/${kotItemId}/status`,
    STATS: '/kots/stats',
  },
  
  REFERRER_POINTS: {
    BASE: '/referrer-points',
    BY_ID: (id: string) => `/referrer-points/${id}`,
    SUMMARY: '/referrer-points/summary',
    BY_REFERRER: (referrerId: string) => `/referrer-points/referrer/${referrerId}`,
    REDEEM: '/referrer-points/redeem',
    BALANCE: (referrerId: string) => `/referrer-points/balance/${referrerId}`,
  },
} as const;