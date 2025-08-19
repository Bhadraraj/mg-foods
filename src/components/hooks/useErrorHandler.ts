import { useState, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ApiError } from '../../services/api/base';


export const useErrorHandler = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const { error: showErrorToast } = useToast();

  const handleError = useCallback((err: ApiError) => {
    console.error('API Error:', err);
    setError(err);

    // Handle authentication errors
    if (err.status === 401 || err.message?.includes('unauthorized') || err.message?.includes('token')) {
      showErrorToast('Session Expired', 'Please log in again.');
      return;
    }

    // Handle network errors
    if (err.code === 'NETWORK_ERROR') {
      showErrorToast('Network Error', 'Please check your connection and try again.');
      return;
    }

    // Handle validation errors
    if (err.status === 400) {
      showErrorToast('Validation Error', err.message || 'Invalid data provided. Please check your input.');
      return;
    }

    // Handle permission errors
    if (err.status === 403) {
      showErrorToast('Access Denied', 'You do not have permission to perform this action.');
      return;
    }

    // Handle not found errors
    if (err.status === 404) {
      showErrorToast('Not Found', 'The requested resource was not found.');
      return;
    }

    // Handle server errors
    if (err.status >= 500) {
      showErrorToast('Server Error', 'A server error occurred. Please try again later.');
      return;
    }

    // Default error handling
    showErrorToast('Error', err.message || 'An unexpected error occurred. Please try again.');
  }, [showErrorToast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};