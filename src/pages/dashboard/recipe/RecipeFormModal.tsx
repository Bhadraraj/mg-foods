// src/components/modals/RecipeFormModal.tsx
import React, { useState, useEffect } from "react";
import { X, MinusCircle, PlusCircle } from "lucide-react";
import {
  RecipeFormData,
  MasterIngredientOption,
  RecipeIngredient,
} from "../../../components/types";

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecipeFormData) => void;
  initialRecipe: RecipeFormData | null;
  masterIngredientsList: MasterIngredientOption[];
}

const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialRecipe,
  masterIngredientsList,
}) => {
  const [activeTab, setActiveTab] = useState<"product" | "subproduct">(
    "product"
  );
  const [formData, setFormData] = useState<RecipeFormData>({
    id: "",
    productName: "",
    date: new Date().toISOString().split("T")[0],
    totalManufactured: 0,
    totalSold: 0,
    balance: 0,
    ingredients: [],
    manufacturingPrice: 0,
    totalCostOfIngredients: 0,
    serviceCharge: 0,
    sellingPrice: 0,
  });

  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");
  const [ingredientQuantity, setIngredientQuantity] = useState<string>("");

  useEffect(() => {
    if (initialRecipe) {
      setFormData(initialRecipe);
    } else {
      setFormData({
        id: "",
        productName: "",
        date: new Date().toISOString().split("T")[0],
        totalManufactured: 0,
        totalSold: 0,
        balance: 0,
        ingredients: [],
        manufacturingPrice: 0,
        totalCostOfIngredients: 0,
        serviceCharge: 0,
        sellingPrice: 0,
      });
    }
    setSelectedIngredientId("");
    setIngredientQuantity("");
    // Reset to product tab when modal opens
    setActiveTab("product");
  }, [isOpen, initialRecipe]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalManufactured" ||
        name === "totalSold" ||
        name === "manufacturingPrice" ||
        name === "totalCostOfIngredients" ||
        name === "serviceCharge" ||
        name === "sellingPrice"
          ? Number(value)
          : value,
    }));
  };

  const handleAddIngredient = () => {
    if (selectedIngredientId && ingredientQuantity) {
      const ingredient = masterIngredientsList.find(
        (ing) => ing.id === selectedIngredientId
      );
      if (ingredient) {
        const newIngredient: RecipeIngredient = {
          id: ingredient.id,
          name: ingredient.name,
          quantity: ingredientQuantity,
          unit: ingredient.unit,
        };
        setFormData((prev) => ({
          ...prev,
          ingredients: [...prev.ingredients, newIngredient],
        }));
        setSelectedIngredientId("");
        setIngredientQuantity("");
      }
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateIngredientQuantity = (index: number, change: number) => {
    setFormData((prev) => {
      const updatedIngredients = [...prev.ingredients];
      const currentQuantity = parseFloat(updatedIngredients[index].quantity);
      const updatedQuantity = currentQuantity + change;

      if (updatedQuantity >= 0) {
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          quantity: updatedQuantity.toString(),
        };
      }
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New Dish
        </h2>

        {/* Product/Sub-Product Tabs */}
        <div className="flex space-x-8 mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("product")}
            className={`pb-3 font-medium ${
              activeTab === "product"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Product
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subproduct")}
            className={`pb-3 font-medium ${
              activeTab === "subproduct"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sub - Product
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Select Product */}
          <div className="mb-6">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-blue-600 mb-2"
            >
              {activeTab === "product"
                ? "Select Product"
                : "Select/Enter Product"}
            </label>
            <select
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="block w-full max-w-md border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">
                {activeTab === "product" ? "Onion vada" : "Coconut Chutney"}
              </option>
              {activeTab === "product" ? (
                <>
                  <option value="Onion Vada">Onion Vada</option>
                  <option value="Onion Vada Special">Onion Vada Special</option>
                  <option value="Aloo Tikki">Aloo Tikki</option>
                  <option value="Samosa">Samosa</option>
                  <option value="Dosa">Dosa</option>
                </>
              ) : (
                <>
                  <option value="Coconut Chutney">Coconut Chutney</option>
                  <option value="Mint Chutney">Mint Chutney</option>
                  <option value="Tomato Chutney">Tomato Chutney</option>
                  <option value="Tamarind Chutney">Tamarind Chutney</option>
                  <option value="Coriander Chutney">Coriander Chutney</option>
                </>
              )}
            </select>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Ingredients Selection and Price Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ingredients Section */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 mb-4">
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="selectIngredient"
                      className="block text-sm font-medium text-blue-600 mb-2"
                    >
                      Select Ingredients
                    </label>
                    <select
                      id="selectIngredient"
                      value={selectedIngredientId}
                      onChange={(e) => setSelectedIngredientId(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Ingredient</option>
                      {masterIngredientsList.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="ingredientQuantity"
                      className="block text-sm font-medium text-blue-600 mb-2"
                    >
                      Quantity
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="ingredientQuantity"
                        value={ingredientQuantity}
                        onChange={(e) => setIngredientQuantity(e.target.value)}
                        placeholder="e.g. 1 kg or 500 g"
                        className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />

                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="manufacturingPrice"
                    className="block text-sm font-medium text-blue-600 mb-2"
                  >
                    Manufacturing Price
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="manufacturingPrice"
                      name="manufacturingPrice"
                      value={formData.manufacturingPrice}
                      onChange={handleChange}
                      className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="20"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="totalCostOfIngredients"
                    className="block text-sm font-medium text-blue-600 mb-2"
                  >
                    Total Cost of ingredients
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="totalCostOfIngredients"
                      name="totalCostOfIngredients"
                      value={formData.totalCostOfIngredients}
                      onChange={handleChange}
                      className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="20"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="serviceCharge"
                    className="block text-sm font-medium text-blue-600 mb-2"
                  >
                    Service Charge
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="serviceCharge"
                      name="serviceCharge"
                      value={formData.serviceCharge}
                      onChange={handleChange}
                      className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="20"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="sellingPrice"
                    className="block text-sm font-medium text-blue-600 mb-2"
                  >
                    Selling Price
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="sellingPrice"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Ingredients List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium text-blue-600 mb-4">
                Ingredients
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
                {formData.ingredients.length > 0 ? (
                  <div className="space-y-3">
                    {formData.ingredients.map((ing, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {ing.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateIngredientQuantity(index, -0.1)
                            }
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <MinusCircle size={20} />
                          </button>
                          <span className="text-sm text-gray-700 min-w-[80px] text-center">
                            {(() => {
                              const qty = parseFloat(ing.quantity);
                              const unit = ing.unit.toLowerCase();

                              if (unit.includes("g") && qty >= 1000) {
                                return `${(qty / 1000).toFixed(1)} kg`;
                              } else if (unit.includes("kg") && qty < 1) {
                                return `${(qty * 1000).toFixed(0)} g`;
                              } else if (unit.includes("kg")) {
                                return `${qty.toFixed(1)} kg`;
                              } else {
                                return `${qty.toFixed(0)} g`;
                              }
                            })()}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateIngredientQuantity(index, 0.1)
                            }
                            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          >
                            <PlusCircle size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">
                      No ingredients added yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormModal;
