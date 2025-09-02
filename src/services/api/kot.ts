// src/services/api/kot.ts
import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface KotItem {
  _id: string;
  item: {
    _id: string;
    productName: string;
    category: string;
    imageUrls: {
      primaryImage: string | null;
      additionalImages: string[];
    };
    id: string;
  };
  itemName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  variant?: string;
  kotNote?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  type: 'Individual' | 'Corporate' | 'Guest';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  id: string;
}

export interface Kot {
  _id: string;
  kotNumber: string;
  tableNumber: string;
  orderReference: string;
  customerDetails: CustomerDetails;
  items: KotItem[];
  kotType: string;
  status: 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  calculatedTotal: number;
  notes?: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface KotFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'completed' | 'cancelled';
  kotType?: string;
  tableNumber?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateKotItemData {
  item: string; // Item ID
  itemName: string;
  quantity: number;
  price: number;
  variant?: string;
  kotNote?: string;
}

export interface CreateKotData {
  tableNumber: string;
  orderReference: string;
  items: CreateKotItemData[];
  customerDetails: CustomerDetails;
  kotType: string;
  notes?: string;
}

export interface UpdateKotData {
  tableNumber?: string;
  customerDetails?: Partial<CustomerDetails>;
  notes?: string;
  status?: 'active' | 'completed' | 'cancelled';
}

export interface UpdateKotItemStatusData {
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
}

export interface KotStats {
  overview: {
    totalKOTs: number;
    activeKOTs: number;
    completedKOTs: number;
    totalAmount: number;
    avgOrderValue: number;
  };
  kotTypeBreakdown: Array<{
    kotType: string;
    count: number;
    totalAmount: number;
  }>;
}

export const kotService = {
  /**
   * Get all KOTs with pagination support
   * GET /kots?page=1&limit=20&search=KOT001&status=active
   */
  async getKots(filters: KotFilters = {}): Promise<ApiResponse<{ kots: Kot[] }>> {
    return await apiClient.get<{ kots: Kot[] }>(ENDPOINTS.KOTS.BASE, { params: filters });
  },

  /**
   * Get a specific KOT by ID
   * GET /kots/:id
   */
  async getKot(id: string): Promise<ApiResponse<Kot>> {
    return await apiClient.get<Kot>(ENDPOINTS.KOTS.BY_ID(id));
  },

  /**
   * Create a new KOT
   * POST /kots
   */
  async createKot(data: CreateKotData): Promise<ApiResponse<Kot>> {
    return await apiClient.post<Kot>(ENDPOINTS.KOTS.BASE, data);
  },

  /**
   * Update an existing KOT
   * PUT /kots/:id
   */
  async updateKot(id: string, data: UpdateKotData): Promise<ApiResponse<Kot>> {
    return await apiClient.put<Kot>(ENDPOINTS.KOTS.BY_ID(id), data);
  },

  /**
   * Update KOT item status
   * PUT /kots/:kotId/items/:kotItemId/status
   */
  async updateKotItemStatus(
    kotId: string, 
    kotItemId: string, 
    data: UpdateKotItemStatusData
  ): Promise<ApiResponse<Kot>> {
    return await apiClient.put<Kot>(
      ENDPOINTS.KOTS.ITEM_STATUS(kotId, kotItemId), 
      data
    );
  },

  /**
   * Get KOT statistics
   * GET /kots/stats
   */
  async getKotStats(): Promise<ApiResponse<KotStats>> {
    return await apiClient.get<KotStats>(ENDPOINTS.KOTS.STATS);
  },

  /**
   * Delete a KOT
   * DELETE /kots/:id
   */
  async deleteKot(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.KOTS.BY_ID(id));
  },
};