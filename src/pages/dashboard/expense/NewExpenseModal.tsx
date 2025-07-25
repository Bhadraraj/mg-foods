// components/expenses/NewExpenseModal.tsx
import React, { useState, useEffect } from 'react';
 
interface Expense {
  id: number;
  entryDate: string;
  transactionType: string;
  voucherNo: string;
  txnRefNo: string;
  comments: string;
  transactionDate: string;
  credit: number;
  debit: number;
  balanceAmount: number;
}

interface NewExpenseFormData {
  ledger: string;
  bankName: string;
  financialYear: string;
  paymentMode: string;
  transactionNo: string;
  debitAmount: string;
  vendorName: string;
  purchaseId: string;
  comment: string;
}

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: NewExpenseFormData; // Now this will be managed by parent (ExpenseView) for pre-filling
  handleInputChange: (field: keyof NewExpenseFormData, value: string) => void;
  handleSubmit: (data: NewExpenseFormData) => void;
  isEditing: boolean; // New prop to indicate edit mode
  initialData: Expense | null; // New prop to pass existing expense data
}

const NewExpenseModal: React.FC<NewExpenseModalProps> = ({
  isOpen, onClose, activeTab, setActiveTab, formData, handleInputChange, handleSubmit, isEditing, initialData
}) => {
  // Internal state for the modal's form fields, initialized from initialData or empty
  const [modalFormData, setModalFormData] = useState<NewExpenseFormData>(formData);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        // Map initialData (Expense) to modalFormData (NewExpenseFormData)
        setModalFormData({
          ledger: "Default Ledger", // You need actual mapping here
          bankName: "Default Bank", // You need actual mapping here
          financialYear: "2025-2026", // You need actual mapping here
          paymentMode: "Bank", // You need actual mapping here
          transactionNo: initialData.txnRefNo,
          debitAmount: initialData.debit.toString(),
          vendorName: "Default Vendor", // You need actual mapping here
          purchaseId: initialData.voucherNo, // Example mapping
          comment: initialData.comments,
        });
        setActiveTab(initialData.transactionType === "Bank" ? "Bank" : "Cash"); // Example: set tab based on type
      } else {
        // Reset for new entry
        setModalFormData({
          ledger: "", bankName: "", financialYear: "", paymentMode: "",
          transactionNo: "", debitAmount: "", vendorName: "", purchaseId: "", comment: "",
        });
        setActiveTab("Bank"); // Default tab for new entry
      }
    }
  }, [isOpen, isEditing, initialData, setActiveTab]);

  // Handle internal input changes and propagate to parent's handleInputChange
  const handleModalInputChange = (field: keyof NewExpenseFormData, value: string) => {
    setModalFormData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value); // Propagate to parent state if needed
  };

  const handleModalSubmit = () => {
    handleSubmit(modalFormData); // Pass the modal's current form data to parent
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{isEditing ? "Edit Expense" : "New Expense"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6 pt-4" aria-label="Tabs">
            {["Bank", "Cash"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 space-y-6">
          {activeTab === "Bank" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ledger" className="block text-sm font-medium text-blue-600 mb-2">Ledger</label>
                  <select
                    id="ledger"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={modalFormData.ledger}
                    onChange={(e) => handleModalInputChange("ledger", e.target.value)}
                  >
                    <option value="">Select Ledger</option>
                    <option value="main">Main Ledger</option>
                    <option value="sub">Sub Ledger</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-blue-600 mb-2">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Bank Name"
                    value={modalFormData.bankName}
                    onChange={(e) => handleModalInputChange("bankName", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="financialYear" className="block text-sm font-medium text-blue-600 mb-2">Financial Year</label>
                  <select
                    id="financialYear"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={modalFormData.financialYear}
                    onChange={(e) => handleModalInputChange("financialYear", e.target.value)}
                  >
                    <option value="">Select Financial Year</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentMode" className="block text-sm font-medium text-blue-600 mb-2">Payment Mode</label>
                  <input
                    type="text"
                    id="paymentMode"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Payment Mode"
                    value={modalFormData.paymentMode}
                    onChange={(e) => handleModalInputChange("paymentMode", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="transactionNo" className="block text-sm font-medium text-blue-600 mb-2">Transaction No.</label>
                  <input
                    type="text"
                    id="transactionNo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Transaction No."
                    value={modalFormData.transactionNo}
                    onChange={(e) => handleModalInputChange("transactionNo", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="debitAmount" className="block text-sm font-medium text-blue-600 mb-2">Debit Amount</label>
                  <input
                    type="number"
                    id="debitAmount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Debit Amount"
                    value={modalFormData.debitAmount}
                    onChange={(e) => handleModalInputChange("debitAmount", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "Cash" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vendorName" className="block text-sm font-medium text-blue-600 mb-2">Vendor Name</label>
                  <input
                    type="text"
                    id="vendorName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Vendor Name"
                    value={modalFormData.vendorName}
                    onChange={(e) => handleModalInputChange("vendorName", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="purchaseId" className="block text-sm font-medium text-blue-600 mb-2">Purchase ID</label>
                  <input
                    type="text"
                    id="purchaseId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Purchase ID"
                    value={modalFormData.purchaseId}
                    onChange={(e) => handleModalInputChange("purchaseId", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-blue-600 mb-2">Comment</label>
                <textarea
                  id="comment"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Add any comments"
                  value={modalFormData.comment}
                  onChange={(e) => handleModalInputChange("comment", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={handleModalSubmit}
              className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              {isEditing ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewExpenseModal;