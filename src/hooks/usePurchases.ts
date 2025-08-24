import { useState, useEffect, useCallback, useRef } from 'react';
import { purchaseService, Purchase, PurchaseFilters, CreatePurchaseData, UpdatePurchaseStatusData, StockEntryData } from '../services/api/purchase';
import { useApiQuery, useApiMutation } from './useApi';

interface UsePurchasesOptions extends PurchaseFilters {
  autoFetch?: boolean;
}

export const usePurchases = (options: UsePurchasesOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    current: 1,
  });

  const { autoFetch = true, ...fetchOptions } = options;
  const fetchRef = useRef<boolean>(false);
  const lastFetchParams = useRef<string>('');

  const {
    data: purchasesResponse,
    loading,
    error,
    execute: fetchPurchases,
  } = useApiQuery<{
    success: boolean;
    data: Purchase[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }>({
    showSuccessToast: false,
  });

  const {
    execute: createPurchaseMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Purchase created successfully',
    onSuccess: () => fetchPurchasesData(),
  });

  const {
    execute: updateStatusMutation,
    loading: updateStatusLoading,
  } = useApiMutation({
    successMessage: 'Purchase status updated successfully',
    onSuccess: () => fetchPurchasesData(),
  });

  const {
    execute: completeStockEntryMutation,
    loading: stockEntryLoading,
  } = useApiMutation({
    successMessage: 'Stock entry completed successfully',
    onSuccess: () => fetchPurchasesData(),
  });

  const {
    execute: deletePurchaseMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Purchase deleted successfully',
    onSuccess: () => fetchPurchasesData(),
  });

  const fetchPurchasesData = useCallback(async (customOptions?: Partial<UsePurchasesOptions>) => {
    const params = { 
      ...fetchOptions, 
      ...customOptions, 
      page: pagination.page, 
      limit: pagination.limit 
    };
    
    const paramsKey = JSON.stringify(params);
    
    // Prevent duplicate requests with same parameters
    if (fetchRef.current || lastFetchParams.current === paramsKey) {
      return;
    }
    
    fetchRef.current = true;
    lastFetchParams.current = paramsKey;

    try {
      const response = await fetchPurchases(() => purchaseService.getPurchases(params));
      
      // Debug log to see the actual response structure
      console.log('fetchPurchases response:', response);
      
      // Update pagination from response - handle different response structures
      let paginationData = null;
      if (response?.pagination) {
        paginationData = response.pagination;
      } else if (response?.data?.pagination) {
        paginationData = response.data.pagination;
      }

      if (paginationData) {
        setPagination(prev => ({
          ...prev,
          ...paginationData,
          page: paginationData.current || paginationData.page || prev.page,
        }));
      }
    } finally {
      fetchRef.current = false;
    }
  }, [fetchOptions, fetchPurchases, pagination.page, pagination.limit]);

  const createPurchase = useCallback(async (data: CreatePurchaseData): Promise<void> => {
    await createPurchaseMutation(() => purchaseService.createPurchase(data));
  }, [createPurchaseMutation]);

  const updatePurchaseStatus = useCallback(async (id: string, data: UpdatePurchaseStatusData): Promise<void> => {
    await updateStatusMutation(() => purchaseService.updatePurchaseStatus(id, data));
  }, [updateStatusMutation]);

  const completePurchase = useCallback(async (id: string): Promise<void> => {
    await updateStatusMutation(() => purchaseService.completePurchase(id));
  }, [updateStatusMutation]);

  const completeStockEntry = useCallback(async (id: string, data: StockEntryData): Promise<void> => {
    await completeStockEntryMutation(() => purchaseService.completeStockEntry(id, data));
  }, [completeStockEntryMutation]);

  const deletePurchase = useCallback(async (id: string): Promise<void> => {
    await deletePurchaseMutation(() => purchaseService.deletePurchase(id));
  }, [deletePurchaseMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch && !fetchRef.current) {
      fetchPurchasesData();
    }
  }, [fetchPurchasesData, autoFetch, pagination.page, pagination.limit]);

  // Extract purchases array from response - handle multiple possible response structures
  let purchases = [];
  
  if (purchasesResponse) {
    console.log('purchasesResponse structure:', purchasesResponse);
    
    // Try different possible response structures
    if (Array.isArray(purchasesResponse)) {
      purchases = purchasesResponse;
    } else if (purchasesResponse.data && Array.isArray(purchasesResponse.data)) {
      purchases = purchasesResponse.data;
    } else if (purchasesResponse.success && purchasesResponse.data && Array.isArray(purchasesResponse.data)) {
      purchases = purchasesResponse.data;
    }
  }

  console.log('Final purchases array:', purchases);

  return {
    purchases,
    loading,
    error,
    pagination,
    fetchPurchases: fetchPurchasesData,
    createPurchase,
    updatePurchaseStatus,
    completePurchase,
    completeStockEntry,
    deletePurchase,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateStatusLoading,
    stockEntryLoading,
    deleteLoading,
  };
};