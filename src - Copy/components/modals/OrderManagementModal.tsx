// src/components/OrderManagementModal.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, Minus, X } from "lucide-react";
import {
  FoodItem,
  OrderItem,
  OrderData,
  CustomerDetails,
} from "../types/OrdermanagementTable";
import CustomerDetailsModal from "./CustomerDetailsModal";
import MenuItemDetailsModal from "./MenuItemDetailsModal"; // Import the new modal

const foodItems: FoodItem[] = [
  {
    id: "FI001",
    name: "Lemon Tea",
    price: 12.0,
    category: "Tea Shop (KOT1)",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI002",
    name: "Masala Tea",
    price: 15.0,
    category: "Tea Shop (KOT1)",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
    variants: [
      {
        type: "image-radio", // As seen in image_bd3de6.png
        label: "Variant",
        options: [
          {
            value: "half-tea",
            label: "Half Tea",
            image: "/path/to/half-tea.png",
          }, // Replace with actual paths
          { value: "without", label: "Without", image: "/path/to/without.png" },
          {
            value: "half-sugar",
            label: "Half sugar",
            image: "/path/to/half-sugar.png",
          },
          {
            value: "double-sugar",
            label: "Double sugar",
            image: "/path/to/double-sugar.png",
          },
          {
            value: "light-tea",
            label: "Light Tea",
            image: "/path/to/light-tea.png",
          },
          {
            value: "medium-tea",
            label: "Medium Tea",
            image: "/path/to/medium-tea.png",
          },
          {
            value: "strong-tea",
            label: "Strong Tea",
            image: "/path/to/strong-tea.png",
          },
          {
            value: "double-strong-tea",
            label: "Double Strong Tea",
            image: "/path/to/double-strong-tea.png",
          },
        ],
      },
    ],
  },
  {
    id: "FI003",
    name: "Cold Coffee",
    price: 80.0,
    category: "Juice shop (KOT2)",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
    variants: [
      {
        type: "radio", // As seen in image_bcebd3.png
        label: "Variant",
        options: [
          { value: "small", label: "Small" },
          { value: "regular", label: "Regular" },
          { value: "large", label: "Large", priceAdjustment: 20.0 }, // Example with price adjustment
        ],
      },
    ],
  },
  {
    id: "FI004",
    name: "Orange Juice",
    price: 100.0,
    category: "Juice shop (KOT2)",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI005",
    name: "Vanilla Ice Cream",
    price: 70.0,
    category: "Ice cream shop (KOT3)",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI006",
    name: "Chocolate Ice Cream",
    price: 90.0,
    category: "Ice cream shop (KOT3)",
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI007",
    name: "Plain Dosa",
    price: 40.0,
    category: "Tea Shop (KOT1)",
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI008",
    name: "Chicken Biryani",
    price: 200.0,
    category: "Tea Shop (KOT1)",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d29c?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI009",
    name: "Veg Noodles",
    price: 120.0,
    category: "Tea Shop (KOT1)",
    image:
      "https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
  {
    id: "FI010",
    name: "Paneer Butter Masala",
    price: 180.0,
    category: "Tea Shop (KOT1)",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&crop=center",
    currentStock: 94,
  },
];

// --- Food Item Card Component (internal to modal) ---
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
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerDetails>({
    name: orderData.customerName || "",
    mobile: "",
    type: "Individual",
  });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isMenuItemDetailsModalOpen, setIsMenuItemDetailsModalOpen] =
    useState(false);
  const [selectedFoodItemForDetails, setSelectedFoodItemForDetails] =
    useState<FoodItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrderItems([
        {
          id: "FI001",
          name: "Lemon Tea",
          quantity: 1,
          amount: 12.0,
          price: 12.0,
          kot: "Kot 01",
        },
      ]);
      setCustomerInfo((prev) => ({
        ...prev,
        name: orderData.customerName || "",
      }));
    }
  }, [isOpen, orderData]);

  const categories = [
    "All Items",
    "Tea Shop (KOT1)",
    "Juice shop (KOT2)",
    "Ice cream shop (KOT3)",
  ];

  if (!isOpen) return null;

  const filteredItems = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All Items" || item.category === selectedCategory)
  );

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

  const handleSaveAndPrint = () => {
    onSaveOrder(orderData.id, totalAmount, customerInfo.name, "occupied");
    onClose();
    printBill();
  };

  const handleGenerateBill = () => {
    onSaveOrder(orderData.id, totalAmount, customerInfo.name, "bill-generated");
    onClose();
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
      {/* Changed max-h-[90vh] to max-h-[95vh] and added overflow-y-auto to the main modal container */}
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
            {/* Keep scrollbar-invisible here */}
            <div className="w-full sm:w-64 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200 p-4 overflow-y-auto scrollbar-invisible">
              <div className="space-y-2 grid grid-cols-2 gap-2 sm:block">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 border border-dashed border-gray-300">
                  + Add Category
                </button>
              </div>
            </div>

            {/* Food Items Grid */}
            {/* Keep scrollbar-invisible here */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-invisible">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg">No items found</p>
                  <p className="text-sm">
                    Try adjusting your search or category filter
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
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

          {/* Keep scrollbar-invisible here */}
          <div className="flex-1 overflow-y-auto scrollbar-invisible">
            {/* Order Items Header */}
            {/* Removed p-4 from here, added px-4 and py-2 for the header's own padding */}
            <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-600 mb-2 border-b pb-2 px-4 py-2 sticky top-0 bg-white z-10">
              <span className="col-span-1">Kot</span>
              <span className="col-span-2">Items</span>
              <span className="col-span-1 text-center">Qty</span>
              <span className="col-span-1 text-right">Price</span>
            </div>

            {/* Order Items List - Removed padding from this outer div */}
            <div>
              {orderItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8 px-4">
                  {" "}
                  {/* Added px-4 here for consistency */}
                  <div className="text-3xl mb-2">🛒</div>
                  <p>No items in order</p>
                  <p className="text-xs mt-1">Add items from the menu</p>
                </div>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={`${item.id}-${item.variant || ""}`}
                    // Added px-4 to each item row for consistent horizontal alignment
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
                        // Added bg-gray-200 for the button background
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-8 text-center">
                        {item.quantity.toString().padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1, item.variant)}
                        // Added bg-gray-200 for the button background
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-sm mr-2">
                        ₹ {item.amount.toFixed(2)}
                      </span>
                      {/* <button
                        onClick={() => removeItem(item.id, item.variant)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={14} />
                      </button> */}
                    </div>
                  </div>
                ))
              )}

              {customerInfo.name && (
                <div className="text-right text-gray-700 text-sm mt-4 px-4 pb-2">
                  {" "}
                  {/* Added px-4 and pb-2 for consistent padding */}
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
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700"
              >
                Generate Bill
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700">
                KOT
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
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
              >
                Save & Print
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
