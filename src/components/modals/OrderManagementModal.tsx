// src/components/OrderManagementModal.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, Minus, X } from "lucide-react";
import {
  FoodItem,
  OrderItem,
  OrderData,
  CustomerDetails,
} from "../../types/index";
import CustomerDetailsModal from "./CustomerDetailsModal";
import MenuItemDetailsModal from "./MenuItemDetailsModal";
import { useCategories } from "../../hooks/useCategories";
import { useItems } from "../../hooks/useItems";
import { useApiMutation } from "../../hooks/useApi";
import { kotService } from "../../services/api/kot";

// FIXED: Transform API item to FoodItem interface
const transformApiItemToFoodItem = (apiItem: any): FoodItem => {
  return {
    id: apiItem._id || apiItem.id,
    name: apiItem.productName,
    price: apiItem.priceDetails?.sellingPrice || 0,
    // FIXED: Handle both category string and categories array
    category: apiItem.category || 
              (apiItem.categories && apiItem.categories[0]) || 
              'Uncategorized',
    image: apiItem.images?.primaryImage?.url || 
           apiItem.images?.primaryImage?.path || 
           apiItem.images?.primary || null,
    currentStock: apiItem.stockDetails?.currentQuantity || 0,
    // Add variants if available from API
    variants: apiItem.variants || undefined,
  };
};

const FoodItemCard: React.FC<{
  item: FoodItem;
  onClick: (item: FoodItem) => void;
}> = ({ item, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="relative h-32 bg-gray-100 flex items-center justify-center">
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-1">🍽️</div>
            <div className="text-xs">No Image</div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          ₹{item.price.toFixed(0)}
        </div>
      </div>
      <div className="p-2 pt-1 text-center">
        <h4 className="font-semibold text-gray-800 truncate text-sm">
          {item.name}
        </h4>
        <p className="text-xs text-gray-500">
          Current Stock: {item.currentStock ?? "N/A"}
        </p>
      </div>
    </div>
  );
};

// --- Order Management Modal Component ---
interface OrderManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData;
  onSaveOrder: (
    orderId: string,
    updatedAmount: number,
    customerName: string,
    status: "occupied" | "bill-generated"
  ) => void;
}

