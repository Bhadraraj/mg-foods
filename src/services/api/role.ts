import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { Role, ApiResponse } from '../../types';

export interface RoleFilters {
  page?: number;
  limit?: number;
  status?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateRoleData {
  roleName: string;
  permissions: string[];
}

export interface UpdateRoleData {
  roleName?: string;
  permissions?: string[];
  isActive?: boolean;
}

export const roleService = {
  async getRoles(filters: RoleFilters = {}): Promise<ApiResponse<{ roles: Role[] }>> {
    return await apiClient.get<{ roles: Role[] }>(ENDPOINTS.ROLES.BASE, { params: filters });
  },

  async getRole(id: string): Promise<ApiResponse<{ role: Role }>> {
    return await apiClient.get<{ role: Role }>(ENDPOINTS.ROLES.BY_ID(id));
  },

  async createRole(data: CreateRoleData): Promise<ApiResponse<{ role: Role }>> {
    return await apiClient.post<{ role: Role }>(ENDPOINTS.ROLES.BASE, data);
  },

  async updateRole(id: string, data: UpdateRoleData): Promise<ApiResponse<{ role: Role }>> {
    return await apiClient.put<{ role: Role }>(ENDPOINTS.ROLES.BY_ID(id), data);
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.ROLES.BY_ID(id));
  },

  async toggleRoleStatus(id: string): Promise<ApiResponse<{ role: Role }>> {
    return await apiClient.put<{ role: Role }>(ENDPOINTS.ROLES.TOGGLE_STATUS(id));
  },

  async updateRolePermissions(id: string, permissions: string[]): Promise<ApiResponse<{ role: Role }>> {
    return await apiClient.put<{ role: Role }>(ENDPOINTS.ROLES.PERMISSIONS(id), { permissions });
  },
};