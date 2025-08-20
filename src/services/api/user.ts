import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { User, NewUserFormData, ApiResponse } from '../../types';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: boolean;
  store?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const userService = {
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<{ users: User[] }>> {
    return await apiClient.get<{ users: User[] }>(ENDPOINTS.USERS.BASE, { params: filters });
  },

  async getUser(id: string): Promise<ApiResponse<{ user: User }>> {
    return await apiClient.get<{ user: User }>(ENDPOINTS.USERS.BY_ID(id));
  },

  async createUser(formData: NewUserFormData): Promise<ApiResponse<{ user: User }>> {
    return await apiClient.post<{ user: User }>(ENDPOINTS.USERS.BASE, formData);
  },

  async updateUser(id: string, formData: Partial<NewUserFormData>): Promise<ApiResponse<{ user: User }>> {
    return await apiClient.put<{ user: User }>(ENDPOINTS.USERS.BY_ID(id), formData);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS.BY_ID(id));
  },

  async toggleUserStatus(id: string): Promise<ApiResponse<{ user: User }>> {
    return await apiClient.put<{ user: User }>(ENDPOINTS.USERS.TOGGLE_STATUS(id));
  },
};