// components/ExpenseFilterAndAdd.tsx
import React from 'react';
import { Plus, Search } from 'lucide-react';

interface ExpenseFilterAndAddProps {
  txnMethod: string;
  setTxnMethod: (method: string) => void;
  searchDate: string;
  setSearchDate: (date: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddClick: () => void;
  onSearchClick: () => void;
  transactionTypes: string[];
}

const ExpenseFilterAndAdd: React.FC<ExpenseFilterAndAddProps> = ({
  txnMethod,
  setTxnMethod,
  searchDate,
  setSearchDate,
  searchTerm,
  setSearchTerm,
  onAddClick,
  onSearchClick,
  transactionTypes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6 flex gap-4 items-center">
      <select
        value={txnMethod}
        onChange={(e) => setTxnMethod(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48"
      >
        <option value="">TXN Method</option>
        {transactionTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
        placeholder="Date"
      />

      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <button
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
      </button>

      <button
        onClick={onAddClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ExpenseFilterAndAdd;