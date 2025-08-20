import { useState, useEffect, useCallback } from 'react';
import { customerService, Customer, CustomerFilters, CreateCustomerData, UpdateCustomerData } from '../services/api/customer';
import { useApiQuery, useApiMutation } from './useApi';

interface UseCustomersOptions extends CustomerFilters {
  autoFetch?: boolean;
}

export const useCustomers = (options: UseCustomersOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: customersData,
    loading,
    error,
    execute: fetchCustomers,
  } = useApiQuery<{ customers: Customer[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createCustomerMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Customer created successfully',
    onSuccess: () => fetchCustomersData(),
  });

  const {
    execute: updateCustomerMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Customer updated successfully',
    onSuccess: () => fetchCustomersData(),
  });

  const {
    execute: deleteCustomerMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Customer deleted successfully',
    onSuccess: () => fetchCustomersData(),
  });

  const fetchCustomersData = useCallback(async (customOptions?: Partial<UseCustomersOptions>) => {
    const params = { ...fetchOptions, ...customOptions };
    const response = await fetchCustomers(() => customerService.getCustomers(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchCustomers]);

  const createCustomer = useCallback(async (data: CreateCustomerData): Promise<void> => {
    await createCustomerMutation(() => customerService.createCustomer(data));
  }, [createCustomerMutation]);

  const updateCustomer = useCallback(async (id: string, data: UpdateCustomerData): Promise<void> => {
    await updateCustomerMutation(() => customerService.updateCustomer(id, data));
  }, [updateCustomerMutation]);

  const deleteCustomer = useCallback(async (id: string): Promise<void> => {
    await deleteCustomerMutation(() => customerService.deleteCustomer(id));
  }, [deleteCustomerMutation]);

  useEffect(() => {
    if (autoFetch) {
      fetchCustomersData();
    }
  }, [fetchCustomersData, autoFetch]);

  return {
    customers: customersData?.customers || [],
    loading,
    error,
    pagination,
    fetchCustomers: fetchCustomersData,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createLoading,
    updateLoading,
    deleteLoading,
  };
};