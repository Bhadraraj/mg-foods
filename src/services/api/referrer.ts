import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';
import { Referrer } from '../../types/party';

export interface ReferrerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateReferrerData {
  referrerName: string;
  phoneNumber: string;
  address: string;
  gstNumber?: string;
}

export interface UpdateReferrerData {
  referrerName?: string;
  phoneNumber?: string;
  address?: string;
  gstNumber?: string;
}

export const referrerService = {
  /**
   * Get all referrers with pagination support
   * GET /referrers?page=1&limit=20&search=name&status=true
   */
  async getReferrers(filters: ReferrerFilters = {}): Promise<ApiResponse<{ referrers: Referrer[] }>> {
    return await apiClient.get<{ referrers: Referrer[] }>(ENDPOINTS.REFERRERS.BASE, { params: filters });
  },

  /**
   * Get a specific referrer by ID
   * GET /referrers/:id
   */
  async getReferrer(id: string): Promise<ApiResponse<{ referrer: Referrer }>> {
    return await apiClient.get<{ referrer: Referrer }>(ENDPOINTS.REFERRERS.BY_ID(id));
  },

  /**
   * Create a new referrer
   * POST /referrers
   */
  async createReferrer(data: CreateReferrerData): Promise<ApiResponse<{ referrer: Referrer }>> {
    return await apiClient.post<{ referrer: Referrer }>(ENDPOINTS.REFERRERS.BASE, data);
  },

  /**
   * Update an existing referrer
   * PUT /referrers/:id
   */
  async updateReferrer(id: string, data: UpdateReferrerData): Promise<ApiResponse<{ referrer: Referrer }>> {
    return await apiClient.put<{ referrer: Referrer }>(ENDPOINTS.REFERRERS.BY_ID(id), data);
  },

  /**
   * Delete a referrer
   * DELETE /referrers/:id
   */
  async deleteReferrer(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.REFERRERS.BY_ID(id));
  },
};