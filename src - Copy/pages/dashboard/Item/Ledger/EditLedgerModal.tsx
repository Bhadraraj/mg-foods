import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Using the same Ledger interface from your table
interface Ledger {
  slNo: string;
  ledgerCategory: string;
  ledgerGroup: string;
  ledgerName: string;
  tax: string;
  percentage: number;
}

interface EditLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ledger: Ledger | null;
  onUpdate: (updatedLedger: Ledger) => void;
  predefinedCategories: string[]; // Pass predefined values for dropdowns
  predefinedGroups: string[];
}

const EditLedgerModal: React.FC<EditLedgerModalProps> = ({
  isOpen,
  onClose,
  ledger,
  onUpdate,
  predefinedCategories,
  predefinedGroups
}) => {
  // State to manage the form fields
  const [formData, setFormData] = useState<Ledger | null>(ledger);

  // Update form data when the selected ledger changes
  useEffect(() => {
    setFormData(ledger);
  }, [ledger]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleUpdateClick = () => {
    if (formData) {
      onUpdate(formData);
    }
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Edit Ledger</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body (Form) */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Name</label>
            <input
              type="text"
              name="ledgerName"
              value={formData.ledgerName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Category</label>
            <select
              name="ledgerCategory"
              value={formData.ledgerCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Group</label>
            <select
              name="ledgerGroup"
              value={formData.ledgerGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {predefinedGroups.map(group => <option key={group} value={group}>{group}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center p-4 border-t space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLedgerModal;