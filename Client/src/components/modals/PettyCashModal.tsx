import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PettyCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PettyCashModal: React.FC<PettyCashModalProps> = ({
  isOpen,
  onClose,
}) => {
  // State for form fields
  const [sourceOfExpense, setSourceOfExpense] = useState("");
  const [selectLedger, setSelectLedger] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState(""); // Will set default in useEffect
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("Credit"); // "Credit" or "Debit"
  const [billType, setBillType] = useState("GST Bill"); // "GST Bill" or "Non GST bill"
  const [taxPercentage, setTaxPercentage] = useState("0"); // "0", "5", "18", "24"

  // Set current date as default for Bill Date
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, "0");
      setBillDate(`${year}-${month}-${day}`);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log("Petty Cash Data:", {
      sourceOfExpense,
      selectLedger,
      billNo,
      billDate,
      amount,
      description,
      transactionType,
      billType,
      taxPercentage,
    });
    // You would typically send this data to a backend or update global state
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Petty Cash</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Source of Expense */}
          <div>
            <label
              htmlFor="sourceOfExpense"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Source of expense <span className="text-red-500">*</span>
            </label>
            <select
              id="sourceOfExpense"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={sourceOfExpense}
              onChange={(e) => setSourceOfExpense(e.target.value)}
              required
            >
              <option value="">Select source</option>
              <option value="Electricity Bill">Electricity Bill</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Travel Expenses">Travel Expenses</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          {/* Select Ledger */}
          <div>
            <label
              htmlFor="selectLedger"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Ledger
            </label>
            <select
              id="selectLedger"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectLedger}
              onChange={(e) => setSelectLedger(e.target.value)}
            >
              <option value="">Select ledger</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Petty Cash Account">Petty Cash Account</option>
            </select>
          </div>

          {/* Bill No */}
          <div>
            <label
              htmlFor="billNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bill No
            </label>
            <input
              type="text"
              id="billNo"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
            />
          </div>

          {/* Choose (Credit/Debit) */}
          <div className="flex items-center space-x-6 pt-2">
            <span className="text-sm font-medium text-gray-700">Choose</span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-gray-600 border-gray-300"
                name="transactionType"
                value="Credit"
                checked={transactionType === "Credit"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <span className="ml-2 text-gray-700 text-sm">Credit</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-gray-600 border-gray-300"
                name="transactionType"
                value="Debit"
                checked={transactionType === "Debit"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <span className="ml-2 text-gray-700 text-sm">Debit</span>
            </label>
          </div>

          {/* Bill Date */}
          <div>
            <label
              htmlFor="billDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bill Date
            </label>
            <input
              type="date"
              id="billDate"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
            />
          </div>

          {/* GST Bill / Non GST Bill */}
          <div className="flex items-center space-x-6 pt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-gray-600 border-gray-300"
                name="billType"
                value="GST Bill"
                checked={billType === "GST Bill"}
                onChange={(e) => setBillType(e.target.value)}
              />
              <span className="ml-2 text-gray-700 text-sm">GST Bill</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-gray-600 border-gray-300"
                name="billType"
                value="Non GST bill"
                checked={billType === "Non GST bill"}
                onChange={(e) => setBillType(e.target.value)}
              />
              <span className="ml-2 text-gray-700 text-sm">Non GST bill</span>
            </label>
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter Amount"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Tax Percentage */}
          <div className="pt-2">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Tax Percentage
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {["0", "5", "18", "24"].map((tax) => (
                <label key={tax} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-gray-600 border-gray-300"
                    name="taxPercentage"
                    value={tax}
                    checked={taxPercentage === tax}
                    onChange={(e) => setTaxPercentage(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700 text-sm">{tax}%</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description - spans both columns */}
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Modal Footer (Buttons) */}
          <div className="col-span-2 flex justify-end space-x-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
const PettyCashModalMain = () => {
  const [isOpen, setIsOpen] = useState(false); // Initially closed

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
      >
        Open Petty Cash Modal
      </button>

      <PettyCashModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default PettyCashModalMain;