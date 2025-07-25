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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6">Add New Dish</h2>
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Product
          </button>
          <button className="pb-2 text-gray-500 hover:text-gray-700 font-medium">
            Sub - Product
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-full">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Product
              </label>
              <select
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Onion vada</option>
                <option value="Onion Vada Special">Onion Vada Special</option>
                <option value="Aloo Tikki">Aloo Tikki</option>
              </select>
            </div>
            <div className="md:col-span-full">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Ingredients
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="selectIngredient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Ingredients
                  </label>
                  <select
                    id="selectIngredient"
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="ingredientQuantity"
                      value={ingredientQuantity}
                      onChange={(e) => setIngredientQuantity(e.target.value)}
                      placeholder="e.g., 1 Kg"
                      className="mt-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="manufacturingPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Manufacturing Price
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Cost of Ingredients
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Charge
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Selling Price
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
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

            <div className="md:col-span-1 lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                Ingredients
              </h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[200px]">
                {formData.ingredients.length > 0 ? (
                  formData.ingredients.map((ing, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {ing.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateIngredientQuantity(index, -0.1)
                          }
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <MinusCircle size={18} />
                        </button>
                        <span className="text-sm text-gray-700">
                          {ing.quantity} 
                          {ing.unit.toLowerCase().includes("kg")
                            ? "Kg"
                            : ing.unit.toLowerCase().includes("gram")
                            ? "g"
                            : ing.unit}
                        </span> 
                         <button
                          type="button"
                          onClick={() =>
                            handleUpdateIngredientQuantity(index, 0.1)
                          }
                          className="p-1 text-gray-500 hover:text-green-600"
                        >
                          <PlusCircle size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No ingredients added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium" // Changed to black button
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
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
