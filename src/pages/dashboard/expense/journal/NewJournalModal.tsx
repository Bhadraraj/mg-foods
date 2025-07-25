// components/journal/NewJournalModal.tsx
import React, { useEffect } from 'react';

interface NewJournalFormData {
  billTaxType: 'GST Bill' | 'Non GST Bill';
  chooseDebitCategory: string;
  chooseDebitBank: string;
  chooseCreditCategory: string;
  chooseCreditBank: string;
  billDate: string;
  totalAmount: string;
  billNo: string;
}

interface JournalEntry { // Ensure this matches the JournalEntry in JournalView.tsx
  id: number;
  billNo: string;
  billDate: string;
  financialYear: string;
  gstBill: 'yes' | 'no';
  amount: number;
}

interface NewJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: NewJournalFormData;
  handleInputChange: (field: keyof NewJournalFormData, value: string) => void;
  handleSubmit: (data: NewJournalFormData) => void;
  isEditing: boolean;
  initialData: JournalEntry | null; // Add initialData prop
}

const NewJournalModal: React.FC<NewJournalModalProps> = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  isEditing,
  initialData, // Destructure initialData
}) => {
  useEffect(() => {
    if (isOpen && isEditing && initialData) {
      // Set form data based on initialData when in edit mode
      handleInputChange('billNo', initialData.billNo);
      handleInputChange('billDate', initialData.billDate.split(' ')[0]); // Assuming date part only
      handleInputChange('totalAmount', initialData.amount.toString());
      handleInputChange('billTaxType', initialData.gstBill === 'yes' ? 'GST Bill' : 'Non GST Bill');
      // You might need to add logic for chooseDebitCategory, chooseDebitBank,
      // chooseCreditCategory, chooseCreditBank if they are present in initialData or derived.
    } else if (isOpen && !isEditing) {
      // Clear form data when adding new (if not already handled by parent)
      handleInputChange('billNo', '');
      handleInputChange('billDate', '');
      handleInputChange('totalAmount', '');
      handleInputChange('billTaxType', 'GST Bill'); // Default for new
      handleInputChange('chooseDebitCategory', '');
      handleInputChange('chooseDebitBank', '');
      handleInputChange('chooseCreditCategory', '');
      handleInputChange('chooseCreditBank', '');
    }
  }, [isOpen, isEditing, initialData, handleInputChange]);

  if (!isOpen) return null;

  const categories = ["Rent", "Utilities", "Salaries", "Supplies", "Other"]; // Example categories
  const banks = ["Bank A", "Bank B", "Cash"]; // Example banks

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Journal Entry" : "Add New Journal Entry"}</h2>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Debit</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.chooseDebitCategory}
                onChange={(e) => handleInputChange("chooseDebitCategory", e.target.value)}
              >
                <option value="">Choose Debit Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.chooseDebitBank}
                onChange={(e) => handleInputChange("chooseDebitBank", e.target.value)}
              >
                <option value="">Choose Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.chooseCreditCategory}
                onChange={(e) => handleInputChange("chooseCreditCategory", e.target.value)}
              >
                <option value="">Choose Credit Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.chooseCreditBank}
                onChange={(e) => handleInputChange("chooseCreditBank", e.target.value)}
              >
                <option value="">Choose Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill tax type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="billTaxType"
                  value="GST Bill"
                  checked={formData.billTaxType === 'GST Bill'}
                  onChange={(e) => handleInputChange("billTaxType", e.target.value as 'GST Bill' | 'Non GST Bill')}
                />
                <span className="ml-2">GST Bill</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="billTaxType"
                  value="Non GST Bill"
                  checked={formData.billTaxType === 'Non GST Bill'}
                  onChange={(e) => handleInputChange("billTaxType", e.target.value as 'GST Bill' | 'Non GST Bill')}
                />
                <span className="ml-2">Non GST Bill</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="billDate" className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
              <input
                type="date"
                id="billDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.billDate}
                onChange={(e) => handleInputChange("billDate", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                step="0.01"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="billNo" className="block text-sm font-medium text-gray-700 mb-1">Bill No</label>
              <input
                type="text"
                id="billNo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.billNo}
                onChange={(e) => handleInputChange("billNo", e.target.value)}
              />
            </div>
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

export default NewJournalModal;