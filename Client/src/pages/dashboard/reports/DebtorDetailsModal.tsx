import React from "react";
import { X, MapPin, FileText, Calendar, CreditCard } from "lucide-react";

interface DebtorData {
  id: string;
  no: string;
  customer: string;
  gstNo: string;
  address: string;
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
  date: string;
}

interface DebtorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: string;
  allDebtorsData: DebtorData[];
}

const DebtorDetailsModal: React.FC<DebtorDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
  allDebtorsData,
}) => {
  if (!isOpen) return null;

  // Filter all transactions for this customer
  const customerTransactions = allDebtorsData.filter(
    (item) => item.customer === customer
  );

  // Get customer basic info from the first transaction
  const customerInfo = customerTransactions[0];

  // Calculate totals for this customer
  const customerTotals = customerTransactions.reduce(
    (acc, transaction) => ({
      totalOpeningBalance: acc.totalOpeningBalance + transaction.openingBalance,
      totalDebit: acc.totalDebit + transaction.debit,
      totalCredit: acc.totalCredit + transaction.credit,
      totalClosingBalance: acc.totalClosingBalance + transaction.closingBalance,
    }),
    { totalOpeningBalance: 0, totalDebit: 0, totalCredit: 0, totalClosingBalance: 0 }
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!customerInfo) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Customer Details</h2>
            <p className="text-sm text-gray-600 mt-1">{customer}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Customer Basic Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Customer Name</label>
                <p className="mt-1 text-sm text-gray-800">{customerInfo.customer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">GST Number</label>
                <p className="mt-1 text-sm text-gray-800">{customerInfo.gstNo}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 flex items-center">
                  <MapPin size={16} className="mr-1" />
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-800">{customerInfo.address}</p>
              </div>
            </div>
          </div>

          {/* Summary Totals */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <CreditCard size={20} className="mr-2 text-green-600" />
              Summary Totals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-xs font-medium text-gray-600 uppercase">Opening Balance</p>
                <p className="text-lg font-semibold text-blue-600">
                  ₹ {customerTotals.totalOpeningBalance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-xs font-medium text-gray-600 uppercase">Total Debit</p>
                <p className="text-lg font-semibold text-red-600">
                  ₹ {customerTotals.totalDebit.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-xs font-medium text-gray-600 uppercase">Total Credit</p>
                <p className="text-lg font-semibold text-green-600">
                  ₹ {customerTotals.totalCredit.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-xs font-medium text-gray-600 uppercase">Closing Balance</p>
                <p className="text-lg font-semibold text-purple-600">
                  ₹ {customerTotals.totalClosingBalance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-purple-600" />
              Transaction History ({customerTransactions.length} transactions)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Opening Balance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Debit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Credit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Closing Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customerTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {transaction.no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        ₹ {transaction.openingBalance.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                        ₹ {transaction.debit.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                        ₹ {transaction.credit.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                        ₹ {transaction.closingBalance.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtorDetailsModal;