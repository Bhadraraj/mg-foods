export interface GstReportData {
  no: number;
  billNo: string;
  billDate: string;
  customerName: string;
  gstNo: string;
  gst5: { sAmt: number; tax: number };
  gst12: { sAmt: number; tax: number };
  gst18: { sAmt: number; tax: number };
  igst: { sAmt: number; tax: number };
}

export interface RecipeReportData {
  no: string;
  date: string;
  totalManufacturingPrice: string;
  totalSellingPrice: string;
  status: string;
}

export interface BrandReportData {
  brand: string;
  total: number;
  onRequest: number;
  unApproved: number;
  verifiedProduct: number;
  availOnLive: number;
}

export interface ProductReportData {
  slNo: string;
  category: string;
  productName: string;
  mrp: string;
  salesCount: number;
  totalSalesPrice: string;
}

export interface HsnReportData {
  no: string;
  hsnCode: string;
  cgst25: { sAmt: string; tax: string };
  cgst06: { sAmt: string; tax: string };
  cgst09: { sAmt: string; tax: string };
  purchase1: string;
  purchase2: string;
  sales: string;
  closingBalance: string;
}

export interface CreditorsReportData {
  no: string;
  vendor: string;
  gstNo: string;
  address: string;
  openingBalance: string;
  credit: string;
  debit: string;
  closingBalance: string;
}

export interface DebtorsReportData {
  no: string;
  customerName: string;
  contact: string;
  gstNo: string;
  openingBalance: string;
  credit: string;
  debit: string;
  closingBalance: string;
}