// src/types.ts
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
  // New: Define a flexible variants structure
  variants?: {
    type: "radio" | "image-radio" | "size"; // Add more types as needed
    label: string;
    options: Array<{
      value: string;
      label: string;
      image?: string; // For image-radio type
      priceAdjustment?: number; // Optional price adjustment for variants
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
  variant?: string; // New: To store selected variant
  kotNote?: string; // New: To store KOT Note
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