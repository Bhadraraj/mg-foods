import { useState, useEffect, useCallback } from 'react';
import { User, NewUserFormData, ApiResponse } from '../components/types/index';
import { userService } from '../services/userService';

interface UseUsersOptions {
  page?: number;
  limit?: number;
  role?: string;
  status?: boolean;
  store?: string;
  search?: string;
  autoFetch?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const fetchUsers = useCallback(async (customOptions?: Partial<UseUsersOptions>) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...fetchOptions, ...customOptions };
      const response = await userService.getUsers(params);
      
      if (response.success && response.data) {
        // Transform backend data to match frontend expectations
        const transformedUsers = response.data.users.map((user, index) => ({
          ...user,
          no: user._id || `${index + 1}`,
          status: user.isActive,
          createdBy: user.createdBy || 'System',
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }));
        
        setUsers(transformedUsers);
        
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchOptions]);

  const createUser = useCallback(async (userData: NewUserFormData): Promise<void> => {
    setError(null);
    
    try {
      const response = await userService.createUser(userData);
      
      if (response.success) {
        await fetchUsers(); // Refresh the list
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: string, userData: Partial<NewUserFormData>): Promise<void> => {
    setError(null);
    
    try {
      const response = await userService.updateUser(id, userData);
      
      if (response.success) {
        await fetchUsers(); // Refresh the list
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const toggleUserStatus = useCallback(async (id: string): Promise<void> => {
    setError(null);
    
    try {
      const response = await userService.toggleUserStatus(id);
      
      if (response.success) {
        // Optimistically update the user in the current list
        setUsers(prev => prev.map(user => 
          user.no === id || user._id === id
            ? { ...user, status: !user.status, isActive: !user.isActive }
            : user
        ));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle user status';
      setError(errorMessage);
      // Revert optimistic update by refetching
      await fetchUsers();
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setError(null);
    
    try {
      const response = await userService.deleteUser(id);
      
      if (response.success) {
        await fetchUsers(); // Refresh the list
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [fetchUsers, autoFetch]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  };
};
