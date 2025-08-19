import api from './api';
import { User, NewUserFormData } from '../components/types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: boolean;
  store?: string;
  search?: string;
}

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  store: string;
  billType: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Transform backend user to frontend user format
const transformBackendUser = (backendUser: BackendUser, index: number): User => ({
  no: (index + 1).toString().padStart(2, '0'),
  name: backendUser.name,
  mobile: backendUser.mobile,
  role: backendUser.role,
  store: backendUser.store,
  status: backendUser.isActive,
  createdBy: backendUser.email,
  createdAt: new Date(backendUser.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
  _id: backendUser._id,
});

// Transform frontend user data to backend format
const transformToBackendUser = (formData: NewUserFormData) => ({
  name: formData.name,
  email: formData.email,
  mobile: formData.mobile,
  role: formData.role,
  password: formData.password,
  billType: formData.billType,
});

export const userService = {
  // Get all users with optional filters
  async getUsers(filters: UserFilters = {}): Promise<{ users: User[]; pagination?: any }> {
    try {
      const response = await api.get<ApiResponse<{ users: BackendUser[] }>>('/users', {
        params: filters,
      });
      
      const transformedUsers = response.data.data.users.map((user, index) => 
        transformBackendUser(user, index)
      );
      
      return {
        users: transformedUsers,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get single user by ID
  async getUser(id: string): Promise<User> {
    try {
      const response = await api.get<ApiResponse<{ user: BackendUser }>>(`/users/${id}`);
      return transformBackendUser(response.data.data.user, 0);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(formData: NewUserFormData): Promise<User> {
    try {
      const backendData = transformToBackendUser(formData);
      const response = await api.post<ApiResponse<{ user: BackendUser }>>('/users', backendData);
      return transformBackendUser(response.data.data.user, 0);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, formData: Partial<NewUserFormData>): Promise<User> {
    try {
      const backendData = transformToBackendUser(formData as NewUserFormData);
      const response = await api.put<ApiResponse<{ user: BackendUser }>>(`/users/${id}`, backendData);
      return transformBackendUser(response.data.data.user, 0);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Toggle user status
  async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await api.put<ApiResponse<{ user: BackendUser }>>(`/users/${id}/toggle-status`);
      return transformBackendUser(response.data.data.user, 0);
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Update user permissions
  async updateUserPermissions(id: string, permissions: string[]): Promise<User> {
    try {
      const response = await api.put<ApiResponse<{ user: BackendUser }>>(`/users/${id}/permissions`, {
        permissions,
      });
      return transformBackendUser(response.data.data.user, 0);
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  },
};