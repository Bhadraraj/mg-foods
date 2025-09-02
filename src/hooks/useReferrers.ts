import { useState, useCallback, useEffect, useRef } from 'react';
import { referrerService } from '../services/api';
import { Referrer } from '../types/party';
import { useApiQuery, useApiMutation } from './useApi';

interface ReferrerFilters {
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseReferrersOptions extends ReferrerFilters {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export const useReferrers = (options: UseReferrersOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    autoFetch = true,
    ...fetchOptions
  } = options;

  const optionsRef = useRef(fetchOptions);
  
  useEffect(() => {
    optionsRef.current = fetchOptions;
  }, [JSON.stringify(fetchOptions)]);

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });

  const {
    data: referrersData,
    loading,
    error,
    execute: fetchReferrersQuery,
  } = useApiQuery<{ referrers: Referrer[] }>({
    showSuccessToast: false,
  });

  const fetchReferrersData = useCallback(async (customOptions?: Partial<UseReferrersOptions>) => {
    const params = {
      ...optionsRef.current,
      ...customOptions,
      page: pagination.page,
      limit: pagination.limit,
    };

    try {
      const response = await fetchReferrersQuery(() => referrerService.getReferrers(params));
      
      if (response?.pagination) {
        setPagination(response.pagination);
      }
      return response;
    } catch (err) {
      console.error('Error fetching referrers:', err);
      throw err;
    }
  }, [fetchReferrersQuery, pagination.page, pagination.limit]);

  // Create referrer mutation
  const {
    execute: createReferrerMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Referrer created successfully',
    onSuccess: () => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchReferrersData();
    },
  });

  // Update referrer mutation
  const {
    execute: updateReferrerMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Referrer updated successfully',
    onSuccess: () => fetchReferrersData(),
  });

  // Delete referrer mutation
  const {
    execute: deleteReferrerMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Referrer deleted successfully',
    onSuccess: () => fetchReferrersData(),
  });

  const createReferrer = useCallback(async (data: any): Promise<void> => {
    await createReferrerMutation(() => referrerService.createReferrer(data));
  }, [createReferrerMutation]);

  const updateReferrer = useCallback(async (id: string, data: any): Promise<void> => {
    await updateReferrerMutation(() => referrerService.updateReferrer(id, data));
  }, [updateReferrerMutation]);

  const deleteReferrer = useCallback(async (id: string): Promise<void> => {
    await deleteReferrerMutation(() => referrerService.deleteReferrer(id));
  }, [deleteReferrerMutation]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  // Handle search
  const handleSearch = useCallback((search: string) => {
    optionsRef.current = { ...optionsRef.current, search };
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchReferrersData();
  }, [fetchReferrersData]);

  // Fetch referrers with current pagination and filters
  const fetchReferrers = useCallback(() => {
    fetchReferrersData();
  }, [fetchReferrersData]);

  // Auto-fetch effect
  useEffect(() => {
    if (autoFetch) {
      fetchReferrersData();
    }
  }, [autoFetch, pagination.page, pagination.limit]);

  // Search effect
  useEffect(() => {
    if (fetchOptions.search !== undefined) {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchReferrersData();
    }
  }, [fetchOptions.search]);

  return {
    referrers: referrersData?.referrers || [],
    loading,
    error,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    fetchReferrers,
    createReferrer,
    updateReferrer,
    deleteReferrer,
    isCreating: createLoading,
    isUpdating: updateLoading,
    isDeleting: deleteLoading,
  };
};