import React from "react";
import { Recipe, MasterIngredientOption } from "../../../components/types";
import RecipeListTable from "./RecipeListTable";
import MasterIngredientsList from "./MasterIngredientsList";

interface RecipeManagementContentProps {
  activeMainTab: "recipe" | "orders";
  filteredRecipes: Recipe[];
  masterIngredientsData: MasterIngredientOption[];
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
  onEditMasterIngredient: (ingredient: MasterIngredientOption) => void;
  onDeleteMasterIngredient: (id: string) => void;
}

const RecipeManagementContent: React.FC<RecipeManagementContentProps> = ({
  activeMainTab,
  filteredRecipes,
  masterIngredientsData,
  onEditRecipe,
  onDeleteRecipe,
  onEditMasterIngredient,
  onDeleteMasterIngredient,
}) => {
  return (
    <>
      {activeMainTab === "orders" && (
        <RecipeListTable
          recipes={filteredRecipes}
          onEdit={onEditRecipe}
          onDelete={onDeleteRecipe}
        />
      )}

      {activeMainTab === "recipe" && (
        <div className="p-6">
          <MasterIngredientsList
            masterIngredients={masterIngredientsData}
            onEditMasterIngredient={onEditMasterIngredient}
            onDeleteMasterIngredient={onDeleteMasterIngredient}
          />
        </div>
      )}
    </>
  );
};

export default RecipeManagementContent;