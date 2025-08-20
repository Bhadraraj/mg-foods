import { useState, useCallback } from 'react';
import { useApiQuery, useApiMutation } from './useApi';
import { referrerService } from '../services/api';
import { Referrer } from '../types/party';
import { ApiResponse } from '../types';

interface UseReferrersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

export const useReferrers = (options: UseReferrersOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSearch = '',
  } = options;

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    search: initialSearch,
    status: true,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // Fetch referrers with pagination
  const { data, isLoading, error, refetch } = useApiQuery<ApiResponse<{ referrers: Referrer[] }>>(
    ['referrers', pagination.page, pagination.limit, filters],
    () => referrerService.getReferrers({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    {
      onSuccess: (data) => {
        if (data.pagination) {
          setPagination({
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            pages: data.pagination.pages,
          });
        }
      },
    }
  );

  // Create referrer mutation
  const createReferrerMutation = useApiMutation(
    (data: any) => referrerService.createReferrer(data),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  // Update referrer mutation
  const updateReferrerMutation = useApiMutation(
    ({ id, data }: { id: string; data: any }) => referrerService.updateReferrer(id, data),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  // Delete referrer mutation
  const deleteReferrerMutation = useApiMutation(
    (id: string) => referrerService.deleteReferrer(id),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

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
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Fetch referrers with current pagination and filters
  const fetchReferrers = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    referrers: data?.data?.referrers || [],
    loading: isLoading,
    error,
    pagination,
    filters,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    fetchReferrers,
    createReferrer: createReferrerMutation.mutate,
    updateReferrer: updateReferrerMutation.mutate,
    deleteReferrer: deleteReferrerMutation.mutate,
    isCreating: createReferrerMutation.isLoading,
    isUpdating: updateReferrerMutation.isLoading,
    isDeleting: deleteReferrerMutation.isLoading,
  };
};