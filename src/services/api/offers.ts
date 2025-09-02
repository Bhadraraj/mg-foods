import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Offer {
  _id: string;
  id: string;
  name: string;
  slug: string;
  offerEffectiveFrom: string;
  offerEffectiveUpto: string;
  discountType: 'Percentage' | 'Fixed' | 'BOGO';
  discount: number;
  applicableType: 'Product' | 'Store';
  applicableItems: string[];
  minOrderAmount: number;
  minOrderQuantity: number;
  maxUsagePerCustomer: number | null;
  totalUsageLimit: number | null;
  currentUsageCount: number;
  customerGroups: string[];
  isFirstTimeCustomerOnly: boolean;
  isActive: boolean;
  isVisible: boolean;
  stackable: boolean;
  description: string;
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
  remainingUsage: string | number;
  status: 'Running' | 'Paused' | 'Expired' | 'Draft';
}

export interface OfferFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  discountType?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOfferData {
  name: string;
  slug: string;
  offerEffectiveFrom: string;
  offerEffectiveUpto: string;
  discountType: 'Percentage' | 'Fixed' | 'BOGO';
  discount: number;
  applicableType: 'Product' | 'Store';
  minOrderAmount: number;
  customerGroups: string[];
  isActive: boolean;
  description: string;
}

export interface UpdateOfferData {
  name?: string;
  slug?: string;
  offerEffectiveFrom?: string;
  offerEffectiveUpto?: string;
  discountType?: 'Percentage' | 'Fixed' | 'BOGO';
  discount?: number;
  applicableType?: 'Product' | 'Store';
  minOrderAmount?: number;
  customerGroups?: string[];
  isActive?: boolean;
  description?: string;
}

export const offerService = {
  /**
   * Get all offers with pagination support
   * GET /api/offers?page=1&limit=10
   */
  async getOffers(filters: OfferFilters = {}): Promise<ApiResponse<{ data: Offer[]; pagination: any }>> {
    return await apiClient.get<{ data: Offer[]; pagination: any }>(ENDPOINTS.OFFERS.BASE, { params: filters });
  },

  /**
   * Get a specific offer by ID
   * GET /api/offers/:id
   */
  async getOffer(id: string): Promise<ApiResponse<{ data: Offer }>> {
    return await apiClient.get<{ data: Offer }>(ENDPOINTS.OFFERS.BY_ID(id));
  },

  /**
   * Create a new offer
   * POST /api/offers
   */
  async createOffer(data: CreateOfferData): Promise<ApiResponse<{ data: Offer }>> {
    return await apiClient.post<{ data: Offer }>(ENDPOINTS.OFFERS.BASE, data);
  },

  /**
   * Update an existing offer
   * PUT /api/offers/:id
   */
  async updateOffer(id: string, data: UpdateOfferData): Promise<ApiResponse<{ data: Offer }>> {
    return await apiClient.put<{ data: Offer }>(ENDPOINTS.OFFERS.BY_ID(id), data);
  },

  /**
   * Delete an offer
   * DELETE /api/offers/:id
   */
  async deleteOffer(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.OFFERS.BY_ID(id));
  },

  /**
   * Toggle offer status
   * PATCH /api/offers/:id/toggle-status
   */
  async toggleOfferStatus(id: string): Promise<ApiResponse<{ data: Offer }>> {
    return await apiClient.patch<{ data: Offer }>(ENDPOINTS.OFFERS.TOGGLE_STATUS(id));
  },
};
