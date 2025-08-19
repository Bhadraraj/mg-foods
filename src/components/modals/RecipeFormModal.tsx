// src/components/modals/RecipeFormModal.tsx
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { RecipeFormData, RecipeIngredient, MasterIngredientOption } from "../types";

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: RecipeFormData) => void;
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
    productName: "",
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    totalManufactured: 0,
    totalSold: 0,
    ingredients: [],
    manufacturingPrice: 0,
    totalCostOfIngredients: 0,
    serviceCharge: 0,
    sellingPrice: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialRecipe) {
        // Ensure date is in YYYY-MM-DD format for input type="date"
        const formattedDate = initialRecipe.date ?
            new Date(initialRecipe.date).toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0];

        setFormData({ ...initialRecipe, date: formattedDate });
      } else {
        setFormData({
          productName: "",
          date: new Date().toISOString().split('T')[0],
          totalManufactured: 0,
          totalSold: 0,
          ingredients: [],
          manufacturingPrice: 0,
          totalCostOfIngredients: 0,
          serviceCharge: 0,
          sellingPrice: 0,
        });
      }
    }
  }, [isOpen, initialRecipe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: (type === 'number' && name !== 'totalManufactured' && name !== 'totalSold') ? Number(value) : value // Exclude totalManufactured and totalSold from direct number conversion if they can be 0 or empty for initial input
    }));
  };

  const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };

    // When ingredient name changes, pre-fill unit if found in master list
    if (field === 'id') { // Changed 'name' to 'id' as we store master ingredient ID
        const selectedMasterIng = masterIngredientsList.find(ing => ing.id === value);
        if (selectedMasterIng) {
            updatedIngredients[index].name = selectedMasterIng.name; // Store display name
            updatedIngredients[index].unit = selectedMasterIng.unit;
        } else {
            updatedIngredients[index].name = ''; // Clear if not found
            updatedIngredients[index].unit = '';
        }
    }
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: '', name: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Calculate costs and prices
  useEffect(() => {
    let calculatedTotalCostOfIngredients = 0;
    formData.ingredients.forEach(ing => {
      const masterIng = masterIngredientsList.find(mi => mi.id === ing.id);
      if (masterIng && ing.quantity && !isNaN(parseFloat(ing.quantity))) {
        // Convert quantity based on unit for calculation
        let quantityInBaseUnit = parseFloat(ing.quantity);
        if (ing.unit === 'Gram' && masterIng.unit === 'Kg') {
          quantityInBaseUnit /= 1000; // Convert grams to kg if master is Kg
        } else if (ing.unit === 'Kg' && masterIng.unit === 'Gram') {
            quantityInBaseUnit *= 1000; // Convert kg to grams if master is Gram
        }
        calculatedTotalCostOfIngredients += quantityInBaseUnit * masterIng.purchasePrice;
      }
    });

    const calculatedManufacturingPrice = calculatedTotalCostOfIngredients + formData.serviceCharge;
    // For selling price, you'd typically add a profit margin to manufacturing price
    // For now, let's just make it manufacturingPrice + some fixed markup if not provided
    const calculatedSellingPrice = formData.sellingPrice > 0 ? formData.sellingPrice : calculatedManufacturingPrice * 1.2; // 20% markup example

    setFormData(prev => ({
      ...prev,
      totalCostOfIngredients: parseFloat(calculatedTotalCostOfIngredients.toFixed(2)),
      manufacturingPrice: parseFloat(calculatedManufacturingPrice.toFixed(2)),
      // Only update sellingPrice if it wasn't manually entered or if it's 0
      sellingPrice: prev.sellingPrice === 0 ? parseFloat(calculatedSellingPrice.toFixed(2)) : prev.sellingPrice,
    }));
  }, [formData.ingredients, formData.serviceCharge, masterIngredientsList, formData.sellingPrice]); // Recalculate when these change

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{initialRecipe ? "Edit Recipe/Order" : "Add New Recipe/Order"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-blue-600 mb-1">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-blue-600 mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="totalManufactured" className="block text-sm font-medium text-blue-600 mb-1">Total Manufactured</label>
              <input
                type="number"
                id="totalManufactured"
                name="totalManufactured"
                value={formData.totalManufactured}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="totalSold" className="block text-sm font-medium text-blue-600 mb-1">Total Sold</label>
              <input
                type="number"
                id="totalSold"
                name="totalSold"
                value={formData.totalSold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-md font-semibold text-blue-700 px-2">Ingredients Used</legend>
            {formData.ingredients.length === 0 && (
              <p className="text-gray-500 text-sm mb-3">No ingredients added yet. Click "Add Ingredient" to start.</p>
            )}
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <label htmlFor={`ingredient-name-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Ingredient</label>
                  <select
                    id={`ingredient-name-${index}`}
                    value={ingredient.id} // Store ID, not name
                    onChange={(e) => handleIngredientChange(index, 'id', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Ingredient</option>
                    {masterIngredientsList.map(masterIng => (
                      <option key={masterIng.id} value={masterIng.id}>
                        {masterIng.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`ingredient-quantity-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text" // Keep as text to allow "1/2" or "0.5"
                    id={`ingredient-quantity-${index}`}
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`ingredient-unit-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    id={`ingredient-unit-${index}`}
                    value={ingredient.unit}
                    readOnly // Unit is determined by master ingredient
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                    title="Remove Ingredient"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> Add Ingredient
            </button>
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="totalCostOfIngredients" className="block text-sm font-medium text-blue-600 mb-1">Total Cost of Ingredients (₹)</label>
              <input
                type="number"
                id="totalCostOfIngredients"
                name="totalCostOfIngredients"
                value={formData.totalCostOfIngredients}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="serviceCharge" className="block text-sm font-medium text-blue-600 mb-1">Service Charge (₹)</label>
              <input
                type="number"
                id="serviceCharge"
                name="serviceCharge"
                value={formData.serviceCharge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="manufacturingPrice" className="block text-sm font-medium text-blue-600 mb-1">Manufacturing Price (₹)</label>
              <input
                type="number"
                id="manufacturingPrice"
                name="manufacturingPrice"
                value={formData.manufacturingPrice}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="sellingPrice" className="block text-sm font-medium text-blue-600 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialRecipe ? "Update Order" : "Add Order"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormModal;