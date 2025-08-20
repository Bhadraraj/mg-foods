import { useState, useEffect, useCallback } from 'react';
import { vendorService, Vendor, VendorFilters, CreateVendorData, UpdateVendorData } from '../services/api/vendor';
import { useApiQuery, useApiMutation } from './useApi';

interface UseVendorsOptions extends VendorFilters {
  autoFetch?: boolean;
}

export const useVendors = (options: UseVendorsOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: vendorsData,
    loading,
    error,
    execute: fetchVendors,
  } = useApiQuery<{ vendors: Vendor[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createVendorMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Vendor created successfully',
    onSuccess: () => fetchVendorsData(),
  });

  const {
    execute: updateVendorMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Vendor updated successfully',
    onSuccess: () => fetchVendorsData(),
  });

  const {
    execute: deleteVendorMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Vendor deleted successfully',
    onSuccess: () => fetchVendorsData(),
  });

  const fetchVendorsData = useCallback(async (customOptions?: Partial<UseVendorsOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchVendors(() => vendorService.getVendors(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchVendors, pagination.page, pagination.limit]);

  const createVendor = useCallback(async (data: CreateVendorData): Promise<void> => {
    await createVendorMutation(() => vendorService.createVendor(data));
  }, [createVendorMutation]);

  const updateVendor = useCallback(async (id: string, data: UpdateVendorData): Promise<void> => {
    await updateVendorMutation(() => vendorService.updateVendor(id, data));
  }, [updateVendorMutation]);

  const deleteVendor = useCallback(async (id: string): Promise<void> => {
    await deleteVendorMutation(() => vendorService.deleteVendor(id));
  }, [deleteVendorMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchVendorsData();
    }
  }, [fetchVendorsData, autoFetch, pagination.page, pagination.limit]);

  return {
    vendors: vendorsData?.vendors || [],
    loading,
    error,
    pagination,
    fetchVendors: fetchVendorsData,
    createVendor,
    updateVendor,
    deleteVendor,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
  };
};