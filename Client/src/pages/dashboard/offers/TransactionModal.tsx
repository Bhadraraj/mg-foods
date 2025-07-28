import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrerName?: string;
  referrerId?: number;
}

interface Transaction {
  id: number;
  customer: string;
  phone: string;
  billNo: string;
  billType: string;
  txnType: string;
  date: string;
  yearlyPts: number;
  commissionPoints: number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  referrerName = "Kumar",
  referrerId = 1
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: 1,
      customer: "John Doe",
      phone: "9876543210",
      billNo: "INV001",
      billType: "Sales",
      txnType: "Credit",
      date: "2024-01-15",
      yearlyPts: 5,
      commissionPoints: 0
    },
    {
      id: 2,
      customer: "Jane Smith",
      phone: "8765432109",
      billNo: "INV002",
      billType: "Sales",
      txnType: "Credit",
      date: "2024-01-16",
      yearlyPts: 3,
      commissionPoints: 0
    },
    {
      id: 3,
      customer: "Mike Johnson",
      phone: "7654321098",
      billNo: "INV003",
      billType: "Return",
      txnType: "Debit",
      date: "2024-01-17",
      yearlyPts: 4,
      commissionPoints: 0
    }
  ];

  const yearlyBalance = transactions.reduce((sum, txn) => 
    txn.txnType === "Credit" ? sum + txn.yearlyPts : sum - txn.yearlyPts, 0
  );
  const commissionBalance = transactions.reduce((sum, txn) => 
    txn.txnType === "Credit" ? sum + txn.commissionPoints : sum - txn.commissionPoints, 0
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.phone.includes(searchTerm) ||
    transaction.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Yearly / Commission points Transaction list
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Date Filter and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
              </div>
              <button className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Balance Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-600">
              (Balance) Yearly / Commission : {yearlyBalance} / {commissionBalance}
            </span>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TXN Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yearly pts
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.phone}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.billNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.billType}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.txnType === 'Credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.txnType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        {transaction.yearlyPts}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        {transaction.commissionPoints}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;