import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Using 'token' to match your AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    // Return a consistent error format
    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    });
  }
);

// Auth service that matches your AuthContext usage
export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    mobile?: string;
    role?: string;
    store?: string;
    billType?: string;
  }) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.put('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  },
};

// User service
export const userService = {
  async getUsers(filters: any = {}) {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  async getUser(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(formData: any) {
    const response = await api.post('/users', formData);
    return response.data;
  },

  async updateUser(id: string, formData: any) {
    const response = await api.put(`/users/${id}`, formData);
    return response.data;
  },

  async deleteUser(id: string) {
    await api.delete(`/users/${id}`);
  },

  async toggleUserStatus(id: string) {
    const response = await api.put(`/users/${id}/toggle-status`);
    return response.data;
  },
};

export default api;