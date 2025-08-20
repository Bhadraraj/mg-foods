import { useState, useEffect, useCallback } from 'react';
import { User, NewUserFormData, ApiResponse } from '../types';
import { userService, UserFilters } from '../services/api/user';
import { useApiQuery, useApiMutation } from './useApi';

interface UseUsersOptions extends UserFilters {
  autoFetch?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: usersData,
    loading,
    error,
    execute: fetchUsers,
  } = useApiQuery<{ users: User[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createUserMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'User created successfully',
    onSuccess: () => fetchUsersData(),
  });

  const {
    execute: updateUserMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'User updated successfully',
    onSuccess: () => fetchUsersData(),
  });

  const {
    execute: deleteUserMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'User deleted successfully',
    onSuccess: () => fetchUsersData(),
  });

  const {
    execute: toggleStatusMutation,
    loading: toggleLoading,
  } = useApiMutation({
    successMessage: 'User status updated successfully',
    onSuccess: () => fetchUsersData(),
  });

  const fetchUsersData = useCallback(async (customOptions?: Partial<UseUsersOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchUsers(() => userService.getUsers(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchUsers, pagination.page, pagination.limit]);

  const createUser = useCallback(async (userData: NewUserFormData): Promise<void> => {
    await createUserMutation(() => userService.createUser(userData));
  }, [createUserMutation]);

  const updateUser = useCallback(async (id: string, userData: Partial<NewUserFormData>): Promise<void> => {
    await updateUserMutation(() => userService.updateUser(id, userData));
  }, [updateUserMutation]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    await deleteUserMutation(() => userService.deleteUser(id));
  }, [deleteUserMutation]);

  const toggleUserStatus = useCallback(async (id: string): Promise<void> => {
    await toggleStatusMutation(() => userService.toggleUserStatus(id));
  }, [toggleStatusMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchUsersData();
    }
  }, [fetchUsersData, autoFetch, pagination.page, pagination.limit]);

  return {
    users: usersData?.users || [],
    loading,
    error,
    pagination,
    fetchUsers: fetchUsersData,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
    toggleLoading,
  };
};