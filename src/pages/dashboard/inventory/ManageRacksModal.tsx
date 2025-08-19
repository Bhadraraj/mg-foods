// src/inventory/ManageRacksModal.tsx
import React, { useState, useEffect } from 'react';

interface ItemRack {
  rack: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
}

interface ManageRacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemRacks: ItemRack[];
  onSave: (updatedRacks: ItemRack[]) => void;
  allRacks: string[]; // Added to provide existing racks for adding
}

const ManageRacksModal: React.FC<ManageRacksModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemRacks,
  onSave,
  allRacks,
}) => {
  // Use a local state to manage the racks within the modal for editing
  const [currentRacks, setCurrentRacks] = useState<ItemRack[]>([]);
  const [selectedExistingRack, setSelectedExistingRack] = useState('');

  // Initialize currentRacks when the modal opens or itemRacks prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentRacks(itemRacks);
      setSelectedExistingRack(''); // Reset dropdown when opening
    }
  }, [isOpen, itemRacks]);

  // Handle changes to currentStock, minStock, or maxStock for a specific rack
  const handleStockChange = (
    index: number,
    field: 'currentStock' | 'minStock' | 'maxStock',
    value: string
  ) => {
    const updatedRacks = [...currentRacks];
    // Ensure value is converted to a number, handling empty string as 0 or undefined as needed.
    // For number inputs, an empty string usually clears the input, which is handled correctly by Number().
    updatedRacks[index] = {
      ...updatedRacks[index],
      [field]: Number(value),
    };
    setCurrentRacks(updatedRacks);
  };

  // Handle removing a rack from the list in the modal
  const handleRemoveRack = (index: number) => {
    setCurrentRacks((prevRacks) => prevRacks.filter((_, i) => i !== index));
  };

  // Handle adding an existing rack to the item
  const handleAddExistingRack = () => {
    if (selectedExistingRack && !currentRacks.some(rack => rack.rack === selectedExistingRack)) {
      setCurrentRacks((prevRacks) => [
        ...prevRacks,
        {
          rack: selectedExistingRack,
          currentStock: 0, // Default current stock
          minStock: 0,     // Default min stock
          maxStock: 0,     // Default max stock
          status: 'Out Of Stock', // Default status for newly added rack
        },
      ]);
      setSelectedExistingRack(''); // Clear the select input
    }
  };

  // Handle saving all changes and closing the modal
  const handleSave = () => {
    // Basic validation: ensure all stock values are numbers
    const isValid = currentRacks.every(rack =>
      typeof rack.currentStock === 'number' &&
      typeof rack.minStock === 'number' &&
      typeof rack.maxStock === 'number' &&
      !isNaN(rack.currentStock) && !isNaN(rack.minStock) && !isNaN(rack.maxStock) // Also check for NaN
    );

    if (isValid) {
      onSave(currentRacks); // Pass the updated racks back to the parent
    } else {
      // Use an alert box as a fallback if custom message box is not implemented
      alert('Please ensure all stock values are valid numbers.');
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Manage Racks for {itemName}</h2>

        <div className="space-y-4 mb-4">
          {currentRacks.map((rack, index) => (
            <div key={rack.rack} className="flex flex-wrap items-center space-x-2 sm:space-x-4">
              <label className="w-20 sm:w-auto font-medium">{rack.rack}:</label>
              <input
                type="number" // Corrected to number
                value={rack.currentStock}
             
                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label={`Current stock for ${rack.rack}`}
              />
              <input
                type="number" // Corrected to number
                value={rack.minStock}        className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label={`Minimum stock for ${rack.rack}`}
              />
              <input
                type="number" // Corrected to number
                value={rack.maxStock}
                onChange={(e) => handleStockChange(index, 'maxStock', e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label={`Maximum stock for ${rack.rack}`}
              />
              <button
                onClick={() => handleRemoveRack(index)}
                className="text-red-600 hover:text-red-800 text-sm py-2 px-3 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <select
            value={selectedExistingRack}
            onChange={(e) => setSelectedExistingRack(e.target.value)}
            className="flex-grow w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Add existing rack...</option>
            {allRacks
              .filter(rackName => !currentRacks.some(r => r.rack === rackName)) // Filter out already assigned racks
              .map((rackName) => (
                <option key={rackName} value={rackName}>
                  {rackName}
                </option>
              ))}
          </select>
          <button
            onClick={handleAddExistingRack}
            disabled={!selectedExistingRack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
          >
            Add
          </button>
        </div>


        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRacksModal;
