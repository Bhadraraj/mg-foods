import React, { useState } from "react";
import { X } from "lucide-react";

interface CustomerCreditDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tableNo: string; // To display which table this credit is for
}

const CustomerCreditDetails: React.FC<CustomerCreditDetailsProps> = ({ isOpen, onClose, tableNo }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [duePeriod, setDuePeriod] = useState("");

  const handleSaveAndContinue = () => {
    // Implement logic to save customer credit details
    console.log("Saving Customer Credit Details:", {
      tableNo,
      customerName,
      customerMobile,
      duePeriod,
    });
    // You would typically send this data to a backend or update a global state
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto flex flex-col shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-medium text-gray-800">Customer Credit Details - {tableNo}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="customerMobile" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerMobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="duePeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Due period <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="duePeriod"
              value={duePeriod}
              onChange={(e) => setDuePeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g., 7 days, 1 month"
              required
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={handleSaveAndContinue}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save & Continue
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreditDetails;