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

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  currentStock?: number;
  variants?: {
    type: "radio" | "image-radio" | "size";
    label: string;
    options: Array<{
      value: string;
      label: string;
      image?: string;
      priceAdjustment?: number;
    }>;
  }[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  price: number;
  kot: string;
  variant?: string;
  kotNote?: string;
}

export interface OrderData {
  id: string;
  name: string;
  customerName: string;
  status: "occupied" | "bill-generated" | "new";
  totalAmount: number;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  type: "Individual" | "Business";
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