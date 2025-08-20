import React from "react";
import { Plus, Minus, X, Receipt, Printer } from "lucide-react";
import { OrderItem } from "./types"; 
interface BillingSectionProps {
  orderItems: OrderItem[];
  updateQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  totalAmount: number;
}

const BillingSection: React.FC<BillingSectionProps> = ({
  orderItems,
  updateQuantity,
  removeItem,
  totalAmount,
}) => {
  return (
    <div className="w-96 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Billing</h2>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mt-2 hover:bg-blue-700">
          Customer details
        </button>
      </div>

      <div className="flex-1 overflow-y-auto"> 
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 mb-2">
              <span>Kot</span>
              <span>Items</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>

            {orderItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 gap-2 items-center py-2 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-sm">Kot 01</span>
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">₹ {item.amount.toFixed(2)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mb-4">
            <div className="text-lg font-medium">Total: ₹{totalAmount.toFixed(2)}</div>
          </div>
        </div>
      </div> 
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2 mb-3">
          <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md text-sm hover:bg-gray-700">
            Bill
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700">
            KOT
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700">
            Delete
          </button>
          <button className="flex-1 bg-black text-white py-2 px-4 rounded-md text-sm hover:bg-gray-800">
            Save
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700">
            Save & Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;