const OrderManagementModal: React.FC<OrderManagementModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onSaveOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerDetails>({
    name: orderData.customerName || "",
    mobile: "",
    type: "Individual",
  });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isMenuItemDetailsModalOpen, setIsMenuItemDetailsModalOpen] = useState(false);
  const [selectedFoodItemForDetails, setSelectedFoodItemForDetails] = useState<FoodItem | null>(null);

  // API hooks
  const { categories, loading: categoriesLoading } = useCategories({
    status: 'active',
    autoFetch: true,
  });

  // FIXED: Updated items hook with proper category ID parameter
  const { items, loading: itemsLoading, fetchItems, refetch: refetchItems } = useItems({
    // CHANGED: Pass category ID instead of name
    category: selectedCategoryId || undefined,
    search: searchQuery || undefined,
    status: 'active',
    autoFetch: false, // We'll manually trigger fetches
  });

  const { execute: createKotMutation, loading: createKotLoading } = useApiMutation({
    successMessage: 'KOT created successfully',
  });

  // Transform API items to FoodItem format
  const foodItems: FoodItem[] = items.map(transformApiItemToFoodItem);

  useEffect(() => {
    if (isOpen) {
      setOrderItems([]);
      setCustomerInfo((prev) => ({
        ...prev,
        name: orderData.customerName || "",
      }));
      setSelectedCategory("All Items");
      setSelectedCategoryId(null);
      setSearchQuery("");
    }
  }, [isOpen, orderData]);

  // FIXED: Fetch items when category or search changes
  useEffect(() => {
    if (isOpen) {
      console.log('=== FETCHING ITEMS ===');
      console.log('Selected category ID:', selectedCategoryId);
      console.log('Search query:', searchQuery);
      
      // Create a timeout to debounce the search
      const timeoutId = setTimeout(() => {
        if (fetchItems) {
          console.log('Calling fetchItems...');
          
          // FIXED: Use category ID for filtering
          const fetchParams = {
            category: selectedCategoryId || undefined,
            search: searchQuery || undefined,
            status: 'active',
          };
          
          console.log('Fetch params:', fetchParams);
          fetchItems(fetchParams);
        } else {
          console.warn('fetchItems is not available');
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCategoryId, searchQuery, isOpen, fetchItems]);

  if (!isOpen) return null;

  // Build categories list with "All Items" option
  const categoriesList = [
    { id: null, name: "All Items" },
    ...categories.map(cat => ({ id: cat._id || cat.id, name: cat.name }))
  ];

  // FIXED: Handle category selection with both ID and name
  const handleCategorySelect = (categoryId: string | null, categoryName: string) => {
    console.log('=== CATEGORY SELECTED ===');
    console.log('Category ID:', categoryId);
    console.log('Category name:', categoryName);
    
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
  };

  const handleFoodItemCardClick = (item: FoodItem) => {
    setSelectedFoodItemForDetails(item);
    setIsMenuItemDetailsModalOpen(true);
  };

  const handleAddItem = (configuredItem: OrderItem) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (orderItem) =>
          orderItem.id === configuredItem.id &&
          orderItem.variant === configuredItem.variant
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + configuredItem.quantity,
          amount:
            (existingItem.quantity + configuredItem.quantity) *
            existingItem.price,
        };
        return updatedItems;
      } else {
        return [...prevItems, configuredItem];
      }
    });
  };

  const updateQuantity = (id: string, change: number, variant?: string) => {
    setOrderItems(
      orderItems
        .map((item) => {
          if (item.id === id && (variant ? item.variant === variant : true)) {
            const newQuantity = Math.max(0, item.quantity + change);
            return {
              ...item,
              quantity: newQuantity,
              amount: newQuantity * item.price,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string, variant?: string) => {
    setOrderItems(
      orderItems.filter(
        (item) =>
          !(item.id === id && (variant ? item.variant === variant : true))
      )
    );
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.amount, 0);

  const handleCreateKot = async () => {
    if (orderItems.length === 0) {
      alert("Please add items to create KOT");
      return;
    }

    const kotData = {
      tableNumber: orderData.name,
      orderReference: `ORD-${Date.now()}`,
      items: orderItems.map(item => ({
        item: item.id,
        itemName: item.name,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || undefined,
        kotNote: item.kotNote || undefined,
      })),
      customerDetails: {
        name: customerInfo.name,
        mobile: customerInfo.mobile,
        type: customerInfo.type,
      },
      kotType: selectedCategory !== "All Items" ? selectedCategory : "General",
      notes: `Order for ${orderData.name}`,
    };

    try {
      await createKotMutation(() => kotService.createKot(kotData));
      onSaveOrder(orderData.id, totalAmount, customerInfo.name, "occupied");
      onClose();
    } catch (error) {
      console.error("Failed to create KOT:", error);
      alert("Failed to create KOT. Please try again.");
    }
  };

  const handleSaveAndPrint = async () => {
    await handleCreateKot();
    printBill();
  };

  const handleGenerateBill = async () => {
    await handleCreateKot();
    onSaveOrder(orderData.id, totalAmount, customerInfo.name, "bill-generated");
    printBill();
  };

  const handleDeleteOrder = () => {
    onClose();
  };

  const handleAddCustomerDetails = (details: CustomerDetails) => {
    setCustomerInfo(details);
  };

  const printBill = () => {
    const printerWindow = window.open("", "_blank", "width=200,height=300");
    if (printerWindow) {
      const doc = printerWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 8px; margin: 0; padding: 5px; }
            .header { text-align: center; margin-bottom: 5px; }
            .header h3 { margin: 0; font-size: 10px; }
            .line { border-top: 1px dashed black; margin: 5px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .item span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .qty-price { text-align: right; }
            .total { font-weight: bold; text-align: right; margin-top: 5px; }
            .footer { text-align: center; margin-top: 10px; font-size: 7px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>Your Restaurant Name</h3>
            <p>Address Line 1</p>
            <p>City, State, Zip</p>
            <p>GSTIN: XXXXXXXXXXXXX</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Time: ${new Date().toLocaleTimeString()}</p>
          </div>
          <div class="line"></div>
          <p><strong>Table: ${orderData.name}</strong></p>
          <p><strong>Customer: ${customerInfo.name || "Walk-in"}</strong></p>
          <div class="line"></div>
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Item</span>
            <span style="text-align: right; width: 30%;">Qty</span>
            <span style="text-align: right; width: 30%;">Price</span>
          </div>
          <div class="line"></div>
          ${orderItems
            .map(
              (item) => `
            <div class="item">
              <span style="width: 40%;">${item.name} ${
                item.variant ? `(${item.variant})` : ""
              }</span>
              <span style="width: 30%; text-align: right;">${
                item.quantity
              }</span>
              <span style="width: 30%; text-align: right;">₹${item.amount.toFixed(
                2
              )}</span>
            </div>
          `
            )
            .join("")}
          <div class="line"></div>
          <div class="total">
            Total: ₹${totalAmount.toFixed(2)}
          </div>
          <div class="line"></div>
          <div class="footer">
            <p>Thank you for your visit!</p>
            <p>Visit again!</p>
          </div>
        </body>
        </html>
      `);
      doc.close();
      printerWindow.print();
    } else {
      alert("Please allow pop-ups for printing.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl lg:max-w-screen-xl max-h-[95vh] overflow-y-auto flex flex-col lg:flex-row shadow-lg">
        {/* Left Side - Food Selection */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft size={20} />
                <span className="text-lg font-medium">Select Food</span>
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, item code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
            {/* Categories Sidebar */}
            <div className="w-full sm:w-64 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200 p-4 overflow-y-auto scrollbar-invisible">
              <div className="space-y-2 grid grid-cols-2 gap-2 sm:block">
                {categoriesLoading ? (
                  <div className="text-center text-gray-500 py-4">Loading categories...</div>
                ) : (
                  categoriesList.map((category) => (
                    <button
                      key={category.id || 'all'}
                      onClick={() => handleCategorySelect(category.id, category.name)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        selectedCategory === category.name
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
                <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 border border-dashed border-gray-300">
                  + Add Category
                </button>
              </div>
            </div>

            {/* Food Items Grid */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-invisible">
              {/* DEBUG: Debug information - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <div className="font-semibold text-blue-800 mb-2">Debug Info:</div>
                  <div className="space-y-1 text-blue-700">
                    <p>Selected Category: <strong>{selectedCategory || 'All'}</strong></p>
                    <p>Selected Category ID: <strong>{selectedCategoryId || 'None'}</strong></p>
                    <p>Items found: <strong>{foodItems.length}</strong></p>
                    <p>Search: <strong>{searchQuery || 'None'}</strong></p>
                    <p>Loading: <strong>{itemsLoading ? 'Yes' : 'No'}</strong></p>
                    <p>Categories loaded: <strong>{categories.length}</strong></p>
                  </div>
                  {/* ADDED: Sample of raw items data */}
                  {foodItems.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold">First item sample:</p>
                      <pre className="bg-white p-2 rounded overflow-x-auto">
                        {JSON.stringify({
                          name: foodItems[0].name,
                          category: foodItems[0].category,
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              {itemsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">⏳</div>
                    <p>Loading items...</p>
                  </div>
                </div>
              ) : foodItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg">No items found</p>
                  <p className="text-sm">
                    {selectedCategory && selectedCategory !== "All Items"
                      ? `No items found in "${selectedCategory}" category`
                      : "Try adjusting your search or category filter"
                    }
                  </p>
                  {/* ADDED: Refresh button for debugging */}
                  {process.env.NODE_ENV === 'development' && (
                    <button 
                      onClick={() => {
                        console.log('Manual refetch triggered');
                        if (refetchItems) {
                          refetchItems();
                        }
                      }}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Refresh Items
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {foodItems.map((item) => (
                    <FoodItemCard
                      key={item.id}
                      item={item}
                      onClick={handleFoodItemCardClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Billing */}
        <div className="w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold sr-only">Billing</h2>
            <div className="flex gap-2 flex-col sm:flex-row">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium">
                Table: {orderData.name}
              </button>
              <button
                onClick={() => setIsCustomerModalOpen(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium"
              >
                Customer details
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-invisible">
            {/* Order Items Header */}
            <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-600 mb-2 border-b pb-2 px-4 py-2 sticky top-0 bg-white z-10">
              <span className="col-span-1">Kot</span>
              <span className="col-span-2">Items</span>
              <span className="col-span-1 text-center">Qty</span>
              <span className="col-span-1 text-right">Price</span>
            </div>

            {/* Order Items List */}
            <div>
              {orderItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8 px-4">
                  <div className="text-3xl mb-2">🛒</div>
                  <p>No items in order</p>
                  <p className="text-xs mt-1">Add items from the menu</p>
                </div>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={`${item.id}-${item.variant || ""}`}
                    className="grid grid-cols-5 gap-2 items-center py-2 px-4 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-sm">{item.kot}</span>
                    <div className="col-span-2">
                      <span className="text-sm font-medium block">
                        {item.name}
                      </span>
                      {item.kotNote && (
                        <span className="text-xs text-gray-500 italic block">
                          Note: {item.kotNote}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, -1, item.variant)
                        }
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-8 text-center">
                        {item.quantity.toString().padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1, item.variant)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-sm mr-2">
                        ₹ {item.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {customerInfo.name && (
                <div className="text-right text-gray-700 text-sm mt-4 px-4 pb-2">
                  Customer:{" "}
                  <span className="font-semibold">{customerInfo.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t bg-gray-50">
            <div className="text-right text-lg font-bold mb-4">
              Total: ₹{totalAmount.toFixed(2)}
            </div>

            <div className="flex gap-2 mb-3 flex-col sm:flex-row">
              <button
                onClick={handleGenerateBill}
                disabled={createKotLoading || orderItems.length === 0}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createKotLoading ? "Processing..." : "Generate Bill"}
              </button>
              <button 
                onClick={handleCreateKot}
                disabled={createKotLoading || orderItems.length === 0}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createKotLoading ? "Creating..." : "Create KOT"}
              </button>
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <button
                onClick={handleDeleteOrder}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  onSaveOrder(
                    orderData.id,
                    totalAmount,
                    customerInfo.name,
                    "occupied"
                  )
                }
                className="flex-1 bg-black text-white py-2 px-4 rounded-md text-sm hover:bg-gray-800"
              >
                Save
              </button>
              <button
                onClick={handleSaveAndPrint}
                disabled={createKotLoading || orderItems.length === 0}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createKotLoading ? "Processing..." : "Save & Print"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomerDetails}
        initialCustomerName={customerInfo.name}
      />

      <MenuItemDetailsModal
        isOpen={isMenuItemDetailsModalOpen}
        onClose={() => setIsMenuItemDetailsModalOpen(false)}
        item={selectedFoodItemForDetails}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default OrderManagementModal;