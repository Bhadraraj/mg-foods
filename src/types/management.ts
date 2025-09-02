 
 

export interface Role {
  _id: string;
  no: string; 
  roleName: string;
  permissions: string[];
  screens: ScreenPermission[]; // For display in UI
  status: string; // "Active" | "Inactive" - derived from isActive
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

}

export interface ScreenPermission {
  name: string;
  hasAccess: boolean;
}

export interface Labour {
  _id: string;
  no: string; // For display purposes
  name: string;
  mobileNumber: string;
  address: string;
  monthlySalary: number;
  isActive: boolean;
  last7DaysStatus?: Array<{
    date: string;
    status: 'Present' | 'Absent' | 'Half Day' | 'Late' | 'Not Marked';
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface NewUserFormData {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
  store?: string;
  billType: string;
  permissions?: string[];
}
export interface AddLabourFormData {
  name: string;
  mobile: string;
  address: string;
  monthlySalary: number;
}
// export interface AddRoleFormData {
//   roleName: string;
//   permissions: {
//     fullAccess: boolean;
//     sales: boolean;
//     kot: boolean;
//     inventory: boolean;
//     management: boolean;
//     reports: boolean;
//     expense: boolean;
//     pos: boolean;
//     dashboard: boolean;
//     purchase: boolean;
//     offer: boolean;
//     item: boolean;
//     approval: boolean;
//     recipe: boolean;
//     party: boolean;
//   };
//   dashboardFeatures: {
//     overviewBox: boolean;
//     paymentReminders: boolean;
//     payables: boolean;
//     recentTransaction: boolean;
//     receivables: boolean;
//     onlineOrders: boolean;
//   };
// }


export interface AddRoleFormData {
  roleName: string;
  permissions: Record<string, boolean>;
  dashboardFeatures: Record<string, boolean>;
}
export interface AddLabourFormData {
  name: string;
  mobile: string;
  address: string;
  monthlySalary: number;
}