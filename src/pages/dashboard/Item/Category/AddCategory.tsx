import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { CreateCategoryData } from '../../../../services/api/category';
import { useItems } from '../../../../hooks/useItems';
import { Item } from '../../../../services/api/item';

interface AddCategoryProps {
  onClose: () => void;
  onSave: (newCategory: CreateCategoryData & { itemIds?: string[] }) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemsAdded, setItemsAdded] = useState<Item[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available items
  const { items: availableItems, loading: itemsLoading } = useItems({
    autoFetch: true,
    limit: 100, // Get more items for selection
  });

  const handleAddItem = (item: Item) => {
    if (!itemsAdded.find(addedItem => addedItem.id === item.id)) {
      setItemsAdded([...itemsAdded, item]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItemsAdded(itemsAdded.filter(item => item.id !== itemId));
  };

  const handleSave = async () => {
    if (categoryName.trim() === '') {
      alert('Category Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData: CreateCategoryData & { itemIds?: string[] } = {
        name: categoryName.trim(),
        description: description.trim() || undefined,
        itemIds: itemsAdded.map(item => item.id),
      };

      await onSave(categoryData);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // Filter available items based on search term and exclude already added items
  const filteredAvailableItems = availableItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brandName && item.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const notAlreadyAdded = !itemsAdded.find(addedItem => addedItem.id === item.id);
    return matchesSearch && notAlreadyAdded;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new category and optionally assign items to it</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSubmitting || !categoryName.trim()}
              className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autoFocus
              />
              {categoryName.trim() === '' && (
                <p className="text-sm text-gray-500 mt-1">Category name is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                placeholder="Enter description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Optional description for the category</p>
            </div>
          </div>

          {/* Items Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Items to Category</h3>
            <p className="text-sm text-gray-600 mb-4">You can assign items to this category now or later.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Items */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Available Items</h4>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items by name or brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 max-h-80 overflow-y-auto bg-gray-50">
                  {itemsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                      <span className="ml-2 text-gray-600">Loading items...</span>
                    </div>
                  ) : filteredAvailableItems.length > 0 ? (
                    <div className="space-y-2">
                      {filteredAvailableItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">{item.productName}</div>
                            {(item.brandName || item.brand) && (
                              <div className="text-xs text-gray-500">Brand: {item.brandName || item.brand}</div>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddItem(item)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors ml-2 flex-shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      {searchTerm ? (
                        <div>
                          <p className="font-medium">No items found</p>
                          <p className="text-sm">No items match "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">No items available</p>
                          <p className="text-sm">No items found to assign</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Items */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Selected Items ({itemsAdded.length})
                </h4>
                <div className="border border-gray-200 rounded-md p-3 max-h-80 overflow-y-auto bg-blue-50">
                  {itemsAdded.length > 0 ? (
                    <div className="space-y-2">
                      {itemsAdded.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-white hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-blue-900 truncate">{item.productName}</div>
                            {(item.brandName || item.brand) && (
                              <div className="text-xs text-blue-600">Brand: {item.brandName || item.brand}</div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-blue-600 hover:text-blue-800 p-1 ml-2 flex-shrink-0"
                            title="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-gray-400 mb-2">
                        <div className="mx-auto h-12 w-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <X size={24} />
                        </div>
                      </div>
                      <p className="font-medium">No items selected</p>
                      <p className="text-sm">Items you add will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {(categoryName || itemsAdded.length > 0) && (
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category Name:</span>
                  <div className="font-medium text-gray-900">{categoryName || 'Not set'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Description:</span>
                  <div className="font-medium text-gray-900">{description || 'None'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Items to assign:</span>
                  <div className="font-medium text-gray-900">{itemsAdded.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;