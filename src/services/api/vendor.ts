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
  async getVendors(filters: VendorFilters = {}): Promise<ApiResponse<{ vendors: Vendor[] }>> {
    return await apiClient.get<{ vendors: Vendor[] }>(ENDPOINTS.VENDORS.BASE, { params: filters });
  },

  async getVendor(id: string): Promise<ApiResponse<{ vendor: Vendor }>> {
    return await apiClient.get<{ vendor: Vendor }>(ENDPOINTS.VENDORS.BY_ID(id));
  },

  async createVendor(data: CreateVendorData): Promise<ApiResponse<{ vendor: Vendor }>> {
    return await apiClient.post<{ vendor: Vendor }>(ENDPOINTS.VENDORS.BASE, data);
  },

  async updateVendor(id: string, data: UpdateVendorData): Promise<ApiResponse<{ vendor: Vendor }>> {
    return await apiClient.put<{ vendor: Vendor }>(ENDPOINTS.VENDORS.BY_ID(id), data);
  },

  async deleteVendor(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.VENDORS.BY_ID(id));
  },
};