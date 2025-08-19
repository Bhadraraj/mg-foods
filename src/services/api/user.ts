import api from '../api';
import { User, NewUserFormData, ApiResponse } from '../../types';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: boolean;
  store?: string;
  search?: string;
}

export const userService = {
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<{ users: User[] }>> {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/users', {
      params: filters,
    });
    return response.data;
  },

  async getUser(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data;
  },

  async createUser(formData: NewUserFormData): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post<ApiResponse<{ user: User }>>('/users', formData);
    return response.data;
  },

  async updateUser(id: string, formData: Partial<NewUserFormData>): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, formData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async toggleUserStatus(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}/toggle-status`);
    return response.data;
  },
};