// src/types/index.ts

// ====================================================
// Core Data Interfaces - Representing the actual data structure
// ====================================================

// --- Ingredient & Recipe Management ---
export interface MasterIngredient {
  id: string; // Unique ID for the master ingredient (e.g., 'ing1', or a database ID)
  name: string;
  unit: string; // e.g., "kg", "g", "ml", "L", "pcs"
  purchasePrice: number; // Price per unit of the master ingredient (e.g., price per Kg)
  currentStock: number; // Current stock of this master ingredient
}

export interface RecipeIngredient {
  // Represents an ingredient as part of a specific recipe
  id: string; // This should ideally be the `MasterIngredient.id`
  name: string; // Redundant if using `MasterIngredient.id` to fetch name, but useful for quick display
  quantity: string; // Quantity used in this specific recipe (e.g., "1/2", "0.5", "100")
  unit: string; // Unit for *this specific recipe's usage* (e.g., "g" if master is "kg" but recipe uses "g")
}

export interface Recipe {
  id: string; // Unique ID for the recipe (e.g., 'REC001' or database ID)
  productName: string; // Name of the final product produced by this recipe
  date: string; // Date of recipe creation or last update (consider 'Date' type if date manipulation is needed)
  totalManufactured: number; // Total units of product manufactured using this recipe
  totalSold: number; // Total units of product sold
  balance: number; // `totalManufactured - totalSold`
  ingredients: RecipeIngredient[]; // List of ingredients and their quantities for this recipe
  manufacturingPrice: number; // Cost to manufacture one unit of the product
  totalCostOfIngredients: number; // Sum of costs of all ingredients for one unit of the product
  serviceCharge: number; // Any additional service charge per unit
  sellingPrice: number; // Selling price per unit of the product
}

export interface RecipeTableData {
  // A simplified Recipe interface, suitable for displaying in a table
  no: string; // Serial number or short ID for table display
  product: string; // Corresponds to productName
  manufacturingPrice: number;
  sellingPrice: number;
  totalIngredients: number; // Number of distinct ingredients in the recipe
}

export interface Order {
  // This likely represents a manufacturing order or a sales order summary
  no: string; // Order serial number
  product: string; // The product associated with the order
  date: string; // Date of the order/record
  totalManufactured: number; // Units manufactured in this order/period
  totalSold: number; // Units sold from this order/period
  balance: number; // `totalManufactured - totalSold` for this order
}
// User related types
export interface User {
  no: string;
  name: string;
  mobile: string;
  role: string;
  store: string;
  status: boolean;
  createdBy: string;
  createdAt: string;
  _id?: string; // MongoDB ObjectId for API operations
  email?: string; // For API compatibility
  isActive?: boolean; // Backend field name
  billType?: string;
  permissions?: string[];
}

export interface ScreenPermission {
  // Defines access level for a specific screen/module
  name: string; // Name of the screen (e.g., "Sales", "Inventory")
  access: "Full Access" | "Partial Access" | "No Access";
  // You might want to include more granular feature permissions here if 'Partial Access' means specific features are enabled/disabled:
  // features?: { name: string; hasAccess: boolean; }[];
}

export interface Role {
  no: string; // Serial number or unique identifier for the role
  roleName: string;
  screens: ScreenPermission[]; // List of screens and their access levels for this role
  status: "Active" | "Inactive";
}

// --- Party Management (Customers, Vendors, Referrers) ---
export interface Party {
  id: string; // Unique identifier for a party
  name: string;
  type: "Customer" | "Supplier";
  phone: string;
  email: string;
  balance: string; // Use string for formatted currency balance (e.g., "₹1,234.50")
  status: "Active" | "Inactive";
}

export interface Customer {
  id: string; // Serial number or unique ID
  customerName: string;
  phoneNumber: string;
  gstNumber: string;
  payLimit: number; // Credit limit amount
  payLimitDays: number; // Credit limit days
  address: string;
}

export interface Vendor {
  id: string; // Serial number or unique ID
  vendorNameCode: string; // Vendor name + code (e.g., "ABC Supplies - V001")
  gstNo: string;
  phoneNumber: string;
  address: string;
  purchaseTotal: number; // Total purchase amount from this vendor
  paidTotal: number; // Total amount paid to this vendor
  balance: number; // Outstanding balance with this vendor
  account: string; // Bank account details (consider a more structured object if needed)
  // Example for structured account:
  // accountDetails?: { name: string; bank: string; number: string; ifsc: string; }
}

