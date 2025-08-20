import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Purchase {
  _id: string;
  id: string;
  vendor: string;
  invoiceNo: string;
  invoiceDate: string;
  brand?: string;
  items: PurchaseItem[];
  pricing: {
    subTotal: number;
    taxAmount: number;
    discountAmount?: number;
    grandTotal: number;
  };
  status: {
    po: 'draft' | 'confirmed' | 'cancelled';
    pi: 'pending' | 'confirmed' | 'cancelled';
    invoice: 'pending' | 'confirmed' | 'cancelled';
  };
  paymentStatus: 'pending' | 'partial' | 'paid';
  fulfillmentStatus: {
    fulfillment: 'pending' | 'completed';
    stockEntry: 'pending' | 'completed';
  };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  product: string;
  productName?: string;
  poQty: number;
  piQty?: number;
  receivedQty?: number;
  purchasePrice: number;
  mrp?: number;
  hsn?: string;
  cgst?: number;
  sgst?: number;
  igst?: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface PurchaseFilters {
  page?: number;
  limit?: number;
  vendor?: string;
  status?: 'draft' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'partial' | 'paid';
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePurchaseData {
  vendor: string;
  invoiceNo: string;
  invoiceDate: string;
  brand?: string;
  items: Omit<PurchaseItem, 'taxableAmount' | 'taxAmount' | 'totalAmount'>[];
  pricing: {
    subTotal: number;
    taxAmount: number;
    discountAmount?: number;
    grandTotal: number;
  };
}

export interface UpdatePurchaseStatusData {
  statusType: 'po' | 'pi' | 'invoice';
  statusValue: 'draft' | 'confirmed' | 'cancelled' | 'pending';
}

export interface StockEntryData {
  items: Array<{
    itemId: string;
    receivedQty: number;
    rackAssignments: Array<{
      rack: string;
      quantity: number;
    }>;
  }>;
  notes?: string;
}

export const purchaseService = {
  async getPurchases(filters: PurchaseFilters = {}): Promise<ApiResponse<{ purchases: Purchase[] }>> {
    return await apiClient.get<{ purchases: Purchase[] }>(ENDPOINTS.PURCHASES.BASE, { params: filters });
  },

  async getPurchase(id: string): Promise<ApiResponse<{ purchase: Purchase }>> {
    return await apiClient.get<{ purchase: Purchase }>(ENDPOINTS.PURCHASES.BY_ID(id));
  },

  async createPurchase(data: CreatePurchaseData): Promise<ApiResponse<{ purchase: Purchase }>> {
    return await apiClient.post<{ purchase: Purchase }>(ENDPOINTS.PURCHASES.BASE, data);
  },

  async updatePurchaseStatus(id: string, data: UpdatePurchaseStatusData): Promise<ApiResponse<{ purchase: Purchase }>> {
    return await apiClient.put<{ purchase: Purchase }>(ENDPOINTS.PURCHASES.STATUS(id), data);
  },

  async completePurchase(id: string): Promise<ApiResponse<{ purchase: Purchase }>> {
    return await apiClient.put<{ purchase: Purchase }>(ENDPOINTS.PURCHASES.BY_ID(id), { status: 'completed' });
  },

  async completeStockEntry(id: string, data: StockEntryData): Promise<ApiResponse<{ purchase: Purchase }>> {
    return await apiClient.post<{ purchase: Purchase }>(ENDPOINTS.PURCHASES.STOCK_ENTRY(id), data);
  },

  async deletePurchase(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.PURCHASES.BY_ID(id));
  },
};