import { useState, useMemo } from "react";
import { Recipe, MasterIngredientOption, RecipeFormData, ModalIngredientData } from "../../../components/types";

// Define types for dish variant data
interface DishVariantIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface DishVariantFormData {
  name: string;
  productId: string;
  subProducts: DishVariantIngredient[];
  quantityPerProduct: string;
  totalCostOfIngredients: string;
}

const initialMasterIngredients: MasterIngredientOption[] = [
  {
    id: "ing1",
    name: "Onion",
    unit: "Kg",
    purchasePrice: 50,
    currentStock: 100,
  },
  {
    id: "ing2",
    name: "Gram Flour",
    unit: "Kg",
    purchasePrice: 80,
    currentStock: 200,
  },
  {
    id: "ing3",
    name: "Rice Flour",
    unit: "Kg",
    purchasePrice: 70,
    currentStock: 150,
  },
  {
    id: "ing4",
    name: "Green Chili",
    unit: "Kg",
    purchasePrice: 60,
    currentStock: 50,
  },
  {
    id: "ing5",
    name: "Curry Leaves",
    unit: "Gram",
    purchasePrice: 2,
    currentStock: 1000,
  },
  {
    id: "ing6",
    name: "Salt",
    unit: "Kg",
    purchasePrice: 20,
    currentStock: 500,
  },
  {
    id: "ing7",
    name: "Oil",
    unit: "Liter",
    purchasePrice: 150,
    currentStock: 80,
  },
];

const initialRecipesList: Recipe[] = [
  {
    id: "01",
    productName: "Onion Vada Special",
    date: "2025-08-15",
    totalManufactured: 100,
    totalSold: 12,
    balance: 88,
    ingredients: [
      { id: "ing1", name: "Onion", quantity: "2", unit: "Kg" },
      { id: "ing2", name: "Gram Flour", quantity: "1", unit: "Kg" },
    ],
    manufacturingPrice: 200,
    totalCostOfIngredients: 180,
    serviceCharge: 20,
    sellingPrice: 300,
  },
  {
    id: "02",
    productName: "Aloo Tikki",
    date: "2025-08-18",
    totalManufactured: 50,
    totalSold: 30,
    balance: 20,
    ingredients: [
      { id: "ing1", name: "Potato", quantity: "3", unit: "Kg" },
      { id: "ing6", name: "Salt", quantity: "0.1", unit: "Kg" },
    ],
    manufacturingPrice: 120,
    totalCostOfIngredients: 100,
    serviceCharge: 20,
    sellingPrice: 180,
  },
];

const generateUniqueId = () => {
  return (
    "REC" +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 5).toUpperCase()
  );
};

export const useRecipeManagement = () => {
  // State management
  const [activeMainTab, setActiveMainTab] = useState<"recipe" | "orders">("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductFilter, setSelectedProductFilter] = useState<"product" | "sub-product">("product");
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 7, 12),
    to: new Date(2025, 7, 22),
  });

  // Modal states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isRecipeFormModalOpen, setIsRecipeFormModalOpen] = useState(false);
  const [isEditIngredientModalOpen, setIsEditIngredientModalOpen] = useState(false);
  const [isAddDishVariantModalOpen, setIsAddDishVariantModalOpen] = useState(false);

  // Edit states
  const [editingRecipe, setEditingRecipe] = useState<RecipeFormData | null>(null);
  const [editingMasterIngredient, setEditingMasterIngredient] = useState<ModalIngredientData | null>(null);

  // Data states
  const [recipesList, setRecipesList] = useState<Recipe[]>(initialRecipesList);
  const [masterIngredientsData, setMasterIngredientsData] = useState<MasterIngredientOption[]>(initialMasterIngredients);

  // Derived data
  const availableProductsForVariants = useMemo(() => 
    recipesList.map(recipe => ({
      id: recipe.id,
      name: recipe.productName,
    })), [recipesList]);

  const availableSubProductsForVariants = useMemo(() => 
    masterIngredientsData.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      unit: ingredient.unit,
    })), [masterIngredientsData]);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipesList.filter((recipe) => {
      let recipeDate: Date;
      try {
        const [year, month, day] = recipe.date.split("-").map(Number);
        recipeDate = new Date(year, month - 1, day);
      } catch (e) {
        console.error("Error parsing recipe date:", recipe.date, e);
        recipeDate = new Date(0);
      }

      const matchesSearch = recipe.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const fromDateStart = new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate()
      );
      const toDateEnd = new Date(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate(),
        23,
        59,
        59,
        999
      );
      const matchesDate = recipeDate >= fromDateStart && recipeDate <= toDateEnd;
      return matchesSearch && matchesDate;
    });
  }, [recipesList, searchTerm, dateRange]);

  // Handler functions
  const handleDateRangeApply = (fromDate: Date, toDate: Date) => {
    setDateRange({ from: fromDate, to: toDate });
    setIsCalendarOpen(false);
  };

  const handleOpenAddRecipeModal = () => {
    setEditingRecipe(null);
    setIsRecipeFormModalOpen(true);
  };

  const handleOpenEditRecipeModal = (recipe: Recipe) => {
    const recipeFormData: RecipeFormData = {
      ...recipe,
      date: new Date(recipe.date).toISOString().split("T")[0],
    };
    setEditingRecipe(recipeFormData);
    setIsRecipeFormModalOpen(true);
  };

  const handleRecipeFormSubmit = (submittedData: RecipeFormData) => {
    const balance = submittedData.totalManufactured - submittedData.totalSold;

    if (submittedData.id) {
      setRecipesList((prev) =>
        prev.map((r) =>
          r.id === submittedData.id
            ? ({ ...submittedData, balance: balance } as Recipe)
            : r
        )
      );
      console.log("Updated Recipe Data:", { ...submittedData, balance });
    } else {
      const newId = generateUniqueId();
      setRecipesList((prev) => [
        ...prev,
        { ...submittedData, id: newId, balance: balance } as Recipe,
      ]);
      console.log("New Recipe Data:", { ...submittedData, id: newId, balance });
    }
    setIsRecipeFormModalOpen(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (window.confirm("Are you sure you want to delete this recipe/order?")) {
      setRecipesList((prev) => prev.filter((r) => r.id !== recipeId));
    }
  };

  const handleOpenEditMasterIngredientModal = (ingredientToEdit: MasterIngredientOption) => {
    const modalFormatIngredient: ModalIngredientData = {
      ...ingredientToEdit,
      quantity: "0",
    };
    setEditingMasterIngredient(modalFormatIngredient);
    setIsEditIngredientModalOpen(true);
  };

  const handleMasterIngredientSubmit = (updatedIngredient: ModalIngredientData) => {
    setMasterIngredientsData((prev) =>
      prev.map((i) =>
        i.id === updatedIngredient.id
          ? {
              ...i,
              name: updatedIngredient.name,
              unit: updatedIngredient.unit,
              purchasePrice: updatedIngredient.purchasePrice,
              currentStock: updatedIngredient.currentStock,
            }
          : i
      )
    );
    console.log("Updated Master Ingredient (from modal):", updatedIngredient);
    setIsEditIngredientModalOpen(false);
    setEditingMasterIngredient(null);
  };

  const handleDeleteMasterIngredient = (id: string) => {
    if (window.confirm("Are you sure you want to delete this master ingredient?")) {
      setMasterIngredientsData((prev) => prev.filter((ing) => ing.id !== id));
    }
  };

  const handleAddDishVariant = () => {
    setIsAddDishVariantModalOpen(true);
  };

  const handleDishVariantSubmit = (data: DishVariantFormData) => {
    console.log("Submitted Dish Variant Data:", data);
    setIsAddDishVariantModalOpen(false);
  };

  return {
    // State
    activeMainTab,
    searchTerm,
    selectedProductFilter,
    dateRange,
    filteredRecipes,
    masterIngredientsData,
    editingRecipe,
    editingMasterIngredient,
    availableProductsForVariants,
    availableSubProductsForVariants,
    
    // Modal states
    isCalendarOpen,
    isRecipeFormModalOpen,
    isEditIngredientModalOpen,
    isAddDishVariantModalOpen,

    // Setters
    setActiveMainTab,
    setSearchTerm,
    setSelectedProductFilter,
    setIsCalendarOpen,
    setIsRecipeFormModalOpen,
    setIsEditIngredientModalOpen,
    setIsAddDishVariantModalOpen,
    setEditingRecipe,
    setEditingMasterIngredient,

    // Handlers
    handleDateRangeApply,
    handleOpenAddRecipeModal,
    handleOpenEditRecipeModal,
    handleRecipeFormSubmit,
    handleDeleteRecipe,
    handleOpenEditMasterIngredientModal,
    handleMasterIngredientSubmit,
    handleDeleteMasterIngredient,
    handleAddDishVariant,
    handleDishVariantSubmit,
  };
};