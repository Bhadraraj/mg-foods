import React, { useState } from 'react';

interface AddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partyData: any) => void;
  mode?: 'add' | 'edit';
  initialData?: any;
}

const AddPartyModal: React.FC<AddPartyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  initialData = {}
}) => {
  const [partyData, setPartyData] = useState(initialData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{mode === 'add' ? 'Add New Party' : 'Edit Party'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Party Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Party Type *
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select type</option>
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Limit
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
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
              onSave(partyData);
              onClose();
            }}
            className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          >
            {mode === 'add' ? 'Add Party' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPartyModal;