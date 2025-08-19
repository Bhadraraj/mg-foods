// hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleError = useCallback((err: any) => {
    console.error('API Error:', err);

    // Handle authentication errors
    if (err.status === 401 || err.message?.includes('unauthorized') || err.message?.includes('token')) {
      logout();
      setError('Session expired. Please log in again.');
      return;
    }

    // Handle network errors
    if (err.name === 'TypeError' && err.message?.includes('fetch')) {
      setError('Network error. Please check your connection and try again.');
      return;
    }

    // Handle validation errors
    if (err.status === 400) {
      setError(err.message || 'Invalid data provided. Please check your input.');
      return;
    }

    // Handle permission errors
    if (err.status === 403) {
      setError('You do not have permission to perform this action.');
      return;
    }

    // Handle not found errors
    if (err.status === 404) {
      setError('Resource not found.');
      return;
    }

    // Handle server errors
    if (err.status >= 500) {
      setError('Server error. Please try again later.');
      return;
    }

    // Default error handling
    setError(err.message || 'An unexpected error occurred. Please try again.');
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};