
// useReferrerPoints.ts
import { useState, useEffect, useCallback, useRef } from 'react'; 
import { referrerPointService, ReferrerPoint, ReferrerSummary, ReferrerPointFilters, CreateReferrerPointData, UpdateReferrerPointData }  from '../services/api/referrerPoints';
import { useApiQuery, useApiMutation } from './useApi';

interface UseReferrerPointsOptions extends ReferrerPointFilters {
  autoFetch?: boolean;
}

export const useReferrerPoints = (options: UseReferrerPointsOptions = {}) => {
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;
  const fetchOptionsRef = useRef(fetchOptions);
  
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

  const {
    data: referrerPointsData,
    loading,
    error,
    execute: fetchReferrerPoints,
  } = useApiQuery<{ data: ReferrerPoint[]; pagination: any }>({
    showSuccessToast: false,
  });

  const {
    data: referrerSummaryData,
    loading: summaryLoading,
    execute: fetchReferrerSummary,
  } = useApiQuery<{ data: ReferrerSummary[]; pagination: any }>({
    showSuccessToast: false,
  });

  const {
    execute: createReferrerPointMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Referrer point transaction created successfully',
    onSuccess: () => {
      fetchReferrerPointsData();
      fetchReferrerSummaryData();
    },
  });

  const {
    execute: updateReferrerPointMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Referrer point transaction updated successfully',
    onSuccess: () => {
      fetchReferrerPointsData();
      fetchReferrerSummaryData();
    },
  });

  const {
    execute: deleteReferrerPointMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Referrer point transaction deleted successfully',
    onSuccess: () => {
      fetchReferrerPointsData();
      fetchReferrerSummaryData();
    },
  });

  const {
    execute: redeemPointsMutation,
    loading: redeemLoading,
  } = useApiMutation({
    successMessage: 'Points redeemed successfully',
    onSuccess: () => {
      fetchReferrerPointsData();
      fetchReferrerSummaryData();
    },
  });

  const fetchReferrerPointsData = useCallback(async (customOptions?: Partial<UseReferrerPointsOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.current, 
      limit: pagination.limit 
    };
    const response = await fetchReferrerPoints(() => referrerPointService.getReferrerPoints(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchReferrerPoints]);

  const fetchReferrerSummaryData = useCallback(async (customOptions?: Partial<UseReferrerPointsOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.current, 
      limit: pagination.limit 
    };
    await fetchReferrerSummary(() => referrerPointService.getReferrerPointsSummary(params));
  }, [fetchReferrerSummary]);

  const createReferrerPoint = useCallback(async (data: CreateReferrerPointData): Promise<void> => {
    await createReferrerPointMutation(() => referrerPointService.createReferrerPoint(data));
  }, [createReferrerPointMutation]);

  const updateReferrerPoint = useCallback(async (id: string, data: UpdateReferrerPointData): Promise<void> => {
    await updateReferrerPointMutation(() => referrerPointService.updateReferrerPoint(id, data));
  }, [updateReferrerPointMutation]);

  const deleteReferrerPoint = useCallback(async (id: string): Promise<void> => {
    await deleteReferrerPointMutation(() => referrerPointService.deleteReferrerPoint(id));
  }, [deleteReferrerPointMutation]);

  const redeemPoints = useCallback(async (referrerId: string, pointsToRedeem: number, description: string): Promise<void> => {
    await redeemPointsMutation(() => referrerPointService.redeemPoints({ referrerId, pointsToRedeem, description }));
  }, [redeemPointsMutation]);

  const getReferrerPointsByReferrer = useCallback(async (referrerId: string, filters: ReferrerPointFilters = {}) => {
    return await referrerPointService.getReferrerPointsByReferrer(referrerId, filters);
  }, []);

  const getReferrerBalance = useCallback(async (referrerId: string) => {
    return await referrerPointService.getReferrerBalance(referrerId);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, current: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchReferrerPointsData();
      fetchReferrerSummaryData();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (autoFetch && (pagination.current !== 1 || pagination.limit !== 10)) {
      fetchReferrerPointsData();
      fetchReferrerSummaryData();
    }
  }, [pagination.current, pagination.limit]);

  return {
    referrerPoints: referrerPointsData?.data || [],
    referrerSummary: referrerSummaryData?.data || [],
    loading,
    summaryLoading,
    error,
    pagination,
    fetchReferrerPoints: fetchReferrerPointsData,
    fetchReferrerSummary: fetchReferrerSummaryData,
    createReferrerPoint,
    updateReferrerPoint,
    deleteReferrerPoint,
    redeemPoints,
    getReferrerPointsByReferrer,
    getReferrerBalance,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
    redeemLoading,
  };
};