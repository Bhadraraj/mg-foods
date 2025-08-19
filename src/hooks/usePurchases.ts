import { useState, useEffect, useCallback } from 'react';
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
    const params = { ...fetchOptions, ...customOptions };
    const response = await fetchPurchases(() => purchaseService.getPurchases(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchPurchases]);

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

  useEffect(() => {
    if (autoFetch) {
      fetchPurchasesData();
    }
  }, [fetchPurchasesData, autoFetch]);

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
    createLoading,
    updateStatusLoading,
    stockEntryLoading,
    deleteLoading,
  };
};