// src/views/TokenManagementView.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import TokenItemCard from "../modals/TokenItemCard"; // Check this path, previously it was in CardsAndGrids
import AddTokenModal from "../modals/AddTokenModal";
import { PaymentData } from "../types/index";

// Define PaymentStatus type
type PaymentStatus = "Pending" | "Paid" | "Refunded";

interface TokenOrder {
  id: string;
  date: string;
  customerName: string;
  customerMobile: string;
  items: PaymentData["items"];
  totalAmount: number;
  paymentStatus: PaymentStatus; // Added payment status
}

const TokenManagementView: React.FC = () => {
  const [tokenOrders, setTokenOrders] = useState<TokenOrder[]>([
    {
      id: "TKN001",
      date: "2025-02-21",
      customerName: "Rajesh",
      customerMobile: "9789768809",
      items: [
        { id: "M1", name: "Masala Tea", quantity: 2, amount: 50 }, // Updated amounts based on new dummy menu
        { id: "M2", name: "Plain Vada", quantity: 3, amount: 105 },
      ],
      totalAmount: 155, // Updated total
      paymentStatus: "Pending", // Default status
    },
    {
      id: "TKN002",
      date: "2025-02-20",
      customerName: "Priya",
      customerMobile: "9000012345",
      items: [
        { id: "M3", name: "Ginger Tea", quantity: 1, amount: 20 },
        { id: "M4", name: "Medu Vada", quantity: 2, amount: 80 },
      ],
      totalAmount: 100,
      paymentStatus: "Paid", // Example paid status
    },
    // Add more dummy token orders if needed
  ]);
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);
  const [selectedTokenToEdit, setSelectedTokenToEdit] = useState<TokenOrder | null>(null);

  const handleAddTokenClick = () => {
    setSelectedTokenToEdit(null); // Ensure we're adding a new one
    setIsAddTokenModalOpen(true);
  };

  const handleEditTokenClick = (token: TokenOrder) => {
    setSelectedTokenToEdit(token);
    setIsAddTokenModalOpen(true);
  };

  const handleSaveNewTokenOrder = (
    customerName: string,
    customerMobile: string,
    items: PaymentData["items"]
  ) => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const newToken: TokenOrder = {
      id: `TKN${Date.now()}`, // Simple unique ID
      date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD for consistency
      customerName,
      customerMobile,
      items,
      totalAmount,
      paymentStatus: "Pending", // New token orders default to Pending
    };
    setTokenOrders((prev) => [...prev, newToken]);
  };

  const handleUpdateTokenOrder = (
    tokenId: string,
    customerName: string,
    customerMobile: string,
    items: PaymentData["items"]
  ) => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    setTokenOrders((prev) =>
      prev.map((token) =>
        token.id === tokenId
          ? { ...token, customerName, customerMobile, items, totalAmount }
          : token
      )
    );
  };

  const handleSaveTokenOrder = (
    customerName: string,
    customerMobile: string,
    items: PaymentData["items"]
  ) => {
    if (selectedTokenToEdit) {
      handleUpdateTokenOrder(selectedTokenToEdit.id, customerName, customerMobile, items);
    } else {
      handleSaveNewTokenOrder(customerName, customerMobile, items);
    }
  };

  // NEW: Function to change payment status
  const handleChangePaymentStatus = (tokenId: string, newStatus: PaymentStatus) => {
    setTokenOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === tokenId ? { ...order, paymentStatus: newStatus } : order
      )
    );
  };

  // Utility to get unique item names and their total quantities from a token order's items
  const getTokenItemSummaries = (items: PaymentData["items"]) => {
    const itemMap = new Map<string, number>(); // Map<itemName, totalQuantity>
    items.forEach(item => {
        // Here we need to refine for "TEA" and "VADA" general categories
        if (item.name.toLowerCase().includes("tea")) {
            itemMap.set("TEA", (itemMap.get("TEA") || 0) + item.quantity);
        } else if (item.name.toLowerCase().includes("vada")) {
            itemMap.set("VADA", (itemMap.get("VADA") || 0) + item.quantity);
        }
        // If you want to list other items too, add more conditions or just item.name
    });
    return Array.from(itemMap.entries()).map(([name, quantity]) => ({ name, quantity }));
  };


  return (
    <div>  
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Token Management</h2>
        <button
          onClick={handleAddTokenClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add new token
        </button>
      </div> 
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Detail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Tea
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Vada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th> {/* NEW Column for Payment Status */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tokenOrders.map((token, index) => {
              const itemSummaries = getTokenItemSummaries(token.items);
              // Ensure that "TEA" and "VADA" here match the keys you set in getTokenItemSummaries
              const teaQty = itemSummaries.find(s => s.name === "TEA")?.quantity || 0;
              const vadaQty = itemSummaries.find(s => s.name === "VADA")?.quantity || 0;

              return (
                <tr key={token.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {token.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {token.customerName} [{token.customerMobile}]
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teaQty.toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vadaQty.toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{token.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${token.paymentStatus === "Paid" ? "bg-green-100 text-green-800" : ""}
                      ${token.paymentStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${token.paymentStatus === "Refunded" ? "bg-red-100 text-red-800" : ""}
                    `}>
                      {token.paymentStatus}
                    </span>
                  </td> {/* Display Payment Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button
                      onClick={() => handleEditTokenClick(token)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    {/* Dropdown to change payment status */}
                    <select
                      value={token.paymentStatus}
                      onChange={(e) => handleChangePaymentStatus(token.id, e.target.value as PaymentStatus)}
                      className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        onClose={() => setIsAddTokenModalOpen(false)}
        onSaveTokenOrder={handleSaveTokenOrder}
        initialTokenData={selectedTokenToEdit ? {
          customerName: selectedTokenToEdit.customerName,
          customerMobile: selectedTokenToEdit.customerMobile,
          items: selectedTokenToEdit.items
        } : undefined}
      />
    </div>
  );
};

export default TokenManagementView;