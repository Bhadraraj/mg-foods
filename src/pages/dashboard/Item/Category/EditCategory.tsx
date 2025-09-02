import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { UpdateCategoryData } from '../../../../services/api/category';
import { useItems } from '../../../../hooks/useItems';
import { useCategory } from '../../../../hooks/useCategories';
import { Item } from '../../../../services/api/item';

interface EditCategoryProps {
  categoryId: string;
  onClose: () => void;
  onSave: (
    categoryId: string, 
    updateData: UpdateCategoryData,
    itemChanges?: { add: string[], remove: string[] }
  ) => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ categoryId, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemsAdded, setItemsAdded] = useState<Item[]>([]);
  const [originalItems, setOriginalItems] = useState<Item[]>([]);

  // Fetch category details
  const { category, loading: categoryLoading } = useCategory(categoryId);

  // Fetch available items (items without category or items with this category)
  const { items: availableItems, loading: itemsLoading } = useItems({
    autoFetch: true,
    limit: 100,
  });

  // Initialize form with category data
  useEffect(() => {
    if (category) {
      console.log('Category data received:', category);
      console.log('Items in category:', category.items);
      
      setCategoryName(category.name);
      setDescription(category.description || '');
      setStatus(category.status);
      
      // Extract items from category response
      const existingItems = category.items || [];
      
      // Map the items properly, ensuring they have the correct structure
      const mappedItems: Item[] = existingItems.map((item: any) => ({
        id: item._id || item.id,
        _id: item._id || item.id,
        productName: item.productName,
        brandName: item.brandName || item.brand,
        brand: item.brand || item.brandName,
        category: item.category,
        subCategory: item.subCategory,
        // Add other fields as needed
      })).filter(item => item.id); // Filter out items without valid IDs
      
      console.log('Mapped items:', mappedItems);
      
      setOriginalItems(mappedItems);
      setItemsAdded(mappedItems);
    }
  }, [category]);

  const handleAddItem = (item: Item) => {
    // Ensure item has proper ID
    const itemToAdd = {
      ...item,
      id: item.id || item._id,
      _id: item._id || item.id
    };
    
    if (!itemsAdded.find(addedItem => addedItem.id === itemToAdd.id)) {
      setItemsAdded([...itemsAdded, itemToAdd]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItemsAdded(itemsAdded.filter(item => item.id !== itemId));
  };

  const handleSave = () => {
    if (categoryName.trim() === '') {
      alert('Category Name cannot be empty.');
      return;
    }

    const updateData: UpdateCategoryData = {
      name: categoryName.trim(),
      description: description.trim() || undefined,
      status,
    };

    // Calculate item changes with better ID handling
    const originalItemIds = originalItems
      .map(item => item.id || item._id)
      .filter(id => id !== null && id !== undefined && id !== '');
    
    const currentItemIds = itemsAdded
      .map(item => item.id || item._id)
      .filter(id => id !== null && id !== undefined && id !== '');
    
    console.log('Original item IDs:', originalItemIds);
    console.log('Current item IDs:', currentItemIds);
    
    const itemsToAdd = currentItemIds.filter(id => !originalItemIds.includes(id));
    const itemsToRemove = originalItemIds.filter(id => !currentItemIds.includes(id));
    
    console.log('Items to add:', itemsToAdd);
    console.log('Items to remove:', itemsToRemove);
    
    const itemChanges = (itemsToAdd.length > 0 || itemsToRemove.length > 0) ? {
      add: itemsToAdd,
      remove: itemsToRemove
    } : undefined;

    console.log('Final item changes:', itemChanges);
    onSave(categoryId, updateData, itemChanges);
  };

  // Filter available items based on search term and exclude already added items
  const filteredAvailableItems = availableItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadyAdded = !itemsAdded.find(addedItem => 
      (addedItem.id || addedItem._id) === (item.id || item._id)
    );
    // Also exclude items that already have this category assigned
    const notAlreadyInCategory = item.category !== categoryName;
    return matchesSearch && notAlreadyAdded && notAlreadyInCategory;
  });

  if (categoryLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Available Items</h3>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-3 max-h-80 overflow-y-auto">
                {itemsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                  </div>
                ) : filteredAvailableItems.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAvailableItems.map((item) => (
                      <div
                        key={item.id || item._id}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{item.productName}</div>
                          {(item.brandName || item.brand) && (
                            <div className="text-xs text-gray-500">Brand: {item.brandName || item.brand}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No items found matching your search' : 'No items available'}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Selected Items ({itemsAdded.length})
              </h3>
              <div className="border border-gray-200 rounded-md p-3 max-h-80 overflow-y-auto">
                {itemsAdded.length > 0 ? (
                  <div className="space-y-2">
                    {itemsAdded.map((item) => (
                      <div
                        key={item.id || item._id}
                        className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-blue-900">{item.productName}</div>
                          {(item.brandName || item.brand) && (
                            <div className="text-xs text-blue-600">Brand: {item.brandName || item.brand}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id || item._id)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {(categoryName || itemsAdded.length > 0) && (
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Category Name: <span className="font-medium">{categoryName || 'Not set'}</span></div>
                <div>Description: <span className="font-medium">{description || 'None'}</span></div>
                <div>Status: <span className="font-medium">{status}</span></div>
                <div>Items selected: <span className="font-medium">{itemsAdded.length}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCategory;