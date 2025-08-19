import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  ParcelOrder,
  OrderData,
  PaymentData,
} from "../../types";
import {
  ParcelCard,
  AddNewParcelCard,
} from "../../components/CardsAndGrids";
import { TableGrid } from "../../components/grids";
import { SalesSummary } from "../../components/modals";
import OrderManagementModal from "../../components/modals/OrderManagementModal";
import AddTableModal from "../../components/modals/AddTableModal";
import TokenManagementView from "../../components/modals/TokenManagementView"; // Import the new Token view

const Header = ({ onAddTableClick }: { onAddTableClick: () => void }) => {
  return (
    <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Table View</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onAddTableClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Add new Table
        </button>
      </div>
    </header>
  );
};

const StatusLegend = () => {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <span>Running</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-800"></div>
        <span>Bill Generated</span>
      </div>
    </div>
  );
};

const NavigationTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    "Table View",
    // "Parcel",
    "Token",  
    // "Swiggy",
    // "Zomato",
    // "Website",
    // "Credit List",
  ];

  return (
    <div className="flex border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
            activeTab === tab
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const RestaurantManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Table View");
  const [tables, setTables] = useState<Table[]>([
    { id: "A", name: "A", status: "available", amount: 0.0, duration: 0 },
    { id: "B", name: "B", status: "available", amount: 0.0, duration: 0 },
    { id: "C", name: "C", status: "available", amount: 0.0, duration: 0 },
    { id: "D", name: "D", status: "available", amount: 0.0, duration: 0 },
    { id: "E", name: "E", status: "available", amount: 0.0, duration: 0 },
    { id: "F", name: "F", status: "available", amount: 0.0, duration: 0 },
    {
      id: "F_occupied1",
      name: "Table-A6",
      status: "occupied",
      customerName: "Customer name 1",
      amount: 12.0,
      duration: 7,
    },
    {
      id: "F_occupied2",
      name: "Table-B1",
      status: "occupied",
      customerName: "Customer name 2",
      amount: 68.0,
      duration: 3,
    },
    {
      id: "F_bill",
      name: "Table-C3",
      status: "bill-generated",
      customerName: "Customer name 3",
      amount: 87.0,
      duration: 2,
    },
    { id: "F1", name: "F1", status: "available", amount: 0.0, duration: 0 },
    { id: "F2", name: "F2", status: "available", amount: 0.0, duration: 0 },
  ]);

  const [parcelOrders, setParcelOrders] = useState<ParcelOrder[]>([
    { id: "P1", name: "P1", status: "available", amount: 0.0, duration: 0 },
    {
      id: "P1_2",
      name: "P1",
      status: "occupied",
      customerName: "Parcel Customer",
      amount: 87.0,
      duration: 2,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);

  // State for managing table splitting
  const [nextTableId, setNextTableId] = useState(1000); // Start with a high number to avoid conflicts
  const [childTableCounters, setChildTableCounters] = useState<{ [key: string]: number }>({});

  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSaveOrder = (
    orderId: string,
    updatedAmount: number,
    customerName: string,
    status: "occupied" | "bill-generated"
  ) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === orderId
          ? {
              ...table,
              amount: updatedAmount,
              customerName: customerName,
              status: status,
              duration:
                table.duration === 0 && status === "occupied"
                  ? 1
                  : table.duration,
            }
          : table
      )
    );
    setParcelOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              amount: updatedAmount,
              customerName: customerName,
              status: status === "bill-generated" ? "occupied" : status,
              duration:
                order.duration === 0 && status === "occupied"
                  ? 1
                  : order.duration,
            }
          : order
      )
    );

    handleCloseOrderModal();
  };

  const handleAddNewParcel = () => {
    const newParcel: ParcelOrder = {
      id: `P${parcelOrders.length + 1}`,
      name: `P${parcelOrders.length + 1}`,
      status: "available",
      amount: 0.0,
      duration: 0,
      customerName: "",
    };
    setParcelOrders((prev) => [...prev, newParcel]);
    handleOrderClick(newParcel);
  };

  const openAddTableModal = () => {
    setIsAddTableModalOpen(true);
  };

  const closeAddTableModal = () => {
    setIsAddTableModalOpen(false);
  };

  const handleAddTable = (tableName: string) => {
    const newTable: Table = {
      id: `Table-${tables.length + 1}-${Date.now()}`,
      name: tableName,
      status: "available",
      amount: 0.0,
      duration: 0,
    };
    setTables((prevTables) => [...prevTables, newTable]);
  };

  // NEW: Handle table splitting
  const handleSplitTable = (parentTable: Table) => {
    const parentName = parentTable.name;
    const currentCounter = childTableCounters[parentName] || 0;
    const newCounter = currentCounter + 1;
    
    // Create new child table with automatic naming
    const childTable: Table = {
      id: `${parentTable.id}-split-${newCounter}-${Date.now()}`,
      name: `${parentName}-${newCounter}`, // e.g., "A-1", "A-2", etc.
      status: "available",
      customerName: "",
      amount: 0.0,
      duration: 0,
    };

    // Update state
    setTables(prev => [...prev, childTable]);
    setNextTableId(prev => prev + 1);
    setChildTableCounters(prev => ({
      ...prev,
      [parentName]: newCounter
    }));

    console.log(`Split table ${parentName} into ${childTable.name}`);
  };

  // NEW: Handle child table deletion
  const handleDeleteTable = (table: Table) => {
    // Only allow deletion of child tables (those with '-' in name)
    if (table.name.includes('-')) {
      setTables(prev => prev.filter(t => t.id !== table.id));
      console.log(`Deleted child table ${table.name}`);
    } else {
      console.log('Cannot delete main table');
      // Optionally show a toast or alert here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAddTableClick={openAddTableModal} />
      <main className="flex-1">
        <div className="bg-white shadow-sm border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <NavigationTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <StatusLegend />
            </div>
          </div>

          <div className="p-6">
            {activeTab === "Table View" && (
              <TableGrid 
                tables={tables} 
                onTableClick={handleOrderClick}
                onSplitTable={handleSplitTable}
                onDeleteTable={handleDeleteTable}
              />
            )}

            {activeTab === "Parcel" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {parcelOrders.map((order) => (
                  <ParcelCard
                    key={order.id}
                    order={order}
                    onClick={handleOrderClick}
                  />
                ))}
                <AddNewParcelCard onClick={handleAddNewParcel} />
              </div>
            )}

            {activeTab === "Token" && (
              <TokenManagementView /> // Render the new Token Management View
            )}

            {activeTab === "Swiggy" && (
              <div className="text-center text-gray-500 py-10">
                Swiggy Orders will appear here.
              </div>
            )}
            {activeTab === "Zomato" && (
              <div className="text-center text-gray-500 py-10">
                Zomato Orders will appear here.
              </div>
            )}
            {activeTab === "Website" && (
              <div className="text-center text-gray-500 py-10">
                Website Orders will appear here.
              </div>
            )}
            {activeTab === "Credit List" && (
              <div className="text-center text-gray-500 py-10">
                Credit List will appear here.
              </div>
            )}
          </div>
        </div>
      </main>
      {selectedOrder && (
        <OrderManagementModal
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrderModal}
          orderData={selectedOrder}
          onSaveOrder={handleSaveOrder}
        />
      )}
      <AddTableModal
        isOpen={isAddTableModalOpen}
        onClose={closeAddTableModal}
        onAddTable={handleAddTable}
      />
      {/* SalesSummary modal is not directly opened from this component
          but is typically opened from within TableCard based on bill-generated status.
          Ensure it's correctly placed where it's called. */}

      {/* Debug info for development - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs max-w-sm">
          <div className="mb-2 font-semibold">Table Split Debug Info:</div>
          <div>Total tables: {tables.length}</div>
          <div>Main tables: {tables.filter(t => !t.name.includes('-')).length}</div>
          <div>Child tables: {tables.filter(t => t.name.includes('-')).length}</div>
          <div className="mt-2 text-xs">
            Child counters: {JSON.stringify(childTableCounters)}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagementSystem;