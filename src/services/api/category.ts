import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Category {
  _id: string;
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  user: {
    _id: string;
    name: string;
    email: string;
    id: string;
  };
  totalItems: number;
  items?: Array<{
    _id: string;
    id?: string;
    productName: string;
    brandName?: string;
    brand?: string;
    category?: string;
    subCategory?: string;
  }>; // Add items property for category details
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
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
  status?: 'active' | 'inactive';
}

export interface AssignItemsData {
  itemIds: string[];
}

export const categoryService = {
  /**
   * Get all categories with pagination support
   * GET /api/categories?page=1&limit=20&search=tea
   */
  async getCategories(filters: CategoryFilters = {}): Promise<ApiResponse<Category[]>> {
    return await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.BASE, { params: filters });
  },

  /**
   * Get a specific category by ID with its items
   * GET /api/categories/:id
   */
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return await apiClient.get<Category>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  /**
   * Create a new category
   * POST /api/categories
   */
  async createCategory(data: CreateCategoryData): Promise<ApiResponse<Category>> {
    return await apiClient.post<Category>(ENDPOINTS.CATEGORIES.BASE, data);
  },

  /**
   * Update an existing category
   * PUT /api/categories/:id
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<ApiResponse<Category>> {
    return await apiClient.put<Category>(ENDPOINTS.CATEGORIES.BY_ID(id), data);
  },

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  async deleteCategory(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  /**
   * Assign items to a category
   * POST /api/categories/:id/assign-items
   */
  async assignItemsToCategory(categoryId: string, data: AssignItemsData): Promise<ApiResponse<Category>> {
    // Ensure we're not sending null itemIds
    const filteredData = {
      itemIds: data.itemIds.filter(id => id !== null && id !== undefined && id !== '')
    };
    
    if (filteredData.itemIds.length === 0) {
      throw new Error('No valid item IDs provided');
    }
    
    console.log('Assigning items to category:', categoryId, filteredData);
    return await apiClient.post<Category>(`/categories/${categoryId}/assign-items`, filteredData);
  },

  /**
   * Remove items from a category
   * DELETE /api/categories/:id/items
   */
  async removeItemsFromCategory(categoryId: string, data: AssignItemsData): Promise<ApiResponse<Category>> {
    // Ensure we're not sending null itemIds
    const filteredData = {
      itemIds: data.itemIds.filter(id => id !== null && id !== undefined && id !== '')
    };
    
    if (filteredData.itemIds.length === 0) {
      throw new Error('No valid item IDs provided');
    }
    
    console.log('Removing items from category:', categoryId, filteredData);
    // Use the correct endpoint for removing items
    return await apiClient.delete<Category>(`/categories/${categoryId}/items`, { data: filteredData });
  },
};