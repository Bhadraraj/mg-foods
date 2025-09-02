import { useState, useEffect, useCallback } from 'react';
import { 
  kotService, 
  Kot, 
  KotFilters, 
  UpdateKotData, 
  UpdateKotItemStatusData,
  KotStats 
} from '../services/api/kot';
import { useApiQuery, useApiMutation } from './useApi'; 
interface UseKotsOptions extends KotFilters {
  autoFetch?: boolean;
}

export const useKots = (options: UseKotsOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: kotsData,
    loading,
    error,
    execute: fetchKots,
  } = useApiQuery<{ kots: Kot[] }>({
    showSuccessToast: false,
  });

  const {
    execute: updateKotMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'KOT updated successfully',
    onSuccess: () => fetchKotsData(),
  });

  const {
    execute: updateKotItemStatusMutation,
    loading: updateItemStatusLoading,
  } = useApiMutation({
    successMessage: 'KOT item status updated successfully',
    onSuccess: () => fetchKotsData(),
  });

  const {
    execute: deleteKotMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'KOT deleted successfully',
    onSuccess: () => fetchKotsData(),
  });

  const fetchKotsData = useCallback(async (customOptions?: Partial<UseKotsOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchKots(() => kotService.getKots(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchKots]); // Removed pagination dependencies to avoid loops

  const updateKot = useCallback(async (id: string, data: UpdateKotData): Promise<void> => {
    await updateKotMutation(() => kotService.updateKot(id, data));
  }, [updateKotMutation]);

  const updateKotItemStatus = useCallback(async (
    kotId: string, 
    kotItemId: string, 
    data: UpdateKotItemStatusData
  ): Promise<void> => {
    await updateKotItemStatusMutation(() => kotService.updateKotItemStatus(kotId, kotItemId, data));
  }, [updateKotItemStatusMutation]);

  const deleteKot = useCallback(async (id: string): Promise<void> => {
    await deleteKotMutation(() => kotService.deleteKot(id));
  }, [deleteKotMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchKotsData();
    }
  }, [autoFetch]); // Removed fetchKotsData dependency to prevent loops

  // Separate effect for pagination changes
  useEffect(() => {
    if (autoFetch && (pagination.page !== 1 || pagination.limit !== 20)) {
      fetchKotsData();
    }
  }, [pagination.page, pagination.limit]);

  return {
    kots: kotsData?.kots || [],
    loading,
    error,
    pagination,
    fetchKots: fetchKotsData,
    updateKot,
    updateKotItemStatus,
    deleteKot,
    handlePageChange,
    handleItemsPerPageChange,
    updateLoading,
    updateItemStatusLoading,
    deleteLoading,
  };
};

export const useKot = (id: string) => {
  const {
    data: kot,
    loading,
    error,
    execute: fetchKot,
  } = useApiQuery<Kot>({
    showSuccessToast: false,
  });

  const {
    execute: updateKotMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'KOT updated successfully',
    onSuccess: () => fetchKotData(),
  });

  const {
    execute: updateKotItemStatusMutation,
    loading: updateItemStatusLoading,
  } = useApiMutation({
    successMessage: 'KOT item status updated successfully',
    onSuccess: () => fetchKotData(),
  });

  const fetchKotData = useCallback(async () => {
    if (id) {
      await fetchKot(() => kotService.getKot(id));
    }
  }, [id, fetchKot]);

  const updateKot = useCallback(async (data: UpdateKotData): Promise<void> => {
    if (id) {
      await updateKotMutation(() => kotService.updateKot(id, data));
    }
  }, [id, updateKotMutation]);

  const updateKotItemStatus = useCallback(async (
    kotItemId: string, 
    data: UpdateKotItemStatusData
  ): Promise<void> => {
    if (id) {
      await updateKotItemStatusMutation(() => kotService.updateKotItemStatus(id, kotItemId, data));
    }
  }, [id, updateKotItemStatusMutation]);

  useEffect(() => {
    if (id) {
      fetchKotData();
    }
  }, [id]); 

  return {
    kot,
    loading,
    error,
    fetchKot: fetchKotData,
    updateKot,
    updateKotItemStatus,
    updateLoading,
    updateItemStatusLoading,
  };
};

export const useKotStats = () => {
  const {
    data: stats,
    loading,
    error,
    execute: fetchStats,
  } = useApiQuery<KotStats>({
    showSuccessToast: false,
  });

  const fetchKotStats = useCallback(async () => {
    await fetchStats(() => kotService.getKotStats());
  }, [fetchStats]);

  useEffect(() => {
    fetchKotStats();
  }, []); // Remove fetchKotStats dependency to prevent loops

  return {
    stats,
    loading,
    error,
    refetch: fetchKotStats,
  };
};