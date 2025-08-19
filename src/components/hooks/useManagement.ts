// hooks/useManagement.ts
import { useState, useEffect } from 'react';
import { userApi, roleApi, labourApi } from '../services/userService';
import { User, Role, Labour, NewUserFormData, AddRoleFormData, AddLabourFormData } from '../types';

// Toast utility
const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message),
};

// User Management Hook
export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAll(params);
      setUsers(response.data.users || response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: NewUserFormData) => {
    try {
      setLoading(true);
      const response = await userApi.create({
        name: userData.name,
        email: userData.email,
        password: userData.password || '',
        mobile: userData.mobile,
        role: userData.role,
        store: userData.store,
        billType: userData.billType,
      });
      
      toast.success('User created successfully');
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      toast.error('Failed to create user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<NewUserFormData>) => {
    try {
      setLoading(true);
      await userApi.update(userId, {
        name: userData.name,
        mobile: userData.mobile,
        store: userData.store,
        role: userData.role,
        billType: userData.billType,
      });
      
      toast.success('User updated successfully');
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      toast.error('Failed to update user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await userApi.delete(userId);
      toast.success('User deleted successfully');
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      toast.error('Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      await userApi.toggleStatus(userId);
      toast.success('User status updated successfully');
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      toast.error('Failed to update user status');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
};

// Role Management Hook
export const useRoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roleApi.getAll(params);
      setRoles(response.data.roles || response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: AddRoleFormData) => {
    try {
      setLoading(true);
      
      // Convert permissions object to array
      const permissions: string[] = [];
      Object.entries(roleData.permissions).forEach(([key, value]) => {
        if (value) {
          permissions.push(key);
        }
      });
      
      // Add dashboard features to permissions
      Object.entries(roleData.dashboardFeatures).forEach(([key, value]) => {
        if (value) {
          permissions.push(`dashboard.${key}`);
        }
      });

      await roleApi.create({
        roleName: roleData.roleName,
        permissions,
      });
      
      toast.success('Role created successfully');
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role');
      toast.error('Failed to create role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (roleId: string, roleData: AddRoleFormData) => {
    try {
      setLoading(true);
      
      // Convert permissions object to array
      const permissions: string[] = [];
      Object.entries(roleData.permissions).forEach(([key, value]) => {
        if (value) {
          permissions.push(key);
        }
      });
      
      // Add dashboard features to permissions
      Object.entries(roleData.dashboardFeatures).forEach(([key, value]) => {
        if (value) {
          permissions.push(`dashboard.${key}`);
        }
      });

      await roleApi.update(roleId, {
        roleName: roleData.roleName,
        permissions,
        isActive: true,
      });
      
      toast.success('Role updated successfully');
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
      toast.error('Failed to update role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      setLoading(true);
      await roleApi.delete(roleId);
      toast.success('Role deleted successfully');
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
      toast.error('Failed to delete role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleStatus = async (roleId: string) => {
    try {
      await roleApi.toggleStatus(roleId);
      toast.success('Role status updated successfully');
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      toast.error('Failed to update role status');
      return false;
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    toggleRoleStatus,
  };
};

// Labour Management Hook
export const useLabourManagement = () => {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLabours = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await labourApi.getAll(params);
      setLabours(response.data.labours || response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch labour records');
      toast.error('Failed to fetch labour records');
    } finally {
      setLoading(false);
    }
  };

  const createLabour = async (labourData: AddLabourFormData) => {
    try {
      setLoading(true);
      await labourApi.create(labourData);
      toast.success('Labour record created successfully');
      await fetchLabours(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create labour record');
      toast.error('Failed to create labour record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLabour = async (labourId: string, labourData: AddLabourFormData) => {
    try {
      setLoading(true);
      await labourApi.update(labourId, labourData);
      toast.success('Labour record updated successfully');
      await fetchLabours(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update labour record');
      toast.error('Failed to update labour record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLabour = async (labourId: string) => {
    try {
      setLoading(true);
      await labourApi.delete(labourId);
      toast.success('Labour record deleted successfully');
      await fetchLabours(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete labour record');
      toast.error('Failed to delete labour record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  return {
    labours,
    loading,
    error,
    fetchLabours,
    createLabour,
    updateLabour,
    deleteLabour,
  };
};