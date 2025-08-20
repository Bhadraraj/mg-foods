import { useState, useCallback } from 'react';
import { ApiError } from '../services/api/base';
import { useToast } from '../contexts/ToastContext';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const {
    showSuccessToast: enableSuccessToast = true,
    showErrorToast: enableErrorToast = true,
    successMessage = 'Operation completed successfully',
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      setData(response.data || response);
      
      if (enableSuccessToast && response.success !== false) {
        showSuccessToast('Success', successMessage);
      }
      
      if (onSuccess) {
        onSuccess(response.data || response);
      }
      
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      
      if (enableErrorToast) {
        showErrorToast(
          'Error',
          apiError.message || 'An unexpected error occurred'
        );
      }
      
      if (onError) {
        onError(apiError);
      }
      
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [enableSuccessToast, enableErrorToast, successMessage, onSuccess, onError, showSuccessToast, showErrorToast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Specialized hooks for common operations
export const useApiMutation = <T = any>(options: UseApiOptions = {}) => {
  return useApi<T>({
    showSuccessToast: true,
    showErrorToast: true,
    ...options,
  });
};

export const useApiQuery = <T = any>(options: UseApiOptions = {}) => {
  return useApi<T>({
    showSuccessToast: false,
    showErrorToast: true,
    ...options,
  });
};