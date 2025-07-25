import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import {
  Recipe,
  MasterIngredientOption,
  RecipeFormData,
  ModalIngredientData,
} from "../../components/types";
import CalendarModal from "../../components/modals/CalendarModal";
import EditIngredientModal from "../../components/modals/EditIngredientModal";
import RecipeFormModal from "../../components/modals/RecipeFormModal";
import RecipeListTable from "./recipe/RecipeListTable";
import MasterIngredientsList from "./recipe/MasterIngredientsList";

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

const generateUniqueId = () => {
  return (
    "REC" +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 5).toUpperCase()
  );
};

const RecipeManagement: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<"recipe" | "orders">(
    "orders"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isRecipeFormModalOpen, setIsRecipeFormModalOpen] = useState(false);
  const [isEditIngredientModalOpen, setIsEditIngredientModalOpen] =
    useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState<"product" | "sub-product">("product"); // <--- THIS LINE WAS MISSING/INCORRECTLY PLACED

  const [editingRecipe, setEditingRecipe] = useState<RecipeFormData | null>(
    null
  );
  const [editingMasterIngredient, setEditingMasterIngredient] =
    useState<ModalIngredientData | null>(null);

  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 7, 12),
    to: new Date(2025, 7, 22),
  });

  const [recipesList, setRecipesList] = useState<Recipe[]>([
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
  ]);

  const [masterIngredientsData, setMasterIngredientsData] = useState<
    MasterIngredientOption[]
  >(initialMasterIngredients);

  // --- Date Range ---
  const handleDateRangeApply = (fromDate: Date, toDate: Date) => {
    setDateRange({ from: fromDate, to: toDate });
    setIsCalendarOpen(false);
  };

  // --- Recipe Form Modal (Add/Edit) ---
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

  // --- Master Ingredient Modal ---
  const handleOpenEditMasterIngredientModal = (
    ingredientToEdit: MasterIngredientOption
  ) => {
    const modalFormatIngredient: ModalIngredientData = {
      ...ingredientToEdit,
      quantity: "0",
    };
    setEditingMasterIngredient(modalFormatIngredient);
    setIsEditIngredientModalOpen(true);
  };

  const handleMasterIngredientSubmit = (
    updatedIngredient: ModalIngredientData
  ) => {
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

  const formatDateRange = (from: Date, to: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return `${from
      .toLocaleDateString("en-GB", options)
      .replace(/ /g, " ")} - ${to
      .toLocaleDateString("en-GB", options)
      .replace(/ /g, " ")}`;
  };

  const filteredRecipes = recipesList.filter((recipe) => {
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 pt-4 pb-4"> 
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveMainTab("recipe")}
                className={`pb-3 border-b-2 font-medium ${
                  activeMainTab === "recipe"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Recipe
              </button>
              <button
                onClick={() => setActiveMainTab("orders")}
                className={`pb-3 border-b-2 font-medium ${
                  activeMainTab === "orders"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Orders
              </button>
            </div>
 
            <div className="flex items-center gap-2">
              {activeMainTab === 'orders' && (  
                  <>
                  <span className="text-sm text-gray-600 whitespace-nowrap mr-4">
                    {formatDateRange(dateRange.from, dateRange.to)}
                  </span>
                  <button
                      onClick={() => setIsCalendarOpen(true)}
                      className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm whitespace-nowrap"
                  >
                      Date
                  </button>
                  </>
              )}

              {activeMainTab === 'recipe' && ( 
                <select
                  value={selectedProductFilter}
                  onChange={(e) => setSelectedProductFilter(e.target.value as "product" | "sub-product")}
                  className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm whitespace-nowrap appearance-none pr-8 bg-no-repeat bg-right" // appearance-none and bg-no-repeat for custom arrow
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em' }}
                >
                  <option value="product">Product</option>
                  <option value="sub-product">Sub - Product</option>
                </select>
              )} 
              <div className="relative flex-shrink-0 flex w-48">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-3 pr-2 py-2 bg-white rounded-l-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="flex-shrink-0 px-3 py-2 bg-black text-white rounded-r-md shadow-sm flex items-center justify-center -ml-px">
                  <Search size={20} />
                </button>
              </div> 
              <button
                onClick={handleOpenAddRecipeModal}
                className="flex-shrink-0 ms-10 ml-2 p-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center text-sm px-3"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {activeMainTab === "orders" && (
          <RecipeListTable
            recipes={filteredRecipes}
            onEdit={handleOpenEditRecipeModal}
            onDelete={handleDeleteRecipe}
          />
        )}

        {activeMainTab === "recipe" && (
          <div className="p-6">
            <MasterIngredientsList
              masterIngredients={masterIngredientsData}
              onEditMasterIngredient={handleOpenEditMasterIngredientModal}
              onDeleteMasterIngredient={handleDeleteMasterIngredient}
            />
          </div>
        )}
      </div>  
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onApply={handleDateRangeApply}
        initialFromDate={dateRange.from}
        initialToDate={dateRange.to}
      />
      <RecipeFormModal
        isOpen={isRecipeFormModalOpen}
        onClose={() => {
          setIsRecipeFormModalOpen(false);
          setEditingRecipe(null);
        }}
        onSubmit={handleRecipeFormSubmit}
        initialRecipe={editingRecipe}
        masterIngredientsList={masterIngredientsData}
      />
      <EditIngredientModal
        isOpen={isEditIngredientModalOpen}
        onClose={() => {
          setIsEditIngredientModalOpen(false);
          setEditingMasterIngredient(null);
        }}
        ingredient={editingMasterIngredient}
        onSubmit={handleMasterIngredientSubmit}
      />
    </div>
  );
};

export default RecipeManagement;