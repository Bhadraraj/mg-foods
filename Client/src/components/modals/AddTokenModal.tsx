// src/components/modals/AddTokenModal.tsx
import React, { useState, useEffect } from "react";
import { X, Plus, MinusCircle } from "lucide-react";
import { PaymentData } from "../types/OrdermanagementTable"; // Assuming PaymentData type is available

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTokenOrder: (
    customerName: string,
    customerMobile: string,
    items: PaymentData["items"]
  ) => void;
  // If editing an existing token, pass initial data
  initialTokenData?: {
    customerName: string;
    customerMobile: string;
    items: PaymentData["items"];
  };
}

const dummyMenuItems = [
  { id: "M1", name: "Masala Tea", price: 25 },
  { id: "M2", name: "Filter Coffee", price: 30 },
  { id: "M3", name: "Ginger Tea", price: 20 },
  { id: "M4", name: "Plain Vada", price: 35 },
  { id: "M5", name: "Medu Vada", price: 40 },
  { id: "M6", name: "Dal Vada", price: 45 },
  { id: "M7", name: "Lemon Tea", price: 25 },
  { id: "M8", name: "Onion Vada", price: 40 },
  { id: "M9", name: "Green Tea", price: 30 },
  { id: "M10", name: "Aloo Vada", price: 38 },
];

const AddTokenModal: React.FC<AddTokenModalProps> = ({
  isOpen,
  onClose,
  onSaveTokenOrder,
  initialTokenData,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [selectedItems, setSelectedItems] = useState<PaymentData["items"]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && initialTokenData) {
      setCustomerName(initialTokenData.customerName);
      setCustomerMobile(initialTokenData.customerMobile);
      setSelectedItems(initialTokenData.items);
    } else if (isOpen) {
      // Reset state when opening for a new token
      setCustomerName("");
      setCustomerMobile("");
      setSelectedItems([]);
      setSearchTerm("");
    }
  }, [isOpen, initialTokenData]);

  const handleAddItem = (item: typeof dummyMenuItems[0]) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, amount: i.amount + item.price } : i
        );
      } else {
        return [...prevItems, { id: item.id, name: item.name, quantity: 1, amount: item.price }];
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevItems.map((i) =>
          i.id === itemId
            ? { ...i, quantity: i.quantity - 1, amount: i.amount - (i.amount / i.quantity) }
            : i
        );
      } else {
        // Remove item if quantity is 1 or less
        return prevItems.filter((i) => i.id !== itemId);
      }
    });
  };

  const handleSave = () => {
    if (!customerName || !customerMobile || selectedItems.length === 0) {
      alert("Please fill customer details and select at least one item.");
      return;
    }
    onSaveTokenOrder(customerName, customerMobile, selectedItems);
    onClose();
  };

  const calculateTotals = () => {
    const totalQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    return { totalQty, subTotal, grandTotal: subTotal }; // For tokens, total and grand total might be the same as subtotal
  };

  const { totalQty, subTotal, grandTotal } = calculateTotals();

  const filteredMenuItems = dummyMenuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto flex flex-col shadow-lg h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-700 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Add Token Order</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-blue-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer Details */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Customer Mobile"
            className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            required
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Menu Items */}
          <div className="w-2/3 p-4 border-r border-gray-200 overflow-y-auto">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 auto-rows-min">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className="bg-gray-100 border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-800">{item.name}</span>
                  <span className="text-blue-600">₹{item.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Order Summary */}
          <div className="w-1/3 p-4 flex flex-col">
            <h3 className="text-md font-semibold mb-3">Order Summary</h3>
            <div className="flex-1 overflow-y-auto border-b border-gray-200 pb-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="px-1 py-2 text-left">#</th>
                    <th className="px-1 py-2 text-left">Item</th>
                    <th className="px-1 py-2 text-right">Qty</th>
                    <th className="px-1 py-2 text-right">Amount</th>
                    <th className="px-1 py-2 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-1 py-2">{index + 1}</td>
                      <td className="px-1 py-2">{item.name}</td>
                      <td className="px-1 py-2 text-right">{item.quantity}</td>
                      <td className="px-1 py-2 text-right">₹{item.amount.toFixed(2)}</td>
                      <td className="px-1 py-2 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MinusCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium text-gray-800">
                <span>Total Qty</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-800">
                <span>Sub Total</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-700 border-t pt-2 mt-2">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Save & Print
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTokenModal;