// components/modals/PettyCashModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PettyCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PettyCashModal: React.FC<PettyCashModalProps> = ({ isOpen, onClose }) => {
  const [sourceOfExpense, setSourceOfExpense] = useState('');
  const [selectedLedger, setSelectedLedger] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState('2025-10-23'); // Default date as per image
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('Credit'); // Default
  const [billType, setBillType] = useState('GST Bill'); // Default
  const [taxPercentage, setTaxPercentage] = useState('0%'); // Default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      sourceOfExpense,
      selectedLedger,
      billNo,
      billDate,
      amount,
      description,
      transactionType,
      billType,
      taxPercentage,
    });
    // Add your form submission logic here (e.g., API call)
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Petty Cash</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Source of Expense */}
          <div>
            <label htmlFor="sourceOfExpense" className="block text-sm font-medium text-gray-700 mb-1">
              Source of expense <span className="text-red-500">*</span>
            </label>
            <select
              id="sourceOfExpense"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={sourceOfExpense}
              onChange={(e) => setSourceOfExpense(e.target.value)}
              required
            >
              <option value="">Select an option</option>
              <option value="Option1">Option 1</option>
              <option value="Option2">Option 2</option>
            </select>
          </div>

          {/* Select Ledger */}
          <div>
            <label htmlFor="selectedLedger" className="block text-sm font-medium text-gray-700 mb-1">
              Select Ledger
            </label>
            <select
              id="selectedLedger"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedLedger}
              onChange={(e) => setSelectedLedger(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="Ledger1">Ledger 1</option>
              <option value="Ledger2">Ledger 2</option>
            </select>
          </div>

          {/* Bill No */}
          <div>
            <label htmlFor="billNo" className="block text-sm font-medium text-gray-700 mb-1">
              Bill No
            </label>
            <input
              type="text"
              id="billNo"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
            />
          </div>

          {/* Choose (Credit/Debit) & Bill Type (GST/Non GST) & Tax Percentage */}
          <div className="flex flex-col space-y-4">
            {/* Choose (Credit/Debit) */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">Choose</span>
              <div className="flex space-x-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    name="transactionType"
                    value="Credit"
                    checked={transactionType === 'Credit'}
                    onChange={(e) => setTransactionType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Credit</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    name="transactionType"
                    value="Debit"
                    checked={transactionType === 'Debit'}
                    onChange={(e) => setTransactionType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Debit</span>
                </label>
              </div>
            </div>

            {/* Bill Type (GST/Non GST) */}
            <div>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    name="billType"
                    value="GST Bill"
                    checked={billType === 'GST Bill'}
                    onChange={(e) => setBillType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">GST Bill</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    name="billType"
                    value="Non GST bill"
                    checked={billType === 'Non GST bill'}
                    onChange={(e) => setBillType(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non GST bill</span>
                </label>
              </div>
            </div>

            {/* Tax Percentage */}
            {billType === 'GST Bill' && (
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['0%', '5%', '12%', '18%', '24%'].map(percentage => (
                    <label key={percentage} className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                        name="taxPercentage"
                        value={percentage}
                        checked={taxPercentage === percentage}
                        onChange={(e) => setTaxPercentage(e.target.value)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{percentage}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Date */}
          <div>
            <label htmlFor="billDate" className="block text-sm font-medium text-gray-700 mb-1">
              Bill Date
            </label>
            <input
              type="date"
              id="billDate"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2"> {/* Span across two columns */}
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PettyCashModal;