import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Printer,
  Trash2,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

// Import all modal components
import InvoiceModal from "../../components/modals/NewInvoiceModal"; // Assuming this is for creating/editing a new invoice
import PrintConfirmModal from "../../components/modals/PrintConfirmModal";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import ChangeBillTypeModal from "../../components/modals/ChangeBillTypeModal";
import BillReturnModal from "../../components/modals/BillReturnModal";
import PettyCashModal from "../../components/modals/AddPettyCashModal";
import CollectionModal from "../../components/modals/AddCollectionModal";

interface Bill {
  id: string;
  customer: {
    name: string;
    phone: string;
    mobileNumber?: string; // Added for BillReturnModal
    address?: string; // Added for BillReturnModal
    gstin?: string; // Added for BillReturnModal
  };
  products: {
    name: string;
    description: string;
    quantity?: number; // Added for BillReturnModal
    amount?: number; // Added for BillReturnModal
  }[];
  kotStatus: string;
  paymentDetails: {
    credit: number;
    cash: number;
  };
  billDate: string;
  updateDate: string;
  creator: string;
  isCancelled?: boolean;
  currentBillType?: string; // Added for ChangeBillTypeModal
  billNo?: string; // Added for BillReturnModal
  billAmount?: number; // Added for BillReturnModal
  saleRep?: string; // Added for BillReturnModal
  payment?: {
    // Added for BillReturnModal
    billNo: string;
    saleRep: string;
    billAmount: number;
  };
}
import { useApi, useApiMutation } from "../../hooks/useApi";
import { salesAPI } from "../../services/api";

