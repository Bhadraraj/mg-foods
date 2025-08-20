export interface Party {
  id: string;
  name: string;
  type: "Customer" | "Supplier";
  phone: string;
  email: string;
  balance: string;
  status: "Active" | "Inactive";
}

export interface Customer {
  id: string;
  customerName: string;
  phoneNumber: string;
  gstNumber: string;
  payLimit: number;
  payLimitDays: number;
  address: string;
}

export interface Vendor {
  id: string;
  vendorNameCode: string;
  gstNo: string;
  phoneNumber: string;
  address: string;
  purchaseTotal: number;
  paidTotal: number;
  balance: number;
  account: string;
}

export interface Referrer {
  id: string;
  referrerName: string;
  phoneNumber: string;
  gstNumber?: string;
  address: string;
  commissionPoints: number;
  yearlyPoints: number;
  totalPoints: number;
  balanceCommissionPoints: number;
  balanceYearlyPoints: number;
  balanceTotalPoints: number;
}

export interface AttendanceRecord {
  id: string;
  labourName: string;
  date: string;
  attendance: 'Present' | 'Absent';
  clockIn: string;
  clockOut: string;
  last7DaysStatus: ('present' | 'absent')[];
}

export interface AddPartyFormData {
  partyName: string;
  partyType: "Customer" | "Supplier";
  mobileNumber: string;
  email: string;
  openingBalance: number;
  gstType: string;
  gstin: string;
  state: string;
  address: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface AddEditCustomerFormData {
  customerName: string;
  mobileNumber: string;
  gstNumber: string;
  location: string;
  creditAmount: number;
  rateType: string;
  creditLimitAmount: number;
  creditLimitDays: number;
  address: string;
}

export interface AddEditVendorFormData {
  vendorName: string;
  vendorCode: string;
  gst: string;
  address: string;
  mobileNumber: string;
  location: string;
  accountName: string;
  accountBankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface AddEditReferrerFormData {
  referrerName: string;
  mobileNumber: string;
  address: string;
}

export interface AddEditLabourFormData {
  labourName: string;
  phoneNumber: string;
  address: string;
  monthlyIncome: number;
}