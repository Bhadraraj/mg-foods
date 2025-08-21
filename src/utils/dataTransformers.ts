import { User, Role, Labour, ScreenPermission } from '../types';

// Transform API user data to include display properties
export const transformUserData = (users: any[], startIndex: number = 1): User[] => {
  return users.map((user, index) => ({
    ...user,
    id: user._id || user.id,
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
      id: role._id || role.id,
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
    id: labour._id || labour.id,
    no: (startIndex + index).toString().padStart(2, '0'),
  }));
};

// Transform API customer data to include display properties
export const transformCustomerData = (customers: any[], startIndex: number = 1) => {
  return customers.map((customer, index) => ({
    ...customer,
    id: customer._id || customer.id,
    customerName: customer.name || customer.customerName,
    phoneNumber: customer.mobileNumber || customer.phoneNumber,
    gstNumber: customer.gstNumber || '',
    payLimit: customer.creditLimit || 0,
    payLimitDays: customer.creditDays || 0,
    address: customer.address || '',
  }));
};

// Transform API vendor data to include display properties
export const transformVendorData = (vendors: any[], startIndex: number = 1) => {
  return vendors.map((vendor, index) => ({
    ...vendor,
    id: vendor._id || vendor.id,
    vendorNameCode: vendor.name || vendor.vendorNameCode,
    gstNo: vendor.gstNumber || vendor.gstNo,
    phoneNumber: vendor.mobileNumber || vendor.phoneNumber,
    address: vendor.address || '',
    purchaseTotal: vendor.purchaseTotal || 0,
    paidTotal: vendor.paidTotal || 0,
    balance: vendor.balance || 0,
    account: vendor.accountDetails ? 
      `${vendor.accountDetails.accountName || ''}, ${vendor.accountDetails.bankName || ''}, ${vendor.accountDetails.accountNumber || ''}, ${vendor.accountDetails.ifscCode || ''}` :
      vendor.account || '',
  }));
};

// Transform API referrer data to include display properties
export const transformReferrerData = (referrers: any[], startIndex: number = 1) => {
  return referrers.map((referrer, index) => ({
    ...referrer,
    id: referrer._id || referrer.id,
    referrerName: referrer.name || referrer.referrerName,
    phoneNumber: referrer.mobileNumber || referrer.phoneNumber,
    gstNumber: referrer.gstNumber || '',
    address: referrer.address || '',
    commissionPoints: referrer.commissionPoints || 0,
    yearlyPoints: referrer.yearlyPoints || 0,
    totalPoints: referrer.totalPoints || 0,
    balanceCommissionPoints: referrer.balanceCommissionPoints || 0,
    balanceYearlyPoints: referrer.balanceYearlyPoints || 0,
    balanceTotalPoints: referrer.balanceTotalPoints || 0,
  }));
};

// Transform API purchase data to include display properties
export const transformPurchaseData = (purchases: any[], startIndex: number = 1) => {
  return purchases.map((purchase, index) => ({
    ...purchase,
    id: purchase._id || purchase.id,
    vendorName: purchase.vendor?.name || purchase.vendorName || 'Unknown Vendor',
    customer: purchase.customer?.name || purchase.customer || 'Unknown Customer',
    gst: purchase.vendor?.gstNumber || purchase.gst || '',
    purchaseOrder: purchase.status ? [
      { status: purchase.status.po || 'Pending', type: 'PO' },
      { status: purchase.status.pi || 'Pending', type: 'PI' },
      { status: purchase.status.invoice || 'Pending', type: 'Invoice' },
    ] : [],
    purchaseTotal: purchase.pricing?.grandTotal || purchase.purchaseTotal || 0,
    paymentStatus: purchase.paymentStatus || 'Pending',
    fulfillment: purchase.fulfillmentStatus ? [
      { type: 'Fulfilment', status: purchase.fulfillmentStatus.fulfillment || 'Pending' },
      { type: 'Stock Entry', status: purchase.fulfillmentStatus.stockEntry || 'Pending' },
    ] : [],
    createdBy: purchase.createdBy || 'Unknown',
    lastUpdatedBy: purchase.updatedBy || 'Unknown',
    date: purchase.invoiceDate || purchase.createdAt || new Date().toISOString().split('T')[0],
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