const BillingSystem: React.FC = () => {
  // API hooks
  const { data: salesData, loading, error, refetch } = useApi(salesAPI.getSales);
  const { mutate: deleteSale } = useApiMutation(salesAPI.deleteSale);
  const { mutate: processPayment } = useApiMutation(salesAPI.processPayment);
  const { mutate: refundSale } = useApiMutation(salesAPI.refundSale);

  // State for the main invoice modal (for "New Invoice" and "Edit")
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // States for each specific action modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangeBillTypeModalOpen, setIsChangeBillTypeModalOpen] =
    useState(false);
  const [isBillReturnModalOpen, setIsBillReturnModalOpen] = useState(false);
  const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  // State to hold the data for the currently selected bill across all action modals
  const [selectedBillForAction, setSelectedBillForAction] =
    useState<Bill | null>(null);

  // Transform API data to match component interface
  const bills = salesData?.data?.sales?.map(sale => ({
    id: sale.billNo,
    customer: {
      name: sale.customer.name,
      phone: sale.customer.mobile,
      mobileNumber: sale.customer.mobile,
      address: sale.customer.address || '',
      gstin: sale.customer.gstNumber || '',
    },
    products: sale.items.map(item => ({
      name: item.itemName,
      description: item.variant || 'Standard',
      quantity: item.quantity,
      amount: item.total,
    })),
    kotStatus: sale.kotStatus === 'completed' ? 'Completed' : 'Pending',
    paymentDetails: { 
      credit: sale.pricing.grandTotal, 
      cash: sale.payment.amountReceived || 0 
    },
    billDate: new Date(sale.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    updateDate: new Date(sale.updatedAt || sale.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    creator: sale.createdBy?.name || 'System',
    currentBillType: sale.billType,
    billNo: sale.billNo,
    billAmount: sale.pricing.grandTotal,
    saleRep: sale.createdBy?.name || 'System',
    payment: { 
      billNo: sale.payment.method, 
      saleRep: sale.createdBy?.name || 'System', 
      billAmount: sale.pricing.grandTotal 
    },
    isCancelled: sale.status === 'cancelled',
  })) || [];

  // --- Invoice Modal (New/Edit) Handlers ---
  const openInvoiceModal = (bill: Bill | null = null) => {
    setEditingBill(bill);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setEditingBill(null);
  };

  // --- Generic Action Modal Handlers ---
  // A helper to set the selected bill and open the specific modal
  const openActionModal = (
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>,
    bill: Bill
  ) => {
    setSelectedBillForAction(bill);
    modalSetter(true);
  };

  // A helper to close the specific modal and clear the selected bill
  const closeActionModal = (
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    modalSetter(false);
    setSelectedBillForAction(null);
  };

  // --- Specific Modal Confirmation Handlers ---

  const handlePrintConfirm = () => {
    if (selectedBillForAction) {
      console.log(`Printing bill: ${selectedBillForAction.id}`);
      // Implement your print logic here, e.g., trigger a print API
    }
    closeActionModal(setIsPrintModalOpen);
  };
  const openPettyCashModal = () => {
    setIsPettyCashModalOpen(true);
  };

  const closePettyCashModal = () => {
    setIsPettyCashModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedBillForAction) {
      console.log(`Deleting bill: ${selectedBillForAction.id}`);
      deleteSale(selectedBillForAction.id).then(() => {
        refetch();
      }).catch(error => {
        console.error('Error deleting sale:', error);
      });
    }
    closeActionModal(setIsDeleteModalOpen);
  };

  const handleChangeBillTypeConfirm = (newType: string) => {
    if (selectedBillForAction) {
      console.log(
        `Changing bill ${selectedBillForAction.id} to type: ${newType}`
      );
      // Implement bill type change API call here
      refetch();
    }
    closeActionModal(setIsChangeBillTypeModalOpen);
  };

  const handleBillReturnConfirm = () => {
    if (selectedBillForAction) {
      console.log(`Initiating return for bill: ${selectedBillForAction.id}`);
      // BillReturnModal itself will have its own internal state and logic for product selection and return.
      // The parent component simply needs to know when the return process is initiated/completed via the modal.
    }
    closeActionModal(setIsBillReturnModalOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top section with stats */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              <p>Error loading sales: {error}</p>
            </div>
          ) : (
          <div className="flex flex-wrap items-start gap-8 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-600">Total Bills</span>
              <span className="text-2xl font-bold text-blue-600">{bills.length}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600">Total Net Amount</span>
              <span className="text-2xl font-bold text-green-600">
                ₹ {bills.reduce((sum, bill) => sum + bill.billAmount, 0).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600">Cash</span>
              <span className="text-2xl font-bold text-green-600">
                ₹ 40,000,000
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600">UPI</span>
              <span className="text-2xl font-bold text-green-600">
                ₹ 35,000,000
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600">Pending</span>
              <span className="text-2xl font-bold text-red-600">
                ₹ {bills.filter(bill => bill.kotStatus === 'Pending').reduce((sum, bill) => sum + bill.billAmount, 0).toLocaleString()}
              </span>
            </div>
          </div>
          )}

          <div className="text-sm text-gray-600">12 Aug 2025 - 22 Aug 2025</div>
        </div>
      </div>

      {/* Filter and action buttons section */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-wrap gap-2 items-center">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Customer</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Product</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Bill</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Payment</option>
          </select>
          <input
            type="date"
            placeholder="Date"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          />

          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Sales Rep</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Bill category</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Product category</option>
          </select>

          <div className="ml-auto flex gap-2">
            <button className="p-2 bg-black text-white rounded-md">
              <Search size={16} />
            </button>
            <button
              onClick={openPettyCashModal} // Add this onClick handler
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            >
              Petty Cash
            </button>
            <button
              onClick={() => setIsCollectionModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            >
              Collection
            </button>
            <button
              onClick={() => openInvoiceModal()} // Open for new invoice
              className="p-2 bg-blue-600 text-white rounded-md"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto **max-h-[calc(100vh-200px)] overflow-y-auto**">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bill no.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  KOT Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bill Date / by
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  className={`${
                    bill.isCancelled ? "bg-red-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-4 text-sm text-gray-900">{bill.id}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {bill.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bill.customer.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {bill.products.map((product, idx) => (
                        <div key={idx} className="text-sm text-gray-900">
                          {product.name} - {product.description}
                        </div>
                      ))}
                      <button className="text-xs text-blue-600 hover:underline">
                        See more
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        bill.kotStatus === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bill.kotStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      credit: ₹ {bill.paymentDetails.credit}
                    </div>
                    <div className="text-sm text-gray-500">
                      santhiyag: {bill.paymentDetails.cash}.00(cash)
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{bill.billDate}</div>
                    <div className="text-sm text-gray-500">
                      {bill.updateDate}
                    </div>
                    <div className="text-sm text-gray-500">
                      Update: {bill.creator}
                    </div>
                    <div className="text-sm text-gray-500">
                      Create: {bill.creator}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => openInvoiceModal(bill)} // Open InvoiceModal for editing
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Edit Bill"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() =>
                          openActionModal(setIsPrintModalOpen, bill)
                        }
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Print Bill"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() =>
                          openActionModal(setIsDeleteModalOpen, bill)
                        }
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete Bill"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          openActionModal(setIsChangeBillTypeModalOpen, bill)
                        }
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Change Bill Type"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() =>
                          openActionModal(setIsBillReturnModalOpen, bill)
                        }
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Bill Return"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals for different actions */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={closeInvoiceModal}
        editingBill={editingBill}
      />

      <PrintConfirmModal
        isOpen={isPrintModalOpen}
        onClose={() => closeActionModal(setIsPrintModalOpen)}
        onConfirm={handlePrintConfirm}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => closeActionModal(setIsDeleteModalOpen)}
        onConfirm={handleDeleteConfirm}
      />

      <ChangeBillTypeModal
        isOpen={isChangeBillTypeModalOpen}
        onClose={() => closeActionModal(setIsChangeBillTypeModalOpen)}
        currentBillType={selectedBillForAction?.currentBillType || "GST"} // Default to 'GST' if not set
        onConfirm={handleChangeBillTypeConfirm}
      />

      <BillReturnModal
        isOpen={isBillReturnModalOpen}
        onClose={() => closeActionModal(setIsBillReturnModalOpen)}
        billData={selectedBillForAction} // Pass the entire bill object
      />

      <PettyCashModal
        isOpen={isPettyCashModalOpen}
        onClose={closePettyCashModal}
      />
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </div>
  );
};

export default BillingSystem;
