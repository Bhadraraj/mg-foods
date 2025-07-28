import React from "react";
import { X, Receipt, Printer } from "lucide-react";
import { ParcelOrder } from "./types"; 
interface ParcelCardProps {
  order: ParcelOrder;
  onClick: (order: ParcelOrder) => void;
}

const ParcelCard: React.FC<ParcelCardProps> = ({ order, onClick }) => {
  const getCardStyle = () => {
    switch (order.status) {
      case "available":
        return "bg-white text-black border border-gray-200";
      case "occupied":
        return "bg-gray-800 text-white";
      default:
        return "bg-white text-black border border-gray-200";
    }
  };

  return (
    <div
      onClick={() => onClick(order)}
      className={`${getCardStyle()} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all relative`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold">{order.name}</div>
        <div className="text-right">
          <div
            className={`${
              order.status === "occupied"
                ? "bg-white bg-opacity-20"
                : "bg-gray-100"
            } rounded-full w-12 h-12 flex items-center justify-center`}
          >
            <div className="text-center">
              <div className="text-lg font-bold">
                {order.duration.toString().padStart(2, "0")}
              </div>
              <div className="text-xs">mins</div>
            </div>
          </div>
        </div>
      </div>

      {order.status === "available" ? (
        <div className="text-sm opacity-75 mb-2">Available</div>
      ) : (
        <div className="text-sm opacity-90 mb-2">{order.customerName}</div>
      )}

      <div className="text-lg font-bold mb-3">₹ {order.amount.toFixed(2)}</div>

      {order.status === "occupied" && (
        <div className="flex gap-1">
          <button className="bg-red-600 text-white p-1 rounded hover:bg-red-700">
            <X size={16} />
          </button>
          <button className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700">
            <Receipt size={16} />
          </button>
          <button className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600">
            <Printer size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ParcelCard;
