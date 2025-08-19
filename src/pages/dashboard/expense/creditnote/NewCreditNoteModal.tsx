// components/credit-notes/NewCreditNoteModal.tsx
import React, { useEffect } from 'react';

interface NewCreditNoteFormData {
  chooseOrigin: string;
  name: string; // Customer Name
  ledger: string;
  amount: string;
  date: string; // Transaction date
  comment: string;
}

interface CreditNote { // Ensure this matches the CreditNote in CreditNoteView.tsx
  id: number;
  origin: string;
  name: string;
  gstNonGst: string;
  transactionDate: string;
  amount: number;
  comment: string;
}

interface NewCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: NewCreditNoteFormData;
  handleInputChange: (field: keyof NewCreditNoteFormData, value: string) => void;
  handleSubmit: (data: NewCreditNoteFormData) => void;
  isEditing: boolean;
  initialData: CreditNote | null; // Add initialData prop
}

const NewCreditNoteModal: React.FC<NewCreditNoteModalProps> = ({
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
      handleInputChange('chooseOrigin', initialData.origin);
      handleInputChange('name', initialData.name);
      handleInputChange('amount', initialData.amount.toString());
      handleInputChange('date', initialData.transactionDate.split(' ')[0]); // Take date part
      handleInputChange('comment', initialData.comment);
      // You might need to add logic for ledger if it's derived or stored elsewhere
    } else if (isOpen && !isEditing) {
      // Clear form data when adding new (if not already handled by parent)
      handleInputChange('chooseOrigin', '');
      handleInputChange('name', '');
      handleInputChange('ledger', '');
      handleInputChange('amount', '');
      handleInputChange('date', '');
      handleInputChange('comment', '');
    }
  }, [isOpen, isEditing, initialData, handleInputChange]);

  if (!isOpen) return null;

  const origins = ["Vendor", "Customer", "Other"]; // Example origins
  const names = ["Asian Points", "Another Name"]; // Example names (customers)
  const ledgers = ["Sales Returns", "Discount Received"]; // Example ledgers

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Credit Note Entry" : "Credit Note Entry"}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <select
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            >
              <option value="">Select</option>
              {names.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="ledger" className="block text-sm font-medium text-gray-700 mb-1">Ledger</label>
            <select
              id="ledger"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.ledger}
              onChange={(e) => handleInputChange("ledger", e.target.value)}
            >
              <option value="">Select</option>
              {ledgers.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
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

export default NewCreditNoteModal;