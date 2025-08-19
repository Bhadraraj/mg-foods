import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasRole = (roles: string | string[]): boolean => {
    if (!user?.role) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.map(role => role.toLowerCase()).includes(user.role.toLowerCase());
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isManager = (): boolean => hasRole('manager');
  const isCashier = (): boolean => hasRole('cashier');
  const isStaff = (): boolean => hasRole('staff');
  const isChef = (): boolean => hasRole('chef');

  const canAccessReports = (): boolean => hasRole(['admin', 'manager']);
  const canAccessPurchase = (): boolean => hasRole(['admin', 'manager']);
  const canAccessExpense = (): boolean => hasRole(['admin', 'manager']);
  const canAccessManagement = (): boolean => hasRole('admin');
  const canAccessSales = (): boolean => hasRole(['admin', 'manager', 'cashier']);
  const canAccessKOT = (): boolean => hasRole(['admin', 'manager', 'staff']);
  const canAccessRecipe = (): boolean => hasRole(['admin', 'manager', 'chef']);
  const canAccessInventory = (): boolean => hasRole(['admin', 'manager']);

  return {
    user,
    hasRole,
    isAdmin,
    isManager,
    isCashier,
    isStaff,
    isChef,
    canAccessReports,
    canAccessPurchase,
    canAccessExpense,
    canAccessManagement,
    canAccessSales,
    canAccessKOT,
    canAccessRecipe,
    canAccessInventory,
  };
};