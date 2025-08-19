import React from 'react';
import { usePermissions } from './ProtectedRoute';

interface RoleGuardProps {
  allowedRoles: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * RoleGuard component to conditionally render content based on user roles
 * 
 * @param allowedRoles - Single role or array of roles that can see the content
 * @param children - Content to render if user has required role
 * @param fallback - Optional fallback content to show if access is denied
 * @param showFallback - Whether to show fallback content or nothing (default: false)
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallback = null,
  showFallback = false 
}) => {
  const { hasRole } = usePermissions();

  const hasAccess = hasRole(allowedRoles);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  return null;
};

export default RoleGuard;

// Specific role guard components for common use cases
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard allowedRoles="admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const ManagerOrAdmin: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard allowedRoles={['admin', 'manager']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const CashierAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard allowedRoles={['admin', 'manager', 'cashier']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const StaffAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard allowedRoles={['admin', 'manager', 'staff']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const ChefAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard allowedRoles={['admin', 'manager', 'chef']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Example usage component showing how to use these guards
export const ExampleUsage: React.FC = () => {
  const { user, isAdmin, canAccessReports } = usePermissions();

  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      {/* Using specific role guards */}
      <AdminOnly>
        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Admin Settings
        </button>
      </AdminOnly>

      <ManagerOrAdmin>
        <button className="bg-blue-600 text-white px-4 py-2 rounded ml-2">
          Management Panel
        </button>
      </ManagerOrAdmin>

      <CashierAccess>
        <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">
          Process Sale
        </button>
      </CashierAccess>

      {/* Using generic RoleGuard */}
      <RoleGuard 
        allowedRoles={['admin', 'manager']} 
        fallback={<p className="text-gray-500">Reports not available for your role</p>}
        showFallback
      >
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3>Financial Reports</h3>
          <p>Access to detailed financial information</p>
        </div>
      </RoleGuard>

      {/* Using permission hooks directly */}
      {isAdmin() && (
        <div className="mt-4 p-4 bg-red-50 rounded">
          <h3>System Administration</h3>
          <p>Complete system control</p>
        </div>
      )}

      {canAccessReports() && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <h3>Business Analytics</h3>
          <p>View business performance metrics</p>
        </div>
      )}
    </div>
  );
};