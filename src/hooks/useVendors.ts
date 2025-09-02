import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchOptionsRef = useRef(fetchOptions);
  
  // Update ref when fetchOptions change
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

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

  // Remove pagination from dependencies to avoid infinite loop
  const fetchVendorsData = useCallback(async (customOptions?: Partial<UseVendorsOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.page, 
      limit: pagination.limit 
    };
    const response = await fetchVendors(() => vendorService.getVendors(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchVendors]); // Only depend on fetchVendors

  const createVendor = useCallback(async (data: CreateVendorData): Promise<void> => {
    await createVendorMutation(() => vendorService.createVendor(data));
  }, [createVendorMutation]);

  const updateVendor = useCallback(async (id: string, data: UpdateVendorData): Promise<void> => {
    await updateVendorMutation(() => vendorService.updateVendor(id, data));
  }, [updateVendorMutation]);

  const deleteVendor = useCallback(async (id: string): Promise<void> => {
    await deleteVendorMutation(() => vendorService.deleteVendor(id, data));
  }, [deleteVendorMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Separate effect for initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchVendorsData();
    }
  }, [autoFetch]); // Only run on mount when autoFetch is true

  // Separate effect for pagination changes
  useEffect(() => {
    if (autoFetch && (pagination.page !== 1 || pagination.limit !== 20)) {
      fetchVendorsData();
    }
  }, [pagination.page, pagination.limit]); // Only trigger when pagination actually changes

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