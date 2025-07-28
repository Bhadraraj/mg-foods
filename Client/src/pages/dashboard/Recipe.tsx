// RecipeManagement.tsx
import React, { useState } from "react";
import { useRecipeManagement } from "../dashboard/recipe/useRecipeManagement"; // Adjust path if necessary
import RecipeManagementHeader from "../dashboard/recipe/RecipeManagementHeader"; // Adjust path if necessary
import RecipeManagementContent from "../dashboard/recipe/RecipeManagementContent"; // Adjust path if necessary
import RecipeManagementModals from "../dashboard/recipe/RecipeManagementModals"; // Adjust path if necessary

// Import the AddOrder Component from its new separate file
import  AddOrder from "../dashboard/recipe/AddOrder"; 


const RecipeManagement: React.FC = () => {
  const {
    // State from useRecipeManagement hook
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

    // Modal states from useRecipeManagement hook
    isCalendarOpen,
    isRecipeFormModalOpen,
    isEditIngredientModalOpen,
    isAddDishVariantModalOpen, // Existing dish variant modal state

    // Setters from useRecipeManagement hook
    setActiveMainTab,
    setSearchTerm,
    setSelectedProductFilter,
    setIsCalendarOpen,
    setIsRecipeFormModalOpen,
    setIsEditIngredientModalOpen,
    setIsAddDishVariantModalOpen, // Existing dish variant modal setter
    setEditingRecipe,
    setEditingMasterIngredient,

    // Handlers from useRecipeManagement hook
    handleDateRangeApply,
    handleOpenAddRecipeModal,
    handleOpenEditRecipeModal,
    handleRecipeFormSubmit,
    handleDeleteRecipe,
    handleOpenEditMasterIngredientModal,
    handleMasterIngredientSubmit,
    handleDeleteMasterIngredient,
    handleAddDishVariant, // This seems to be for opening the Dish Variant modal
    handleDishVariantSubmit,
  } = useRecipeManagement();

  // State for the AddOrder modal
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Handler to open the AddOrder modal
  const handleOpenAddOrderModal = () => {
    setIsAddOrderOpen(true);
  };

  // Handler to close the AddOrder modal
  const handleCloseAddOrderModal = () => {
    setIsAddOrderOpen(false);
  };

  // Handler for AddOrder form submission
  const handleOrderSubmit = (orderData: any) => {
    console.log("Order submitted:", orderData);
    // In a real application, you would send this data to your backend
    // Example: call an API, update global state, refetch data, etc.

    // After submission, you might want to reset the form or close the modal
    handleCloseAddOrderModal(); // Close the modal after submission
    // Optionally, give user feedback (e.g., a toast notification)
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <RecipeManagementHeader
          activeMainTab={activeMainTab}
          onTabChange={setActiveMainTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateClick={() => setIsCalendarOpen(true)}
          selectedProductFilter={selectedProductFilter}
          onProductFilterChange={setSelectedProductFilter}
          onAddDishVariant={handleAddDishVariant} // This should open the dish variant modal
          onAddRecipe={handleOpenAddRecipeModal}
          onAddOrder={handleOpenAddOrderModal} // Passed to header for the '+' button
        />

        <RecipeManagementContent
          activeMainTab={activeMainTab}
          filteredRecipes={filteredRecipes}
          masterIngredientsData={masterIngredientsData}
          onEditRecipe={handleOpenEditRecipeModal}
          onDeleteRecipe={handleDeleteRecipe}
          onEditMasterIngredient={handleOpenEditMasterIngredientModal}
          onDeleteMasterIngredient={handleDeleteMasterIngredient}
        />
      </div>

      <RecipeManagementModals
        isCalendarOpen={isCalendarOpen}
        onCloseCalendar={() => setIsCalendarOpen(false)}
        onDateRangeApply={handleDateRangeApply}
        dateRange={dateRange}
        isRecipeFormModalOpen={isRecipeFormModalOpen}
        onCloseRecipeForm={() => {
          setIsRecipeFormModalOpen(false);
          setEditingRecipe(null);
        }}
        onRecipeFormSubmit={handleRecipeFormSubmit}
        editingRecipe={editingRecipe}
        masterIngredientsList={masterIngredientsData}
        isEditIngredientModalOpen={isEditIngredientModalOpen}
        onCloseEditIngredient={() => {
          setIsEditIngredientModalOpen(false);
          setEditingMasterIngredient(null);
        }}
        editingMasterIngredient={editingMasterIngredient}
        onMasterIngredientSubmit={handleMasterIngredientSubmit}
        isAddDishVariantModalOpen={isAddDishVariantModalOpen}
        onCloseAddDishVariant={() => setIsAddDishVariantModalOpen(false)}
        onDishVariantSubmit={handleDishVariantSubmit}
        availableProducts={availableProductsForVariants}
        availableSubProducts={availableSubProductsForVariants}
      />

      {/* Render the AddOrder modal conditionally */}
      <AddOrder
        isOpen={isAddOrderOpen}
        onClose={handleCloseAddOrderModal}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
};

export default RecipeManagement;