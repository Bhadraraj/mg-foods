// src/components/modals/EditIngredientModal.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ModalIngredientData } from "../types"; // Import from types

interface EditIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: ModalIngredientData | null;
  onSubmit: (ingredient: ModalIngredientData) => void;
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ModalIngredientData | null>(null);

  useEffect(() => {
    if (ingredient && isOpen) {
      setFormData({ ...ingredient });
    } else {
      setFormData(null);
    }
  }, [ingredient, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'purchasePrice' || name === 'currentStock' ? Number(value) : value
    });
  };

  const handleSubmit = () => {
    if (formData) {
      onSubmit(formData);
      // Don't close here, let the parent component handle closing after onSubmit
      // This allows for parent to perform async ops or show feedback before closing
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Master Ingredient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">Ingredient name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">Unit</label>
              <select
                name="unit" value={formData.unit} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Gram">Gram</option>
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Piece">Piece</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">Purchase Price / Unit (₹)</label>
              <input
                type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">Current Stock</label>
              <input
                type="number" name="currentStock" value={formData.currentStock} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-3 mt-6">
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditIngredientModal;