import React, { useState } from 'react'; // <-- Import useState
import { Plus, Search, ChevronDown, Edit3, MoreVertical } from 'lucide-react';
import EditLedgerModal from './EditLedgerModal'; // <-- Import the new modal

interface Ledger {
  slNo: string;
  ledgerCategory: string;
  ledgerGroup: string;
  ledgerName: string;
  tax: string;
  percentage: number;
}

interface LedgerListTableProps {
  ledgers: Ledger[];
  onAddLedger: () => void;
  onSearch: (searchTerm: string) => void;
  // onEditLedger is no longer needed as a prop, we handle it internally
}

const LedgerListTable: React.FC<LedgerListTableProps> = ({ ledgers, onAddLedger, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState<boolean>(false);

  // --- Start: New state and handlers for the modal ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<Ledger | null>(null);

  const handleEditClick = (ledger: Ledger) => {
    setEditingLedger(ledger);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingLedger(null);
  };

  const handleUpdateLedger = (updatedLedger: Ledger) => {
    // Here, you would typically update the state or call an API
    console.log("Updated Ledger:", updatedLedger);
    // For now, we just close the modal
    handleCloseModal();
  };
  // --- End: New state and handlers for the modal ---


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategoryFilter(category);
    setShowCategoryDropdown(false);
  };

  const handleGroupFilterChange = (group: string) => {
    setSelectedGroupFilter(group);
    setShowGroupDropdown(false);
  };

  const filteredLedgers = ledgers.filter(ledger => {
    const matchesSearch = ledger.ledgerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === '' || ledger.ledgerCategory === selectedCategoryFilter;
    const matchesGroup = selectedGroupFilter === '' || ledger.ledgerGroup === selectedGroupFilter;
    return matchesSearch && matchesCategory && matchesGroup;
  });

  const predefinedCategories = ['Current Liabilities'];
  const predefinedGroups = ['Current Liabilities', 'Fixed Asset', 'Direct Income', 'Indirect Income'];

  return (
    <div className="bg-white">

      {/* Render the modal */}
      <EditLedgerModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateLedger}
        ledger={editingLedger}
        predefinedCategories={predefinedCategories}
        predefinedGroups={predefinedGroups}
      />

      {/* Filters and Search (Your existing JSX is unchanged) */}
      <div className="p-4 border-b border-gray-200">
        {/* ... your filter and search UI ... */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
              {/* Ledger Category Filter */}
              <div className="relative">
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[140px] justify-between"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span>{selectedCategoryFilter || 'Ledger Category'}</span>
                  <ChevronDown size={16} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-md mt-1 z-10 min-w-[200px]">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleCategoryFilterChange('')}
                    >
                      All Categories
                    </button>
                    {predefinedCategories.map(category => (
                      <button
                        key={category}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                        onClick={() => handleCategoryFilterChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ledger Group Filter */}
              <div className="relative">
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[120px] justify-between"
                  onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                >
                  <span>{selectedGroupFilter || 'Ledger Group'}</span>
                  <ChevronDown size={16} />
                </button>
                {showGroupDropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-md mt-1 z-10 min-w-[200px]">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleGroupFilterChange('')}
                    >
                      All Groups
                    </button>
    _                {predefinedGroups.map(group => (
                      <button
                        key={group}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                        onClick={() => handleGroupFilterChange(group)}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          </div>

          {/* Search and Add Button */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              className="w-10 h-10 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center transition-colors"
              onClick={onAddLedger}
            >
              <Search size={20} />
            </button>
            <button
              onClick={onAddLedger}
              className="w-10 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {/* ... your table header ... */}
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SI No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ledger Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ledger Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ledger
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLedgers.map((ledger, index) => (
              <tr key={ledger.slNo} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ledger.ledgerCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ledger.ledgerGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ledger.ledgerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.tax === 'Yes' ? '-' : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.percentage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={() => handleEditClick(ledger)} // <-- MODIFIED LINE
                    >
                      <Edit3 size={16} />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerListTable;