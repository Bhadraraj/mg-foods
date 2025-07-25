// components/balance-transactions/NewBalanceTransactionModal.tsx
import React, { useEffect } from 'react';

interface NewBalanceTransactionFormData {
  chooseOrigin: string;
  customerName: string;
  chooseBank: string;
  paymentMode: string;
  transactionNo: string;
  amount: string;
  date: string;
  accountType: 'Credit' | 'Debit';
  transactionType: 'Cash' | 'Bank';
  comment: string;
}

interface BalanceTransaction { // Ensure this matches the BalanceTransaction in BalanceTransactionView.tsx
  id: number;
  origin: string;
  customerName: string;
  transactionType: string;
  accountType: string;
  transactionDate: string;
  amount: number;
  settled: 'Yes' | 'No';
  comment: string;
}

interface NewBalanceTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: NewBalanceTransactionFormData;
  handleInputChange: (field: keyof NewBalanceTransactionFormData, value: string) => void;
  handleSubmit: (data: NewBalanceTransactionFormData) => void;
  transactionTypes: string[]; // This might be used for a dropdown, rename if it's confusing
  isEditing: boolean;
  initialData: BalanceTransaction | null; // Add initialData prop
}

const NewBalanceTransactionModal: React.FC<NewBalanceTransactionModalProps> = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  transactionTypes, // Not used in this modal directly, consider removing if not needed here
  isEditing,
  initialData, // Destructure initialData
}) => {
  useEffect(() => {
    if (isOpen && isEditing && initialData) {
      // Set form data based on initialData when in edit mode
      handleInputChange('chooseOrigin', initialData.origin);
      handleInputChange('customerName', initialData.customerName.split('\n')[0]); // Take name part
      handleInputChange('paymentMode', initialData.transactionType); // Maps table's Transaction type
      handleInputChange('transactionNo', initialData.comment.replace('IMPS No:\n', ''));
      handleInputChange('amount', initialData.amount.toString());
      handleInputChange('date', initialData.transactionDate.split('\n')[0]); // Take date part
      handleInputChange('accountType', initialData.accountType as 'Credit' | 'Debit');
      handleInputChange('transactionType', initialData.transactionType as 'Cash' | 'Bank'); // Maps to radio button
      handleInputChange('comment', initialData.comment);
      // You might need to add logic for chooseBank
    } else if (isOpen && !isEditing) {
      // Clear form data when adding new (if not already handled by parent)
      handleInputChange('chooseOrigin', '');
      handleInputChange('customerName', '');
      handleInputChange('chooseBank', '');
      handleInputChange('paymentMode', '');
      handleInputChange('transactionNo', '');
      handleInputChange('amount', '');
      handleInputChange('date', '');
      handleInputChange('accountType', 'Credit'); // Default for new
      handleInputChange('transactionType', 'Cash'); // Default for new
      handleInputChange('comment', '');
    }
  }, [isOpen, isEditing, initialData, handleInputChange]);

  if (!isOpen) return null;

  const origins = ["Vendor", "Customer", "Other"]; // Example origins
  const customers = ["Sri Senthi Points", "Another Customer"]; // Example customers
  const banks = ["Bank A", "Bank B", "Cash"]; // Example banks
  const paymentModes = ["Cash", "Bank", "UPI"]; // Example payment modes

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Old Balance" : "Add Old Balance"}</h2>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="chooseOrigin" className="block text-sm font-medium text-gray-700 mb-1">Choose Origin</label>
              <select
                id="chooseOrigin"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.chooseOrigin}
                onChange={(e) => handleInputChange("chooseOrigin", e.target.value)}
              >
                <option value="">Select</option>
                {origins.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <select
                id="customerName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
              >
                <option value="">Select</option>
                {customers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="chooseBank" className="block text-sm font-medium text-gray-700 mb-1">Choose Bank</label>
              <select
                id="chooseBank"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.chooseBank}
                onChange={(e) => handleInputChange("chooseBank", e.target.value)}
              >
                <option value="">Select</option>
                {banks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                id="paymentMode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.paymentMode}
                onChange={(e) => handleInputChange("paymentMode", e.target.value)}
              >
                <option value="">Select</option>
                {paymentModes.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="transactionNo" className="block text-sm font-medium text-gray-700 mb-1">Transaction No</label>
              <input
                type="text"
                id="transactionNo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.transactionNo}
                onChange={(e) => handleInputChange("transactionNo", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                id="amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="accountType"
                  value="Credit"
                  checked={formData.accountType === 'Credit'}
                  onChange={(e) => handleInputChange("accountType", e.target.value as 'Credit' | 'Debit')}
                />
                <span className="ml-2">Credit</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="accountType"
                  value="Debit"
                  checked={formData.accountType === 'Debit'}
                  onChange={(e) => handleInputChange("accountType", e.target.value as 'Credit' | 'Debit')}
                />
                <span className="ml-2">Debit</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="transactionType"
                  value="Cash"
                  checked={formData.transactionType === 'Cash'}
                  onChange={(e) => handleInputChange("transactionType", e.target.value as 'Cash' | 'Bank')}
                />
                <span className="ml-2">Cash</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="transactionType"
                  value="Bank"
                  checked={formData.transactionType === 'Bank'}
                  onChange={(e) => handleInputChange("transactionType", e.target.value as 'Cash' | 'Bank')}
                />
                <span className="ml-2">Bank</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              id="comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              rows={3}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBalanceTransactionModal;