import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  location?: string;
  creditLimit?: number;
  creditDays?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  location?: string;
}

export interface CreateCustomerData {
  name: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  location?: string;
  creditLimit?: number;
  creditDays?: number;
}

export interface UpdateCustomerData {
  name?: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  location?: string;
  creditLimit?: number;
  creditDays?: number;
}

export const customerService = {
  async getCustomers(filters: CustomerFilters = {}): Promise<ApiResponse<{ customers: Customer[] }>> {
    return await apiClient.get<{ customers: Customer[] }>(ENDPOINTS.CUSTOMERS.BASE, { params: filters });
  },

  async getCustomer(id: string): Promise<ApiResponse<{ customer: Customer }>> {
    return await apiClient.get<{ customer: Customer }>(ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  async createCustomer(data: CreateCustomerData): Promise<ApiResponse<{ customer: Customer }>> {
    return await apiClient.post<{ customer: Customer }>(ENDPOINTS.CUSTOMERS.BASE, data);
  },

  async updateCustomer(id: string, data: UpdateCustomerData): Promise<ApiResponse<{ customer: Customer }>> {
    return await apiClient.put<{ customer: Customer }>(ENDPOINTS.CUSTOMERS.BY_ID(id), data);
  },

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.CUSTOMERS.BY_ID(id));
  },
};