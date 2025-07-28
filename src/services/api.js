import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken,
          });

          const { token } = response.data.data;
          localStorage.setItem('token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  toggleUserStatus: (id) => api.put(`/users/${id}/toggle-status`),
  updateUserPermissions: (id, permissions) => api.put(`/users/${id}/permissions`, { permissions }),
};

// Items API
export const itemsAPI = {
  getItems: (params) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (formData) => api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateItem: (id, formData) => api.put(`/items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteItem: (id) => api.delete(`/items/${id}`),
  updateStock: (id, stockData) => api.put(`/items/${id}/stock`, stockData),
  getLowStockItems: () => api.get('/items/low-stock'),
  getItemsByCategory: (categoryId) => api.get(`/items/category/${categoryId}`),
  bulkUpdateStock: (updates) => api.post('/items/bulk-stock-update', { updates }),
};

// Sales API
export const salesAPI = {
  getSales: (params) => api.get('/sales', { params }),
  getSale: (id) => api.get(`/sales/${id}`),
  createSale: (saleData) => api.post('/sales', saleData),
  updateSale: (id, saleData) => api.put(`/sales/${id}`, saleData),
  deleteSale: (id) => api.delete(`/sales/${id}`),
  getSalesStats: () => api.get('/sales/stats'),
  generateBill: (id) => api.post(`/sales/${id}/generate-bill`),
  processPayment: (id, paymentData) => api.post(`/sales/${id}/payment`, paymentData),
  refundSale: (id, refundData) => api.post(`/sales/${id}/refund`, refundData),
  getSalesByDateRange: (params) => api.get('/sales/date-range', { params }),
};

// Purchase API
export const purchaseAPI = {
  getPurchases: (params) => api.get('/purchase', { params }),
  getPurchase: (id) => api.get(`/purchase/${id}`),
  createPurchase: (purchaseData) => api.post('/purchase', purchaseData),
  updatePurchase: (id, purchaseData) => api.put(`/purchase/${id}`, purchaseData),
  deletePurchase: (id) => api.delete(`/purchase/${id}`),
  updatePurchaseStatus: (id, statusData) => api.put(`/purchase/${id}/status`, statusData),
  getPurchaseStats: () => api.get('/purchase/stats'),
};

// Party API
export const partyAPI = {
  getParties: (params) => api.get('/party', { params }),
  getParty: (id) => api.get(`/party/${id}`),
  createParty: (partyData) => api.post('/party', partyData),
  updateParty: (id, partyData) => api.put(`/party/${id}`, partyData),
  deleteParty: (id) => api.delete(`/party/${id}`),
  getCustomers: () => api.get('/party/customers'),
  getVendors: () => api.get('/party/vendors'),
  getReferrers: () => api.get('/party/referrers'),
};

// Recipe API
export const recipeAPI = {
  getRecipes: (params) => api.get('/recipe', { params }),
  getRecipe: (id) => api.get(`/recipe/${id}`),
  createRecipe: (formData) => api.post('/recipe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateRecipe: (id, formData) => api.put(`/recipe/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteRecipe: (id) => api.delete(`/recipe/${id}`),
  calculateRecipeCost: (ingredients) => api.post('/recipe/calculate-cost', { ingredients }),
};

// Expense API
export const expenseAPI = {
  getExpenses: (params) => api.get('/expense', { params }),
  getExpense: (id) => api.get(`/expense/${id}`),
  createExpense: (formData) => api.post('/expense', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateExpense: (id, formData) => api.put(`/expense/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteExpense: (id) => api.delete(`/expense/${id}`),
  approveExpense: (id, approvalData) => api.put(`/expense/${id}/approve`, approvalData),
  getExpenseStats: () => api.get('/expense/stats'),
};

// Offers API
export const offersAPI = {
  getOffers: (params) => api.get('/offers', { params }),
  getOffer: (id) => api.get(`/offers/${id}`),
  createOffer: (formData) => api.post('/offers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateOffer: (id, formData) => api.put(`/offers/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteOffer: (id) => api.delete(`/offers/${id}`),
  validateOffer: (offerData) => api.post('/offers/validate', offerData),
  getActiveOffers: () => api.get('/offers/active'),
};

// KOT API
export const kotAPI = {
  getKOTs: (params) => api.get('/kot', { params }),
  getKOT: (id) => api.get(`/kot/${id}`),
  updateKOTStatus: (id, statusData) => api.put(`/kot/${id}`, statusData),
  updateKOTItemStatus: (id, itemId, statusData) => api.put(`/kot/${id}/items/${itemId}`, statusData),
  getKOTsByStatus: (status) => api.get(`/kot/status/${status}`),
  getKOTStats: () => api.get('/kot/stats'),
};

// Inventory API
export const inventoryAPI = {
  getInventoryOverview: () => api.get('/inventory/overview'),
  getStockMovements: (params) => api.get('/inventory/movements', { params }),
  adjustStock: (adjustmentData) => api.post('/inventory/adjust', adjustmentData),
  transferStock: (transferData) => api.post('/inventory/transfer', transferData),
  getStockAlerts: () => api.get('/inventory/alerts'),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getSalesAnalytics: (params) => api.get('/dashboard/sales-analytics', { params }),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getPurchaseReport: (params) => api.get('/reports/purchase', { params }),
  getInventoryReport: (params) => api.get('/reports/inventory', { params }),
  getGSTReport: (params) => api.get('/reports/gst', { params }),
  getProfitLossReport: (params) => api.get('/reports/profit-loss', { params }),
  getTaxReport: (params) => api.get('/reports/tax', { params }),
  getCustomerReport: (params) => api.get('/reports/customers', { params }),
  getVendorReport: (params) => api.get('/reports/vendors', { params }),
  getItemWiseReport: (params) => api.get('/reports/items', { params }),
  getCashBookReport: (params) => api.get('/reports/cash-book', { params }),
};

export default api;