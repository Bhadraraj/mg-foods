import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Rack {
  id: string;
  name: string;
  code?: string;
  location?: string;
  capacity?: number;
  currentOccupancy: number;
  items: RackItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RackItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  purchaseId?: string;
  zoneId?: string;
  addedAt: string;
}

export interface RackFilters {
  page?: number;
  limit?: number;
  location?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateRackData {
  name: string;
  code?: string;
  location?: string;
  capacity?: number;
}

export interface UpdateRackData {
  name?: string;
  code?: string;
  location?: string;
  capacity?: number;
}

export interface AddItemToRackData {
  itemId: string;
  itemName: string;
  quantity: number;
  purchaseId?: string;
  zoneId?: string;
}

export interface RemoveItemFromRackData {
  quantity: number;
}

export const rackService = {
  /**
   * Get all racks with pagination support
   * GET /racks?page=1&limit=10&location=warehouse&category=electronics
   */
  async getRacks(filters: RackFilters = {}): Promise<ApiResponse<{ racks: Rack[] }>> {
    return await apiClient.get<{ racks: Rack[] }>(ENDPOINTS.RACKS.BASE, { params: filters });
  },

  /**
   * Get a specific rack by ID
   * GET /racks/:id
   */
  async getRack(id: string): Promise<ApiResponse<{ rack: Rack }>> {
    return await apiClient.get<{ rack: Rack }>(ENDPOINTS.RACKS.BY_ID(id));
  },

  /**
   * Create a new rack
   * POST /racks
   */
  async createRack(data: CreateRackData): Promise<ApiResponse<{ rack: Rack }>> {
    return await apiClient.post<{ rack: Rack }>(ENDPOINTS.RACKS.BASE, data);
  },

  /**
   * Update an existing rack
   * PUT /racks/:id
   */
  async updateRack(id: string, data: UpdateRackData): Promise<ApiResponse<{ rack: Rack }>> {
    return await apiClient.put<{ rack: Rack }>(ENDPOINTS.RACKS.BY_ID(id), data);
  },

  /**
   * Delete a rack
   * DELETE /racks/:id
   */
  async deleteRack(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.RACKS.BY_ID(id));
  },

  /**
   * Add an item to a rack
   * POST /racks/:id/items
   */
  async addItemToRack(rackId: string, data: AddItemToRackData): Promise<ApiResponse<{ rack: Rack }>> {
    return await apiClient.post<{ rack: Rack }>(ENDPOINTS.RACKS.ITEMS(rackId), data);
  },

  /**
   * Remove an item from a rack
   * DELETE /racks/:id/items/:itemId
   */
  async removeItemFromRack(rackId: string, itemId: string, data: RemoveItemFromRackData): Promise<ApiResponse<{ rack: Rack }>> {
    return await apiClient.delete<{ rack: Rack }>(ENDPOINTS.RACKS.REMOVE_ITEM(rackId, itemId), { data });
  },

  /**
   * Update item quantity in a rack
   * PUT /racks/:id/items/:itemId
   */
  async updateItemQuantity(rackId: string, itemId: string, quantity: number): Promise<ApiResponse<{ rack: Rack }>> {
    return await apiClient.put<{ rack: Rack }>(ENDPOINTS.RACKS.REMOVE_ITEM(rackId, itemId), { quantity });
  },
};