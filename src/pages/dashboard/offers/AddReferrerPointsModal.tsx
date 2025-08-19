import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddReferrerPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the possible types for calculations
type CalculationType = 'yearly' | 'price' | 'percentage' | '';

const AddReferrerPointsModal: React.FC<AddReferrerPointsModalProps> = ({ isOpen, onClose }) => {
  const [selectedReferrer, setSelectedReferrer] = useState('');
  const [chosenOption, setChosenOption] = useState<CalculationType>(''); // State to control visible inputs
  const [commissionPoints, setCommissionPoints] = useState<number | ''>(''); // Changed to number type
  const [yearlyValue, setYearlyValue] = useState<number | ''>(''); // Renamed for clarity, changed to number
  const [priceTotal, setPriceTotal] = useState<number | ''>(''); // For 'price' calculation
  const [percentageValue, setPercentageValue] = useState<number | ''>(''); // For 'percentage' calculation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToLog: { [key: string]: any } = {
      selectedReferrer,
      chosenOption,
    };

    // Conditionally add values based on chosenOption
    if (chosenOption === 'yearly') {
      dataToLog.yearlyPoints = yearlyValue;
      dataToLog.commissionPoints = commissionPoints; // Assuming commission points still apply
    } else if (chosenOption === 'price') {
      dataToLog.priceTotal = priceTotal;
    } else if (chosenOption === 'percentage') {
      dataToLog.percentageValue = percentageValue;
    }

    console.log('Adding Referrer Points:', dataToLog);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Redeem</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="selectReferrer" className="block text-sm font-medium text-blue-700 mb-1">
              Choose referrer
            </label>
            <div className="relative">
              <select
                id="selectReferrer"
                value={selectedReferrer}
                onChange={(e) => setSelectedReferrer(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                required
              >
                <option value="">Select a referrer...</option>
                <option value="referrer1">Referrer A</option>
                <option value="referrer2">Referrer B</option>
                <option value="referrer3">Referrer C</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="chosenOption" className="block text-sm font-medium text-blue-700 mb-1">
              Choose Calculation Type
            </label>
            <div className="relative">
              <select
                id="chosenOption"
                value={chosenOption}
                onChange={(e) => {
                  setChosenOption(e.target.value as CalculationType);
                  // Reset relevant fields when the option changes
                  setCommissionPoints('');
                  setYearlyValue('');
                  setPriceTotal('');
                  setPercentageValue('');
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                required
              >
                <option value="">Select...</option>
                <option value="yearly">Yearly Points</option>
                <option value="price">Price Total</option>
                <option value="percentage">Percentage</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Conditional Inputs based on chosenOption */}
          {chosenOption === 'yearly' && (
            <>
              <div>
                <label htmlFor="commissionPts" className="block text-sm font-medium text-blue-700 mb-1">
                  Commission Points (Overall Reference Points)
                </label>
                <input
                  type="number" // Changed to number
                  id="commissionPts"
                  value={commissionPoints}
                  onChange={(e) => setCommissionPoints(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="yearlyValue" className="block text-sm font-medium text-blue-700 mb-1">
                  Yearly Points
                </label>
                <input
                  type="number" // Changed to number
                  id="yearlyValue"
                  value={yearlyValue}
                  onChange={(e) => setYearlyValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </>
          )}

          {chosenOption === 'price' && (
            <div>
              <label htmlFor="priceTotal" className="block text-sm font-medium text-blue-700 mb-1">
                Price Total
              </label>
              <input
                type="number" // Changed to number
                id="priceTotal"
                value={priceTotal}
                onChange={(e) => setPriceTotal(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          )}

          {chosenOption === 'percentage' && (
            <div>
              <label htmlFor="percentageValue" className="block text-sm font-medium text-blue-700 mb-1">
                Percentage (%)
              </label>
              <input
                type="number" // Changed to number
                id="percentageValue"
                value={percentageValue}
                onChange={(e) => setPercentageValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0" // Percentages are usually between 0 and 100
                max="100"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReferrerPointsModal;