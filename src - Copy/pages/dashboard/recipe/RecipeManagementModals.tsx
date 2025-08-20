import React from "react";
import { RecipeFormData, ModalIngredientData, MasterIngredientOption } from "../../../components/types";
import CalendarModal from "../../../components/modals/CalendarModal";
import EditIngredientModal from "../../../components/modals/EditIngredientModal";
import RecipeFormModal from "./RecipeFormModal";
import AddDishVariantModal from "./AddDishVariantModal";

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

interface RecipeManagementModalsProps {
  // Calendar Modal
  isCalendarOpen: boolean;
  onCloseCalendar: () => void;
  onDateRangeApply: (fromDate: Date, toDate: Date) => void;
  dateRange: { from: Date; to: Date };

  // Recipe Form Modal
  isRecipeFormModalOpen: boolean;
  onCloseRecipeForm: () => void;
  onRecipeFormSubmit: (data: RecipeFormData) => void;
  editingRecipe: RecipeFormData | null;
  masterIngredientsList: MasterIngredientOption[];

  // Edit Ingredient Modal
  isEditIngredientModalOpen: boolean;
  onCloseEditIngredient: () => void;
  editingMasterIngredient: ModalIngredientData | null;
  onMasterIngredientSubmit: (data: ModalIngredientData) => void;

  // Add Dish Variant Modal
  isAddDishVariantModalOpen: boolean;
  onCloseAddDishVariant: () => void;
  onDishVariantSubmit: (data: DishVariantFormData) => void;
  availableProducts: Array<{ id: string; name: string }>;
  availableSubProducts: Array<{ id: string; name: string; unit: string }>;
}

const RecipeManagementModals: React.FC<RecipeManagementModalsProps> = ({
  isCalendarOpen,
  onCloseCalendar,
  onDateRangeApply,
  dateRange,
  isRecipeFormModalOpen,
  onCloseRecipeForm,
  onRecipeFormSubmit,
  editingRecipe,
  masterIngredientsList,
  isEditIngredientModalOpen,
  onCloseEditIngredient,
  editingMasterIngredient,
  onMasterIngredientSubmit,
  isAddDishVariantModalOpen,
  onCloseAddDishVariant,
  onDishVariantSubmit,
  availableProducts,
  availableSubProducts,
}) => {
  return (
    <>
      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={onCloseCalendar}
        onApply={onDateRangeApply}
        initialFromDate={dateRange.from}
        initialToDate={dateRange.to}
      />

      {/* Recipe Form Modal */}
      <RecipeFormModal
        isOpen={isRecipeFormModalOpen}
        onClose={onCloseRecipeForm}
        onSubmit={onRecipeFormSubmit}
        initialRecipe={editingRecipe}
        masterIngredientsList={masterIngredientsList}
      />

      {/* Edit Ingredient Modal */}
      <EditIngredientModal
        isOpen={isEditIngredientModalOpen}
        onClose={onCloseEditIngredient}
        ingredient={editingMasterIngredient}
        onSubmit={onMasterIngredientSubmit}
      />

      {/* Add Dish Variant Modal */}
      <AddDishVariantModal
        isOpen={isAddDishVariantModalOpen}
        onClose={onCloseAddDishVariant}
        onSubmit={onDishVariantSubmit}
        availableProducts={availableProducts}
        availableSubProducts={availableSubProducts}
      />
    </>
  );
};

export default RecipeManagementModals;