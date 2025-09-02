import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface ReferrerPoint {
  _id: string;
  store: string;
  referrer: {
    _id: string;
    name: string;
  } | null;
  commissionType: 'Fixed Amount' | 'Percentage';
  commissionValue: number;
  pointsEarned: number;
  pointsRedeemed: number;
  yearlyPoints: number;
  transactionType: 'Manual Adjustment' | 'Redemption' | 'Order' | 'Referral';
  orderAmount: number;
  description: string;
  status: 'Active' | 'Inactive';
  isActive: boolean;
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
  balancePoints: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReferrerSummary {
  _id: string;
  name: string;
  phone: string;
  commissionTotal: number;
  yearlyTotal: number;
  totalPoints: number;
  balanceCommission: number;
  balanceYearly: number;
  balancePoints: number;
}

export interface ReferrerPointFilters {
  page?: number;
  limit?: number;
  search?: string;
  referrerId?: string;
  transactionType?: string;
  status?: 'Active' | 'Inactive';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateReferrerPointData {
  referrerId?: string;
  commissionType: 'Fixed Amount' | 'Percentage';
  commissionValue: number;
  pointsEarned: number;
  pointsRedeemed: number;
  yearlyPoints: number;
  transactionType: 'Manual Adjustment' | 'Redemption' | 'Order' | 'Referral';
  orderAmount: number;
  description: string;
}

export interface UpdateReferrerPointData {
  commissionType?: 'Fixed Amount' | 'Percentage';
  commissionValue?: number;
  pointsEarned?: number;
  pointsRedeemed?: number;
  yearlyPoints?: number;
  transactionType?: 'Manual Adjustment' | 'Redemption' | 'Order' | 'Referral';
  orderAmount?: number;
  description?: string;
  isActive?: boolean;
}

export const referrerPointService = {
  /**
   * Get all referrer points with pagination support
   * GET /api/referrer-points?page=1&limit=10
   */
  async getReferrerPoints(filters: ReferrerPointFilters = {}): Promise<ApiResponse<{ data: ReferrerPoint[]; pagination: any }>> {
    return await apiClient.get<{ data: ReferrerPoint[]; pagination: any }>(ENDPOINTS.REFERRER_POINTS.BASE, { params: filters });
  },

  /**
   * Get referrer points summary grouped by referrer
   * GET /api/referrer-points/summary
   */
  async getReferrerPointsSummary(filters: ReferrerPointFilters = {}): Promise<ApiResponse<{ data: ReferrerSummary[]; pagination: any }>> {
    return await apiClient.get<{ data: ReferrerSummary[]; pagination: any }>(ENDPOINTS.REFERRER_POINTS.SUMMARY, { params: filters });
  },

  /**
   * Get points for a specific referrer
   * GET /api/referrer-points/referrer/:referrerId
   */
  async getReferrerPointsByReferrer(referrerId: string, filters: ReferrerPointFilters = {}): Promise<ApiResponse<{ data: ReferrerPoint[]; pagination: any }>> {
    return await apiClient.get<{ data: ReferrerPoint[]; pagination: any }>(ENDPOINTS.REFERRER_POINTS.BY_REFERRER(referrerId), { params: filters });
  },

  /**
   * Get a specific referrer point transaction by ID
   * GET /api/referrer-points/:id
   */
  async getReferrerPoint(id: string): Promise<ApiResponse<{ data: ReferrerPoint }>> {
    return await apiClient.get<{ data: ReferrerPoint }>(ENDPOINTS.REFERRER_POINTS.BY_ID(id));
  },

  /**
   * Create a new referrer point transaction
   * POST /api/referrer-points
   */
  async createReferrerPoint(data: CreateReferrerPointData): Promise<ApiResponse<{ data: ReferrerPoint }>> {
    return await apiClient.post<{ data: ReferrerPoint }>(ENDPOINTS.REFERRER_POINTS.BASE, data);
  },

  /**
   * Update an existing referrer point transaction
   * PUT /api/referrer-points/:id
   */
  async updateReferrerPoint(id: string, data: UpdateReferrerPointData): Promise<ApiResponse<{ data: ReferrerPoint }>> {
    return await apiClient.put<{ data: ReferrerPoint }>(ENDPOINTS.REFERRER_POINTS.BY_ID(id), data);
  },

  /**
   * Delete a referrer point transaction
   * DELETE /api/referrer-points/:id
   */
  async deleteReferrerPoint(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.REFERRER_POINTS.BY_ID(id));
  },

  /**
   * Redeem points for a referrer
   * POST /api/referrer-points/redeem
   */
  async redeemPoints(data: { referrerId: string; pointsToRedeem: number; description: string }): Promise<ApiResponse<{ data: ReferrerPoint }>> {
    return await apiClient.post<{ data: ReferrerPoint }>(ENDPOINTS.REFERRER_POINTS.REDEEM, data);
  },

  /**
   * Get referrer balance
   * GET /api/referrer-points/balance/:referrerId
   */
  async getReferrerBalance(referrerId: string): Promise<ApiResponse<{ data: { commissionBalance: number; yearlyBalance: number; totalBalance: number } }>> {
    return await apiClient.get<{ data: { commissionBalance: number; yearlyBalance: number; totalBalance: number } }>(ENDPOINTS.REFERRER_POINTS.BALANCE(referrerId));
  },
};
