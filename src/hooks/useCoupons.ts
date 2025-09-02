import { useState, useEffect, useCallback, useRef } from 'react';
import { couponService, Coupon, CouponFilters, CreateCouponData, UpdateCouponData } from '../services/api/coupon';
import { useApiQuery, useApiMutation } from './useApi';

interface UseCouponsOptions extends CouponFilters {
  autoFetch?: boolean;
}

export const useCoupons = (options: UseCouponsOptions = {}) => {
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
    data: couponsData,
    loading,
    error,
    execute: fetchCoupons,
  } = useApiQuery<{ data: Coupon[]; pagination: any }>({
    showSuccessToast: false,
  });

  const {
    execute: createCouponMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Coupon created successfully',
    onSuccess: () => fetchCouponsData(),
  });

  const {
    execute: updateCouponMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Coupon updated successfully',
    onSuccess: () => fetchCouponsData(),
  });

  const {
    execute: deleteCouponMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Coupon deleted successfully',
    onSuccess: () => fetchCouponsData(),
  });

  const {
    execute: toggleStatusMutation,
    loading: toggleLoading,
  } = useApiMutation({
    successMessage: 'Coupon status updated successfully',
    onSuccess: () => fetchCouponsData(),
  });

  const {
    execute: validateCouponMutation,
    loading: validateLoading,
  } = useApiMutation({
    showSuccessToast: false,
  });

  const fetchCouponsData = useCallback(async (customOptions?: Partial<UseCouponsOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.current, 
      limit: pagination.limit 
    };
    
    try {
      const response = await fetchCoupons(() => couponService.getCoupons(params));
      
      // Handle the API response structure properly
      if (response && response.success) {
        // If the response structure matches your JSON (direct data array)
        if (Array.isArray(response.data)) {
          setPagination(response.pagination || {
            current: 1,
            pages: 1,
            total: response.data.length,
            limit: pagination.limit
          });
        } else if (response.data && Array.isArray(response.data.data)) {
          // If the response has nested data structure
          setPagination(response.data.pagination || {
            current: 1,
            pages: 1,
            total: response.data.data.length,
            limit: pagination.limit
          });
        }
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  }, [fetchCoupons, pagination.current, pagination.limit]);

  const createCoupon = useCallback(async (data: CreateCouponData): Promise<void> => {
    await createCouponMutation(() => couponService.createCoupon(data));
  }, [createCouponMutation]);

  const updateCoupon = useCallback(async (id: string, data: UpdateCouponData): Promise<void> => {
    await updateCouponMutation(() => couponService.updateCoupon(id, data));
  }, [updateCouponMutation]);

  const deleteCoupon = useCallback(async (id: string): Promise<void> => {
    await deleteCouponMutation(() => couponService.deleteCoupon(id));
  }, [deleteCouponMutation]);

  const toggleCouponStatus = useCallback(async (id: string): Promise<void> => {
    await toggleStatusMutation(() => couponService.toggleCouponStatus(id));
  }, [toggleStatusMutation]);

  const validateCoupon = useCallback(async (code: string, orderAmount: number, customerId?: string) => {
    return await validateCouponMutation(() => couponService.validateCoupon({ code, orderAmount, customerId }));
  }, [validateCouponMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, current: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCouponsData();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (autoFetch && (pagination.current !== 1 || pagination.limit !== 10)) {
      fetchCouponsData();
    }
  }, [pagination.current, pagination.limit, autoFetch, fetchCouponsData]);

  // Extract coupons from the response data structure
  const getCouponsFromData = () => {
    if (!couponsData) return [];
    
    // Handle direct array response structure (like your JSON sample)
    if (Array.isArray(couponsData)) {
      return couponsData;
    }
    
    // Handle nested data structure
    if (couponsData.data && Array.isArray(couponsData.data)) {
      return couponsData.data;
    }
    
    // Handle deeply nested structure
    if (couponsData.data && couponsData.data.data && Array.isArray(couponsData.data.data)) {
      return couponsData.data.data;
    }
    
    return [];
  };

  return {
    coupons: getCouponsFromData(),
    loading,
    error,
    pagination,
    fetchCoupons: fetchCouponsData,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    validateCoupon,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
    toggleLoading,
    validateLoading,
  };
};