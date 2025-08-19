import React, { useState } from 'react';
import { Search } from 'lucide-react';
import StatusDropdown from './StatusDropdown';

interface ItemRack {
  rack: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
}

interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  unit: string;
  image?: string; // Added image field (optional)
  racks: ItemRack[];
}

interface ItemsProps {
  inventoryItems: InventoryItem[];
  statusFilter: string;
  handleAdjustStock: (item: InventoryItem, rack: ItemRack) => void;
  handleStatusChange: (status: string) => void;
  handleEditItemRack: (item: InventoryItem, rack: ItemRack) => void;
}

const Items: React.FC<ItemsProps> = ({
  inventoryItems,
  statusFilter,
  handleAdjustStock,
  handleStatusChange,
  handleEditItemRack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Flatten items with multiple racks for display
  const flattenedItems = inventoryItems.flatMap((item) =>
    item.racks.map((rack) => ({ ...item, rack }))
  );

  // Filter items based on status, search term, and category
  const filteredItems = flattenedItems.filter((item) => {
    const matchesStatus = statusFilter === 'Status' || statusFilter === 'All' ? true : item.rack.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rack.rack.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    
    return matchesStatus && matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Well Stocked':
        return 'text-green-700';
      case 'Low Stock':
        return 'text-yellow-600';
      case 'Out Of Stock':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Search is already handled by the filter effect
    console.log('Search submitted:', searchTerm);
  };

  // Get unique categories for the dropdown
  const uniqueCategories = [...new Set(inventoryItems.map(item => item.category))];

  return (
    <>
      {/* Clean Header Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Search Section */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg w-80 text-gray-600 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
            <button 
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Filter Controls Section */}
          <div className="flex items-center gap-3">
            {/* Category Dropdown */}
            <select 
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Dropdown */}
            <StatusDropdown onStatusChange={handleStatusChange} />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {filteredItems.length} of {flattenedItems.length} items
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </span>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">SI No.</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Image</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Item Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Unit</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Current Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Rack</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Min Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Max Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={`${item.id}-${item.rack.rack}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.id}</td>
                  <td className="px-6 py-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.itemName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.rack.currentStock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.rack.rack}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.rack.minStock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.rack.maxStock}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${getStatusColor(item.rack.status)}`}>
                    {item.rack.status}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleAdjustStock(item, item.rack)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-medium mb-2">No items found</div>
                    <div className="text-sm">
                      {searchTerm || selectedCategory ? 
                        'Try adjusting your search or filter criteria' : 
                        'No inventory items available'
                      }
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Items;