// components/credit-notes/CreditNoteTable.tsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface CreditNote {
  id: number;
  origin: string; // From image
  name: string; // From image (Customer Name)
  gstNonGst: string; // From image (GST / Non GST)
  transactionDate: string; // From image
  amount: number; // From image
  comment: string; // From image
}

interface CreditNoteTableProps {
  notes: CreditNote[];
  onEdit: (note: CreditNote) => void;
  onDelete: (id: number) => void;
}

const CreditNoteTable: React.FC<CreditNoteTableProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="  border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Origin</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">GST / Non GST</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Transaction date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notes.map((note, index) => (
              <tr key={note.id} className="hover: ">
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{note.origin}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{note.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{note.gstNonGst}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{note.transactionDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹ {note.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{note.comment}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(note)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
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

export default CreditNoteTable;