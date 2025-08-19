import React, { useState } from 'react';

interface AddRackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rackName: string) => void;
  existingRacks: string[];
}

const AddRackModal: React.FC<AddRackModalProps> = ({ isOpen, onClose, onSave, existingRacks }) => {
  const [rackName, setRackName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedRackName = rackName.trim();
    if (!trimmedRackName) {
      setError('Rack name cannot be empty.');
      return;
    }
    if (existingRacks.includes(trimmedRackName)) {
      setError('Rack name already exists.');
      return;
    }
    setError('');
    onSave(trimmedRackName);
    setRackName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-1">Add New Rack</h2>
        </div>

        <div className="mb-8">
          <label className="block text-gray-600 text-sm mb-2">Rack Name</label>
          <input
            type="text"
            value={rackName}
            onChange={(e) => {
              setRackName(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-600 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter rack name (e.g., Rack05)"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRackModal;
