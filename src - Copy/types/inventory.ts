export interface ItemRack {
  rack: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  unit: string;
  racks: ItemRack[];
  hsnCode?: string;
  itemCode?: string;
  sellPrice?: number;
  purchasePrice?: number;
  image?: string;
}