// services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API utility
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// User API Services
export const userApi = {
  // Get all users
  getAll: (params?: { page?: number; limit?: number; role?: string; status?: string; store?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiCall(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get single user
  getById: (id: string) => apiCall(`/users/${id}`),

  // Create user
  create: (userData: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
    store?: string;
    billType?: string;
    permissions?: string[];
  }) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Update user
  update: (id: string, userData: {
    name?: string;
    mobile?: string;
    store?: string;
    role?: string;
    billType?: string;
  }) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  // Delete user
  delete: (id: string) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),

  // Toggle user status
  toggleStatus: (id: string) => apiCall(`/users/${id}/toggle-status`, {
    method: 'PUT',
  }),

  // Update user permissions
  updatePermissions: (id: string, permissions: string[]) => apiCall(`/users/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  }),
};

// Role API Services
export const roleApi = {
  // Get all roles
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiCall(`/roles${queryString ? `?${queryString}` : ''}`);
  },

  // Get single role
  getById: (id: string) => apiCall(`/roles/${id}`),

  // Create role
  create: (roleData: {
    roleName: string;
    permissions: string[];
  }) => apiCall('/roles', {
    method: 'POST',
    body: JSON.stringify(roleData),
  }),

  // Update role
  update: (id: string, roleData: {
    roleName?: string;
    permissions?: string[];
    isActive?: boolean;
  }) => apiCall(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roleData),
  }),

  // Delete role
  delete: (id: string) => apiCall(`/roles/${id}`, {
    method: 'DELETE',
  }),

  // Toggle role status
  toggleStatus: (id: string) => apiCall(`/roles/${id}/toggle-status`, {
    method: 'PUT',
  }),

  // Update role permissions
  updatePermissions: (id: string, permissions: string[]) => apiCall(`/roles/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  }),
};

// Labour API Services
export const labourApi = {
  // Get all labour records
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiCall(`/labour${queryString ? `?${queryString}` : ''}`);
  },

  // Get single labour record
  getById: (id: string) => apiCall(`/labour/${id}`),

  // Create labour record
  create: (labourData: {
    name: string;
    mobile: string;
    address: string;
    monthlySalary: number;
  }) => apiCall('/labour', {
    method: 'POST',
    body: JSON.stringify(labourData),
  }),

  // Update labour record
  update: (id: string, labourData: {
    name?: string;
    mobile?: string;
    address?: string;
    monthlySalary?: number;
  }) => apiCall(`/labour/${id}`, {
    method: 'PUT',
    body: JSON.stringify(labourData),
  }),

  // Delete labour record
  delete: (id: string) => apiCall(`/labour/${id}`, {
    method: 'DELETE',
  }),
};