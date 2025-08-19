import { useState, useEffect } from 'react';
import { userService } from '../../services/api/user';
<<<<<<< HEAD
import { roleService } from '../../services/api/role';
import { labourService } from '../../services/api/labour';
import { User, Role, Labour, NewUserFormData, AddRoleFormData, AddLabourFormData } from '../../types';
import { useApiMutation, useApiQuery } from '../../hooks/useApi';
import { transformUserData, transformRoleData, transformLabourData, transformRoleFormData } from '../../utils/dataTransformers';
=======
import { labourService } from '../../services/api/labour';
import { User, Role, Labour, NewUserFormData, AddRoleFormData, AddLabourFormData } from '../../types';
import { useApiMutation, useApiQuery } from '../../hooks/useApi';

>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447

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
<<<<<<< HEAD
    execute: userMutation,
    loading: mutationLoading,
  } = useApiMutation({
    successMessage: 'Operation completed successfully',
=======
    execute: createUserMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'User created successfully',
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    onSuccess: () => fetchUsersData(),
  });

  const fetchUsersData = async (params?: any) => {
    await fetchUsers(() => userService.getUsers(params));
  };

  const createUser = async (userData: NewUserFormData) => {
<<<<<<< HEAD
    await userMutation(() => userService.createUser(userData));
=======
    await createUserMutation(() => userService.createUser(userData));
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    return true;
  };

  const updateUser = async (userId: string, userData: Partial<NewUserFormData>) => {
<<<<<<< HEAD
    await userMutation(() => userService.updateUser(userId, userData));
=======
    await createUserMutation(() => userService.updateUser(userId, userData));
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    return true;
  };

  const deleteUser = async (userId: string) => {
<<<<<<< HEAD
    await userMutation(() => userService.deleteUser(userId));
=======
    await createUserMutation(() => userService.deleteUser(userId));
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    return true;
  };

  const toggleUserStatus = async (userId: string) => {
<<<<<<< HEAD
    await userMutation(() => userService.toggleUserStatus(userId));
=======
    await createUserMutation(() => userService.toggleUserStatus(userId));
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    return true;
  };
  useEffect(() => {
    fetchUsersData();
  }, []);

  return {
<<<<<<< HEAD
    users: transformUserData(usersData?.users || []),
    loading: loading || mutationLoading,
=======
    users: usersData?.users || [],
    loading,
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
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

<<<<<<< HEAD
  const {
    execute: roleMutation,
    loading: mutationLoading,
  } = useApiMutation({
    successMessage: 'Role operation completed successfully',
    onSuccess: () => fetchRolesData(),
  });

  const fetchRolesData = async (params?: any) => {
    await fetchRoles(() => roleService.getRoles(params));
=======
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
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
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

<<<<<<< HEAD
      await roleMutation(() => roleService.createRole({
        roleName: roleData.roleName,
        permissions,
      }));
      return true;
    } catch (err) {
=======
      // TODO: Implement role creation when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to create role');
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
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

<<<<<<< HEAD
      await roleMutation(() => roleService.updateRole(roleId, {
        roleName: roleData.roleName,
        permissions,
      }));
      return true;
    } catch (err) {
=======
      // TODO: Implement role update when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to update role');
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
      return false;
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
<<<<<<< HEAD
      await roleMutation(() => roleService.deleteRole(roleId));
      return true;
    } catch (err) {
=======
      setLoading(true);
      // TODO: Implement role deletion when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete role');
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
      return false;
    }
  };

  const toggleRoleStatus = async (roleId: string) => {
    try {
<<<<<<< HEAD
      await roleMutation(() => roleService.toggleRoleStatus(roleId));
      return true;
    } catch (err) {
=======
      // TODO: Implement role status toggle when API is available
      await fetchRoles(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to update role status');
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
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
<<<<<<< HEAD
  } = useApiQuery<{ labour: Labour[]; labourRecords: Labour[] }>({
=======
  } = useApiQuery<{ labour: Labour[] }>({
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    showSuccessToast: false,
  });

  const {
<<<<<<< HEAD
    execute: labourMutation,
    loading: mutationLoading,
  } = useApiMutation({
    successMessage: 'Labour operation completed successfully',
=======
    execute: createLabourMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Labour record created successfully',
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    onSuccess: () => fetchLabourData(),
  });

  const fetchLabourData = async (params?: any) => {
    await fetchLabour(() => labourService.getLabour(params));
  };

  const createLabour = async (labourData: AddLabourFormData) => {
<<<<<<< HEAD
    await labourMutation(() => labourService.createLabour({
=======
    await createLabourMutation(() => labourService.createLabour({
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
      name: labourData.name,
      mobileNumber: labourData.mobile,
      address: labourData.address,
      monthlySalary: labourData.monthlySalary,
    }));
    return true;
  };

  const updateLabour = async (labourId: string, labourData: AddLabourFormData) => {
<<<<<<< HEAD
    await labourMutation(() => labourService.updateLabour(labourId, {
=======
    await createLabourMutation(() => labourService.updateLabour(labourId, {
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
      name: labourData.name,
      mobileNumber: labourData.mobile,
      address: labourData.address,
      monthlySalary: labourData.monthlySalary,
    }));
    return true;
  };

  const deleteLabour = async (labourId: string) => {
<<<<<<< HEAD
    await labourMutation(() => labourService.deleteLabour(labourId));
=======
    await createLabourMutation(() => labourService.deleteLabour(labourId));
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    return true;
  };
  useEffect(() => {
    fetchLabourData();
  }, []);

  return {
<<<<<<< HEAD
    // Handle both possible response structures from the API
    labours: labourData?.labour || labourData?.labourRecords || [],
    loading: loading || mutationLoading,
=======
    labours: labourData?.labour || [],
    loading,
>>>>>>> bb12a49250642ac637069414b20cd477bd5fd447
    error,
    fetchLabours: fetchLabourData,
    createLabour,
    updateLabour,
    deleteLabour,
  };
};