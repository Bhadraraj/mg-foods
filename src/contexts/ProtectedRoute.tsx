import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/unauthorized' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const hasAccess = userRole && allowedRoles.map(role => role.toLowerCase()).includes(userRole);
    
    if (!hasAccess) {
      // For debugging - you can remove this in production
      console.warn(`Access denied: User role "${userRole}" not in allowed roles:`, allowedRoles);
      
      return <Navigate to={redirectTo} replace />;
    }
  }

  // User is authenticated and has proper role access
  return <>{children}</>;
};

export default ProtectedRoute;

// Helper hook to check permissions in components
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