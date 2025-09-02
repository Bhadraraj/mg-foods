// src/hooks/useTokens.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  tokenService, 
  TokenOrder, 
  TokenFilters, 
  CreateTokenData, 
  UpdateTokenData, 
  UpdateTokenPaymentData 
} from '../services/api/token';
import { useApiQuery, useApiMutation } from './useApi';

interface UseTokensOptions extends TokenFilters {
  autoFetch?: boolean;
}

export const useTokens = (options: UseTokensOptions = {}) => {
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;
  const fetchOptionsRef = useRef(fetchOptions);
  
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

  const {
    data: tokensData,
    loading,
    error,
    execute: fetchTokens,
  } = useApiQuery<{ data: TokenOrder[]; pagination: any }>({
    showSuccessToast: false,
  });

  const {
    data: statsData,
    loading: statsLoading,
    execute: fetchStats,
  } = useApiQuery({
    showSuccessToast: false,
  });

  const {
    execute: createTokenMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Token order created successfully',
    onSuccess: () => {
      fetchTokensData();
    //   fetchTokenStats();
    },
  });

  const {
    execute: updateTokenMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Token order updated successfully',
    onSuccess: () => {
      fetchTokensData();
    //   fetchTokenStats();
    },
  });

  const {
    execute: updatePaymentMutation,
    loading: updatePaymentLoading,
  } = useApiMutation({
    successMessage: 'Payment status updated successfully',
    onSuccess: () => {
      fetchTokensData();
    //   fetchTokenStats();
    },
  });

  const {
    execute: deleteTokenMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Token order deleted successfully',
    onSuccess: () => {
      fetchTokensData();
    //   fetchTokenStats();
    },
  });

  const {
    execute: cancelTokenMutation,
    loading: cancelLoading,
  } = useApiMutation({
    successMessage: 'Token order cancelled successfully',
    onSuccess: () => {
      fetchTokensData();
    //   fetchTokenStats();
    },
  });

  const fetchTokensData = useCallback(async (customOptions?: Partial<UseTokensOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.current, 
      limit: pagination.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const
    };
    
    try {
      const response = await fetchTokens(() => tokenService.getTokens(params));
      
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          setPagination(response.pagination || {
            current: 1,
            pages: 1,
            total: response.data.length,
            limit: pagination.limit
          });
        } else if (response.data && Array.isArray(response.data.data)) {
          setPagination(response.data.pagination || {
            current: 1,
            pages: 1,
            total: response.data.data.length,
            limit: pagination.limit
          });
        }
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }, [fetchTokens, pagination.current, pagination.limit]);

//   const fetchTokenStats = useCallback(async () => {
//     try {
//       await fetchStats(() => tokenService.getTokenStats());
//     } catch (error) {
//       console.error('Error fetching token stats:', error);
//     }
//   }, [fetchStats]);

 const createToken = useCallback(async (data: CreateTokenData): Promise<void> => {
  // Generate unique request ID to prevent duplicates
  const requestId = `create-token-${Date.now()}-${Math.random()}`;
  
  await createTokenMutation(() => {
    console.log(`Creating token with ID: ${requestId}`);
    return tokenService.createToken(data);
  });
}, [createTokenMutation]);
  const updateToken = useCallback(async (id: string, data: UpdateTokenData): Promise<void> => {
    await updateTokenMutation(() => tokenService.updateToken(id, data));
  }, [updateTokenMutation]);

  const updateTokenPayment = useCallback(async (id: string, data: UpdateTokenPaymentData): Promise<void> => {
    await updatePaymentMutation(() => tokenService.updateTokenPayment(id, data));
  }, [updatePaymentMutation]);

  const deleteToken = useCallback(async (id: string): Promise<void> => {
    await deleteTokenMutation(() => tokenService.deleteToken(id));
  }, [deleteTokenMutation]);

  const cancelToken = useCallback(async (id: string): Promise<void> => {
    await cancelTokenMutation(() => tokenService.cancelToken(id));
  }, [cancelTokenMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, current: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchTokensData();
    //   fetchTokenStats();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (autoFetch && (pagination.current !== 1 || pagination.limit !== 20)) {
      fetchTokensData();
    }
  }, [pagination.current, pagination.limit, autoFetch, fetchTokensData]);

  // Extract tokens from the response data structure
  const getTokensFromData = () => {
    if (!tokensData) return [];
    
    if (Array.isArray(tokensData)) {
      return tokensData;
    }
    
    if (tokensData.data && Array.isArray(tokensData.data)) {
      return tokensData.data;
    }
    
    if (tokensData.data && tokensData.data.data && Array.isArray(tokensData.data.data)) {
      return tokensData.data.data;
    }
    
    return [];
  };

  const getStatsFromData = () => {
    if (!statsData) return null;
    
    if (statsData.data) {
      return statsData.data;
    }
    
    return statsData;
  };

  return {
    tokens: getTokensFromData(),
    stats: getStatsFromData(),
    loading,
    error,
    statsLoading,
    pagination,
    fetchTokens: fetchTokensData,
    // fetchTokenStats,
    createToken,
    updateToken,
    updateTokenPayment,
    deleteToken,
    cancelToken,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    updatePaymentLoading,
    deleteLoading,
    cancelLoading,
  };
};