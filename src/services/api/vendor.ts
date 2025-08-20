import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Vendor {
  id: string;
  name: string;
  vendorCode?: string;
  mobileNumber: string;
  gstNumber?: string;
  address: string;
  location?: string;
  accountDetails?: {
    accountName?: string;
    bankName?: string;
    branchName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateVendorData {
  name: string;
  mobileNumber: string;
  vendorCode?: string;
  gstNumber?: string;
  address: string;
  location?: string;
  accountDetails?: {
    accountName?: string;
    bankName?: string;
    branchName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

export interface UpdateVendorData {
  name?: string;
  mobileNumber?: string;
  vendorCode?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  accountDetails?: {
    accountName?: string;
    bankName?: string;
    branchName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

export const vendorService = {
  /**
   * Get all vendors with pagination support
   * GET /vendors?page=1&limit=20&search=supplier&status=true
   */
  async getVendors(filters: VendorFilters = {}): Promise<ApiResponse<{ vendors: Vendor[] }>> {
    return await apiClient.get<{ vendors: Vendor[] }>(ENDPOINTS.VENDORS.BASE, { params: filters });
  },

  /**
   * Get a specific vendor by ID
   * GET /vendors/:id
   */
  async getVendor(id: string): Promise<ApiResponse<{ vendor: Vendor }>> {
    return await apiClient.get<{ vendor: Vendor }>(ENDPOINTS.VENDORS.BY_ID(id));
  },

  /**
   * Create a new vendor
   * POST /vendors
   */
  async createVendor(data: CreateVendorData): Promise<ApiResponse<{ vendor: Vendor }>> {
    return await apiClient.post<{ vendor: Vendor }>(ENDPOINTS.VENDORS.BASE, data);
  },

  /**
   * Update an existing vendor
   * PUT /vendors/:id
   */
  async updateVendor(id: string, data: UpdateVendorData): Promise<ApiResponse<{ vendor: Vendor }>> {
    return await apiClient.put<{ vendor: Vendor }>(ENDPOINTS.VENDORS.BY_ID(id), data);
  },

  /**
   * Delete a vendor
   * DELETE /vendors/:id
   */
  async deleteVendor(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.VENDORS.BY_ID(id));
  },
};