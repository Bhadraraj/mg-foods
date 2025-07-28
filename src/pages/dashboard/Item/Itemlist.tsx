import React, { useState } from "react";
import { Search } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  hsnCode: string;
  itemCode: string;
  sellPrice: string;
  purchasePrice: string;
  currentStock: number;
}

interface ItemListProps {
  setShowNewItemForm: (show: boolean) => void;
  items: any[];
  loading: boolean;
  error: string | null;
  onEditItem: (item: any) => void;
  onDeleteItem: (itemId: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ 
  setShowNewItemForm, 
  items, 
  loading, 
  error, 
  onEditItem, 
  onDeleteItem 
}) => {
  const [activeTab, setActiveTab] = useState<"item" | "category">("item");
  const [isMenuManagementOpen, setIsMenuManagementOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "item" ? "bg-blue-700 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("item")}
            >
              Item
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "category" ? "bg-blue-700 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("category")}
            >
              Category
            </button>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, item code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setIsMenuManagementOpen(true)}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              Menu Management
            </button>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="px-4 py-2 text-blue-700 hover:text-blue-800"
            >
              Add new item
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-8">
            <p>Error loading items: {error}</p>
          </div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SI no.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                HSN Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sell Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Purchase Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item, index) => (
              <tr key={item._id || item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0].url} 
                        alt={item.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-blue-700 rounded"></div>
                    )}
                    <span className="ml-3 text-sm text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.hsnCode || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.itemCode || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{item.pricing?.sellingPrice?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{item.pricing?.purchasePrice?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.stock?.currentStock || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditItem(item)}
                      className="text-blue-700 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteItem(item._id || item.id)}
                      className="text-red-700 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default ItemList;