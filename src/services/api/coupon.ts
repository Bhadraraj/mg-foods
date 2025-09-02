import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Coupon {
  _id: string;
  id: string;
  code: string;
  name: string;
  description: string;
  couponType: 'Promotional' | 'Seasonal' | 'Event';
  discountType: 'Percentage' | 'Fixed';
  couponValue: number;
  validFrom: string;
  validTo: string;
  applicableType: 'Store' | 'Product';
  applicableItems: string[];
  minOrderAmount: number;
  minOrderQuantity: number;
  maxUsagePerCustomer: number;
  totalUsageLimit: number;
  currentUsageCount: number;
  customerGroups: string[];
  isFirstTimeCustomerOnly: boolean;
  isActive: boolean;
  isVisible: boolean;
  stackable: boolean;
  terms: string;
  priority: number;
  store: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    id: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  isCurrentlyActive: boolean;
  remainingUsage: number;
  status: 'Active' | 'Inactive' | 'Expired';
}

export interface CouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Active' | 'Inactive' | 'Expired';
  couponType?: string;
  discountType?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCouponData {
  code: string;
  name: string;
  description: string;
  couponType: 'Promotional' | 'Seasonal' | 'Event';
  discountType: 'Percentage' | 'Fixed';
  couponValue: number;
  validFrom: string;
  validTo: string;
  applicableType: 'Store' | 'Product';
  minOrderAmount: number;
  maxUsagePerCustomer: number;
  totalUsageLimit: number;
  customerGroups: string[];
  isFirstTimeCustomerOnly: boolean;
  stackable: boolean;
  terms?: string;
}

export interface UpdateCouponData {
  code?: string;
  name?: string;
  description?: string;
  couponType?: 'Promotional' | 'Seasonal' | 'Event';
  discountType?: 'Percentage' | 'Fixed';
  couponValue?: number;
  validFrom?: string;
  validTo?: string;
  applicableType?: 'Store' | 'Product';
  minOrderAmount?: number;
  maxUsagePerCustomer?: number;
  totalUsageLimit?: number;
  customerGroups?: string[];
  isFirstTimeCustomerOnly?: boolean;
  stackable?: boolean;
  terms?: string;
  isActive?: boolean;
}

export const couponService = {
  /**
   * Get all coupons with pagination support
   * GET /api/coupons?page=1&limit=10&status=Active&sortOrder=desc
   */
  async getCoupons(filters: CouponFilters = {}): Promise<ApiResponse<{ data: Coupon[]; pagination: any }>> {
    return await apiClient.get<{ data: Coupon[]; pagination: any }>(ENDPOINTS.COUPONS.BASE, { params: filters });
  },

  /**
   * Get a specific coupon by ID
   * GET /api/coupons/:id
   */
  async getCoupon(id: string): Promise<ApiResponse<{ data: Coupon }>> {
    return await apiClient.get<{ data: Coupon }>(ENDPOINTS.COUPONS.BY_ID(id));
  },

  /**
   * Create a new coupon
   * POST /api/coupons
   */
  async createCoupon(data: CreateCouponData): Promise<ApiResponse<{ data: Coupon }>> {
    return await apiClient.post<{ data: Coupon }>(ENDPOINTS.COUPONS.BASE, data);
  },

  /**
   * Update an existing coupon
   * PUT /api/coupons/:id
   */
  async updateCoupon(id: string, data: UpdateCouponData): Promise<ApiResponse<{ data: Coupon }>> {
    return await apiClient.put<{ data: Coupon }>(ENDPOINTS.COUPONS.BY_ID(id), data);
  },

  /**
   * Delete a coupon
   * DELETE /api/coupons/:id
   */
  async deleteCoupon(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.COUPONS.BY_ID(id));
  },

  /**
   * Toggle coupon status
   * PATCH /api/coupons/:id/toggle-status
   */
  async toggleCouponStatus(id: string): Promise<ApiResponse<{ data: Coupon }>> {
    return await apiClient.patch<{ data: Coupon }>(ENDPOINTS.COUPONS.TOGGLE_STATUS(id));
  },

  /**
   * Validate coupon code
   * POST /api/coupons/validate
   */
  async validateCoupon(data: { code: string; orderAmount: number; customerId?: string }): Promise<ApiResponse<{ isValid: boolean; coupon?: Coupon; message: string }>> {
    return await apiClient.post<{ isValid: boolean; coupon?: Coupon; message: string }>(ENDPOINTS.COUPONS.VALIDATE, data);
  },

  /**
   * Apply coupon to order
   * POST /api/coupons/apply
   */
  async applyCoupon(data: { code: string; orderId: string; customerId?: string }): Promise<ApiResponse<{ data: { discount: number; coupon: Coupon } }>> {
    return await apiClient.post<{ data: { discount: number; coupon: Coupon } }>(ENDPOINTS.COUPONS.APPLY, data);
  },
};
