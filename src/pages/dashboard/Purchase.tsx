import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import NewPurchaseModal from "../../components/modals/NewPurchaseModal";
import FulfillmentModal from "../../components/modals/FulfillmentModal";
import VerificationModal from "../../components/modals/VerificationModal";
import AddProductToRackModal from "../../components/modals/AddProductToRack";
import { usePurchases } from "../../hooks/usePurchases";
import { useAddProductToRack } from "../../hooks/useAddProductToRack";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/LoadingSpinner";

// Updated PurchaseItem interface (ensure this is consistent with your types file)
interface PurchaseItem {
  id: string;
  vendorName: string;
  customer: string;
  gst: string;
  purchaseOrder: {
    status: "Progress" | "Completed" | "Pending";
    type: "PO" | "PI" | "Invoice";
  }[];
  purchaseTotal: number;
  paymentStatus: "Pending" | "In Progress" | "Completed" | "Paid";
  fulfillment: {
    type: "Fulfilment" | "Stock Entry";
    status: "Pending" | "Completed";
  }[];
  createdBy: string;
  lastUpdatedBy: string;
  date: string;
  details?: {
    invoiceNo: string;
    invoiceDate: string;
    totalItems: number;
    totalQty: number;
    brand: string;
    items: Array<{
      no: string;
      image: string;
      productName: string;
      price: number;
      qty: number;
      inventoryQty: number;
    }>;
    unit: string;
    mrp: number;
    storeRetailPrice: number;
    storeWholePrice: number;
    estimationPrice: number;
    quotation: number;
    igst: string;
    sgst: string;
    cgst: string;
    hsn: string;
    description: string;
    discount: number;
  };
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
    const samplePurchaseData: PurchaseItem[] = [
    {
      id: "MUK192834930293B4",
      vendorName: "SS Marketing",
      customer: "Pidilite",
      gst: "33AVSPD9193QQ1ZL",
      purchaseOrder: [
        { status: "Progress", type: "PO" },
        { status: "Completed", type: "PI" },
        { status: "Completed", type: "Invoice" },
      ],
      purchaseTotal: 1820,
      paymentStatus: "Pending",
      fulfillment: [
        { type: "Fulfilment", status: "Pending" },
        { type: "Stock Entry", status: "Pending" },
      ],
      createdBy: "Sundar",
      lastUpdatedBy: "Sundar",
      date: "2025-04-12",
      details: {
        invoiceNo: "261",
        invoiceDate: "2025-05-12 04:34:56",
        totalItems: 3,
        totalQty: 15,
        brand: "Sand Master",
        items: [
          {
            no: "01",
            image: "https://placehold.co/40x40/FF0000/FFFFFF?text=P1", // Placeholder image
            productName: "Product 01",
            price: 0.0,
            qty: 5,
            inventoryQty: 5,
          },
          {
            no: "02",
            image: "https://placehold.co/40x40/00FF00/FFFFFF?text=P2", // Placeholder image
            productName: "Product 02",
            price: 10.5,
            qty: 5,
            inventoryQty: 5,
          },
          {
            no: "03",
            image: "https://placehold.co/40x40/0000FF/FFFFFF?text=P3", // Placeholder image
            productName: "Product 03",
            price: 25.75,
            qty: 5,
            inventoryQty: 5,
          },
        ],
        unit: "Pcs",
        mrp: 3331.7,
        storeRetailPrice: 1000.0,
        storeWholePrice: 800.0,
        estimationPrice: 900.0,
        quotation: 850.0,
        igst: "18%",
        sgst: "9%",
        cgst: "9%",
        hsn: "12345",
        description: "Description for product 01",
        discount: 50.0,
      },
    },
    {
      id: "MUK192834930293B5",
      vendorName: "ABC Suppliers",
      customer: "Reliance",
      gst: "22ABCDE1234F5G6H7",
      purchaseOrder: [
        { status: "Completed", type: "PO" },
        { status: "Progress", type: "PI" },
        { status: "Pending", type: "Invoice" },
      ],
      purchaseTotal: 3500,
      paymentStatus: "In Progress",
      fulfillment: [
        { type: "Fulfilment", status: "Completed" },
        { type: "Stock Entry", status: "Pending" },
      ],
      createdBy: "Alice",
      lastUpdatedBy: "Bob",
      date: "2025-03-20",
      details: {
        invoiceNo: "262",
        invoiceDate: "2025-04-01 10:00:00",
        totalItems: 2,
        totalQty: 10,
        brand: "Tech Innovations",
        items: [
          {
            no: "01",
            image: "https://placehold.co/40x40/FF0000/FFFFFF?text=G1", // Placeholder image
            productName: "Gadget X",
            price: 100.0,
            qty: 5,
            inventoryQty: 5,
          },
          {
            no: "02",
            image: "https://placehold.co/40x40/00FF00/FFFFFF?text=G2", // Placeholder image
            productName: "Gadget Y",
            price: 200.0,
            qty: 5,
            inventoryQty: 5,
          },
        ],
        unit: "Pcs",
        mrp: 5000.0,
        storeRetailPrice: 1500.0,
        storeWholePrice: 1200.0,
        estimationPrice: 1300.0,
        quotation: 1250.0,
        igst: "12%",
        sgst: "6%",
        cgst: "6%",
        hsn: "67890",
        description: "Description for product X",
        discount: 100.0,
      },
    },
    {
      id: "MUK192834930293B6",
      vendorName: "XYZ Distributors",
      customer: "Tata",
      gst: "11ZYXWV9876U5T4S3",
      purchaseOrder: [
        { status: "Completed", type: "PO" },
        { status: "Completed", type: "PI" },
        { status: "Completed", type: "Completed" }, // Changed to "Completed" to match image
      ],
      purchaseTotal: 5000,
      paymentStatus: "Completed",
      fulfillment: [
        { type: "Fulfilment", status: "Completed" },
        { type: "Stock Entry", status: "Completed" },
      ],
      createdBy: "Charlie",
      lastUpdatedBy: "Charlie",
      date: "2025-05-01",
      details: {
        invoiceNo: "263",
        invoiceDate: "2025-05-15 11:30:00",
        totalItems: 1,
        totalQty: 20,
        brand: "Global Supplies",
        items: [
          {
            no: "01",
            image: "https://placehold.co/40x40/0000FF/FFFFFF?text=RM", // Placeholder image
            productName: "Raw Material A",
            price: 50.0,
            qty: 20,
            inventoryQty: 20,
          },
        ],
        unit: "Kg",
        mrp: 2000.0,
        storeRetailPrice: 60.0,
        storeWholePrice: 55.0,
        estimationPrice: 58.0,
        quotation: 57.0,
        igst: "5%",
        sgst: "2.5%",
        cgst: "2.5%",
        hsn: "54321",
        description: "Description for raw material A",
        discount: 20.0,
      },
    },
    // Adding more dummy data to match the image's row count and variations
    {
      id: "MUK192834930293B7",
      vendorName: "SS Marketing",
      customer: "Pidilite",
      gst: "33AVSPD9193QQ1ZL",
      purchaseOrder: [
        { status: "Completed", type: "PO" },
        { status: "Completed", type: "PI" },
        { status: "Completed", type: "Invoice" },
      ],
      purchaseTotal: 1862,
      paymentStatus: "Paid",
      fulfillment: [
        { type: "Fulfilment", status: "Completed" },
        { type: "Stock Entry", status: "Completed" },
      ],
      createdBy: "Sundar",
      lastUpdatedBy: "Sundar",
      date: "2025-04-12",
      details: {
        // Reusing details for brevity, ideally unique for each entry
        invoiceNo: "264",
        invoiceDate: "2025-05-12 04:34:56",
        totalItems: 3,
        totalQty: 15,
        brand: "Sand Master",
        items: [
          {
            no: "01",
            image: "https://placehold.co/40x40/FF0000/FFFFFF?text=P1",
            productName: "Product 01",
            price: 0.0,
            qty: 5,
            inventoryQty: 5,
          },
        ],
        unit: "Pcs",
        mrp: 3331.7,
        storeRetailPrice: 1000.0,
        storeWholePrice: 800.0,
        estimationPrice: 900.0,
        quotation: 850.0,
        igst: "18%",
        sgst: "9%",
        cgst: "9%",
        hsn: "12345",
        description: "Description for product 01",
        discount: 50.0,
      },
    },
    {
      id: "MUK192834930293B8",
      vendorName: "SS Marketing",
      customer: "Pidilite",
      gst: "33AVSPD9193QQ1ZL",
      purchaseOrder: [
        { status: "Completed", type: "PO" },
        { status: "Completed", type: "PI" },
        { status: "Completed", type: "Invoice" },
      ],
      purchaseTotal: 1862,
      paymentStatus: "Paid",
      fulfillment: [
        { type: "Fulfilment", status: "Completed" },
        { type: "Stock Entry", status: "Completed" },
      ],
      createdBy: "Sundar",
      lastUpdatedBy: "Sundar",
      date: "2025-04-12",
      details: {
        // Reusing details for brevity, ideally unique for each entry
        invoiceNo: "265",
        invoiceDate: "2025-05-12 04:34:56",
        totalItems: 3,
        totalQty: 15,
        brand: "Sand Master",
        items: [
          {
            no: "01",
            image: "https://placehold.co/40x40/FF0000/FFFFFF?text=P1",
            productName: "Product 01",
            price: 0.0,
            qty: 5,
            inventoryQty: 5,
          },
        ],
        unit: "Pcs",
        mrp: 3331.7,
        storeRetailPrice: 1000.0,
        storeWholePrice: 800.0,
        estimationPrice: 900.0,
        quotation: 850.0,
        igst: "18%",
        sgst: "9%",
        cgst: "9%",
        hsn: "12345",
        description: "Description for product 01",
        discount: 50.0,
      },
    },
    {
      id: "MUK192834930293B9",
      vendorName: "SS Marketing",
      customer: "Pidilite",
      gst: "33AVSPD9193QQ1ZL",
      purchaseOrder: [
        { status: "Completed", type: "PO" },
        { status: "Completed", type: "PI" },
        { status: "Completed", type: "Invoice" },
      ],
      purchaseTotal: 1862,
      paymentStatus: "Paid",
      fulfillment: [
        { type: "Fulfilment", status: "Completed" },
        { type: "Stock Entry", status: "Completed" },
      ],
      createdBy: "Sundar",
      lastUpdatedBy: "Sundar",
      date: "2025-04-12",
      details: {
        // Reusing details for brevity, ideally unique for each entry
        invoiceNo: "266",
        invoiceDate: "2025-05-12 04:34:56",
        totalItems: 3,
        totalQty: 15,
        brand: "Sand Master",
        items: [
          {
            no: "01",
            image: "https://placehold.co/40x40/FF0000/FFFFFF?text=P1",
            productName: "Product 01",
            price: 0.0,
            qty: 5,
            inventoryQty: 5,
          },
        ],
        unit: "Pcs",
        mrp: 3331.7,
        storeRetailPrice: 1000.0,
        storeWholePrice: 800.0,
        estimationPrice: 900.0,
        quotation: 850.0,
        igst: "18%",
        sgst: "9%",
        cgst: "9%",
        hsn: "12345",
        description: "Description for product 01",
        discount: 50.0,
      },
    },
  ];

