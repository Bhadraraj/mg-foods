// src/components/modals/AddDishVariantModal.tsx

import React, { useState } from "react";
import { X, MinusCircle, PlusCircle, Plus } from "lucide-react"; // Import necessary icons

// Define types for your dish variant data
interface DishVariantIngredient {
  id: string; // Master ingredient ID
  name: string;
  quantity: string;
  unit: string;
}

interface DishVariantFormData {
  name: string;
  productId: string; // ID of the main product/recipe
  subProducts: DishVariantIngredient[];
  quantityPerProduct: string;
  totalCostOfIngredients: string;
}

// Define props for the modal
interface AddDishVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DishVariantFormData) => void;
  // You'll likely need to pass available products and sub-products for the selects
  // For now, these are placeholders:
  availableProducts: { id: string; name: string }[];
  availableSubProducts: { id: string; name: string; unit: string }[];
}

const AddDishVariantModal: React.FC<AddDishVariantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableProducts,
  availableSubProducts,
}) => {
  const [variantName, setVariantName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSubProducts, setSelectedSubProducts] = useState<
    DishVariantIngredient[]
  >([]);
  const [quantityPerProduct, setQuantityPerProduct] = useState("");
  const [totalCost, setTotalCost] = useState(""); // This will likely be calculated

  if (!isOpen) return null;

  const handleSubProductAdd = () => {
    // Logic to add a sub-product to the list.
    // This typically involves selecting from a dropdown and adding it to `selectedSubProducts`.
    // For now, let's add a dummy one.
    const newSubProductId = `sub_${Date.now()}`; // Placeholder ID
    const newSubProduct = availableSubProducts[0] || {id: newSubProductId, name: "New SubProduct", unit: "g"}; // Use a real sub-product or placeholder
    setSelectedSubProducts((prev) => [
      ...prev,
      {
        id: newSubProduct.id,
        name: newSubProduct.name,
        quantity: "0.1", // Default quantity
        unit: newSubProduct.unit,
      },
    ]);
  };

  const handleSubProductQuantityChange = (
    id: string,
    newQuantity: string,
    unit: string
  ) => {
    setSelectedSubProducts((prev) =>
      prev.map((sp) =>
        sp.id === id ? { ...sp, quantity: newQuantity, unit: unit } : sp
      )
    );
  };

  const handleSubProductRemove = (id: string) => {
    setSelectedSubProducts((prev) => prev.filter((sp) => sp.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!variantName || !selectedProductId || selectedSubProducts.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData: DishVariantFormData = {
      name: variantName,
      productId: selectedProductId,
      subProducts: selectedSubProducts,
      quantityPerProduct: quantityPerProduct,
      totalCostOfIngredients: totalCost, // You'll calculate this
    };
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Dish Variants
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="variantName"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Name
              </label>
              <input
                type="text"
                id="variantName"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Meals"
              />
            </div>

            <div>
              <label
                htmlFor="selectProduct"
                className="block text-sm font-medium text-gray-700"
              >
                Select Product
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="selectProduct"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => alert("Add new product functionality here!")}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="selectSubProducts"
                className="block text-sm font-medium text-gray-700"
              >
                Select Sub-products
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="selectSubProducts"
                  // You might need a more complex state for multi-select or 'add to list' logic
                  onChange={(e) => {
                    const subProductToAdd = availableSubProducts.find(
                      (sp) => sp.id === e.target.value
                    );
                    if (subProductToAdd && !selectedSubProducts.some(sp => sp.id === subProductToAdd.id)) {
                      setSelectedSubProducts((prev) => [
                        ...prev,
                        { ...subProductToAdd, quantity: "0.1" }, // Default quantity
                      ]);
                      e.target.value = ""; // Reset select after adding
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select</option>
                  {availableSubProducts.map((subProduct) => (
                    <option key={subProduct.id} value={subProduct.id}>
                      {subProduct.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSubProductAdd} // You can simplify this if the select handles it directly
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="quantityPerProduct"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity / Product
              </label>
              <input
                type="text"
                id="quantityPerProduct"
                value={quantityPerProduct}
                onChange={(e) => setQuantityPerProduct(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="totalCost"
                className="block text-sm font-medium text-gray-700"
              >
                Total Cost of Ingredients
              </label>
              <input
                type="text"
                id="totalCost"
                value={totalCost}
                readOnly // This is likely calculated, so make it read-only
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Right side: Sub Product List */}
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Sub Product
            </h3>
            <div className="space-y-2">
              {selectedSubProducts.length === 0 && (
                <p className="text-gray-500 text-sm">No sub-products added yet.</p>
              )}
              {selectedSubProducts.map((subProduct) => (
                <div
                  key={subProduct.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm"
                >
                  <span className="font-medium text-gray-800">
                    {subProduct.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSubProductRemove(subProduct.id)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <MinusCircle size={20} />
                    </button>
                    <input
                      type="text"
                      value={subProduct.quantity}
                      onChange={(e) =>
                        handleSubProductQuantityChange(
                          subProduct.id,
                          e.target.value,
                          subProduct.unit
                        )
                      }
                      className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 text-sm"
                    />
                    <span className="text-gray-600 text-sm">{subProduct.unit}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSubProductQuantityChange(
                          subProduct.id,
                          (parseFloat(subProduct.quantity) + 0.1).toFixed(1), // Example increment
                          subProduct.unit
                        )
                      }
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishVariantModal;