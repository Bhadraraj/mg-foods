import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import NewPurchaseModal from "../../components/modals/NewPurchaseModal";
import FulfillmentModal from "../../components/modals/FulfillmentModal";
import VerificationModal from "../../components/modals/VerificationModal";
import AddProductToRackModal from "../../components/modals/AddProductToRack";
import { usePurchases } from "../../hooks/usePurchases";
import { useAddProductToRack } from "../../hooks/useAddProductToRack";
import Pagination from "../../components/ui/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";

// Updated PurchaseItem interface to match API response
interface PurchaseItem {
  _id: string;
  vendorName: string;
  brandName: string;
  invoiceNo: string;
  invoiceNumber: string;
  invoiceDate: string;
  expectedDeliveryDate: string;
  uid: string;
  items: Array<{
    itemName: string;
    quantity: number;
    price: number;
    total: number;
    taxPercentage: number;
    taxAmount: number;
    productName: string;
    hsn: string;
    unit: string;
    mrp: number;
    purchasePrice: number;
    description: string;
    discount: number;
  }>;
  pricing: {
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    roundOff: number;
    grandTotal: number;
  };
  paymentStatus: "pending" | "partial" | "completed" | "paid";
  fulfillmentStatus: "pending" | "completed";
  status?: {
    po?: string;
    pi?: string;
    invoice?: string;
    stockEntry?: string;
  };
  notes: string;
  store: string;
  createdAt: string;
  updatedAt: string;
  purchaseId: string;
}

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (fromDate: Date, toDate: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose, onApply }) => {
  const [fromDate, setFromDate] = useState(new Date(2024, 5, 10));
  const [toDate, setToDate] = useState(new Date(2024, 6, 26));
  const [fromMonth, setFromMonth] = useState(5);
  const [toMonth, setToMonth] = useState(6);
  const [fromYear, setFromYear] = useState(2024);
  const [toYear, setToYear] = useState(2024);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = (
    month: number,
    year: number,
    selectedDate: Date,
    onDateSelect: (date: Date) => void,
    isFrom: boolean
  ) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-blue-100 ${
            isSelected ? "bg-blue-600 text-white" : "text-gray-700"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (isFrom) {
                if (fromMonth === 0) {
                  setFromMonth(11);
                  setFromYear(fromYear - 1);
                } else {
                  setFromMonth(fromMonth - 1);
                }
              } else {
                if (toMonth === 0) {
                  setToMonth(11);
                  setToYear(toYear - 1);
                } else {
                  setToMonth(toMonth - 1);
                }
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-medium">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={() => {
              if (isFrom) {
                if (fromMonth === 11) {
                  setFromMonth(0);
                  setFromYear(fromYear + 1);
                } else {
                  setFromMonth(fromMonth + 1);
                }
              } else {
                if (toMonth === 11) {
                  setToMonth(0);
                  setToYear(toYear + 1);
                } else {
                  setToMonth(toMonth + 1);
                }
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px]">
        <div className="flex justify-between mb-6">
          <div className="flex-1 mr-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">From -</h4>
            {renderCalendar(fromMonth, fromYear, fromDate, setFromDate, true)}
          </div>
          <div className="flex-1 ml-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">To -</h4>
            {renderCalendar(toMonth, toYear, toDate, setToDate, false)}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApply(fromDate, toDate);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const PurchaseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 5, 10),
    to: new Date(2024, 6, 26),
  });

  // Use the purchases hook for data fetching and pagination
  const {
    purchases,
    loading,
    error,
    pagination,
    fetchPurchases,
    createPurchase,
    updatePurchaseStatus,
    completePurchase,
    completeStockEntry,
    deletePurchase,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateStatusLoading,
    stockEntryLoading,
    deleteLoading,
  } = usePurchases({
    vendor: selectedVendor || undefined,
    startDate: dateRange.from.toISOString(),
    endDate: dateRange.to.toISOString(),
    autoFetch: true,
  });

  // Debug log to see what data we're getting
  console.log('Purchases data:', purchases);
  console.log('Loading:', loading);
  console.log('Error:', error);

  // Use the add product to rack hook
  const {
    isModalOpen: isAddProductToRackModalOpen,
    selectedProduct: productToAddDetails,
    addingProductToRack,
    openAddProductToRackModal: handleOpenAddProductToRackModal,
    closeAddProductToRackModal: handleCloseAddProductToRackModal,
    handleAddProductToRack: handleAddProductToRackSave,
  } = useAddProductToRack();

  // Filter purchases based on search term and other filters
  // Handle the case where purchases might be undefined or not an array
  const purchasesList = Array.isArray(purchases) ? purchases : [];
  
  const filteredPurchases = purchasesList.filter((purchase) => {
    if (!purchase) return false;
    
    const matchesSearch = !searchTerm || 
      purchase.purchaseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVendor = !selectedVendor || purchase.vendorName === selectedVendor;
    const matchesBrand = !selectedBrand || purchase.brandName === selectedBrand;
    
    return matchesSearch && matchesVendor && matchesBrand;
  });

  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);
  const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<any>(null);

  // Handlers for modals
  const handleOpenNewPurchaseModal = (itemDetails: any = null) => {
    setSelectedPurchaseDetails(itemDetails);
    setIsNewPurchaseModalOpen(true);
  };
  
  const handleCloseNewPurchaseModal = () => setIsNewPurchaseModalOpen(false);
  
  const handleOpenFulfillmentModal = (purchaseDetails: any) => {
    setSelectedPurchaseDetails(purchaseDetails);
    setIsFulfillmentModalOpen(true);
  };
  
  const handleCloseFulfillmentModal = () => setIsFulfillmentModalOpen(false);
  
  const handleCloseVerificationModal = () => setIsVerificationModalOpen(false);
  
  const handleOpenVerificationModal = (itemDetails: any) => {
    setSelectedPurchaseDetails(itemDetails);
    setIsVerificationModalOpen(true);
  };

  const handleNewPurchaseSubmit = (data: any) => {
    console.log("New Purchase Data:", data);
    setIsNewPurchaseModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || 'pending';
    if (statusLower === "completed" || statusLower === "paid")
      return "bg-green-500 text-white";
    if (statusLower === "progress" || statusLower === "partial" || statusLower === "draft")
      return "bg-yellow-400 text-black";
    if (statusLower === "pending") 
      return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getOrderStatus = (purchase: any, type: 'po' | 'pi' | 'invoice') => {
    // Handle both object and string status formats
    if (purchase.status && typeof purchase.status === 'object') {
      return purchase.status[type] || 'Pending';
    }
    // For items with string status, map to appropriate values
    if (purchase.status === 'draft') {
      return type === 'po' ? 'Completed' : 'Pending';
    }
    return purchase.status || 'Pending';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleDateRangeApply = (fromDate: Date, toDate: Date) => {
    setDateRange({ from: fromDate, to: toDate });
  };

  const handleStatusUpdate = async (purchaseId: string, status: string) => {
    try {
      await updatePurchaseStatus(purchaseId, { status });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Top Filter and Action Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Input Filters */}
            <div className="flex flex-wrap gap-3 flex-grow">
              <input
                type="text"
                placeholder="Purchase ID"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                placeholder="UID"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[100px]"
              />
              <button
                onClick={() => setIsCalendarOpen(true)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 flex-1 min-w-[120px]"
              >
                Invoice Date
              </button>
              <input
                type="text"
                placeholder="Barcode"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[100px]"
              />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
              >
                <option value="">Vendor</option>
                <option value="Bhavani Hardware">Bhavani Hardware</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Choose Brand</option>
                <option value="Acme elec">Acme elec</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <button 
                onClick={() => fetchPurchases()}
                className="p-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => handleOpenNewPurchaseModal(null)}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Error loading purchases: {error}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No purchases found. Try adjusting your filters or create a new purchase.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="font-medium">Vendor name</div>
                    <div className="font-medium">Brand</div>
                    <div className="font-medium">Invoice No</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="font-medium">Purchase Order</div>
                    <div className="font-medium">Performa Invoice</div>
                    <div className="font-medium">Invoice</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="font-medium">Payment</div>
                    <div className="font-medium">Status</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fulfillment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="font-medium">Purchase date</div>
                    <div className="font-medium">Last Updated date</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="font-medium">Store</div>
                    <div className="font-medium">Notes</div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.purchaseId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-gray-900 font-semibold">
                        {item.vendorName}
                      </div>
                      <div className="text-gray-700">{item.brandName}</div>
                      <div className="text-gray-500 text-xs">{item.invoiceNo}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="space-y-1">
                        <div className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(getOrderStatus(item, 'po'))}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNewPurchaseModal(item);
                            }}
                            className="font-semibold text-left flex-grow focus:outline-none px-1 py-0.5"
                          >
                            PO
                          </button>
                          <span className="font-semibold text-right px-1 py-0.5">
                            {getOrderStatus(item, 'po')}
                          </span>
                        </div>
                        
                        <div className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(getOrderStatus(item, 'pi'))}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNewPurchaseModal(item);
                            }}
                            className="font-semibold text-left flex-grow focus:outline-none px-1 py-0.5"
                          >
                            PI
                          </button>
                          <span className="font-semibold text-right px-1 py-0.5">
                            {getOrderStatus(item, 'pi')}
                          </span>
                        </div>
                        
                        <div className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(getOrderStatus(item, 'invoice'))}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNewPurchaseModal(item);
                            }}
                            className="font-semibold text-left flex-grow focus:outline-none px-1 py-0.5"
                          >
                            Invoice
                          </button>
                          <span className="font-semibold text-right px-1 py-0.5">
                            {getOrderStatus(item, 'invoice')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.pricing?.grandTotal || 0)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col items-center justify-center w-full">
                        <select
                          value={item.paymentStatus}
                          onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded min-w-[100px] text-center border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500
                            ${getStatusColor(item.paymentStatus)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="partial">Partial</option>
                          <option value="completed">Completed</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="space-y-1">
                        <div className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(item.fulfillmentStatus)}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFulfillmentModal(item);
                            }}
                            className="w-1/2 font-semibold text-left focus:outline-none px-1 py-0.5"
                          >
                            Fulfilment
                          </button>
                          <span className="w-1/2 font-semibold text-right px-1 py-0.5">
                            {item.fulfillmentStatus}
                          </span>
                        </div>
                        
                        <div className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(item.status?.stockEntry || 'pending')}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenVerificationModal(item);
                            }}
                            className="w-1/2 font-semibold text-left focus:outline-none px-1 py-0.5"
                          >
                            Stock Entry
                          </button>
                          <span className="w-1/2 font-semibold text-right px-1 py-0.5">
                            {item.status?.stockEntry || 'Pending'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between w-full p-1 text-xs rounded-md">
                          <button
                            onClick={() => handleOpenAddProductToRackModal(item)}
                            className="w-full px-2 py-0.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                          >
                            <Plus size={16} className="mr-1" />
                            Product to Rack
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="text-gray-900 font-semibold">
                        {formatDate(item.createdAt)}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {formatDate(item.updatedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="text-gray-900 font-semibold">
                        {item.store}
                      </div>
                      <div className="text-gray-600 text-xs truncate max-w-32">
                        {item.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Pagination */}
          {!loading && !error && filteredPurchases.length > 0 && pagination && (
            <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <Pagination
                currentPage={pagination.current || pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onApply={handleDateRangeApply}
      />
      
      {/* Modals */}
      {isNewPurchaseModalOpen && (
        <NewPurchaseModal
          isOpen={isNewPurchaseModalOpen}
          onClose={handleCloseNewPurchaseModal}
        />
      )}

      {isFulfillmentModalOpen && selectedPurchaseDetails && (
        <FulfillmentModal
          isOpen={isFulfillmentModalOpen}
          onClose={handleCloseFulfillmentModal}
          purchaseDetails={selectedPurchaseDetails}
        />
      )}

      {isVerificationModalOpen && selectedPurchaseDetails && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={handleCloseVerificationModal}
          purchaseDetails={selectedPurchaseDetails}
        />
      )}

      {isAddProductToRackModalOpen && (
        <AddProductToRackModal
          isOpen={isAddProductToRackModalOpen}
          onClose={handleCloseAddProductToRackModal}
          onSave={(productsData) => {
            if (productsData.length > 0 && productsData[0].tempId) {
              const rackAssignments = productsData[0].rackQuantities.map(rq => ({
                rack: rq.rackId,
                quantity: rq.quantity
              }));
              
              handleAddProductToRackSave({
                itemId: productsData[0].tempId,
                rackAssignments
              });
            }
          }}
          initialData={productToAddDetails}
          mode="edit"
        />
      )}
    </div>
  );
};

export default PurchaseManagement;