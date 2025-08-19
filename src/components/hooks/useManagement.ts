import { useState, useEffect } from 'react';
import { userService } from '../../services/api/user';
import { labourService } from '../../services/api/labour';
import { User, Role, Labour, NewUserFormData, AddRoleFormData, AddLabourFormData } from '../../types';
import { useApiMutation, useApiQuery } from '../../hooks/useApi';


// User Management Hook
export const useUserManagement = () => {
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

  const fetchUsersData = async (params?: any) => {
    await fetchUsers(() => userService.getUsers(params));
  };

  const createUser = async (userData: NewUserFormData) => {
    await createUserMutation(() => userService.createUser(userData));
    return true;
  };

  const updateUser = async (userId: string, userData: Partial<NewUserFormData>) => {
    await createUserMutation(() => userService.updateUser(userId, userData));
    return true;
  };

  const deleteUser = async (userId: string) => {
    await createUserMutation(() => userService.deleteUser(userId));
    return true;
  };

  const toggleUserStatus = async (userId: string) => {
    await createUserMutation(() => userService.toggleUserStatus(userId));
    return true;
  };
  useEffect(() => {
    fetchUsersData();
  }, []);

  return {
    users: usersData?.users || [],
    loading,
    error,
    fetchUsers: fetchUsersData,
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
      // TODO: Implement role service when API is available
      setRoles([]);
    } catch (err) {
      setError('Failed to fetch roles');
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

      // TODO: Implement role creation when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to create role');
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

      // TODO: Implement role update when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to update role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      setLoading(true);
      // TODO: Implement role deletion when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleStatus = async (roleId: string) => {
    try {
      // TODO: Implement role status toggle when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to update role status');
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
  const {
    data: labourData,
    loading,
    error,
    execute: fetchLabour,
  } = useApiQuery<{ labour: Labour[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createLabourMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Labour record created successfully',
    onSuccess: () => fetchLabourData(),
  });

  const fetchLabourData = async (params?: any) => {
    await fetchLabour(() => labourService.getLabour(params));
  };

  const createLabour = async (labourData: AddLabourFormData) => {
    await createLabourMutation(() => labourService.createLabour({
      name: labourData.name,
      mobileNumber: labourData.mobile,
      address: labourData.address,
      monthlySalary: labourData.monthlySalary,
    }));
    return true;
  };

  const updateLabour = async (labourId: string, labourData: AddLabourFormData) => {
    await createLabourMutation(() => labourService.updateLabour(labourId, {
      name: labourData.name,
      mobileNumber: labourData.mobile,
      address: labourData.address,
      monthlySalary: labourData.monthlySalary,
    }));
    return true;
  };

  const deleteLabour = async (labourId: string) => {
    await createLabourMutation(() => labourService.deleteLabour(labourId));
    return true;
  };
  useEffect(() => {
    fetchLabourData();
  }, []);

  return {
    labours: labourData?.labour || [],
    loading,
    error,
    fetchLabours: fetchLabourData,
    createLabour,
    updateLabour,
    deleteLabour,
  };
};