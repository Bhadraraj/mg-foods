import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Table as TableType,
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
import TokenManagementView from "../../components/modals/TokenManagementView";
import { useTables } from "../../hooks/useTables"; // Import the custom hook
import { Table } from "../../services/api"; // Import API Table type

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
  
  // Use the API hook instead of local state
  const {
    tables: apiTables,
    loading: tablesLoading,
    error: tablesError,
    createTable,
    createChildTable,
    updateTable,
    updateTableStatus,
    deleteTable,
    createLoading,
    createChildLoading,
    updateLoading,
    updateStatusLoading,
    deleteLoading,
    fetchTables,
  } = useTables();

  // Convert API tables to UI format
  const tables = React.useMemo<TableType[]>(() => {
    return apiTables.map((apiTable: Table) => ({
      id: apiTable._id,
      name: apiTable.name,
      status: apiTable.status === 'Available' ? 'available' 
             : apiTable.status === 'Running' ? 'occupied'
             : apiTable.status === 'Reserved' ? 'occupied'
             : 'bill-generated',
      amount: apiTable.totalAmount || 0.0,
      duration: apiTable.elapsedMinutes || 0,
      customerName: apiTable.isOccupied ? `Customer at ${apiTable.name}` : "",
      tableNumber: apiTable.tableNumber,
      capacity: apiTable.capacity,
      location: apiTable.location,
      description: apiTable.description,
      isOccupied: apiTable.isOccupied,
      parentTable: apiTable.parentTable,
      childTables: apiTable.childTables || [],
    }));
  }, [apiTables]);

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

  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSaveOrder = async (
    orderId: string,
    updatedAmount: number,
    customerName: string,
    status: "occupied" | "bill-generated"
  ) => {
    try {
      // Find the table in the API tables
      const apiTable = apiTables.find(t => t._id === orderId);
      if (!apiTable) {
        console.error("Table not found");
        return;
      }

      // Update table status via API
      const apiStatus = status === "occupied" ? "Running" : "Available";
      await updateTableStatus(orderId, { status: apiStatus });

      // If needed, update other table properties
      if (updatedAmount !== apiTable.totalAmount) {
        // Note: You might need to add an API endpoint to update totalAmount
        // For now, we'll just update the status
        console.log(`Amount updated to ${updatedAmount} for table ${apiTable.name}`);
      }

      handleCloseOrderModal();
    } catch (error) {
      console.error("Error saving order:", error);
    }
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

  const handleAddTable = async (tableName: string) => {
    try {
      // Generate a unique table number
      const tableNumber = `T${Date.now()}`;
      
      await createTable({
        name: tableName,
        tableNumber: tableNumber,
        capacity: 4, // Default capacity
        location: "Main Floor", // Default location
        description: `Table created: ${tableName}`,
      });
      
      closeAddTableModal();
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const handleSplitTable = async (parentTable: TableType) => {
    try {
      // Find the original API table
      const apiParentTable = apiTables.find(t => t._id === parentTable.id);
      if (!apiParentTable) {
        console.error("Parent table not found");
        return;
      }

      // Count existing child tables to generate next number
      const childCount = apiParentTable.childTables?.length || 0;
      const childName = `${parentTable.name}-${childCount + 1}`;
      
      await createChildTable(parentTable.id, {
        name: childName,
        capacity: Math.floor(apiParentTable.capacity / 2), // Split capacity
        description: `Child table of ${parentTable.name}`,
      });
      
      console.log(`Split table ${parentTable.name} into ${childName}`);
    } catch (error) {
      console.error("Error splitting table:", error);
    }
  };

  const handleDeleteTable = async (table: TableType) => {
    try {
      // Only allow deletion of child tables (those with '-' in name)
      if (table.name.includes('-')) {
        await deleteTable(table.id);
        console.log(`Deleted child table ${table.name}`);
      } else {
        console.log('Cannot delete main table');
        // Optionally show a toast or alert here
      }
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  // Show loading state
  if (tablesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tables...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (tablesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading tables</p>
          <button 
            onClick={() => fetchTables()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              <TokenManagementView />
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
      
      {/* Loading overlay for API operations */}
      {(createLoading || createChildLoading || updateLoading || updateStatusLoading || deleteLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default RestaurantManagementSystem;