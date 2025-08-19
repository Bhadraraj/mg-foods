// EditCategory.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category } from './CategoryListTable'; // Import Category interface

interface EditCategoryProps {
  category: Category; // The category data to be edited
  onClose: () => void; // Function to close the modal
  onUpdate: (updatedCategory: Category) => void; // Function to handle saving changes
}

const EditCategory: React.FC<EditCategoryProps> = ({ category, onClose, onUpdate }) => {
  const [editedCategory, setEditedCategory] = useState<Category>(category);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sample items for demonstration, replace with actual data or fetching logic
  const availableItems = [
    { name: 'Item A', id: 'itemA' },
    { name: 'Item B', id: 'itemB' },
    { name: 'Item C', id: 'itemC' },
    { name: 'Tea', id: 'itemTea' },
    { name: 'Coff', id: 'itemCoff' },
    { name: 'Vad', id: 'itemVad' },
    { name: 'Item', id: 'itemX' },
    { name: 'Item', id: 'itemY' },
    { name: 'Item', id: 'itemZ' },
  ];

  // In a real application, 'itemsAdded' would likely be part of the category object
  // For demonstration, let's keep it as a local state or derive it
  const [itemsAdded, setItemsAdded] = useState<string[]>(['Tea', 'Coff', 'Vad', 'Item', 'Item', 'Item']);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCategory({
      ...editedCategory,
      categoryName: e.target.value,
    });
  };

  const handleUpdate = () => {
    onUpdate(editedCategory);
    onClose();
  };

  const handleAddItem = (itemName: string) => {
    if (!itemsAdded.includes(itemName)) {
      setItemsAdded([...itemsAdded, itemName]);
    }
  };

  const handleRemoveItem = (itemName: string) => {
    setItemsAdded(itemsAdded.filter(item => item !== itemName));
  };

  const filteredAvailableItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Category - {category.categoryName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={editedCategory.categoryName}
              onChange={handleInputChange}
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

        <div className="flex justify-end gap-4 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;