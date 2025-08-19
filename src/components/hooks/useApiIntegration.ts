import { useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ApiError } from '../../services/api/base';

// Centralized API integration hook for consistent error handling and user feedback
export const useApiIntegration = () => {
  const { success, error: showError } = useToast();

  const handleApiSuccess = useCallback((message: string, data?: any) => {
    success('Success', message);
    return data;
  }, [success]);

  const handleApiError = useCallback((error: ApiError, customMessage?: string) => {
    const message = customMessage || error.message || 'An unexpected error occurred';
    showError('Error', message);
    
    // Log error for debugging
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error.status === 401) {
      // Token expired - handled by interceptor
      return;
    }
    
    if (error.status === 403) {
      showError('Access Denied', 'You do not have permission to perform this action');
      return;
    }
    
    if (error.status === 404) {
      showError('Not Found', 'The requested resource was not found');
      return;
    }
    
    if (error.status >= 500) {
      showError('Server Error', 'A server error occurred. Please try again later');
      return;
    }
    
    throw error;
  }, [showError]);

  const executeWithFeedback = useCallback(async <T>(
    apiCall: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    try {
      const result = await apiCall();
      if (successMessage) {
        handleApiSuccess(successMessage, result);
      }
      return result;
    } catch (error) {
      handleApiError(error as ApiError, errorMessage);
      throw error;
    }
  }, [handleApiSuccess, handleApiError]);

  return {
    handleApiSuccess,
    handleApiError,
    executeWithFeedback,
  };
};