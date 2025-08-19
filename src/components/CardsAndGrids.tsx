import React, { useState } from "react";
import { 
  Eye, 
  Users, 
  RotateCw, 
  ReceiptIndianRupee, 
  Printer, 
  Plus,
  Split,
  Trash2
} from "lucide-react";
import { Table, ParcelOrder, PaymentData } from "../types";
import { TableCard } from "./cards";
import { TableGrid } from "./grids";
import { SalesSummary, CustomerCreditDetails } from "./modals";

interface ParcelCardProps {
  order: ParcelOrder;
  onClick: (order: ParcelOrder) => void;
}

const ParcelCard: React.FC<ParcelCardProps> = ({ order, onClick }) => {
  const getCardStyle = () => {
    switch (order.status) {
      case "available":
        return "bg-white border-2 border-gray-200 text-gray-600";
      case "occupied":
        return "bg-green-400 text-gray-800";
      default:
        return "bg-white border-2 border-gray-200 text-gray-600";
    }
  };

  const getTimeStyle = () => {
    switch (order.status) {
      case "available":
        return "bg-gray-800 text-white";
      case "occupied":
        return "bg-white text-gray-800";
      default:
        return "bg-gray-800 text-white";
    }
  };

  return (
    <div
      onClick={() => onClick(order)}
      className={`${getCardStyle()} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all relative`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-2xl font-bold mb-1">{order.name}</div>
          <div className="text-sm">
            {order.status === "available" ? "Unoccupied" : order.customerName}
          </div>
          <div className="text-sm font-medium">₹ {order.amount.toFixed(2)}</div>
        </div>
        <div className={`${getTimeStyle()} rounded-full w-12 h-12 flex flex-col items-center justify-center`}>
          <div className="text-sm font-bold">
            {order.duration.toString().padStart(2, "0")}
          </div>
          <div className="text-xs">mins</div>
        </div>
      </div>

      {order.status === "occupied" && (
        <div className="flex items-center gap-2 mt-3">
          <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
            <Eye size={12} />
          </button>
          <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
            <Users size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

interface AddNewParcelCardProps {
  onClick: () => void;
}

const AddNewParcelCard: React.FC<AddNewParcelCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg p-4 bg-gray-100 border-2 border-gray-300 text-gray-500 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all h-40"
    >
      <Plus size={48} />
      <div className="text-lg font-medium mt-2">Add New Parcel</div>
    </div>
  );
};

export { ParcelCard, AddNewParcelCard };
export { TableCard } from './cards';
export { TableGrid } from './grids';