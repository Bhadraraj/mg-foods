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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
  /**
   * Get all customers with pagination support
   * GET /customers?page=1&limit=20&search=john&status=true
   */
  async getCustomers(filters: CustomerFilters = {}): Promise<ApiResponse<{ customers: Customer[] }>> {
    return await apiClient.get<{ customers: Customer[] }>(ENDPOINTS.CUSTOMERS.BASE, { params: filters });
  },

  /**
   * Get a specific customer by ID
   * GET /customers/:id
   */
  async getCustomer(id: string): Promise<ApiResponse<{ customer: Customer }>> {
    return await apiClient.get<{ customer: Customer }>(ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  /**
   * Create a new customer
   * POST /customers
   */
  async createCustomer(data: CreateCustomerData): Promise<ApiResponse<{ customer: Customer }>> {
    return await apiClient.post<{ customer: Customer }>(ENDPOINTS.CUSTOMERS.BASE, data);
  },

  /**
   * Update an existing customer
   * PUT /customers/:id
   */
  async updateCustomer(id: string, data: UpdateCustomerData): Promise<ApiResponse<{ customer: Customer }>> {
    return await apiClient.put<{ customer: Customer }>(ENDPOINTS.CUSTOMERS.BY_ID(id), data);
  },

  /**
   * Delete a customer
   * DELETE /customers/:id
   */
  async deleteCustomer(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.CUSTOMERS.BY_ID(id));
  },
};