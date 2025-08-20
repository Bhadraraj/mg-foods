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
  });

  const { autoFetch = true, ...fetchOptions } = options;
  const fetchRef = useRef<boolean>(false);
  const lastFetchParams = useRef<string>('');

  const {
    data: purchasesData,
    loading,
    error,
    execute: fetchPurchases,
  } = useApiQuery<{ purchases: Purchase[] }>({
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
      
      if (response?.pagination) {
        setPagination(response.pagination);
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

  return {
    purchases: purchasesData?.purchases || [],
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