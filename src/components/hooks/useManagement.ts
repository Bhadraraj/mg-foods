import { useState, useEffect } from 'react';
import { userService } from '../../services/api/user';
import { roleService } from '../../services/api/role';
import { labourService } from '../../services/api/labour';
import { User, Role, Labour, NewUserFormData, AddRoleFormData, AddLabourFormData } from '../../types';
import { useApiMutation, useApiQuery } from '../../hooks/useApi';
import { transformUserData, transformRoleData, transformLabourData, transformRoleFormData } from '../../utils/dataTransformers';

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
    execute: userMutation,
    loading: mutationLoading,
  } = useApiMutation({
    successMessage: 'Operation completed successfully',
    onSuccess: () => fetchUsersData(),
  });

  const fetchUsersData = async (params?: any) => {
    await fetchUsers(() => userService.getUsers(params));
  };

  const createUser = async (userData: NewUserFormData) => {
    await userMutation(() => userService.createUser(userData));
    return true;
  };

  const updateUser = async (userId: string, userData: Partial<NewUserFormData>) => {
    await userMutation(() => userService.updateUser(userId, userData));
    return true;
  };

  const deleteUser = async (userId: string) => {
    await userMutation(() => userService.deleteUser(userId));
    return true;
  };

  const toggleUserStatus = async (userId: string) => {
    await userMutation(() => userService.toggleUserStatus(userId));
    return true;
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return {
    users: transformUserData(usersData?.users || []),
    loading: loading || mutationLoading,
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
  const {
    data: rolesData,
    loading,
    error,
    execute: fetchRoles,
  } = useApiQuery<{ roles: Role[] }>({
    showSuccessToast: false,
  });

  const {
    execute: roleMutation,
    loading: mutationLoading,
  } = useApiMutation({
    successMessage: 'Role operation completed successfully',
    onSuccess: () => fetchRolesData(),
  });

  const fetchRolesData = async (params?: any) => {
    await fetchRoles(() => roleService.getRoles(params));
  };

  const createRole = async (roleData: AddRoleFormData) => {
    try {
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

      await roleMutation(() => roleService.createRole({
        roleName: roleData.roleName,
        permissions,
      }));
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateRole = async (roleId: string, roleData: AddRoleFormData) => {
    try {
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

      await roleMutation(() => roleService.updateRole(roleId, {
        roleName: roleData.roleName,
        permissions,
      }));
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      await roleMutation(() => roleService.deleteRole(roleId));
      return true;
    } catch (err) {
      return false;
    }
  };

  const toggleRoleStatus = async (roleId: string) => {
    try {
      await roleMutation(() => roleService.toggleRoleStatus(roleId));
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  return {
    roles: rolesData?.roles || [],
    loading: loading || mutationLoading,
    error,
    fetchRoles: fetchRolesData,
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
  } = useApiQuery<{ labour: Labour[]; labourRecords: Labour[] }>({
    showSuccessToast: false,
  });

  const {
    execute: labourMutation,
    loading: mutationLoading,
  } = useApiMutation({
    successMessage: 'Labour operation completed successfully',
    onSuccess: () => fetchLabourData(),
  });

  const fetchLabourData = async (params?: any) => {
    await fetchLabour(() => labourService.getLabour(params));
  };

  const createLabour = async (labourData: AddLabourFormData) => {
    await labourMutation(() => labourService.createLabour({
      name: labourData.name,
      mobileNumber: labourData.mobile,
      address: labourData.address,
      monthlySalary: labourData.monthlySalary,
    }));
    return true;
  };

  const updateLabour = async (labourId: string, labourData: AddLabourFormData) => {
    await labourMutation(() => labourService.updateLabour(labourId, {
      name: labourData.name,
      mobileNumber: labourData.mobile,
      address: labourData.address,
      monthlySalary: labourData.monthlySalary,
    }));
    return true;
  };

  const deleteLabour = async (labourId: string) => {
    await labourMutation(() => labourService.deleteLabour(labourId));
    return true;
  };

  useEffect(() => {
    fetchLabourData();
  }, []);

  return {
    // Handle both possible response structures from the API
    labours: labourData?.labour || labourData?.labourRecords || [],
    loading: loading || mutationLoading,
    error,
    fetchLabours: fetchLabourData,
    createLabour,
    updateLabour,
    deleteLabour,
  };
};