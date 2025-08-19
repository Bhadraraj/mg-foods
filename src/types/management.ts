export interface User {
  no: string;
  name: string;
  mobile: string;
  role: string;
  store: string;
  status: boolean;
  createdBy: string;
  createdAt: string;
  _id?: string;
  email?: string;
  isActive?: boolean;
  billType?: string;
  permissions?: string[];
}

export interface Role {
  no: string;
  roleName: string;
  screens: ScreenPermission[];
  status: string;
  _id?: string;
}

export interface ScreenPermission {
  name: string;
  hasAccess: boolean;
}

export interface Labour {
  no: string;
  name: string;
  mobile: string;
  address: string;
  monthlySalary: number;
  _id?: string;
}

export interface NewUserFormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
  store?: string;
  billType: string;
  permissions?: string[];
}

export interface AddRoleFormData {
  roleName: string;
  permissions: {
    fullAccess: boolean;
    sales: boolean;
    kot: boolean;
    inventory: boolean;
    management: boolean;
    reports: boolean;
    expense: boolean;
    pos: boolean;
    dashboard: boolean;
    purchase: boolean;
    offer: boolean;
    item: boolean;
    approval: boolean;
    recipe: boolean;
    party: boolean;
  };
  dashboardFeatures: {
    overviewBox: boolean;
    paymentReminders: boolean;
    payables: boolean;
    recentTransaction: boolean;
    receivables: boolean;
    onlineOrders: boolean;
  };
}

export interface AddLabourFormData {
  name: string;
  mobile: string;
  address: string;
  monthlySalary: number;
}