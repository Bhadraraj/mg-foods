    
  
// Category Types
export interface Category {
  _id: string;
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  user: {
    _id: string;
    name: string;
    email: string;
    id: string;
  };
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AssignItemsData {
  itemIds: string[];
}

// Item Types
export interface Item {
  _id: string;
  id: string;
  productName: string;
  description?: string;
  category: string | {
    _id: string;
    name: string;
    id: string;
  } | null;
  subCategory?: {
    _id: string;
    name: string;
    description: string;
    id: string;
  };
  brandName?: string;
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
    sellingPrice: number;
    purchasePrice?: number;
    mrp?: number;
    onlineDeliveryPrice?: number;
    onlineSellingPrice?: number;
    acSellingPrice?: number;
    nonAcSellingPrice?: number;
    taxPercentage?: number;
    discount?: number;
  };
  codeDetails?: {
    qrCode?: string;
  };
  images: {
    primaryImage?: {
      uploadedAt: string;
    };
    additionalImages: any[];
  };
  imageUrls: {
    primaryImage: string | null;
    additionalImages: string[];
  };
  status: string;
  vendorName?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateItemData {
  productName: string;
  description?: string;
  category?: string;
  brandName?: string;
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
    sellingPrice: number;
    purchasePrice?: number;
    mrp?: number;
    onlineDeliveryPrice?: number;
    onlineSellingPrice?: number;
    acSellingPrice?: number;
    nonAcSellingPrice?: number;
    taxPercentage?: number;
    discount?: number;
  };
  primaryImage?: File;
  additionalImages?: File[];
  vendorName?: string;
}

export interface UpdateItemData {
  productName?: string;
  description?: string;
  category?: string;
  brandName?: string;
  stockDetails?: Partial<Item['stockDetails']>;
  priceDetails?: Partial<Item['priceDetails']>;
  primaryImage?: File;
  additionalImages?: File[];
  status?: string;
  vendorName?: string;
}
 
export interface SearchParams {
  search?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StatusParams {
  status?: 'active' | 'inactive';
}

// Error Types
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Response Wrapper for Lists
export interface ListResponse<T> {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: T[];
}

// Response Wrapper for Single Items
export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Generic Success Response
export interface SuccessResponse {
  success: boolean;
  message?: string;
}