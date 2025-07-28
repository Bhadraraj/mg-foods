import React, { useState, useEffect } from "react";
import { X, Info } from "lucide-react"; // Import Info icon

// Assuming these types are defined in ../types.ts
// For this self-contained example, they are defined here.
export interface ModalIngredientData { // This represents an item from the master ingredient list
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  currentStock: number;
}

export interface SelectedIngredient { // This represents an ingredient chosen for a product
  id: string;
  name: string;
  quantity: number;
  unit: string; // Unit of the selected quantity (e.g., "g", "ml", "piece")
}

export interface ModalProductData { // This represents the data for the product being edited
  id: string;
  productName: string; // e.g., "Omrveda"
  productQuantity: number; // e.g., 160
  manufacturingPrice: number; // e.g., 35
  totalCost: number; // e.g., 50
  serviceCharge: number; // e.g., 30
  sellingPrice: number; // e.g., 105
  selectedIngredients: SelectedIngredient[];
}

interface EditIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  // The 'ingredient' prop now represents the 'product' data to be edited
  product: ModalProductData | null; // Changed from 'ingredient' to 'product'
  onSubmit: (product: ModalProductData) => void; // Changed type of submission
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
  isOpen,
  onClose,
  product, // Changed prop name to 'product'
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ModalProductData | null>(null);
  const [selectedIngredientToAdd, setSelectedIngredientToAdd] = useState<string>(''); // Stores ID of ingredient to add
  const [quantityToAdd, setQuantityToAdd] = useState<number>(0); // Stores quantity for ingredient to add

  // Mock data for product options and ingredient options
  // In a real application, these would likely come from an API or context
  const productOptions = [
    { id: 'prod1', name: 'Omrveda' },
    { id: 'prod2', name: 'Product B' },
    { id: 'prod3', name: 'Product C' },
  ];

  const ingredientOptions: ModalIngredientData[] = [
    { id: 'ing1', name: 'IngredientID1', unit: 'Gram', purchasePrice: 10, currentStock: 1000 },
    { id: 'ing2', name: 'IngredientID2', unit: 'Liter', purchasePrice: 5, currentStock: 500 },
    { id: 'ing3', name: 'IngredientID3', unit: 'Piece', purchasePrice: 2, currentStock: 200 },
    { id: 'ing4', name: 'IngredientID4', unit: 'Kg', purchasePrice: 20, currentStock: 2000 },
  ];

  // Effect to initialize form data when modal opens or product prop changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData({ ...product });
    } else if (isOpen) {
      // Initialize with default values if no product is provided but modal is open
      setFormData({
        id: '',
        productName: productOptions[0].name, // Default to first product option
        productQuantity: 0,
        manufacturingPrice: 0,
        totalCost: 0,
        serviceCharge: 0,
        sellingPrice: 0,
        selectedIngredients: [],
      });
    } else {
      // Reset form data when modal closes
      setFormData(null);
    }
  }, [product, isOpen]);

  // Handle changes for all input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (!prevData) return null;
      // Convert numerical inputs to numbers
      const isNumberField = [
        'productQuantity',
        'manufacturingPrice',
        'totalCost',
        'serviceCharge',
        'sellingPrice',
      ].includes(name);

      return {
        ...prevData,
        [name]: isNumberField ? Number(value) : value,
      };
    });
  };

  // Handle adding a new ingredient to the product's recipe
  const handleAddIngredient = () => {
    if (!formData || !selectedIngredientToAdd || quantityToAdd <= 0) {
      // In a real app, you'd show a user-friendly message here (e.g., a toast notification)
      console.warn("Please select an ingredient and enter a valid quantity.");
      return;
    }

    const ingredientDetail = ingredientOptions.find(
      (ing) => ing.id === selectedIngredientToAdd
    );

    if (ingredientDetail) {
      const newSelectedIngredient: SelectedIngredient = {
        id: ingredientDetail.id,
        name: ingredientDetail.name,
        quantity: quantityToAdd,
        unit: ingredientDetail.unit, // Use the unit from the master ingredient
      };

      setFormData((prevData) => {
        if (!prevData) return null;
        // Check if ingredient already exists in the list, if so, update its quantity
        const existingIndex = prevData.selectedIngredients.findIndex(
          (ing) => ing.id === newSelectedIngredient.id
        );

        if (existingIndex > -1) {
          const updatedIngredients = [...prevData.selectedIngredients];
          updatedIngredients[existingIndex].quantity += newSelectedIngredient.quantity;
          return {
            ...prevData,
            selectedIngredients: updatedIngredients,
          };
        } else {
          // Otherwise, add the new ingredient
          return {
            ...prevData,
            selectedIngredients: [...prevData.selectedIngredients, newSelectedIngredient],
          };
        }
      });
      // Reset selection fields after adding
      setSelectedIngredientToAdd('');
      setQuantityToAdd(0);
    }
  };

  // Handle removing an ingredient from the product's recipe
  const handleRemoveIngredient = (id: string) => {
    if (!formData) return;
    setFormData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        selectedIngredients: prevData.selectedIngredients.filter((ing) => ing.id !== id),
      };
    });
  };

  // Handles the main form submission
  const handleSubmit = () => {
    if (formData) {
      onSubmit(formData);
      // The parent component is responsible for closing the modal after submission
    }
  };

  // Placeholder for the "Update" button functionality (currently same as submit)
  const handleUpdate = () => {
    handleSubmit();
  };

  // Placeholder for the "Convert" button functionality
  const handleConvert = () => {
    console.log("Convert button clicked. (Functionality to be implemented)");
    // Add conversion logic here
  };

  // Render nothing if modal is not open or form data is not ready
  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Edit Master Ingredient <Info size={20} className="text-gray-500" />
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full p-1">
            <X size={24} />
          </button>
        </div>

        {/* Product Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-blue-600 mb-3">Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {productOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div> */}
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-blue-600 mb-3">Ingredients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Add Ingredient */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select an ingredient</label>
                <select
                  value={selectedIngredientToAdd}
                  onChange={(e) => setSelectedIngredientToAdd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select --</option>
                  {ingredientOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} ({option.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAddIngredient}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
              >
                Add Ingredient
              </button>
            </div>

            {/* Right side: Selected Ingredients List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Ingredients</label>
              <div className="border border-gray-200 rounded-md p-3 min-h-[120px] max-h-[200px] overflow-y-auto bg-gray-50">
                {formData.selectedIngredients.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No ingredients added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {formData.selectedIngredients.map((ing) => (
                      <li key={ing.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm border border-gray-100">
                        <span className="text-gray-800 font-medium">{ing.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">{ing.quantity} {ing.unit}</span>
                          <button
                            onClick={() => handleRemoveIngredient(ing.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                            aria-label={`Remove ${ing.name}`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Price Fields */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Manufacturing Price (₹)</label>
              <input
                type="number"
                name="manufacturingPrice"
                value={formData.manufacturingPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Total Cost (₹)</label>
              <input
                type="number"
                name="totalCost"
                value={formData.totalCost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Service Charge (₹)</label>
              <input
                type="number"
                name="serviceCharge"
                value={formData.serviceCharge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-3">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-colors"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 shadow-md transition-colors"
            >
              Cancel
            </button>
          </div>
          {/* <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-colors"
            >
              Submit
            </button>
            
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EditIngredientModal;
