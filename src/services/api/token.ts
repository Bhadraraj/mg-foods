// src/services/api/tokenService.ts
import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface TokenOrder {
  _id: string;
  tokenNumber: string;
  serialNumber: number;
  displayToken: string;
  customerDetails: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  };
  orderItems: Array<{
    _id: string;
    item: {
      _id: string;
      productName: string;
      priceDetails: {
        sellingPrice: number;
        taxPercentage: number;
        discount: number;
      };
      imageUrls: {
        primaryImage: string | null;
        additionalImages: string[];
      };
      id: string;
    };
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions: string;
  }>;
  orderSummary: {
    totalQuantity: number;
    totalTea: number;
    totalVada: number;
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    grandTotal: number;
  };
  paymentDetails: {
    status: 'Pending' | 'Paid' | 'Refunded';
    method: string;
    paidAmount: number;
    pendingAmount: number;
    paymentDate: string | null;
    transactionId: string | null;
  };
  orderStatus: 'Placed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  orderType: 'Dine-in' | 'Takeaway' | 'Delivery';
  priority: 'Low' | 'Normal' | 'High';
  estimatedTime: number;
  orderNotes: string;
  store: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    id: string;
  };
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  orderTiming: string;
  id: string;
}

export interface TokenFilters {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  orderType?: string;
  priority?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTokenData {
  customerDetails: {
    name: string;
    mobile: string;
    email?: string;
    address?: string;
  };
  orderItems: Array<{
    item: string; // Item ID
    quantity: number;
    specialInstructions?: string;
  }>;
  orderType: 'Dine-in' | 'Takeaway' | 'Delivery';
  priority: 'Low' | 'Normal' | 'High';
  orderNotes?: string;
  estimatedTime?: number;
}

export interface UpdateTokenData {
  customerDetails?: {
    name?: string;
    mobile?: string;
    email?: string;
    address?: string;
  };
  orderItems?: Array<{
    item: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  orderType?: 'Dine-in' | 'Takeaway' | 'Delivery';
  priority?: 'Low' | 'Normal' | 'High';
  orderNotes?: string;
  estimatedTime?: number;
  orderStatus?: 'Placed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
}

export interface UpdateTokenPaymentData {
  status: 'Pending' | 'Paid' | 'Refunded';
  method?: string;
  paidAmount?: number;
  transactionId?: string;
}

// export interface TokenStats {
//   total: number;
//   pending: number;
//   completed: number;
//   revenue: number;
//   statusBreakdown: Record<string, number>;
//   paymentBreakdown: Record<string, number>;
// }

export const tokenService = {
  /**
   * Get all tokens with pagination support
   * GET /api/tokens?page=1&limit=20&sortBy=createdAt&sortOrder=desc
   */
  async getTokens(filters: TokenFilters = {}): Promise<ApiResponse<{ data: TokenOrder[]; pagination: any }>> {
    return await apiClient.get<{ data: TokenOrder[]; pagination: any }>(ENDPOINTS.TOKENS.BASE, { params: filters });
  },

  /**
   * Get a specific token by ID
   * GET /api/tokens/:id
   */
  async getToken(id: string): Promise<ApiResponse<{ data: TokenOrder }>> {
    return await apiClient.get<{ data: TokenOrder }>(ENDPOINTS.TOKENS.BY_ID(id));
  },

  /**
   * Create a new token order
   * POST /api/tokens
   */
  async createToken(data: CreateTokenData): Promise<ApiResponse<{ data: TokenOrder }>> {
    return await apiClient.post<{ data: TokenOrder }>(ENDPOINTS.TOKENS.BASE, data);
  },

  /**
   * Update an existing token order
   * PUT /api/tokens/:id
   */
  async updateToken(id: string, data: UpdateTokenData): Promise<ApiResponse<{ data: TokenOrder }>> {
    return await apiClient.put<{ data: TokenOrder }>(ENDPOINTS.TOKENS.BY_ID(id), data);
  },

  /**
   * Update token payment status
   * PUT /api/tokens/:id/payment
   */
  async updateTokenPayment(id: string, data: UpdateTokenPaymentData): Promise<ApiResponse<{ data: TokenOrder }>> {
    return await apiClient.put<{ data: TokenOrder }>(ENDPOINTS.TOKENS.UPDATE_PAYMENT(id), data);
  },

  /**
   * Delete a token order
   * DELETE /api/tokens/:id
   */
  async deleteToken(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.TOKENS.BY_ID(id));
  },

  /**
   * Get token statistics
   * GET /api/tokens/stats
   */
  async getTokenStats(): Promise<ApiResponse<{ data: TokenStats }>> {
    return await apiClient.get<{ data: TokenStats }>(ENDPOINTS.TOKENS.STATS);
  },

  /**
   * Cancel a token order
   * PUT /api/tokens/:id/cancel
   */
  async cancelToken(id: string): Promise<ApiResponse<{ data: TokenOrder }>> {
    return await apiClient.put<{ data: TokenOrder }>(ENDPOINTS.TOKENS.CANCEL(id));
  },
};