  // Add the missing state declaration for purchaseData
  const [purchaseData, setPurchaseData] = useState<PurchaseItem[]>(samplePurchaseData);

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
  });

  // Use the add product to rack hook
  const {
    isModalOpen: isAddProductToRackModalOpen,
    selectedProduct: productToAddDetails,
    addingProductToRack,
    openAddProductToRackModal: handleOpenAddProductToRackModal,
    closeAddProductToRackModal: handleCloseAddProductToRackModal,
    handleAddProductToRack: handleAddProductToRackSave,
  } = useAddProductToRack();

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter((purchase) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      purchase.id?.toLowerCase().includes(searchLower) ||
      purchase.vendorName?.toLowerCase().includes(searchLower) ||
      purchase.details?.invoiceNo?.toLowerCase().includes(searchLower)
    );
  });

  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);
  const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false); // State for FulfillmentModal
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false); // State for VerificationModal
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<
    PurchaseItem["details"] | null
  >(null); // State for passing details to modals

  // Handlers for modals
const handleOpenNewPurchaseModal = (itemDetails: PurchaseItem["details"] | null = null) => {
  setSelectedPurchaseDetails(itemDetails);
  setIsNewPurchaseModalOpen(true);
};
  const handleCloseNewPurchaseModal = () => setIsNewPurchaseModalOpen(false);
  
  const handleOpenFulfillmentModal = (purchaseDetails: PurchaseItem["details"]) => {
    setSelectedPurchaseDetails(purchaseDetails);
    setIsFulfillmentModalOpen(true);
  };
  const handleCloseFulfillmentModal = () => setIsFulfillmentModalOpen(false);
  
  // const handleOpenVerificationModal = (purchaseDetails: PurchaseItem["details"]) => {
  //   setSelectedPurchaseDetails(purchaseDetails);
  //   setIsVerificationModalOpen(true);
  // };
  const handleCloseVerificationModal = () => setIsVerificationModalOpen(false);
  


  const handleNewPurchaseSubmit = (data: any) => {
    console.log("New Purchase Data:", data);
    // In a real app, you'd add this new purchase to the purchaseData state
    setIsNewPurchaseModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    if (status === "Completed" || status === "Paid")
      return "bg-green-500 text-white";
    if (status === "Progress" || status === "In Progress")
      return "bg-yellow-400 text-black";
    if (status === "Pending") return "bg-red-500 text-white";
    return "bg-gray-500 text-white"; // Default
  };

  const togglePurchaseOrderStatus = (
    purchaseItemId: string,
    orderType: "PO" | "PI" | "Invoice",
    currentStatus: "Progress" | "Completed" | "Pending"
  ) => {
    setPurchaseData((prevData) =>
      prevData.map((item) =>
        item.id === purchaseItemId
          ? {
              ...item,
              purchaseOrder: item.purchaseOrder.map((order) =>
                order.type === orderType
                  ? {
                      ...order,
                      status:
                        currentStatus === "Pending"
                          ? "Progress"
                          : currentStatus === "Progress"
                          ? "Completed"
                          : "Pending", // Cycle: Pending -> Progress -> Completed -> Pending
                    }
                  : order
              ),
            }
          : item
      )
    );
  };

  // This function will now ONLY toggle the status, not open a modal.
  const toggleFulfillmentStatus = (
    purchaseItemId: string,
    fulfillmentType: "Fulfilment" | "Stock Entry",
    currentStatus: "Pending" | "Completed"
  ) => {
    setPurchaseData((prevData) =>
      prevData.map((item) =>
        item.id === purchaseItemId
          ? {
              ...item,
              fulfillment: item.fulfillment.map((fulfill) =>
                fulfill.type === fulfillmentType
                  ? {
                      ...fulfill,
                      status:
                        currentStatus === "Pending" ? "Completed" : "Pending",
                    }
                  : fulfill
              ),
            }
          : item
      )
    );
  };

 
 

  // Function to open VerificationModal (for fulfillment status clicks or a dedicated button)
  const handleOpenVerificationModal = (
    itemDetails: PurchaseItem["details"]
  ) => {
    setSelectedPurchaseDetails(itemDetails);
    setIsVerificationModalOpen(true);
  };

  const handleDateRangeApply = (fromDate: Date, toDate: Date) => {
    setDateRange({ from: fromDate, to: toDate });
  };

  // Filtered data based on search term, vendor, and brand
  const filteredPurchaseData = purchaseData.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor =
      selectedVendor === "" || item.vendorName === selectedVendor;
    const matchesBrand =
      selectedBrand === "" ||
      (item.details && item.details.brand === selectedBrand);
    // Add date range filtering if needed
    return matchesSearch && matchesVendor && matchesBrand;
  });

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
                <option value="SS Marketing">SS Marketing</option>
                <option value="ABC Suppliers">ABC Suppliers</option>
                <option value="XYZ Distributors">XYZ Distributors</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Choose Brand</option>
                <option value="Sand Master">Sand Master</option>
                <option value="Tech Innovations">Tech Innovations</option>
                <option value="Global Supplies">Global Supplies</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <button className="p-2 bg-black text-white rounded-md hover:bg-gray-800">
                <Search size={20} />
              </button>
              <button
                onClick={() => handleOpenNewPurchaseModal(null)} // Click Plus to add new, no initial data
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
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Error loading purchases: {error.message}
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
                    <div className="font-medium">Customer</div>
                    <div className="font-medium">GST</div>
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
                    <div className="font-medium">Created By</div>
                    <div className="font-medium">Last Updated By</div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-gray-900 font-semibold">
                      {item.vendorName}
                    </div>
                    <div className="text-gray-700">{item.customer}</div>
                    <div className="text-gray-500 text-xs">{item.gst}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      {item.purchaseOrder.map((order, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {/* Button for PO/PI/Invoice type to open NewPurchaseModal */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              if (item.details) {
                                handleOpenNewPurchaseModal(
                                  order.type as "PO" | "PI" | "Invoice"
                                );
                              } else {
                                // Using a custom message box instead of alert()
                                console.log(
                                  `No detailed data available for ${order.type}.`
                                );
                                // Implement a custom modal/toast for user feedback here
                              }
                            }}
                            className="font-semibold text-left flex-grow focus:outline-none px-1 py-0.5"
                          >
                            {order.type}
                          </button>
                          {/* Button for PO/PI/Invoice status to toggle status */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              togglePurchaseOrderStatus(
                                item.id,
                                order.type,
                                order.status
                              );
                            }}
                            className="font-semibold text-right focus:outline-none px-1 py-0.5"
                          >
                            {order.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹ {item.purchaseTotal.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col items-center justify-center w-full">
                      <select
                        value={item.paymentStatus}
                        onChange={(e) =>
                          setPurchaseData((prevData) =>
                            prevData.map((dataItem) =>
                              dataItem.id === item.id
                                ? {
                                    ...dataItem,
                                    paymentStatus: e.target
                                      .value as PurchaseItem["paymentStatus"],
                                  }
                                : dataItem
                            )
                          )
                        }
                        className={`px-2 py-1 text-xs rounded min-w-[100px] text-center border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500
                          ${getStatusColor(item.paymentStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      {item.fulfillment.map((fulfill, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between w-full p-1 text-xs rounded-md ${getStatusColor(
                            fulfill.status
                          )}`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.details) {
                                if (fulfill.type === "Fulfilment") {
                                  handleOpenFulfillmentModal(item.details);
                                } else if (fulfill.type === "Stock Entry") {
                                  handleOpenVerificationModal(item.details);
                                }
                              } else {
                                console.log(
                                  `No detailed data available for ${fulfill.type} details.`
                                );
                              }
                            }}
                            className="w-1/2 font-semibold text-left focus:outline-none px-1 py-0.5"
                          >
                            {fulfill.type}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFulfillmentStatus(
                                item.id,
                                fulfill.type,
                                fulfill.status
                              );
                            }}
                            className="w-1/2 font-semibold text-right focus:outline-none px-1 py-0.5"
                          >
                            {fulfill.status}
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-between w-full p-1 text-xs rounded-md">
                        <button
                          onClick={() => handleOpenAddProductToRackModal(null)}
                          className="w-full px-2 py-0.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                        >
                          <Plus size={20} className="mr-1" />
                          Product to Rack
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-900 font-semibold">
                      {item.date}
                    </div>
                    <div className="text-gray-600 text-xs">00:00:00</div>
                    <div className="text-gray-900 font-semibold">
                      {item.date}
                    </div>
                    <div className="text-gray-600 text-xs">00:00:00</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-900 font-semibold">
                      {item.createdBy}
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {item.lastUpdatedBy}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
          
          {/* Pagination */}
          {!loading && !error && filteredPurchases.length > 0 && (
            <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex items-center">
                <select
                  className="mr-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={pagination.limit}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                >
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
                <span className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.totalItems}</span> results
                </span>
              </div>
              
              <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.totalItems / pagination.limit)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Button to open AddProductToRackModal - placed outside the table for better structure */}

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onApply={handleDateRangeApply}
      />
      
      {/* New Purchase Modal */}
      {isNewPurchaseModalOpen && (
        <NewPurchaseModal
          isOpen={isNewPurchaseModalOpen}
          onClose={handleCloseNewPurchaseModal}
          onSave={(purchaseData) => {
            createPurchase(purchaseData);
            handleCloseNewPurchaseModal();
          }}
          initialData={selectedPurchaseDetails}
        />
      )}

      {/* Fulfillment Modal */}
      {isFulfillmentModalOpen && selectedPurchaseDetails && (
        <FulfillmentModal
          isOpen={isFulfillmentModalOpen}
          onClose={handleCloseFulfillmentModal}
          purchaseDetails={selectedPurchaseDetails}
          onSave={(fulfillmentData) => {
            completePurchase(fulfillmentData);
            handleCloseFulfillmentModal();
          }}
        />
      )}

      {/* Verification Modal */}
      {isVerificationModalOpen && selectedPurchaseDetails && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={handleCloseVerificationModal}
          purchaseDetails={selectedPurchaseDetails}
          onSave={(verificationData) => {
            updatePurchaseStatus(verificationData);
            handleCloseVerificationModal();
          }}
        />
      )}

      {/* Add Product To Rack Modal */}
      {isAddProductToRackModalOpen && (
        <AddProductToRackModal
          isOpen={isAddProductToRackModalOpen}
          onClose={handleCloseAddProductToRackModal}
          onSave={(productsData) => {
            // Transform the data to match the API format
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