export interface Referrer {
  id: string; // Serial number or unique ID
  referrerName: string;
  phoneNumber: string;
  gstNumber?: string; // Optional
  address: string;
  commissionPoints: number; // Current commission points
  yearlyPoints: number; // Current yearly points
  totalPoints: number; // Sum of all points
  balanceCommissionPoints: number; // Redeemable commission points
  balanceYearlyPoints: number; // Redeemable yearly points
  balanceTotalPoints: number; // Total redeemable points
}

// --- Labour Management ---
export interface Labour {
  id: string; // Serial number or unique ID
  labourName: string;
  phoneNumber: string;
  address: string;
  monthlyIncome: number; // Monthly salary/income
}

export interface AttendanceRecord {
  id: string;
  labourName: string;
  date: string;
  attendance: 'Present' | 'Absent'; // Or 'Half Day' etc.
  clockIn: string;
  clockOut: string;
  last7DaysStatus: ('present' | 'absent')[];
}
// In your types.ts or similar file
export interface MasterIngredientOption {
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  currentStock: number;
  sellingPrice?: number; // Add this line if sellingPrice is part of MasterIngredientOption
}
// --- Offer & Coupon Management ---
export interface Offer {
  slNo: string; // Serial number for display
  name: string; // Name of the offer
  offerEffectiveFrom: string; // Start date of the offer
  offerEffectiveUpto: string; // End date of the offer
  discountType: string; // e.g., "Percentage", "Fixed Amount"
  discount: string; // The discount value, stored as string to handle "%" or currency symbol
  slug: string; // URL-friendly identifier
  createdBy: string;
  updatedBy: string;
  status: "Running" | "Expired";
}

export interface Coupon {
  slNo: string; // Serial number for display
  couponCode: string; // The actual code (e.g., "SUMMER20")
  couponValue: string; // Value of the coupon (e.g., "10%", "₹50")
  description: string;
  couponType: string; // e.g., "Discount", "Free Item", "Referral"
  status: boolean; // true for active, false for inactive
  validFrom: string;
  validTo: string;
}


// ====================================================
// Form Data Interfaces - For inputs, modals, and API request bodies
// These might differ slightly from core data for convenience (e.g., optional IDs for new entries)
// ====================================================

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
  location: string; // Specific to the form/modal, might not map directly to `Customer` core data
  creditAmount: number; // Specific to the form/modal, might not map directly to `Customer` core data
  rateType: string; // Specific to the form/modal
  creditLimitAmount: number; // Maps to `Customer.payLimit`
  creditLimitDays: number; // Maps to `Customer.payLimitDays`
  address: string;
}

export interface AddEditVendorFormData {
  vendorName: string;
  vendorCode: string;
  gst: string; // Corresponds to `Vendor.gstNo`
  address: string;
  mobileNumber: string; // Corresponds to `Vendor.phoneNumber`
  location: string; // Specific to the form/modal
  accountName: string;
  accountBankName: string;
  branchName: string;
  accountNumber: string;
  accountIfscCode: string; // Corresponds to part of `Vendor.account` or its structured version
  upiId: string;
}

export interface AddEditReferrerFormData {
  referrerName: string;
  mobileNumber: string;
  address: string;
  // If this form also handles "Add/Redeem" functionality, you'd add:
  // choose?: "Commission Points" | "Yearly Points" | "Amount";
  // commissionPts?: number;
  // yearlyPts?: number;
  // amount?: number;
}

export interface AddEditLabourFormData {
  labourName: string; // Corresponds to `Labour.labourName`
  phoneNumber: string; // Corresponds to `Labour.phoneNumber`
  address: string;
  monthlyIncome: number; // Corresponds to `Labour.monthlyIncome`
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
// API User response (from backend)
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  store: string;
  billType: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Role related types
export interface ScreenPermission {
  name: string;
  hasAccess: boolean;
}

export interface Role {
  no: string;
  roleName: string;
  screens: ScreenPermission[];
  status: string;
  _id?: string;
}

export interface AddRoleFormData {
  roleName: string;
  permissions: { [key: string]: boolean };
  dashboardFeatures: { [key: string]: boolean };
}

// Labour related types
export interface Labour {
  no: string;
  name: string;
  mobile: string;
  address: string;
  monthlySalary: number;
  _id?: string;
}

export interface AddLabourFormData {
  name: string;
  mobile: string;
  address: string;
  monthlySalary: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

// Permission types
export type Permission = 
  | 'users.view'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'roles.view'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete'
  | 'labour.view'
  | 'labour.create'
  | 'labour.update'
  | 'labour.delete';

// Filter types
export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: boolean;
  store?: string;
  search?: string;
}

// Auth types
export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
}

// Error types
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: { [field: string]: string };
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

export interface ModalIngredientData {
  // For modals that edit/add master ingredients or select them for a recipe
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  currentStock: number;
  quantity?: string; // Optional: Only relevant if this modal is also used for selecting for a recipe
}

