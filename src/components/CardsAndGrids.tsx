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
import { Table, ParcelOrder, PaymentData } from "./types";
import SalesSummary from "./modals/SalesSummary";
import CustomerCreditDetails from "./modals/CustomerCreditDetails";

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
    
    // Add different styling for child tables with proper alignment
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

  const calculateDummyPaymentData = (): PaymentData => {
    const items = [
      { id: "item1", name: "Chicken Biryani", quantity: 2, amount: 400 },
      { id: "item2", name: "Coke", quantity: 3, amount: 90 },
      { id: "item3", name: "Mutton Korma", quantity: 1, amount: 350 },
      { id: "item4", name: "Naan Bread", quantity: 4, amount: 100 },
      { id: "item5", name: "Paneer Tikka", quantity: 1, amount: 280 },
      { id: "item6", name: "Fresh Lime Soda", quantity: 2, amount: 120 },
      { id: "item7", name: "Dal Makhani", quantity: 1, amount: 220 },
      { id: "item8", name: "Jeera Rice", quantity: 1, amount: 150 },
      { id: "item9", name: "Gulab Jamun", quantity: 2, amount: 180 },
      { id: "item10", name: "Butter Chicken", quantity: 1, amount: 380 },
      { id: "item11", name: "Garlic Naan", quantity: 3, amount: 90 },
      { id: "item12", name: "Veg Pulao", quantity: 1, amount: 200 },
      { id: "item13", name: "Raita", quantity: 1, amount: 60 },
      { id: "item14", name: "Masala Dosa", quantity: 2, amount: 140 },
      { id: "item15", name: "Coffee", quantity: 2, amount: 100 },
      { id: "item16", name: "Spring Roll", quantity: 1, amount: 180 },
      { id: "item17", name: "Chilli Paneer", quantity: 1, amount: 290 },
      { id: "item18", name: "Sweet Corn Soup", quantity: 2, amount: 160 },
      { id: "item19", name: "Fried Rice", quantity: 1, amount: 250 },
      { id: "item20", name: "Lassi", quantity: 2, amount: 140 },
      { id: "item21", name: "Tandoori Chicken", quantity: 1, amount: 450 },
      { id: "item22", name: "Lemon Iced Tea", quantity: 3, amount: 150 },
      { id: "item23", name: "Veg Burger", quantity: 1, amount: 190 },
      { id: "item24", name: "French Fries", quantity: 1, amount: 110 },
      { id: "item25", name: "Chocolate Shake", quantity: 2, amount: 200 },
      { id: "item26", name: "Prawn Curry", quantity: 1, amount: 500 },
      { id: "item27", name: "Appam", quantity: 4, amount: 120 },
      { id: "item28", name: "Fish Fry", quantity: 1, amount: 320 },
      { id: "item29", name: "Mango Lassi", quantity: 1, amount: 80 },
      { id: "item30", name: "Kids Meal", quantity: 1, amount: 200 },
    ];

    const currentSubTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const charges = {
      service: 50.00,
      ac: 20.00,
      gst: 30.00,
      cgst: 30.00,
    };
    const waiterTip = 0;

    const currentTotal = currentSubTotal + charges.service + charges.ac + charges.gst + charges.cgst + waiterTip;

    return {
      billNo: `INV001-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
      tableNo: table.name,
      date: new Date().toLocaleDateString('en-GB'),
      items: items,
      charges: charges,
      waiterTip: waiterTip,
      subTotal: currentSubTotal,
      total: currentTotal,
      grandTotal: currentTotal,
    };
  };

  const dummyPaymentData = calculateDummyPaymentData();

  return (
    <>
      <div
        onClick={() => onClick(table)}
        className={`${getCardStyle()} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all relative`}
      >
        {/* Child table indicator */}
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

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          {/* Split button - only for main tables */}
          {!isChildTable && (
            <button
              onClick={handleSplitTable}
              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
              title="Split Table"
            >
              <Split size={12} />
            </button>
          )}

          {/* Delete button - only for child tables */}
          {isChildTable && (
            <button
              onClick={handleDeleteTable}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
              title="Delete Child Table"
            >
              <Trash2 size={12} />
            </button>
          )}

          {/* Existing buttons */}
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

      {/* Customer Credit Details Modal */}
      <CustomerCreditDetails
        isOpen={isCreditDetailsOpen}
        onClose={() => setIsCreditDetailsOpen(false)}
        tableNo={table.name}
      />

      {/* Sales Summary Modal */}
      <SalesSummary
        isOpen={isSalesSummaryOpen}
        onClose={() => setIsSalesSummaryOpen(false)}
        paymentData={dummyPaymentData}
      />
    </>
  );
};

// Enhanced TableGrid with split functionality and proper child alignment
interface TableGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
  onSplitTable?: (parentTable: Table) => void;
  onDeleteTable?: (table: Table) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ 
  tables, 
  onTableClick, 
  onSplitTable,
  onDeleteTable 
}) => {
  // Create a flat array of all tables including main and child tables in proper order
  const orderedTables = React.useMemo(() => {
    const groups: { [key: string]: Table[] } = {};
    const mainTables: Table[] = [];
    const result: Array<{ table: Table; isChild: boolean; parentName?: string }> = [];
    
    // Separate main tables and group child tables
    tables.forEach(table => {
      if (table.name.includes('-')) {
        // This is a child table
        const parentName = table.name.split('-')[0];
        if (!groups[parentName]) {
          groups[parentName] = [];
        }
        groups[parentName].push(table);
      } else {
        // This is a main table
        mainTables.push(table);
      }
    });
    
    // Sort child tables by their suffix number for consistent ordering
    Object.keys(groups).forEach(parentName => {
      groups[parentName].sort((a, b) => {
        const aNum = parseInt(a.name.split('-')[1] || '0');
        const bNum = parseInt(b.name.split('-')[1] || '0');
        return aNum - bNum;
      });
    });
    
    // Build the ordered result array
    mainTables.forEach(table => {
      // Add main table
      result.push({ table, isChild: false });
      
      // Add child tables right after their parent
      if (groups[table.name]) {
        groups[table.name].forEach(childTable => {
          result.push({ 
            table: childTable, 
            isChild: true, 
            parentName: table.name 
          });
        });
      }
    });
    
    return result;
  }, [tables]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {orderedTables.map(({ table, isChild, parentName }) => (
        <div key={table.id} className={isChild ? "ml-4" : ""}>
          <TableCard
            table={table}
            onClick={onTableClick}
            onSplitTable={!isChild ? onSplitTable : undefined}
            onDeleteTable={isChild ? onDeleteTable : undefined}
            isChildTable={isChild}
            parentTableName={parentName}
          />
        </div>
      ))}
    </div>
  );
};

// Other components remain the same
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

export { TableCard, ParcelCard, AddNewParcelCard, TableGrid };