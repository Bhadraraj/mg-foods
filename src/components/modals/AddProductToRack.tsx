import React, { useState, useRef } from 'react';
import { X, Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

// Define the interface for a product managed within this modal
interface ProductInRack {
  tempId: string; // A temporary ID for React keys, for new products before they get a real ID
  itemName: string;
  itemCode: string;
  hsnCode: string;
  category: string;
  sellingPrice: string;
  purchasePrice: string;
  imageUrl: string;
  isProductType: boolean; // true for product, false for service
  // This product's quantities in various racks
  rackQuantities: { rackId: string; quantity: number }[];
}

interface AddProductToRackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productsData: ProductInRack[]) => void; // onSave now expects an array of products
  mode?: 'add' | 'edit';
  initialData?: ProductInRack | null; // initialData for editing a single product
}

// Helper function to create an empty product object
const createEmptyProduct = (): ProductInRack => ({
  tempId: Date.now().toString(),
  itemName: '',
  itemCode: '',
  hsnCode: '',
  category: '',
  sellingPrice: '',
  purchasePrice: '',
  imageUrl: '',
  isProductType: true,
  rackQuantities: []
});

const AddProductToRackModal: React.FC<AddProductToRackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  initialData = null // Default prop value
}) => {
  // Initialize products state based on mode and initialData
  const [products, setProducts] = useState<ProductInRack[]>(() => {
    if (mode === 'edit' && initialData) {
      return [{ ...initialData, tempId: initialData.tempId || Date.now().toString() }];
    }
    // Default to three empty products for 'add' mode or if initialData is null/undefined
    return [createEmptyProduct(), createEmptyProduct(), createEmptyProduct()];
  });

  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number | null>(0); // Open first product by default

  // List of all available racks (not their stock, just the locations)
  // This list is static for this iteration. Adding new rack types would be a separate feature.
  const availableRacks = [
    { id: 'rack01', name: 'Rack01' },
    { id: 'rack02', name: 'Rack02' },
    { id: 'rack03', name: 'Rack03' },
    { id: 'rack04', name: 'Rack04' },
    { id: 'rack05', name: 'Rack05' },
  ];

  // State for the "Add to Rack" form inputs
  const [selectedRackForAdd, setSelectedRackForAdd] = useState('');
  const [quantityForAdd, setQuantityForAdd] = useState('');

  // State for the "Transfer Stock" form, applies to the currently active product
  const [transferData, setTransferData] = useState({
    quantity: '',
    fromRack: '',
    toRack: ''
  });

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); // Refs for multiple file inputs

  if (!isOpen) return null;

  // Helper to get the current product being edited/viewed in the open accordion
  const currentProduct = activeAccordionIndex !== null ? products[activeAccordionIndex] : null;

  const handleAccordionToggle = (index: number) => {
    setActiveAccordionIndex(activeAccordionIndex === index ? null : index);
    // Clear add/transfer forms when changing active product
    setSelectedRackForAdd('');
    setQuantityForAdd('');
    setTransferData({ quantity: '', fromRack: '', toRack: '' });
  };

  const handleAddProduct = () => {
    setProducts(prev => [
      ...prev,
      createEmptyProduct() // Use the helper function to add a new empty product
    ]);
    setActiveAccordionIndex(products.length); // Open the newly added product
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    setProducts(prev => prev.filter((_, idx) => idx !== indexToRemove));
    if (activeAccordionIndex === indexToRemove) {
      setActiveAccordionIndex(null); // Close if the removed one was active
    } else if (activeAccordionIndex !== null && activeAccordionIndex > indexToRemove) {
      setActiveAccordionIndex(activeAccordionIndex - 1); // Adjust index if items before were removed
    }
  };

  const handleProductInputChange = (index: number, field: keyof ProductInRack, value: any) => {
    setProducts(prev => prev.map((product, idx) =>
      idx === index ? { ...product, [field]: value } : product
    ));
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProductInputChange(index, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (tempId: string) => {
    fileInputRefs.current[tempId]?.click();
  };

  // Function to update a product's rackQuantities
  const updateProductRackQuantity = (
    productIndex: number,
    rackId: string,
    quantity: number // quantity is now a number
  ) => {
    setProducts(prevProducts => prevProducts.map((product, pIdx) => {
      if (pIdx === productIndex) {
        const existingRack = product.rackQuantities.find(rq => rq.rackId === rackId);
        let newRackQuantities;

        if (existingRack) {
          if (quantity > 0) {
            newRackQuantities = product.rackQuantities.map(rq =>
              rq.rackId === rackId ? { ...rq, quantity: quantity } : rq
            );
          } else {
            // Remove if quantity is 0 or less
            newRackQuantities = product.rackQuantities.filter(rq => rq.rackId !== rackId);
          }
        } else {
          // Add new rack quantity if valid
          if (quantity > 0) {
            newRackQuantities = [...product.rackQuantities, { rackId, quantity: quantity }];
          } else {
            newRackQuantities = product.rackQuantities; // No change if invalid new quantity
          }
        }
        return { ...product, rackQuantities: newRackQuantities };
      }
      return product;
    }));
  };

  const handleRemoveRackQuantity = (productIndex: number, rackIdToRemove: string) => {
    setProducts(prevProducts => prevProducts.map((product, pIdx) => {
      if (pIdx === productIndex) {
        return {
          ...product,
          rackQuantities: product.rackQuantities.filter(rq => rq.rackId !== rackIdToRemove)
        };
      }
      return product;
    }));
  };

  // New function to handle adding quantity to a selected rack
  const handleAddQuantityToSelectedRack = () => {
    if (!currentProduct || activeAccordionIndex === null) return;

    const qtyNum = parseInt(quantityForAdd);
    const rackId = selectedRackForAdd;

    if (isNaN(qtyNum) || qtyNum <= 0 || !rackId) {
      alert("Please select a rack and enter a valid quantity to add.");
      return;
    }

    updateProductRackQuantity(activeAccordionIndex, rackId, qtyNum);

    // Clear the add form
    setSelectedRackForAdd('');
    setQuantityForAdd('');
  };


  const handleTransferChange = (field: string, value: string) => {
    setTransferData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTransferProductStock = () => {
    if (!currentProduct || activeAccordionIndex === null) return; // Ensure a product is active

    const qtyToTransfer = parseInt(transferData.quantity);
    const { fromRack, toRack } = transferData;

    if (isNaN(qtyToTransfer) || qtyToTransfer <= 0 || !fromRack || !toRack || fromRack === toRack) {
      alert("Please enter a valid quantity, select different 'From' and 'To' racks.");
      return;
    }

    const fromRackObj = currentProduct.rackQuantities.find(rq => rq.rackId === fromRack);

    if (!fromRackObj || fromRackObj.quantity < qtyToTransfer) {
      alert(`Insufficient stock of ${currentProduct.itemName || 'this product'} in ${availableRacks.find(r => r.id === fromRack)?.name || fromRack}.`);
      return;
    }

    setProducts(prevProducts => prevProducts.map((product, pIdx) => {
      if (pIdx === activeAccordionIndex) { // Only modify the current active product
        let updatedRackQuantities = [...product.rackQuantities];

        // Decrease quantity in 'from' rack
        updatedRackQuantities = updatedRackQuantities.map(rq =>
          rq.rackId === fromRack ? { ...rq, quantity: rq.quantity - qtyToTransfer } : rq
        ).filter(rq => rq.quantity > 0); // Remove if quantity becomes zero

        // Increase quantity in 'to' rack, or add if new
        const toRackExists = updatedRackQuantities.find(rq => rq.rackId === toRack);
        if (toRackExists) {
          updatedRackQuantities = updatedRackQuantities.map(rq =>
            rq.rackId === toRack ? { ...rq, quantity: rq.quantity + qtyToTransfer } : rq
          );
        } else {
          updatedRackQuantities.push({ rackId: toRack, quantity: qtyToTransfer });
        }

        return { ...product, rackQuantities: updatedRackQuantities };
      }
      return product;
    }));

    // Clear transfer form
    setTransferData({ quantity: '', fromRack: '', toRack: '' });
  };


  const handleSave = () => {
    // Basic validation for each product before saving
    const isValid = products.every(p =>
      p.itemName && p.category && p.sellingPrice && p.purchasePrice
    );

    if (!isValid) {
      alert("Please ensure all required fields (Item Name, Category, Sell Price, Purchase Price) are filled for all products.");
      return;
    }

    onSave(products); // Call the onSave prop with the collected array of products
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Add Products to Rack' : 'Edit Products in Rack'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* List of Products as Accordions */}
        <div className="space-y-4 mb-6">
          {products.map((product, index) => (
            <div key={product.tempId} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleAccordionToggle(index)}
              >
                <h3 className="text-lg font-semibold text-gray-800 flex-grow">
                  {product.itemName || `New Product ${index + 1}`}
                </h3>
                <div className="flex items-center space-x-3">
                  {activeAccordionIndex === index ? (
                    <ChevronDown size={24} className="text-gray-600" />
                  ) : (
                    <ChevronRight size={24} className="text-gray-600" />
                  )}
                  {products.length > 1 && ( // Only show remove if more than one product
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion toggle
                        if (window.confirm(`Are you sure you want to remove ${product.itemName || `Product ${index + 1}`}?`)) {
                          handleRemoveProduct(index);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full"
                      title="Remove Product"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>

              {activeAccordionIndex === index && (
                <div className="p-4 bg-white grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Item Details */}
                  <div className="space-y-5">
                    {/* Image Upload */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => triggerFileInput(product.tempId)}
                    >
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[product.tempId] = el}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt="Product Preview"
                          className="w-24 h-24 mx-auto object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                          <Plus className="text-2xl text-blue-700" size={32} />
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-600">
                        {product.imageUrl ? 'Change product image' : 'Add product image'}
                      </p>
                    </div>

                    {/* Basic Details */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-700">Item Details</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          className={`px-4 py-2 rounded-full font-medium transition-colors ${
                            product.isProductType ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleProductInputChange(index, 'isProductType', true)}
                        >
                          Product
                        </button>
                        <button
                          className={`px-4 py-2 rounded-full font-medium transition-colors ${
                            !product.isProductType ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleProductInputChange(index, 'isProductType', false)}
                        >
                          Service
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={product.itemCode}
                            onChange={(e) => handleProductInputChange(index, 'itemCode', e.target.value)}
                            placeholder="IGF008"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={product.hsnCode}
                            onChange={(e) => handleProductInputChange(index, 'hsnCode', e.target.value)}
                            placeholder="IGF808"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={product.itemName}
                            onChange={(e) => handleProductInputChange(index, 'itemName', e.target.value)}
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={product.category}
                            onChange={(e) => handleProductInputChange(index, 'category', e.target.value)}
                          >
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="food">Food & Beverage</option>
                            <option value="books">Books</option>
                            <option value="home">Home & Garden</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sell Price *</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={product.sellingPrice}
                              onChange={(e) => handleProductInputChange(index, 'sellingPrice', e.target.value)}
                              placeholder="₹0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={product.purchasePrice}
                              onChange={(e) => handleProductInputChange(index, 'purchasePrice', e.target.value)}
                              placeholder="₹0.00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Rack Details */}
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-700">Rack Assignment</h3>

                      {/* Current Rack Stock for this product */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-inner">
                        <h4 className="font-medium text-gray-700 mb-3">Current Stock of "{product.itemName || 'this product'}" in Racks</h4>
                        {product.rackQuantities.length > 0 ? (
                          <div className="space-y-2">
                            {product.rackQuantities.map((rq) => (
                              <div key={rq.rackId} className="flex justify-between items-center bg-white p-2 rounded-md border border-gray-200">
                                <span className="text-sm font-medium">{availableRacks.find(r => r.id === rq.rackId)?.name || rq.rackId}:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Qty:</span>
                                  <span className="font-medium text-gray-800">{rq.quantity}</span>
                                  <button
                                    onClick={() => handleRemoveRackQuantity(index, rq.rackId)}
                                    className="text-red-500 text-sm hover:text-red-700 p-1 rounded-full"
                                    title={`Remove ${product.itemName} from ${availableRacks.find(r => r.id === rq.rackId)?.name}`}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No stock assigned to racks for this product yet.</p>
                        )}
                      </div>

                      {/* Add to Rack */}
                      <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                        <h4 className="font-medium text-gray-700 mb-3">Add to Rack</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Rack *</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedRackForAdd}
                              onChange={(e) => setSelectedRackForAdd(e.target.value)}
                            >
                              <option value="">Select Rack</option>
                              {availableRacks.map(rack => (
                                <option key={rack.id} value={rack.id}>
                                  {rack.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={quantityForAdd}
                              onChange={(e) => setQuantityForAdd(e.target.value)}
                              placeholder="Enter quantity"
                            />
                          </div>
                          <button
                            onClick={handleAddQuantityToSelectedRack}
                            className="w-full px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={!selectedRackForAdd || !quantityForAdd || parseInt(quantityForAdd) <= 0}
                          >
                            Add to Rack
                          </button>
                        </div>
                      </div>

                      {/* Transfer Stock */}
                      <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-700 mb-3">Transfer Stock of "{product.itemName || 'this product'}"</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                            <input
                              type="number"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter quantity"
                              value={transferData.quantity}
                              onChange={(e) => handleTransferChange('quantity', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">From</label>
                              <select
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={transferData.fromRack}
                                onChange={(e) => handleTransferChange('fromRack', e.target.value)}
                              >
                                <option value="">Select Rack</option>
                                {product.rackQuantities.map(rq => (
                                  <option key={rq.rackId} value={rq.rackId}>
                                    {availableRacks.find(r => r.id === rq.rackId)?.name || rq.rackId} ({rq.quantity})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">To</label>
                              <select
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={transferData.toRack}
                                onChange={(e) => handleTransferChange('toRack', e.target.value)}
                              >
                                <option value="">Select Rack</option>
                                {availableRacks.map(rack => (
                                  <option key={rack.id} value={rack.id}>{rack.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={handleTransferProductStock}
                            className="w-full px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={!transferData.quantity || !transferData.fromRack || !transferData.toRack || transferData.fromRack === transferData.toRack}
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Product Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddProduct}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus size={20} className="mr-2" /> Add New Product
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Save All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductToRackModal;
