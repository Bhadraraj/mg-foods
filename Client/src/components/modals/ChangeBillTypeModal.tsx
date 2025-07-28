// components/modals/ChangeBillTypeModal.tsx
import React, { useState, useEffect } from 'react';

interface ChangeBillTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBillType: string; // Pass the current bill type
  onConfirm: (newType: string) => void;
}

const ChangeBillTypeModal: React.FC<ChangeBillTypeModalProps> = ({
  isOpen,
  onClose,
  currentBillType,
  onConfirm,
}) => {
  const [selectedType, setSelectedType] = useState(currentBillType);

  useEffect(() => {
    // Update selectedType if currentBillType changes while modal is open
    if (isOpen) {
      setSelectedType(currentBillType);
    }
  }, [isOpen, currentBillType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Change Bill</h2>
        <div className="mb-6">
          <label htmlFor="billType" className="block text-sm font-medium text-gray-700 mb-1">
            Change Bill type
          </label>
          <select
            id="billType"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="GST">GST</option>
            <option value="Estimation">Estimation</option>
            <option value="Proforma">Proforma</option>
            {/* Add other bill types as needed */}
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => { onConfirm(selectedType); onClose(); }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Change Bill
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeBillTypeModal;