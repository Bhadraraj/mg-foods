// components/expenses/ExpenseTable.tsx
import React from 'react';
import { Edit } from 'lucide-react';

interface Expense {
  id: number;
  entryDate: string;
  transactionType: string;
  voucherNo: string;
  txnRefNo: string;
  comments: string;
  transactionDate: string;
  credit: number;
  debit: number;
  balanceAmount: number;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void; // New prop for edit
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className=" ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn Ref. No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th> {/* New column */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense, index) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.entryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.transactionType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.voucherNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.txnRefNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.comments}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.transactionDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹ {expense.credit.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹ {expense.debit.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹ {expense.balanceAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(expense)} // Call onEdit with the expense data
                    className="text-indigo-600 hover:text-indigo-900 ml-4"
                  >
                    <Edit className="h-5 w-5" />
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

export default ExpenseTable;