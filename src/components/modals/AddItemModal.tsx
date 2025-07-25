import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: any) => void;
  mode?: 'add' | 'edit';
  initialData?: any;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  initialData = {}
}) => {
  const [isProduct, setIsProduct] = useState(true);
  const [itemData, setItemData] = useState(initialData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{mode === 'add' ? 'New Item' : 'Edit Item'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-6">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl text-blue-700">+</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Add image</p>
          </div>

          {/* Basic Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic details</h3>
            <div className="flex items-center gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-full ${isProduct ? 'bg-blue-700 text-white' : 'bg-gray-100'}`}
                onClick={() => setIsProduct(true)}
              >
                Product
              </button>
              <button
                className={`px-4 py-2 rounded-full ${!isProduct ? 'bg-blue-700 text-white' : 'bg-gray-100'}`}
                onClick={() => setIsProduct(false)}
              >
                Service
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Select category</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Select sub category</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

          {/* Stock Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Stock details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Select unit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Quantity</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing date</label>
                <div className="relative">
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration date</label>
                <div className="relative">
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Price details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online Delivery Price</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online Selling Price</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AC Selling Price</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Non AC Selling Price</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Select tax %</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(itemData);
                onClose();
              }}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;