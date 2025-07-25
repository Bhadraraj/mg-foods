import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Items from './inventory/Items';
import Racks from './inventory/Racks';
import AdjustStockModal from './inventory/AdjustStockModel';
import AddRackModal from './inventory/AddRackModel';


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

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'item' | 'rack'>('item');
  const [selectedItemRack, setSelectedItemRack] = useState<{ item: InventoryItem; rack: ItemRack } | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isAddRackModalOpen, setIsAddRackModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Status');
  const [selectedRack, setSelectedRack] = useState('Rack03');
  const [successMessage, setSuccessMessage] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '01',
      itemName: '5 - Star',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack03', currentStock: 97, minStock: 15, maxStock: 100, status: 'Well Stocked' },
        { rack: 'Rack01', currentStock: 50, minStock: 10, maxStock: 80, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/5star/100/100',
    },
    {
      id: '02',
      itemName: 'Dairy Milk',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack03', currentStock: 97, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/dairymilk/100/100',
    },
    {
      id: '03',
      itemName: 'Tic tac',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack03', currentStock: 97, minStock: 15, maxStock: 100, status: 'Well Stocked' },
        { rack: 'Rack04', currentStock: 20, minStock: 5, maxStock: 50, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/tictac/100/100',
    },
    {
      id: '04',
      itemName: 'Snickers',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack03', currentStock: 97, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/snickers/100/100',
    },
    {
      id: '05',
      itemName: 'Burger',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack03', currentStock: 97, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/burger/100/100',
    },
    {
      id: '06',
      itemName: 'Pizza',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack03', currentStock: 97, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/pizza/100/100',
    },
    {
      id: '07',
      itemName: 'Item07',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack01', currentStock: 98, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/item07/100/100',
    },
    {
      id: '08',
      itemName: 'Item08',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack01', currentStock: 98, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/item08/100/100',
    },
    {
      id: '09',
      itemName: 'Item09',
      category: 'Tea shop',
      unit: 'Count',
      racks: [
        { rack: 'Rack04', currentStock: 98, minStock: 15, maxStock: 100, status: 'Well Stocked' },
      ],
      hsnCode: 'IGF808',
      itemCode: 'IGF008',
      sellPrice: 0.0,
      purchasePrice: 0.0,
      image: 'https://picsum.photos/seed/item09/100/100',
    },
  ]);

  const [racks, setRacks] = useState<string[]>(
    Array.from(new Set(inventoryItems.flatMap((item) => item.racks.map((r) => r.rack))))
  );

  const getStatusFromStock = (currentStock: number, minStock: number, maxStock: number): string => {
    if (currentStock === 0) return 'Out Of Stock';
    if (currentStock <= minStock) return 'Low Stock';
    if (currentStock > maxStock) return 'Overstock';
    return 'Well Stocked';
  };

  const handleAdjustStock = (item: InventoryItem, rack: ItemRack) => {
    setSelectedItemRack({ item, rack });
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (currentStock: number, maxStock: number, minStock: number) => {
    if (selectedItemRack) {
      const { item, rack } = selectedItemRack;
      setInventoryItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                racks: i.racks.map((r) =>
                  r.rack === rack.rack
                    ? { ...r, currentStock, maxStock, minStock, status: getStatusFromStock(currentStock, minStock, maxStock) }
                    : r
                ),
              }
            : i
        )
      );
    }
    setIsAdjustModalOpen(false);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleRackChange = (rack: string) => {
    setSelectedRack(rack);
  };

  const handleAddRack = (rackName: string) => {
    setRacks((prevRacks) => [...prevRacks, rackName]);
    setSelectedRack(rackName);
    setSuccessMessage(`Rack "${rackName}" added successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };
 
  const handleEditRackDetails = (itemId: string, updatedRack: ItemRack) => {
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              racks: item.racks.map(r =>
                r.rack === updatedRack.rack
                  ? { ...updatedRack,
                      status: getStatusFromStock(updatedRack.currentStock, updatedRack.minStock, updatedRack.maxStock)
                    }
                  : r
              ),
            }
          : item
      )
    );
    console.log(`Edited rack details for item ${itemId}, rack ${updatedRack.rack}`);
  }; 
  
  const handleUpdateItemRacks = (itemId: string, updatedRacks: ItemRack[]) => {
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              racks: updatedRacks.map(rack => ({
                  ...rack,
                  status: getStatusFromStock(rack.currentStock, rack.minStock, rack.maxStock)
                }))
            }
          : item
      )
    );
    console.log(`Updated all racks for item ${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-gradient-to-r from-teal-400 via-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Items</h3>
            <p className="text-2xl font-bold text-gray-900">13200</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Low Stocks</h3>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Out of stocks</h3>
            <p className="text-2xl font-bold text-gray-900">32</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Last Updated</h3>
            <p className="text-2xl font-bold text-gray-900">12 Aug 2025</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 text-center">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex gap-1">
              <button
                className={`px-6 py-2 rounded-lg transition-colors ${
                  activeTab === 'item'
                    ? 'text-blue-600 shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`}
                onClick={() => setActiveTab('item')}
              >
                Item
              </button>
              <button
                className={`px-6 py-2 rounded-lg transition-colors ${
                  activeTab === 'rack'
                    ? 'text-blue-600 shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`}
                onClick={() => setActiveTab('rack')}
              >
                Rack
              </button>
            </div>
            
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'item' ? (
            <Items
              inventoryItems={inventoryItems}
              statusFilter={statusFilter}
              handleAdjustStock={handleAdjustStock}
              handleStatusChange={handleStatusChange}
            />
          ) : (
            <Racks
              inventoryItems={inventoryItems}
              racks={racks}
              selectedRack={selectedRack}
              handleAdjustStock={handleAdjustStock}
              handleRackChange={handleRackChange}
              setIsAddRackModalOpen={setIsAddRackModalOpen}
              handleEditRackDetails={handleEditRackDetails}
              handleUpdateItemRacks={handleUpdateItemRacks}
            />
          )}
        </div>
      </div>

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        itemName={selectedItemRack?.item.itemName || ''}
        itemCode={selectedItemRack?.item.itemCode}
        currentStock={selectedItemRack?.rack.currentStock || 0}
        maxStock={selectedItemRack?.rack.maxStock}
        minStock={selectedItemRack?.rack.minStock}
        onSave={handleSaveAdjustment}
      />

      <AddRackModal
        isOpen={isAddRackModalOpen}
        onClose={() => setIsAddRackModalOpen(false)}
        onSave={handleAddRack}
        existingRacks={racks}
      />
    </div>
  );
};

export default Inventory;