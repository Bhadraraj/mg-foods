import React, { useState } from "react";
import { 
  Eye, 
  Users, 
  RotateCw, 
  ReceiptIndianRupee, 
  Printer, 
  Split,
  Trash2
} from "lucide-react";
import { Table } from "../../../types";
import SalesSummary from "../../modals/SalesSummary";
import CustomerCreditDetails from "../../modals/CustomerCreditDetails";

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
  onSplitTable?: (parentTable: Table) => void;
  onDeleteTable?: (table: Table) => void;
  isChildTable?: boolean;
  parentTableName?: string;
}

const TableCard: React.FC<TableCardProps> = ({ 
  table, 
  onClick, 
  onSplitTable,
  onDeleteTable,
  isChildTable = false,
  parentTableName
}) => {
  const [isSalesSummaryOpen, setIsSalesSummaryOpen] = useState(false);
  const [isCreditDetailsOpen, setIsCreditDetailsOpen] = useState(false);

  const getCardStyle = () => {
    let baseStyle = "";
    switch (table.status) {
      case "available":
        baseStyle = "bg-white border-2 border-gray-200 text-gray-600";
        break;
      case "occupied":
        baseStyle = "bg-green-400 text-gray-800";
        break;
      case "bill-generated":
        baseStyle = "bg-gray-800 text-white";
        break;
      default:
        baseStyle = "bg-white border-2 border-gray-200 text-gray-600";
    }
    
    if (isChildTable) {
      baseStyle += " border-l-4 border-l-blue-500";
    }
    
    return baseStyle;
  };

  const getTimeStyle = () => {
    switch (table.status) {
      case "available":
        return "bg-gray-800 text-white";
      case "occupied":
        return "bg-white text-gray-800";
      case "bill-generated":
        return "bg-white text-gray-800";
      default:
        return "bg-gray-800 text-white";
    }
  };

  const handleSplitTable = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSplitTable && !isChildTable) {
      onSplitTable(table);
    }
  };

  const handleDeleteTable = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteTable && isChildTable) {
      onDeleteTable(table);
    }
  };

  const calculateDummyPaymentData = () => {
    // Payment data calculation logic here
    return {
      billNo: `INV001-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
      tableNo: table.name,
      date: new Date().toLocaleDateString('en-GB'),
      items: [
        { id: "item1", name: "Chicken Biryani", quantity: 2, amount: 400 },
        { id: "item2", name: "Coke", quantity: 3, amount: 90 },
      ],
      charges: {
        service: 50.00,
        ac: 20.00,
        gst: 30.00,
        cgst: 30.00,
      },
      waiterTip: 0,
      subTotal: 490,
      total: 620,
      grandTotal: 620,
    };
  };

  const dummyPaymentData = calculateDummyPaymentData();

  return (
    <>
      <div
        onClick={() => onClick(table)}
        className={`${getCardStyle()} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all relative`}
      >
        {isChildTable && parentTableName && (
          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Child of {parentTableName}
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-lg font-semibold mb-1">{table.name}</div>
            <div className="text-sm">
              {table.status === "available" ? "Unoccupied" : table.customerName}
            </div>
            <div className="text-sm font-medium">₹ {table.amount.toFixed(2)}</div>
          </div>
          <div className={`${getTimeStyle()} rounded-full w-12 h-12 flex flex-col items-center justify-center`}>
            <div className="text-sm font-bold">
              {table.duration.toString().padStart(2, "0")}
            </div>
            <div className="text-xs">mins</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {!isChildTable && (
            <button
              onClick={handleSplitTable}
              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
              title="Split Table"
            >
              <Split size={12} />
            </button>
          )}

          {isChildTable && (
            <button
              onClick={handleDeleteTable}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
              title="Delete Child Table"
            >
              <Trash2 size={12} />
            </button>
          )}

          {table.status !== "available" && (
            <>
              <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                <Eye size={12} />
              </button>

              {table.status === "bill-generated" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreditDetailsOpen(true);
                    }}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <RotateCw size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSalesSummaryOpen(true);
                    }}
                    className="bg-black text-white p-1 rounded hover:bg-gray-800"
                  >
                    <ReceiptIndianRupee size={12} />
                  </button>
                  <button className="bg-black text-white p-1 rounded hover:bg-gray-800">
                    <Printer size={12} />
                  </button>
                  <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                    <Users size={12} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <CustomerCreditDetails
        isOpen={isCreditDetailsOpen}
        onClose={() => setIsCreditDetailsOpen(false)}
        tableNo={table.name}
      />

      <SalesSummary
        isOpen={isSalesSummaryOpen}
        onClose={() => setIsSalesSummaryOpen(false)}
        paymentData={dummyPaymentData}
      />
    </>
  );
};

export default TableCard;