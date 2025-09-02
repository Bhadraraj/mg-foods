import { useState, useEffect, useCallback, useRef } from 'react';
import { offerService, Offer, OfferFilters, CreateOfferData, UpdateOfferData } from '../services/api/offers';
import { useApiQuery, useApiMutation } from './useApi';

interface UseOffersOptions extends OfferFilters {
  autoFetch?: boolean;
}

export const useOffers = (options: UseOffersOptions = {}) => {
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
    data: offersData,
    loading,
    error,
    execute: fetchOffers,
  } = useApiQuery<{ data: Offer[]; pagination: any }>({
    showSuccessToast: false,
  });

  const {
    execute: createOfferMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Offer created successfully',
    onSuccess: () => fetchOffersData(),
  });

  const {
    execute: updateOfferMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Offer updated successfully',
    onSuccess: () => fetchOffersData(),
  });

  const {
    execute: deleteOfferMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Offer deleted successfully',
    onSuccess: () => fetchOffersData(),
  });

  const {
    execute: toggleStatusMutation,
    loading: toggleLoading,
  } = useApiMutation({
    successMessage: 'Offer status updated successfully',
    onSuccess: () => fetchOffersData(),
  });

  const fetchOffersData = useCallback(async (customOptions?: Partial<UseOffersOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.current, 
      limit: pagination.limit 
    };
    
    try {
      const response = await fetchOffers(() => offerService.getOffers(params));
      
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
      console.error('Error fetching offers:', error);
    }
  }, [fetchOffers, pagination.current, pagination.limit]);

  const createOffer = useCallback(async (data: CreateOfferData): Promise<void> => {
    await createOfferMutation(() => offerService.createOffer(data));
  }, [createOfferMutation]);

  const updateOffer = useCallback(async (id: string, data: UpdateOfferData): Promise<void> => {
    await updateOfferMutation(() => offerService.updateOffer(id, data));
  }, [updateOfferMutation]);

  const deleteOffer = useCallback(async (id: string): Promise<void> => {
    await deleteOfferMutation(() => offerService.deleteOffer(id));
  }, [deleteOfferMutation]);

  const toggleOfferStatus = useCallback(async (id: string): Promise<void> => {
    await toggleStatusMutation(() => offerService.toggleOfferStatus(id));
  }, [toggleStatusMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, current: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchOffersData();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (autoFetch && (pagination.current !== 1 || pagination.limit !== 10)) {
      fetchOffersData();
    }
  }, [pagination.current, pagination.limit, autoFetch, fetchOffersData]);

  // Extract offers from the response data structure
  const getOffersFromData = () => {
    if (!offersData) return [];
    
    // Handle direct array response structure (like your JSON sample)
    if (Array.isArray(offersData)) {
      return offersData;
    }
    
    // Handle nested data structure
    if (offersData.data && Array.isArray(offersData.data)) {
      return offersData.data;
    }
    
    // Handle deeply nested structure
    if (offersData.data && offersData.data.data && Array.isArray(offersData.data.data)) {
      return offersData.data.data;
    }
    
    return [];
  };

  return {
    offers: getOffersFromData(),
    loading,
    error,
    pagination,
    fetchOffers: fetchOffersData,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
    toggleLoading,
  };
};