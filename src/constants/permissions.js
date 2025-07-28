// Permission constants for role-based access control

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  
  // Sales
  SALES_CREATE: 'sales.create',
  SALES_VIEW: 'sales.view',
  SALES_UPDATE: 'sales.update',
  SALES_DELETE: 'sales.delete',
  
  // Purchase
  PURCHASE_CREATE: 'purchase.create',
  PURCHASE_VIEW: 'purchase.view',
  PURCHASE_UPDATE: 'purchase.update',
  PURCHASE_DELETE: 'purchase.delete',
  
  // Inventory
  INVENTORY_CREATE: 'inventory.create',
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_UPDATE: 'inventory.update',
  INVENTORY_DELETE: 'inventory.delete',
  
  // Recipe
  RECIPE_CREATE: 'recipe.create',
  RECIPE_VIEW: 'recipe.view',
  RECIPE_UPDATE: 'recipe.update',
  RECIPE_DELETE: 'recipe.delete',
  
  // Party
  PARTY_CREATE: 'party.create',
  PARTY_VIEW: 'party.view',
  PARTY_UPDATE: 'party.update',
  PARTY_DELETE: 'party.delete',
  
  // Expense
  EXPENSE_CREATE: 'expense.create',
  EXPENSE_VIEW: 'expense.view',
  EXPENSE_UPDATE: 'expense.update',
  EXPENSE_DELETE: 'expense.delete',
  
  // Offers
  OFFERS_CREATE: 'offers.create',
  OFFERS_VIEW: 'offers.view',
  OFFERS_UPDATE: 'offers.update',
  OFFERS_DELETE: 'offers.delete',
  
  // Items
  ITEMS_CREATE: 'items.create',
  ITEMS_VIEW: 'items.view',
  ITEMS_UPDATE: 'items.update',
  ITEMS_DELETE: 'items.delete',
  
  // Reports
  REPORTS_VIEW: 'reports.view',
  
  // Users
  USERS_CREATE: 'users.create',
  USERS_VIEW: 'users.view',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  
  // KOT
  KOT_CREATE: 'kot.create',
  KOT_VIEW: 'kot.view',
  KOT_UPDATE: 'kot.update',
};

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_UPDATE,
    PERMISSIONS.PURCHASE_VIEW,
    PERMISSIONS.PURCHASE_UPDATE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.RECIPE_VIEW,
    PERMISSIONS.RECIPE_UPDATE,
    PERMISSIONS.PARTY_VIEW,
    PERMISSIONS.PARTY_UPDATE,
    PERMISSIONS.EXPENSE_VIEW,
    PERMISSIONS.OFFERS_VIEW,
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.ITEMS_UPDATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.KOT_CREATE,
    PERMISSIONS.KOT_VIEW,
    PERMISSIONS.KOT_UPDATE,
  ],
  cashier: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.PARTY_VIEW,
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.KOT_CREATE,
    PERMISSIONS.KOT_VIEW,
    PERMISSIONS.KOT_UPDATE,
  ],
};

export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};