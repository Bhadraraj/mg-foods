import React from "react";
import { ArrowLeft, Eye, Users, Receipt } from "lucide-react";

interface MainHeaderProps {
  onPaymentClick: () => void;
  onCustomerCreditClick: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  onPaymentClick,
  onCustomerCreditClick,
}) => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Table View</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPaymentClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Receipt size={20} />
          Payment
        </button>
        <button
          onClick={onCustomerCreditClick}
          className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700"
        >
          <Users size={20} />
          Customer Credit
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <Eye size={20} />
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
