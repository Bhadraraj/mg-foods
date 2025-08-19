// types.ts
export interface ItemRack {
  rack: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string; // e.g., 'Well Stocked', 'Low Stock', 'Out Of Stock', 'Over Stock'
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  unit: string;
  hsnCode?: string;
  itemCode?: string;
  sellPrice?: number;
  purchasePrice?: number;
  image?: string;
  racks: ItemRack[]; // Array of racks for this specific item
}