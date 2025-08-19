import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Item {
  id: string;
  productName: string;
  description?: string;
  category: string;
  brand?: string;
  hsnCode?: string;
  itemCode?: string;
  stockDetails: {
    currentQuantity: number;
    minimumStock: number;
    maximumStock?: number;
    unit: string;
    manufacturingDate?: string;
    expirationDate?: string;
  };
  priceDetails: {
    costPrice: number;
    sellingPrice: number;
    mrp?: number;
    onlineDeliveryPrice?: number;
    onlineSellingPrice?: number;
    acSellingPrice?: number;
    nonAcSellingPrice?: number;
    taxPercentage?: number;
  };
  images: {
    primary?: string;
    additional?: string[];
  };
  status: 'draft' | 'published' | 'inactive';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: 'draft' | 'published' | 'inactive';
}

export interface CreateItemData {
  productName: string;
  description?: string;
  category: string;
  brand?: string;
  hsnCode?: string;
  itemCode?: string;
  stockDetails: {
    currentQuantity: number;
    minimumStock: number;
    maximumStock?: number;
    unit: string;
    manufacturingDate?: string;
    expirationDate?: string;
  };
  priceDetails: {
    costPrice: number;
    sellingPrice: number;
    mrp?: number;
    onlineDeliveryPrice?: number;
    onlineSellingPrice?: number;
    acSellingPrice?: number;
    nonAcSellingPrice?: number;
    taxPercentage?: number;
  };
  primaryImage?: File;
  additionalImages?: File[];
}

export interface UpdateItemData {
  productName?: string;
  description?: string;
  category?: string;
  brand?: string;
  stockDetails?: Partial<Item['stockDetails']>;
  priceDetails?: Partial<Item['priceDetails']>;
  primaryImage?: File;
  additionalImages?: File[];
}

export const itemService = {
  async getItems(filters: ItemFilters = {}): Promise<ApiResponse<{ items: Item[] }>> {
    return await apiClient.get<{ items: Item[] }>(ENDPOINTS.ITEMS.BASE, { params: filters });
  },

  async getItem(id: string): Promise<ApiResponse<{ item: Item }>> {
    return await apiClient.get<{ item: Item }>(ENDPOINTS.ITEMS.BY_ID(id));
  },

  async createItem(data: CreateItemData): Promise<ApiResponse<{ item: Item }>> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('productName', data.productName);
    if (data.description) formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.brand) formData.append('brand', data.brand);
    if (data.hsnCode) formData.append('hsnCode', data.hsnCode);
    if (data.itemCode) formData.append('itemCode', data.itemCode);
    
    // Add complex objects as JSON strings
    formData.append('stockDetails', JSON.stringify(data.stockDetails));
    formData.append('priceDetails', JSON.stringify(data.priceDetails));
    
    // Add files
    if (data.primaryImage) {
      formData.append('primaryImage', data.primaryImage);
    }
    if (data.additionalImages) {
      data.additionalImages.forEach((file, index) => {
        formData.append(`additionalImages`, file);
      });
    }

    return await apiClient.upload<{ item: Item }>(ENDPOINTS.ITEMS.BASE, formData);
  },

  async updateItem(id: string, data: UpdateItemData): Promise<ApiResponse<{ item: Item }>> {
    const formData = new FormData();
    
    // Add text fields
    if (data.productName) formData.append('productName', data.productName);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.brand) formData.append('brand', data.brand);
    
    // Add complex objects as JSON strings
    if (data.stockDetails) formData.append('stockDetails', JSON.stringify(data.stockDetails));
    if (data.priceDetails) formData.append('priceDetails', JSON.stringify(data.priceDetails));
    
    // Add files
    if (data.primaryImage) {
      formData.append('primaryImage', data.primaryImage);
    }
    if (data.additionalImages) {
      data.additionalImages.forEach((file) => {
        formData.append(`additionalImages`, file);
      });
    }

    return await apiClient.upload<{ item: Item }>(ENDPOINTS.ITEMS.BY_ID(id), formData);
  },

  async deleteItem(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.ITEMS.BY_ID(id));
  },
};