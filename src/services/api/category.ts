import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Category {
  id: string;
  name: string;
  description?: string;
  itemCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export interface AssignItemsData {
  itemIds: string[];
}

export const categoryService = {
  async getCategories(filters: CategoryFilters = {}): Promise<ApiResponse<{ categories: Category[] }>> {
    return await apiClient.get<{ categories: Category[] }>(ENDPOINTS.CATEGORIES.BASE, { params: filters });
  },

  async getCategory(id: string): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.get<{ category: Category }>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  async createCategory(data: CreateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.post<{ category: Category }>(ENDPOINTS.CATEGORIES.BASE, data);
  },

  async updateCategory(id: string, data: UpdateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.put<{ category: Category }>(ENDPOINTS.CATEGORIES.BY_ID(id), data);
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  async assignItemsToCategory(id: string, data: AssignItemsData): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.post<{ category: Category }>(ENDPOINTS.CATEGORIES.ITEMS(id), data);
  },
};