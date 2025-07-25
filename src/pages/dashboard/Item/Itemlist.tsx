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
}

const ItemList: React.FC<ItemListProps> = ({ setShowNewItemForm }) => {
  const [activeTab, setActiveTab] = useState<"item" | "category">("item");
  const [isMenuManagementOpen, setIsMenuManagementOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      id: "01",
      name: "5-Star",
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
    },
  ];

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
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-700 rounded"></div>
                    <span className="ml-3 text-sm text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.hsnCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.itemCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.sellPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.purchasePrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.currentStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-700 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;