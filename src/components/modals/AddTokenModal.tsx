import React, { useState, useEffect, useRef } from "react";
import { X, MinusCircle, Loader2 } from "lucide-react";
import { useTokens } from "../../hooks/useTokens";
import { itemService } from "../../services/api/item";
import { CreateTokenData } from "../../services/api/token"; 
 
interface MenuItem {
  _id: string;
  productName: string;
  priceDetails: {
    sellingPrice: number;
    purchasePrice: number;
    mrp: number;
    taxPercentage: number;
    discount: number;
  };
  category: {
    _id: string;
    name: string;
    description: string;
    id: string;
  };
  subCategory: {
    _id: string;
    name: string;
    description: string;
    id: string;
  };
  brandName: string;
  status: string;
  stockDetails: {
    unit: string;
    currentQuantity: number;
    minimumStock: number;
    maximumStock: number;
  };
  imageUrls: {
    primaryImage: string | null;
    additionalImages: string[];
  };
  id: string;
}

interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  unitPrice: number;
}

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTokenOrder?: (data: {
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    customerAddress?: string;
    items: SelectedItem[];
    orderType: string;
    priority: string;
    orderNotes?: string;
    estimatedTime?: number;
  }) => void;
  // If editing an existing token, pass initial data
  initialTokenData?: {
    _id?: string;
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    customerAddress?: string;
    items: SelectedItem[];
    orderType?: string;
    priority?: string;
    orderNotes?: string;
    estimatedTime?: number;
  };
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({
  isOpen,
  onClose,
  onSaveTokenOrder,
  initialTokenData,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [orderType, setOrderType] = useState<string>("Takeaway");
  const [priority, setPriority] = useState<string>("Normal");
  const [orderNotes, setOrderNotes] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState("");
  
  // API related state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [isSubmittingRef, setIsSubmittingRef] = useState(false);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSubmittedRef = useRef(false);

  // Use tokens hook for CRUD operations
  const { 
    createToken, 
    updateToken, 
    createLoading, 
    updateLoading 
  } = useTokens({ autoFetch: false });

  // Fetch items from API
  const fetchItems = async (page = 1, limit = 100) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const response = await itemService.getItems({ page, limit });
      
      if (response.success && response.data) {
        // Handle different response structures
        const items = Array.isArray(response.data) 
          ? response.data 
          : response.data.items || response.data.data || [];
        setMenuItems(items);
      } else {
        setItemsError("Failed to fetch items");
      }
    } catch (err) {
      setItemsError("Error fetching items. Please try again.");
      console.error("Error fetching items:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Reset submission flags when modal opens
      setIsSubmittingRef(false);
      hasSubmittedRef.current = false;
      
      fetchItems();
      
      if (initialTokenData) {
        setCustomerName(initialTokenData.customerName);
        setCustomerMobile(initialTokenData.customerMobile);
        setCustomerEmail(initialTokenData.customerEmail || "");
        setCustomerAddress(initialTokenData.customerAddress || "");
        setSelectedItems(initialTokenData.items);
        setOrderType(initialTokenData.orderType || "Takeaway");
        setPriority(initialTokenData.priority || "Normal");
        setOrderNotes(initialTokenData.orderNotes || "");
        setEstimatedTime(initialTokenData.estimatedTime || 15);
      } else {
        // Reset state when opening for a new token
        setCustomerName("");
        setCustomerMobile("");
        setCustomerEmail("");
        setCustomerAddress("");
        setSelectedItems([]);
        setOrderType("Takeaway");
        setPriority("Normal");
        setOrderNotes("");
        setEstimatedTime(15);
        setSearchTerm("");
      }
    }

    // Cleanup timeout on unmount or when modal closes
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
        submitTimeoutRef.current = null;
      }
      if (!isOpen) {
        setIsSubmittingRef(false);
        hasSubmittedRef.current = false;
      }
    };
  }, [isOpen, initialTokenData]);

  const handleAddItem = (item: MenuItem) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item._id 
            ? { 
                ...i, 
                quantity: i.quantity + 1, 
                amount: i.amount + item.priceDetails.sellingPrice 
              } 
            : i
        );
      } else {
        return [...prevItems, { 
          id: item._id, 
          name: item.productName, 
          quantity: 1, 
          amount: item.priceDetails.sellingPrice,
          unitPrice: item.priceDetails.sellingPrice
        }];
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevItems.map((i) =>
          i.id === itemId
            ? { 
                ...i, 
                quantity: i.quantity - 1, 
                amount: i.amount - i.unitPrice 
              }
            : i
        );
      } else {
        // Remove item if quantity is 1 or less
        return prevItems.filter((i) => i.id !== itemId);
      }
    });
  }; 

  const handleSave = async () => {
    // Prevent double submission with multiple checks
    if (isSubmittingRef || isSubmitting || hasSubmittedRef.current) {
      return;
    }

    if (!customerName || !customerMobile || selectedItems.length === 0) {
      alert("Please fill customer details and select at least one item.");
      return;
    }

    // Set all prevention flags immediately
    setIsSubmittingRef(true);
    hasSubmittedRef.current = true;

    try {
      const tokenData: CreateTokenData = {
        customerDetails: {
          name: customerName,
          mobile: customerMobile,
          email: customerEmail || undefined,
          address: customerAddress || undefined,
        },
        orderItems: selectedItems.map(item => ({
          item: item.id,
          quantity: item.quantity,
          specialInstructions: ""
        })),
        orderType: orderType as 'Dine-in' | 'Takeaway' | 'Delivery',
        priority: priority as 'Low' | 'Normal' | 'High',
        orderNotes: orderNotes || undefined,
        estimatedTime,
      };

      if (initialTokenData?._id) {
        // Update existing token
        await updateToken(initialTokenData._id, tokenData);
      } else {
        // Create new token - ONLY call API, not callback
        await createToken(tokenData);
      }

      // DO NOT call onSaveTokenOrder callback to avoid duplicate creation
      // The useTokens hook already handles the success callback

      onClose();
    } catch (error) {
      console.error("Error saving token:", error);
      alert("Failed to save token. Please try again.");
      // Reset flags on error so user can retry
      hasSubmittedRef.current = false;
    } finally {
      setIsSubmittingRef(false);
    }
  };

  const calculateTotals = () => {
    const totalQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    return { totalQty, subTotal, grandTotal: subTotal };
  };

  const { totalQty, subTotal, grandTotal } = calculateTotals();

  const filteredMenuItems = menuItems.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  const isSubmitting = createLoading || updateLoading || isSubmittingRef;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl mx-auto flex flex-col shadow-lg h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-700 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">
            {initialTokenData?._id ? "Edit Token Order" : "Add Token Order"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-blue-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer Details & Order Settings */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Customer Details Row */}
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Customer Name *"
              className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <input
              type="text"
              placeholder="Customer Mobile *"
              className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <input
              type="email"
              placeholder="Customer Email"
              className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Order Settings Row */}
          <div className="flex flex-wrap gap-4">
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="Takeaway">Takeaway</option>
              <option value="Dine-in">Dine-in</option>
              <option value="Delivery">Delivery</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
            <input
              type="number"
              placeholder="Est. Time (min)"
              className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
              disabled={isSubmitting}
              min="1"
            />
            <input
              type="text"
              placeholder="Order Notes"
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              disabled={isSubmitting}
            />
            {orderType === "Delivery" && (
              <input
                type="text"
                placeholder="Customer Address *"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                disabled={isSubmitting}
                required
              />
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Menu Items */}
          <div className="w-2/3 p-4 border-r border-gray-200 overflow-y-auto">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Loading state */}
            {itemsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                <span className="ml-2 text-gray-600">Loading items...</span>
              </div>
            )}

            {/* Error state */}
            {itemsError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-600 text-sm">{itemsError}</p>
                <button
                  onClick={() => fetchItems()}
                  className="mt-2 text-red-700 underline text-sm hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Items grid */}
            {!itemsLoading && !itemsError && (
              <div className="grid grid-cols-3 gap-3 auto-rows-min">
                {filteredMenuItems.length === 0 ? (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    {searchTerm ? "No items found matching your search." : "No items available."}
                  </div>
                ) : (
                  filteredMenuItems.map((item) => {
                    const isOutOfStock = item.stockDetails.currentQuantity <= 0;
                    const isLowStock = item.stockDetails.currentQuantity <= item.stockDetails.minimumStock;
                    
                    return (
                      <button
                        key={item._id}
                        onClick={() => !isOutOfStock && handleAddItem(item)}
                        disabled={isOutOfStock || isSubmitting}
                        className={`
                          border rounded-md p-3 flex flex-col items-center justify-center text-sm font-medium transition-colors
                          ${isOutOfStock 
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                            : isLowStock
                            ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                            : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                          }
                        `}
                      >
                        <span className={`${isOutOfStock ? 'text-gray-400' : 'text-gray-800'}`}>
                          {item.productName}
                        </span>
                        <span className={`${isOutOfStock ? 'text-gray-400' : 'text-blue-600'}`}>
                          ₹{item.priceDetails.sellingPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {item.category.name}
                        </span>
                        {isOutOfStock && (
                          <span className="text-xs text-red-500 mt-1">Out of Stock</span>
                        )}
                        {isLowStock && !isOutOfStock && (
                          <span className="text-xs text-yellow-600 mt-1">
                            Low Stock ({item.stockDetails.currentQuantity})
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Order Summary */}
          <div className="w-1/3 p-4 flex flex-col">
            <h3 className="text-md font-semibold mb-3">Order Summary</h3>
            <div className="flex-1 overflow-y-auto border-b border-gray-200 pb-4 mb-4">
              {selectedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No items selected
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600">
                      <th className="px-1 py-2 text-left">#</th>
                      <th className="px-1 py-2 text-left">Item</th>
                      <th className="px-1 py-2 text-right">Qty</th>
                      <th className="px-1 py-2 text-right">Amount</th>
                      <th className="px-1 py-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-1 py-2">{index + 1}</td>
                        <td className="px-1 py-2">{item.name}</td>
                        <td className="px-1 py-2 text-right">{item.quantity}</td>
                        <td className="px-1 py-2 text-right">₹{item.amount.toFixed(2)}</td>
                        <td className="px-1 py-2 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isSubmitting}
                          >
                            <MinusCircle size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between font-medium text-gray-800">
                <span>Total Qty</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-800">
                <span>Sub Total</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-700 border-t pt-2 mt-2">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={handleSave}
            disabled={isSubmitting || selectedItems.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            {initialTokenData?._id 
              ? (isSubmitting ? "Updating..." : "Update Token")
              : (isSubmitting ? "Creating..." : "Save & Print")
            }
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTokenModal;