// components/journal/JournalTable.tsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react'; // Import Trash2 icon

interface JournalEntry {
  id: number;
  billNo: string; // From image
  billDate: string; // From image
  financialYear: string; // From image
  gstBill: 'yes' | 'no'; // From image
  amount: number; // From image
}

interface JournalTableProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: number) => void;
}

const JournalTable: React.FC<JournalTableProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="  border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bill No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bill Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Financial Year</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">GST Bill</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <tr key={entry.id} className="hover: ">
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.billNo}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.billDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.financialYear}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.gstBill}</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹ {entry.amount.toFixed(2)}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(entry)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
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

export default JournalTable;