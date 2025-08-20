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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
  /**
   * 
   * Get all categories with pagination support
   * GET /categories?page=1&limit=20&search=electronics
   */
  async getCategories(filters: CategoryFilters = {}): Promise<ApiResponse<{ categories: Category[] }>> {
    return await apiClient.get<{ categories: Category[] }>(ENDPOINTS.CATEGORIES.BASE, { params: filters });
  },

  /**
   * Get a specific category by ID
   * GET /categories/:id
   */
  async getCategory(id: string): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.get<{ category: Category }>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  /**
   * Create a new category
   * POST /categories
   */
  async createCategory(data: CreateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.post<{ category: Category }>(ENDPOINTS.CATEGORIES.BASE, data);
  },

  /**
   * Update an existing category
   * PUT /categories/:id
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    return await apiClient.put<{ category: Category }>(ENDPOINTS.CATEGORIES.BY_ID(id), data);
  },

  /**
   * Delete a category
   * DELETE /categories/:id
   */
  async deleteCategory(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  /**
   * Assign items to a category
   * POST /categories/:id/items
   */
  async assignItemsToCategory(id: string, data: AssignItemsData): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.post<{ success: boolean }>(ENDPOINTS.CATEGORIES.ITEMS(id), data);
  },
};