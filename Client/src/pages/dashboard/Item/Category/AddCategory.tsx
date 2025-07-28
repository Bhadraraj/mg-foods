// AddCategory.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category } from './CategoryListTable'; // Assuming CategoryListTable is in the same folder

interface AddCategoryProps {
  onClose: () => void; // Function to close the modal
  onSave: (newCategory: Omit<Category, 'slNo' | 'totalItems'> & { items: string[] }) => void; // Function to handle saving the new category
}

const AddCategory: React.FC<AddCategoryProps> = ({ onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemsAdded, setItemsAdded] = useState<string[]>([]);

  // Sample available items (replace with actual data or fetching logic)
  const availableItems = [
    { name: 'Tea', id: 'itemTea' },
    { name: 'Coffee', id: 'itemCoff' },
    { name: 'Vada', id: 'itemVada' },
    { name: 'Item A', id: 'itemA' },
    { name: 'Item B', id: 'itemB' },
    { name: 'Item C', id: 'itemC' },
    { name: 'Item D', id: 'itemD' },
    { name: 'Item E', id: 'itemE' },
    { name: 'Item F', id: 'itemF' },
  ];

  const handleAddItem = (itemName: string) => {
    if (!itemsAdded.includes(itemName)) {
      setItemsAdded([...itemsAdded, itemName]);
    }
  };

  const handleRemoveItem = (itemName: string) => {
    setItemsAdded(itemsAdded.filter(item => item !== itemName));
  };

  const handleSave = () => {
    if (categoryName.trim() === '') {
      alert('Category Name cannot be empty.');
      return;
    }
    // For a new category, slNo and totalItems might be assigned by the backend
    // We are only sending the categoryName and the items associated with it.
    onSave({
      categoryName: categoryName,
      items: itemsAdded,
    });
    onClose(); // Close the modal after saving
  };

  const filteredAvailableItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add new Category</h2>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Add Items</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search item name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto grid grid-cols-3 gap-2">
                {filteredAvailableItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddItem(item.name)}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Items Added</h3>
              <div className="border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto grid grid-cols-3 gap-2">
                {itemsAdded.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-1 bg-blue-100 border border-blue-300 rounded-md text-sm text-blue-800"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;