export interface RecipeFormData {
  // For forms creating or editing a full recipe
  id?: string; // Optional for new recipes
  productName: string;
  date: string;
  totalManufactured: number;
  totalSold: number;
  ingredients: RecipeIngredient[]; // Uses the core RecipeIngredient type
  manufacturingPrice: number;
  totalCostOfIngredients: number;
  serviceCharge: number;
  sellingPrice: number;
}

export interface NewDishFormData {
  // This seems like a simplified recipe creation form, distinct from RecipeFormData
  product: string; // Maps to productName in Recipe
  ingredients: RecipeIngredient[]; // Uses the core RecipeIngredient type
  manufacturingPrice: number;
  totalCostOfIngredients: number;
  serviceCharge: number;
  sellingPrice: number;
}

export interface AddOfferFormData {
  offerName: string;
  product: string; // Associated product for the offer (e.g., "Pizza")
  offerType: "Discount" | "Free";
  discountType: string; // e.g., "Percentage", "Fixed Amount" (if discount is Free, this might be N/A)
  discount: number; // Numeric discount value (e.g., 10 for 10% or 50 for ₹50)
  effectiveFrom: string;
  effectiveUpto: string;
}

export interface AddCouponFormData {
  couponType: string; // e.g., "Discount", "Free Item"
  couponName: string; // A user-friendly name for the coupon
  qrCode?: File; // For QR code upload
  status: boolean; // Active/Inactive toggle
  couponCode: string; // The actual code users enter
  couponValue: string; // The value (e.g., "10%", "₹50")
  billType: string; // How this coupon applies to a bill
  couponValidityFrom: string;
  couponValidityTo: string;
  type: string; // This seems redundant if `couponType` is present; clarify or remove one
  description: string;
}

export interface AddRedeemFormData {
  referrer: string; // ID or name of the referrer redeeming points
  choose: "Commission Points" | "Yearly Points" | "Amount"; // Explicit options
  commissionPts?: number; // Optional, depending on `choose`
  yearlyPts?: number; // Optional, depending on `choose`
  amount?: number; // Optional, depending on `choose`
}

export interface AddOrderFormData {
  product: string;
  quantity: number;
  salesFrom: string; // Start date/period for sales tracking
  salesTo: string; // End date/period for sales tracking
}


// src/components/types/OrdermanagementTable.ts (or types.ts)

export interface Table {
  id: string;
  name: string;
  status: "available" | "occupied" | "bill-generated";
  customerName: string;
  amount: number;
  duration: number;
  isMain: boolean; // Add this property
  parentId?: string; // Add this property
} export interface ParcelOrder {
  id: string;
  name: string;
  status: "available" | "occupied";
  customerName: string;
  amount: number;
  duration: number;
}
export interface PaymentData {
  billNo: string;
  tableNo: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    amount: number;
  }>;
  charges: {
    service: number;
    ac: number;
    gst: number;
    cgst: number;
  };
  waiterTip: number;
  subTotal: number;
  total: number;
  grandTotal: number;
}

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
}

export interface Charges {
  service: number;
  ac: number;
  gst: number;
  cgst: number;
}

export interface PaymentData {
  billNo: string;
  tableNo: string;
  date: string;
  items: BillItem[];
  charges: Charges;
  waiterTip: number;
}

// Assuming this is in your types file, e.g., src/components/types/index.ts or similar
interface PurchaseItem {
  id: string;
  vendorName: string;
  customer: string;
  gst: string;
  purchaseOrder: {
    status: "Progress" | "Completed";
    type: "PO" | "PI" | "Invoice";
  }[];
  purchaseTotal: number;
  paymentStatus: "Pending" | "In Progress" | "Completed";
  fulfillment: {
    type: "Fulfilment" | "Stock Entry";
    status: "Pending" | "Completed";
  }[];
  createdBy: string;
  lastUpdatedBy: string;
  date: string;
  // NEW: Add a property to hold detailed data for modals
  details?: {
    invoiceNo: string;
    invoiceDate: string;
    totalItems: number;
    totalQty: number;
    brand: string;
    // Add other fields as needed for NewPurchaseModal and other modals
    items: Array<{
      no: string;
      image: string; // Placeholder for image URL
      productName: string;
      price: number;
      qty: number;
      inventoryQty: number;
    }>;
    // For verification modal
    unit: string;
    mrp: number;
    storeRetailPrice: number;
    storeWholePrice: number;
    estimationPrice: number;
    quotation: number;
    igst: string;
    sgst: string;
    cgst: string;
    hsn: string;
    description: string;
    discount: number;
  };
}
