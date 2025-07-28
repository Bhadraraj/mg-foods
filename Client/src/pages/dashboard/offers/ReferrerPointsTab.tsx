import React, { useState } from "react";
import { Search, Eye, Plus } from "lucide-react";
import ReferralPointDetailsModal from "./ReferralPointDetailsModal";
import AddReferrerPointsModal from "./AddReferrerPointsModal";

// Transaction Modal Component
const TransactionModal = ({ isOpen, onClose, referrerName, referrerId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const transactions = [
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
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Yearly / Commission points Transaction list
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
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

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-600">
              (Balance) Yearly / Commission : {yearlyBalance} / {commissionBalance}
            </span>
          </div>

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

interface Referrer {
  id: number;
  customerName: string;
  phone: string;
  commissionTotal: number;
  yearlyTotal: number;
  totalPoints: number;
  balanceCommission: number;
  balanceYearly: number;
  balancePoints: number;
}

const ReferrerPointsTab: React.FC = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null);
  const [selectedMainReferrer, setSelectedMainReferrer] = useState("");

  const referrerData: Referrer[] = [
    {
      id: 1,
      customerName: "Kumar",
      phone: "9787875643",
      commissionTotal: 0,
      yearlyTotal: 12,
      totalPoints: 12,
      balanceCommission: 0,
      balanceYearly: 12,
      balancePoints: 12,
    },
    {
      id: 2,
      customerName: "Shiva",
      phone: "6342343234",
      commissionTotal: 0,
      yearlyTotal: 42,
      totalPoints: 42,
      balanceCommission: 0,
      balanceYearly: 42,
      balancePoints: 42,
    },
    {
      id: 3,
      customerName: "Arul",
      phone: "9896454363",
      commissionTotal: 0,
      yearlyTotal: 442,
      totalPoints: 442,
      balanceCommission: 0,
      balanceYearly: 442,
      balancePoints: 442,
    },
    {
      id: 4,
      customerName: "Annsh",
      phone: "8096454363",
      commissionTotal: 0,
      yearlyTotal: 21,
      totalPoints: 21,
      balanceCommission: 0,
      balanceYearly: 21,
      balancePoints: 21,
    },
  ];

  const handleTransactionClick = (referrerId: number) => {
    const referrer = referrerData.find(r => r.id === referrerId);
    setSelectedReferrer(referrer || null);
    setIsTransactionModalOpen(true);
  };

  const handleEyeClick = () => {
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handlePlusClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedReferrer(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div className="w-full md:w-1/4 min-w-[180px]">
          <div className="relative">
            <select
              id="selectReferrer"
              value={selectedMainReferrer}
              onChange={(e) => setSelectedMainReferrer(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
            >
              <option value="">Choose referrer</option>
              <option value="referrer1">Referrer A</option>
              <option value="referrer2">Referrer B</option>
              <option value="referrer3">Referrer C</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          <button className="p-2 border border-gray-300 rounded-md bg-black text-white">
            <Search size={20} />
          </button>
          <button
            className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={handleEyeClick}
          >
            <Eye size={20} />
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            onClick={handlePlusClick}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sl No.
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                colSpan={3}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Total Points
              </th>
              <th
                scope="col"
                colSpan={3}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Balance Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
            <tr>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Commission
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Yearly
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Commission
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Yearly
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrerData.map((referrer) => (
              <tr key={referrer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {referrer.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {referrer.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {referrer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 bg-red-50">
                  {referrer.commissionTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 bg-red-50">
                  {referrer.yearlyTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 bg-red-50">
                  {referrer.totalPoints}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 bg-red-50">
                  {referrer.balanceCommission}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 bg-red-50">
                  {referrer.balanceYearly}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 bg-red-50">
                  {referrer.balancePoints}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleTransactionClick(referrer.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Transaction
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ReferralPointDetailsModal Component (for the eye icon) */}
      <ReferralPointDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />

      {/* AddReferrerPointsModal Component (for the plus icon) */}
      <AddReferrerPointsModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />

      {/* Transaction Modal Component */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        referrerName={selectedReferrer?.customerName}
        referrerId={selectedReferrer?.id}
      />
    </div>
  );
};

export default ReferrerPointsTab;