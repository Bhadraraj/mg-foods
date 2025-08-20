import { User, Role, Labour, ScreenPermission } from '../types';

// Transform API user data to include display properties
export const transformUserData = (users: any[], startIndex: number = 1): User[] => {
  return users.map((user, index) => ({
    ...user,
    no: (startIndex + index).toString().padStart(2, '0'),
  }));
};

// Transform API role data to include display properties and screen permissions
export const transformRoleData = (roles: any[], startIndex: number = 1): Role[] => {
  return roles.map((role, index) => {
    // Convert permissions array to screen permissions for UI
    const screens: ScreenPermission[] = [];
    
    if (role.permissions && Array.isArray(role.permissions)) {
      role.permissions.forEach((permission: string) => {
        const name = permission
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/dashboard\./, '');
        
        screens.push({ name, hasAccess: true });
      });
    }

    return {
      ...role,
      no: (startIndex + index).toString().padStart(2, '0'),
      status: role.isActive ? 'Active' : 'Inactive',
      screens,
    };
  });
};

// Transform API labour data to include display properties
export const transformLabourData = (labours: any[], startIndex: number = 1): Labour[] => {
  return labours.map((labour, index) => ({
    ...labour,
    no: (startIndex + index).toString().padStart(2, '0'),
  }));
};

// Transform form data for role API calls
export const transformRoleFormData = (formData: any) => {
  const permissions: string[] = [];
  
  // Process permissions
  if (formData.permissions) {
    Object.entries(formData.permissions).forEach(([key, value]) => {
      if (value) {
        permissions.push(key);
      }
    });
  }
  
  // Process dashboard features
  if (formData.dashboardFeatures) {
    Object.entries(formData.dashboardFeatures).forEach(([key, value]) => {
      if (value) {
        permissions.push(`dashboard.${key}`);
      }
    });
  }

  return {
    roleName: formData.roleName,
    permissions,
  };
};

// Transform role data back to form data for editing
export const transformRoleToFormData = (role: Role) => {
  const permissions: Record<string, boolean> = {};
  const dashboardFeatures: Record<string, boolean> = {};

  if (role.permissions) {
    role.permissions.forEach(permission => {
      if (permission.startsWith('dashboard.')) {
        const feature = permission.replace('dashboard.', '');
        dashboardFeatures[feature] = true;
      } else {
        permissions[permission] = true;
      }
    });
  }

  return {
    roleName: role.roleName,
    permissions,
    dashboardFeatures,
  };
};