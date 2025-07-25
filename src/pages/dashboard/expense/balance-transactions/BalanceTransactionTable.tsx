// components/balance-transactions/BalanceTransactionTable.tsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface BalanceTransaction {
  id: number;
  origin: string; // From image
  customerName: string; // From image
  transactionType: string; // From image
  accountType: string; // From image
  transactionDate: string; // From image
  amount: number; // From image
  settled: 'Yes' | 'No'; // From image
  comment: string; // From image
}

interface BalanceTransactionTableProps {
  transactions: BalanceTransaction[];
  onEdit: (transaction: BalanceTransaction) => void;
  onDelete: (id: number) => void;
}

const BalanceTransactionTable: React.FC<BalanceTransactionTableProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="  border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Origin</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Transaction type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Transaction Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Settled</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className="hover: ">
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.origin}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.customerName}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.transactionType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.accountType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.transactionDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹ {transaction.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.settled}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.comment}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceTransactionTable;