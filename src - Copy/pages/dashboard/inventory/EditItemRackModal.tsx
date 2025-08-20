// inventory/EditItemRackModal.tsx
import React, { useState, useEffect } from 'react';

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
  racks: ItemRack[];
  hsnCode?: string;
  itemCode?: string;
  sellPrice?: number;
  purchasePrice?: number;
  image?: string;
}

interface EditItemRackModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
  rack: ItemRack;
  onSave: (itemId: string, oldRackName: string, updatedRackData: { rack?: string; currentStock?: number; minStock?: number; maxStock?: number; }) => void;
  availableRacks: string[]; // To allow changing the assigned rack name
}

const EditItemRackModal: React.FC<EditItemRackModalProps> = ({
  isOpen,
  onClose,
  item,
  rack,
  onSave,
  availableRacks,
}) => {
  const [newRackName, setNewRackName] = useState(rack.rack);
  const [minStock, setMinStock] = useState(rack.minStock);
  const [maxStock, setMaxStock] = useState(rack.maxStock);

  // Update form fields when the selected rack changes (e.g., if modal is reused)
  useEffect(() => {
    if (isOpen) {
      setNewRackName(rack.rack);
      setMinStock(rack.minStock);
      setMaxStock(rack.maxStock);
    }
  }, [isOpen, rack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, rack.rack, { // Pass original rack.rack to identify, and new data
      rack: newRackName,
      minStock: minStock,
      maxStock: maxStock,
      // currentStock is not typically edited directly in this type of modal,
      // but you can add it if needed: currentStock: rack.currentStock,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Rack Details for {item.itemName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              id="itemName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
              value={item.itemName}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currentRack" className="block text-sm font-medium text-gray-700">Current Rack</label>
            <input
              type="text"
              id="currentRack"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
              value={rack.rack}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newRackName" className="block text-sm font-medium text-gray-700">Assign to Rack (New Name)</label>
            <select
              id="newRackName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={newRackName}
              onChange={(e) => setNewRackName(e.target.value)}
            >
              {availableRacks.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              {/* Option to create a truly new rack for this item's entry,
                  though it's better handled via AddRackModal if creating general racks */}
              {!availableRacks.includes(newRackName) && newRackName !== rack.rack && (
                <option value={newRackName}>{newRackName} (New)</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">Min Stock</label>
            <input
              type="number"
              id="minStock"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={minStock}
              onChange={(e) => setMinStock(parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="maxStock" className="block text-sm font-medium text-gray-700">Max Stock</label>
            <input
              type="number"
              id="maxStock"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={maxStock}
              onChange={(e) => setMaxStock(parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemRackModal;