import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, hasAnyPermission } from '../constants/permissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions,
  fallback = null,
  requireAll = false
}) => {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const userPermissions = user.permissions || [];

  // Check single permission
  if (permission) {
    const hasAccess = hasPermission(userPermissions, permission);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    let hasAccess;
    
    if (requireAll) {
      // User must have ALL permissions
      hasAccess = permissions.every(perm => hasPermission(userPermissions, perm));
    } else {
      // User must have ANY of the permissions
      hasAccess = hasAnyPermission(userPermissions, permissions);
    }
    
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // If no permissions specified, show children
  return <>{children}</>;
};

export default PermissionGate;