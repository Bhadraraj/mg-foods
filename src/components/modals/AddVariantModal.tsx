import React, { useState } from 'react';

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variantData: any) => void;
}

const AddVariantModal: React.FC<AddVariantModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [variantData, setVariantData] = useState({});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Variant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Size, Color, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Adjustment
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(variantData);
              onClose();
            }}
            className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVariantModal;