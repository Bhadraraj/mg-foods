// Ledger/AddLedger.tsx
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface AddLedgerProps {
  onClose: () => void;
  onSave: (newLedgerData: { ledgerCategory: string; ledgerGroup: string; ledgerName: string; isTaxLedger: 'Yes' | 'No'; percentage: number }) => void;
}

const AddLedger: React.FC<AddLedgerProps> = ({ onClose, onSave }) => {
  const [ledgerCategory, setLedgerCategory] = useState<string>('');
  const [ledgerGroup, setLedgerGroup] = useState<string>('');
  const [ledgerName, setLedgerName] = useState<string>('');
  const [isTaxLedger, setIsTaxLedger] = useState<'Yes' | 'No'>('No');
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState<boolean>(false);

  const categoryOptions = ['Current Liabilities', 'Fixed Asset', 'Direct Income'];
  const groupOptions = ['Current Liabilities', 'Fixed Asset', 'Direct Income'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ledgerCategory,
      ledgerGroup,
      ledgerName,
      isTaxLedger,
      percentage: taxPercentage,
    });
  };

  const handleTaxPercentageChange = (percentage: number) => {
    setTaxPercentage(percentage);
    if (percentage > 0) {
      setIsTaxLedger('Yes');
    }
  };

  const handleTaxLedgerChange = (value: 'Yes' | 'No') => {
    setIsTaxLedger(value);
    if (value === 'No') {
      setTaxPercentage(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Ledger</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Ledger Category Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ledger Category
              </label>
              <button
                type="button"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <span className={ledgerCategory ? 'text-gray-900' : 'text-gray-400'}>
                  {ledgerCategory || 'Select Category'}
                </span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                  {categoryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50"
                      onClick={() => {
                        setLedgerCategory(option);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <span className="text-blue-600">{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ledger Group Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ledger Group
              </label>
              <button
                type="button"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                onClick={() => setShowGroupDropdown(!showGroupDropdown)}
              >
                <span className={ledgerGroup ? 'text-gray-900' : 'text-gray-400'}>
                  {ledgerGroup || 'Select Group'}
                </span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              {showGroupDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                  {groupOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50"
                      onClick={() => {
                        setLedgerGroup(option);
                        setShowGroupDropdown(false);
                      }}
                    >
                      <span className="text-blue-600">{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Tax Ledger Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tax Ledger
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <div className="relative">
                    <input
                      type="radio"
                      className="sr-only"
                      name="taxLedger"
                      value="Yes"
                      checked={isTaxLedger === 'Yes'}
                      onChange={() => handleTaxLedgerChange('Yes')}
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isTaxLedger === 'Yes' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {isTaxLedger === 'Yes' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <div className="relative">
                    <input
                      type="radio"
                      className="sr-only"
                      name="taxLedger"
                      value="No"
                      checked={isTaxLedger === 'No'}
                      onChange={() => handleTaxLedgerChange('No')}
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isTaxLedger === 'No' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {isTaxLedger === 'No' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Tax Percentage Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tax Percentage
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[0, 18, 5, 24, 12].map((percent) => (
                  <label key={percent} className="flex items-center">
                    <div className="relative">
                      <input
                        type="radio"
                        className="sr-only"
                        name="taxPercentage"
                        value={percent}
                        checked={taxPercentage === percent}
                        onChange={() => handleTaxPercentageChange(percent)}
                        disabled={isTaxLedger === 'No'}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        taxPercentage === percent ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      } ${isTaxLedger === 'No' ? 'opacity-50' : ''}`}>
                        {taxPercentage === percent && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className={`ml-3 text-gray-700 ${isTaxLedger === 'No' ? 'opacity-50' : ''}`}>
                      {percent}%
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLedger;