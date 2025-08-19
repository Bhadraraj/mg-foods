export interface Table {
  id: string;
  name: string;
  status: "available" | "occupied" | "bill-generated";
  customerName?: string;
  amount: number;
  duration: number;
}

export interface ParcelOrder {
  id: string;
  name: string;
  customerName?: string;
  amount: number;
  duration: number;
  status: "available" | "occupied";
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  currentStock: number;
  image: string;
  category: string;
}

export interface PaymentData {
  billNo: string;
  tableNo: string;
  date: string;
  items: OrderItem[];
  charges: {
    service: number;
    ac: number;
    gst: number;
    cgst: number;
  };
  waiterTip: number;
  total: number;
  subTotal: number;
  grandTotal: number;
}

export interface CustomerCreditData {
  customerName: string;
  customerMobile: string;
  duePeriod: string;
}
 