import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
const RackDropdown: React.FC<{ racks: string[], selectedRack: string, onRackChange: (rack: string) => void }> = ({ racks, selectedRack, onRackChange }) => {
  return (
    <select
      value={selectedRack}
      onChange={(e) => onRackChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {racks.map(r => <option key={r} value={r}>{r}</option>)}
    </select>
  );
};

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
  hsnCode?: string;
  itemCode?: string;
  sellPrice?: number;
  purchasePrice?: number;
  image?: string;
  racks: ItemRack[];
}

interface RacksProps {
  inventoryItems: InventoryItem[];
  racks: string[];
  selectedRack: string;
  handleAdjustStock: (item: InventoryItem, rack: ItemRack) => void;
  handleRackChange: (rack: string) => void;
  setIsAddRackModalOpen: (isOpen: boolean) => void;
  handleEditRackDetails: (itemId: string, updatedRack: ItemRack) => void;
  handleUpdateItemRacks: (itemId: string, updatedRacks: ItemRack[]) => void;
}

const Racks: React.FC<RacksProps> = ({
  inventoryItems,
  racks,
  selectedRack,
  handleAdjustStock,
  handleRackChange,
  setIsAddRackModalOpen,
  handleEditRackDetails,
  handleUpdateItemRacks,
}) => {
  const [editingRackId, setEditingRackId] = useState<string | null>(null);
  const [editedStock, setEditedStock] = useState<number>(0);
  const [editedMinStock, setEditedMinStock] = useState<number>(0);
  const [editedMaxStock, setEditedMaxStock] = useState<number>(0);
  const [itemRacksModalItem, setItemRacksModalItem] = useState<InventoryItem | null>(null);
  const [transferQty, setTransferQty] = useState<number>(0);
  const [transferFrom, setTransferFrom] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferError, setTransferError] = useState<string>('');
  useEffect(() => {
    if (itemRacksModalItem) {
      const updatedItem = inventoryItems.find(item => item.id === itemRacksModalItem.id);
      if (updatedItem) {
        setItemRacksModalItem(updatedItem);
      } else {
        setItemRacksModalItem(null);
      }
    }
  }, [inventoryItems, itemRacksModalItem]);


  const startEditing = (itemId: string, currentRack: ItemRack) => {
    setEditingRackId(itemId);
    setEditedStock(currentRack.currentStock);
    setEditedMinStock(currentRack.minStock);
    setEditedMaxStock(currentRack.maxStock);
  };

  const saveEditedRackDetails = (item: InventoryItem) => {
    const currentRack = item.racks.find((r) => r.rack === selectedRack);
    if (currentRack) {
      const updatedRack: ItemRack = {
        ...currentRack,
        currentStock: editedStock,
        minStock: editedMinStock,
        maxStock: editedMaxStock,
        status: '',
      };
      handleEditRackDetails(item.id, updatedRack);
      setEditingRackId(null);
    }
  };

  const cancelEditing = () => {
    setEditingRackId(null);
  };

  const openItemRacksModal = (item: InventoryItem) => {
    setItemRacksModalItem(item);
    setTransferQty(0);
    setTransferFrom('');
    setTransferTo('');
    setTransferError('');
  };

  const closeItemRacksModal = () => {
    setItemRacksModalItem(null);
  };
  const updateModalItemRack = (rackName: string, field: keyof ItemRack, value: number | string) => {
    if (!itemRacksModalItem) return;

    let updatedRacks = itemRacksModalItem.racks.map((r) =>
      r.rack === rackName
        ? { ...r, [field]: Number(value) }
        : r
    );
    if (field === 'currentStock') {
      updatedRacks = updatedRacks.filter(r => !(r.rack === rackName && Number(value) === 0));
    }


    setItemRacksModalItem({
      ...itemRacksModalItem,
      racks: updatedRacks
    });

    handleUpdateItemRacks(itemRacksModalItem.id, updatedRacks);
  };

  const handleStockTransfer = () => {
    if (!itemRacksModalItem) return;
    setTransferError('');

    const fromRack = itemRacksModalItem.racks.find(r => r.rack === transferFrom);
    if (!fromRack || transferQty <= 0 || !transferFrom || !transferTo) {
        setTransferError("Please fill all transfer fields and enter a valid quantity.");
        return;
    }
    if (fromRack.currentStock < transferQty) {
        setTransferError(`Cannot transfer more than the available stock in ${transferFrom}.`);
        return;
    }
      if (transferFrom === transferTo) {
        setTransferError("Source and destination racks cannot be the same.");
        return;
    }


    let updatedRacks = [...itemRacksModalItem.racks];
    updatedRacks = updatedRacks.map(r =>
        r.rack === transferFrom
        ? {...r, currentStock: r.currentStock - transferQty}
        : r
    );

    const toRackExists = updatedRacks.some(r => r.rack === transferTo);

    if (toRackExists) {
        updatedRacks = updatedRacks.map(r =>
            r.rack === transferTo
            ? {...r, currentStock: r.currentStock + transferQty}
            : r
        );
    } else {
        const newRack: ItemRack = {
            rack: transferTo,
            currentStock: transferQty,
            minStock: 0,
            maxStock: 0,
            status: 'in-stock',
        };
        updatedRacks.push(newRack);
    }

    updatedRacks = updatedRacks.filter(r => !(r.rack === transferFrom && r.currentStock === 0));
    setItemRacksModalItem({...itemRacksModalItem, racks: updatedRacks});
    handleUpdateItemRacks(itemRacksModalItem.id, updatedRacks);
    setTransferQty(0);
    setTransferFrom('');
    setTransferTo('');
    setTransferError('');
  }

  const handleSubmitModal = () => {
    closeItemRacksModal();
  };


  return (
    <>
      
       <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg w-80 text-gray-600 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors">
              <Search size={16} />
            </button>
          </div>
   <div className="flex items-center gap-3">
            <RackDropdown
              racks={racks}
              selectedRack={selectedRack}
              onRackChange={handleRackChange}
            />
            <button
              onClick={() => setIsAddRackModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span>
              Add New Rack Type
            </button>
          </div>
        </div>
      </div>
      

      <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Sl No.</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Image</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Item Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">HSN Code</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Item Code</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Sell Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Purchase Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Racks & Stock</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Action (Selected Rack)</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, index) => {
              const rackForSelected = item.racks.find((r) => r.rack === selectedRack);
              return (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.id}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // prevents looping
                            target.src = "https://placehold.co/40x40/e2e8f0/64748b?text=No+Img";
                          }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.hsnCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.itemCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{item.sellPrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{item.purchasePrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.racks.length > 0 ? (
                      <ul className="list-inside">
                        {item.racks.map((r) => (
                          <li key={r.rack}>
                            <strong>{r.rack}:</strong> {r.currentStock}
                            <span className={`ml-2 px-2 py-1 text-xs rounded ${
                              r.status === 'low' ? 'bg-red-100 text-red-600' :
                              r.status === 'overstock' ? 'bg-orange-100 text-orange-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {r.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No racks assigned'
                    )}
                    <button
                      onClick={() => openItemRacksModal(item)}
                      className="text-blue-600 hover:underline mt-2 text-xs"
                    >
                      Manage Racks
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {rackForSelected ? (
                      editingRackId === item.id ? (
                        <div className="space-y-2">
                          <div className="flex flex-col gap-1">
                          
                            <input
                              type="number"
                              value={editedMinStock}
                              onChange={(e) => setEditedMinStock(Number(e.target.value))}
                              className="w-20 px-2 py-1 border rounded text-xs"
                              placeholder="Min"
                            />
                            <input
                              type="number"
                              value={editedMaxStock}
                              onChange={(e) => setEditedMaxStock(Number(e.target.value))}
                              className="w-20 px-2 py-1 border rounded text-xs"
                              placeholder="Max"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEditedRackDetails(item)}
                              className="text-green-600 hover:underline text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:underline text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(item.id, rackForSelected)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
      </table>

      {itemRacksModalItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-4">
                Manage Racks for {itemRacksModalItem.itemName}
                  </h2>
                  <button onClick={closeItemRacksModal} className="text-2xl font-light leading-none hover:text-red-600">&times;</button>
            </div>


            <div className="flex flex-col md:flex-row gap-8 w-full mt-4">
                <div className="w-full md:w-1/3 border-r md:pr-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Item Details</h3>
                    {itemRacksModalItem.image ? (
                        <img
                          src={itemRacksModalItem.image}
                          alt={itemRacksModalItem.itemName}
                          className="w-full h-40 object-cover rounded-md mb-4"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "https://placehold.co/200x160/e2e8f0/64748b?text=No+Image";
                          }}
                          />
                    ) : (
                            <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">No Image</div>
                    )}
                    <div className="space-y-2 text-sm">
                        <p><strong className="font-medium text-gray-600">Item Code:</strong> {itemRacksModalItem.itemCode || 'N/A'}</p>
                        <p><strong className="font-medium text-gray-600">HSN Code:</strong> {itemRacksModalItem.hsnCode || 'N/A'}</p>
                        <p><strong className="font-medium text-gray-600">Sell Price:</strong> ₹{itemRacksModalItem.sellPrice?.toFixed(2) || 'N/A'}</p>
                        <p><strong className="font-medium text-gray-600">Purchase Price:</strong> ₹{itemRacksModalItem.purchasePrice?.toFixed(2) || 'N/A'}</p>
                    </div>
                </div>

                <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Edit Rack Stock</h3>
                    <div className="space-y-3">
                      {itemRacksModalItem.racks.map((rackDetail) => (
                        <div key={rackDetail.rack} className="flex items-center gap-3 border-b pb-3 flex-wrap">
                          <span className="font-medium w-24 flex-shrink-0">{rackDetail.rack}:</span>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">Stock</label>
                            <input
                              type="number"
                              value={rackDetail.currentStock}
                              onChange={(e) => updateModalItemRack(rackDetail.rack, 'currentStock', e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                            />
                          </div> 
                          <button
                            onClick={() => {
                              const updatedRacks = itemRacksModalItem.racks.filter((r) => r.rack !== rackDetail.rack);
                              setItemRacksModalItem({...itemRacksModalItem, racks: updatedRacks});
                              handleUpdateItemRacks(itemRacksModalItem.id, updatedRacks);
                            }}
                            className="text-red-500 hover:underline text-sm ml-auto"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Transfer Stock</h3>
                          {transferError && <p className="text-red-500 text-sm mb-2">{transferError}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-gray-600">Quantity</label>
                                <input type="number" placeholder="Qty" value={transferQty || ''} onChange={e => setTransferQty(Number(e.target.value))} className="px-2 py-1.5 border rounded-md"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-gray-600">From</label>
                                <select value={transferFrom} onChange={e => setTransferFrom(e.target.value)} className="px-2 py-1.5 border rounded-md bg-white">
                                    <option value="" disabled>Select Rack</option>
                                    {itemRacksModalItem.racks.map(r => <option key={r.rack} value={r.rack}>{r.rack}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-gray-600">To</label>
                                <select value={transferTo} onChange={e => setTransferTo(e.target.value)} className="px-2 py-1.5 border rounded-md bg-white">
                                    <option value="" disabled>Select Rack</option>
                                    {racks.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                              <button onClick={handleStockTransfer} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors h-fit">
                                Transfer
                            </button>
                        </div>
                    </div>
                      <div className="mt-6 pt-4 border-t">
                          <select
                            className="px-2 py-1 border rounded bg-white"
                            onChange={(e) => {
                                const newRackName = e.target.value;
                                if (newRackName && !itemRacksModalItem.racks.some(r => r.rack === newRackName)) {
                                const newRack: ItemRack = { rack: newRackName, currentStock: 0, minStock: 0, maxStock: 0, status: 'in-stock' };
                                const updatedRacks = [...itemRacksModalItem.racks, newRack];
                                setItemRacksModalItem({...itemRacksModalItem,racks: updatedRacks});
                                handleUpdateItemRacks(itemRacksModalItem.id, updatedRacks);
                                }
                                e.target.value = '';
                            }}
                            defaultValue=""
                            >
                            <option value="" disabled>+ Add another existing rack...</option>
                            {racks
                                .filter(rackName => !itemRacksModalItem.racks.some(r => r.rack === rackName))
                                .map((rackName) => (
                                <option key={rackName} value={rackName}>
                                    {rackName}
                                </option>
                                ))}
                            </select>
                      </div>
                </div>
            </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={handleSubmitModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeItemRacksModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Racks;