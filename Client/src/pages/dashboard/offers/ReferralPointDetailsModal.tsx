import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ReferralPointDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CommissionType = 'price' | 'percentage';
// Updated PriceType to allow for string, as custom types will be strings
type PriceType = string;

// Interface for a single price entry
interface PriceEntry {
  id: string; // Unique ID for React keys
  priceType: PriceType | ''; // Price type from the dropdown
  commissionType: CommissionType;
  commissionValue: string;
  yearly: string;
  from: string;
  to: string;
}

const ReferralPointDetailsModal: React.FC<ReferralPointDetailsModalProps> = ({ isOpen, onClose }) => {
  // State to hold all price entries
  const [priceEntries, setPriceEntries] = useState<PriceEntry[]>([]);

  // State to hold all available price types, including custom ones
  const [availablePriceTypes, setAvailablePriceTypes] = useState<PriceType[]>([
    'Retail',
    'Selling Price',
    'Estimation',
    'Quotation',
    'MRP',
    'Store Retail Price',
    'Store Whole Price',
  ]);

  // State for the new custom price type input
  const [newCustomPriceType, setNewCustomPriceType] = useState('');

  useEffect(() => {
    // Initialize with one default entry when the modal opens, if no entries exist
    if (isOpen && priceEntries.length === 0) {
      handleAddPriceEntry();
    }
  }, [isOpen]); // Only run when isOpen changes

  // Helper function to create a new empty price entry
  const createNewPriceEntry = (): PriceEntry => ({
    id: Date.now().toString(), // Simple unique ID for now
    priceType: '', // Default empty
    commissionType: 'percentage', // Default to percentage
    commissionValue: '',
    yearly: '',
    from: '',
    to: '',
  });

  const handleAddPriceEntry = () => {
    setPriceEntries(prevEntries => [...prevEntries, createNewPriceEntry()]);
  };

  const handleRemovePriceEntry = (idToRemove: string) => {
    setPriceEntries(prevEntries => prevEntries.filter(entry => entry.id !== idToRemove));
  };

  const handlePriceEntryChange = (
    id: string,
    field: keyof PriceEntry,
    value: string
  ) => {
    setPriceEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Handler to add a new custom price type to the available options
  const handleAddCustomPriceType = () => {
    if (newCustomPriceType.trim() !== '' && !availablePriceTypes.includes(newCustomPriceType.trim())) {
      setAvailablePriceTypes(prevTypes => [...prevTypes, newCustomPriceType.trim()]);
      setNewCustomPriceType(''); // Clear input field
    } else if (availablePriceTypes.includes(newCustomPriceType.trim())) {
      alert('This price type already exists.');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating Referral Point Details:', priceEntries);
    // In a real application, you would send this data to your backend
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">Referral Point Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Add Custom Price Type Section */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Add Custom Price Type</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomPriceType}
                onChange={(e) => setNewCustomPriceType(e.target.value)}
                placeholder="Enter new price type (e.g., 'Wholesale Price')"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomPriceType}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={newCustomPriceType.trim() === ''}
              >
                Add Type
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[repeat(6,minmax(0,1fr))_40px] gap-x-4 gap-y-2 text-center text-sm font-semibold text-gray-600 border-b pb-2">
            <div>Price Type</div>
            <div>Commission Type</div>
            <div>Commission Value</div>
            <div>Yearly</div>
            <div>From</div>
            <div>To</div>
            <div></div> {/* For remove button */}
          </div>

          {/* Dynamic Price Entry Rows */}
          {priceEntries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-[repeat(6,minmax(0,1fr))_40px] items-center gap-x-4 gap-y-2">
              {/* Price Type Dropdown */}
              <select
                value={entry.priceType}
                onChange={(e) => handlePriceEntryChange(entry.id, 'priceType', e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                {availablePriceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Commission Type Dropdown */}
              <select
                value={entry.commissionType}
                onChange={(e) => handlePriceEntryChange(entry.id, 'commissionType', e.target.value as CommissionType)}
                className="border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage</option>
                <option value="price">Price</option>
              </select>

              {/* Commission Value Input */}
              <input
                type="text"
                value={entry.commissionValue}
                onChange={(e) => handlePriceEntryChange(entry.id, 'commissionValue', e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Value"
              />

              {/* Yearly Input */}
              <input
                type="text"
                value={entry.yearly}
                onChange={(e) => handlePriceEntryChange(entry.id, 'yearly', e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yearly"
              />

              {/* From Date Input */}
              <input
                type="date"
                value={entry.from}
                onChange={(e) => handlePriceEntryChange(entry.id, 'from', e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* To Date Input */}
              <input
                type="date"
                value={entry.to}
                onChange={(e) => handlePriceEntryChange(entry.id, 'to', e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemovePriceEntry(entry.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
                title="Remove Price Entry"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {/* Add New Price Button */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleAddPriceEntry}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus size={20} className="mr-2" /> Add New Price
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralPointDetailsModal;
