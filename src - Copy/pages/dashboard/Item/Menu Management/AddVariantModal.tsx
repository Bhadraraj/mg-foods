// src/components/AddVariantModal.tsx
import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface AddVariantModalProps {
  onClose: () => void;
  onSave: (variantName: string, imageUrl: string | null) => void;
}

const AddVariantModal: React.FC<AddVariantModalProps> = ({ onClose, onSave }) => {
  const [variantName, setVariantName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddClick = () => {
    if (variantName.trim() === "") {
      // In a real app, you might show a more user-friendly error message
      console.error("Variant Name cannot be empty.");
      return;
    }
    onSave(variantName.trim(), imagePreview);
    onClose(); // Close after saving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add new Variant</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="variantName" className="block text-sm font-medium text-gray-700 mb-1">
            Variant Name *
          </label>
          <input
            type="text"
            id="variantName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variant Image
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="variantImageUpload"
              onChange={handleImageChange}
            />
            <label
              htmlFor="variantImageUpload"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 text-sm"
            >
              <Plus size={16} className="mr-2" /> Add new image
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Variant Preview" className="h-16 w-16 object-cover rounded-md border border-gray-300" />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClick}
            className="px-6 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVariantModal;