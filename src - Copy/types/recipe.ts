export interface MasterIngredient {
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  currentStock: number;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id: string;
  productName: string;
  date: string;
  totalManufactured: number;
  totalSold: number;
  balance: number;
  ingredients: RecipeIngredient[];
  manufacturingPrice: number;
  totalCostOfIngredients: number;
  serviceCharge: number;
  sellingPrice: number;
}

export interface RecipeFormData {
  id?: string;
  productName: string;
  date: string;
  totalManufactured: number;
  totalSold: number;
  ingredients: RecipeIngredient[];
  manufacturingPrice: number;
  totalCostOfIngredients: number;
  serviceCharge: number;
  sellingPrice: number;
}

export interface MasterIngredientOption {
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  currentStock: number;
  sellingPrice?: number;
}

export interface ModalIngredientData {
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  currentStock: number;
  quantity?: string;
}