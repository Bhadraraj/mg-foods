import { useState, useEffect } from 'react';
import { userService } from '../../services/api/user';
import { roleService } from '../../services/api/role';
import { labourService } from '../../services/api/labour';
import { User, Role, Labour, NewUserFormData, AddRoleFormData, AddLabourFormData } from '../../types';
import { useApiMutation, useApiQuery } from '../../hooks/useApi';
import { transformUserData, transformRoleData, transformLabourData, transformRoleFormData } from '../../utils/dataTransformers';

// User Management Hook with Pagination
export const useUserManagement = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: undefined as boolean | undefined,
  });

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

  const fetchUsersData = async (customFilters?: any) => {
    const params = {
      ...filters,
      ...customFilters,
      page: pagination.page,
      limit: pagination.limit,
    };
    const response = await fetchUsers(() => userService.getUsers(params));
    if (response?.pagination) {
      setPagination(response.pagination);
    }
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

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchUsersData();
  }, [pagination.page, pagination.limit, filters]);

  return {
    users: transformUserData(usersData?.users || []),
    loading: loading || mutationLoading,
    error,
    pagination,
    filters,
    fetchUsers: fetchUsersData,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
  };
};

// Role Management Hook with Pagination
export const useRoleManagement = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    status: undefined as boolean | undefined,
  });

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

  const fetchRolesData = async (customFilters?: any) => {
    const params = {
      ...filters,
      ...customFilters,
      page: pagination.page,
      limit: pagination.limit,
    };
    const response = await fetchRoles(() => roleService.getRoles(params));
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  };

  const createRole = async (roleData: AddRoleFormData) => {
    try {
      const permissions: string[] = [];
      Object.entries(roleData.permissions).forEach(([key, value]) => {
        if (value) {
          permissions.push(key);
        }
      });
      
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
      const permissions: string[] = [];
      Object.entries(roleData.permissions).forEach(([key, value]) => {
        if (value) {
          permissions.push(key);
        }
      });
      
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

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchRolesData();
  }, [pagination.page, pagination.limit, filters]);

  return {
    roles: rolesData?.roles || [],
    loading: loading || mutationLoading,
    error,
    pagination,
    filters,
    fetchRoles: fetchRolesData,
    createRole,
    updateRole,
    deleteRole,
    toggleRoleStatus,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
  };
};

// Labour Management Hook with Pagination
export const useLabourManagement = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    status: undefined as boolean | undefined,
  });

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

  const fetchLabourData = async (customFilters?: any) => {
    const params = {
      ...filters,
      ...customFilters,
      page: pagination.page,
      limit: pagination.limit,
    };
    const response = await fetchLabour(() => labourService.getLabour(params));
    if (response?.pagination) {
      setPagination(response.pagination);
    }
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

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchLabourData();
  }, [pagination.page, pagination.limit, filters]);

  return {
    labours: labourData?.labour || labourData?.labourRecords || [],
    loading: loading || mutationLoading,
    error,
    pagination,
    filters,
    fetchLabours: fetchLabourData,
    createLabour,
    updateLabour,
    deleteLabour,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
  };
};