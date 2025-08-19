// src/components/CustomerDetailsModal.tsx
import React, { useState } from "react";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (details: { name: string; mobile: string; type: "Individual" | "Business" }) => void;
  initialCustomerName?: string;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
  initialCustomerName = "",
}) => {
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerType, setCustomerType] = useState<"Individual" | "Business">(
    "Individual"
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAddCustomer({ name: customerName, mobile: customerMobile, type: customerType });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-6">Customer Details</h2>

        <div className="flex border-b border-gray-300 mb-6">
          <button
            className={`pb-2 px-4 text-sm font-medium ${
              customerType === "Individual"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setCustomerType("Individual")}
          >
            Individual
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${
              customerType === "Business"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setCustomerType("Business")}
          >
            Business
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="customerName" className="block text-gray-700 text-sm font-medium mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer name"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="customerMobile" className="block text-gray-700 text-sm font-medium mb-1">
            Customer Mobile Number
          </label>
          <input
            type="text"
            id="customerMobile"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            className="w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;