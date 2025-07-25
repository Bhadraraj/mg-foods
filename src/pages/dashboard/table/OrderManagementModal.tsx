import React, { useState } from "react";
import FoodSelectionSection from "./FoodSelectionSection";
import BillingSection from "./BillingSection";
import { FoodItem, OrderItem, ParcelOrder, Table } from "./types"; 

interface OrderManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: ParcelOrder | Table; 
}

const foodItems: FoodItem[] = [
  {
    id: "1",
    name: "Cream Bun",
    price: 30.0,
    currentStock: 94,
    image: "/api/placeholder/150/150",
    category: "bakery",
  },
  {
    id: "2",
    name: "Lava Cake",
    price: 30.0,
    currentStock: 94,
    image: "/api/placeholder/150/150",
    category: "dessert",
  },
  {
    id: "3",
    name: "Tea",
    price: 30.0,
    currentStock: 94,
    image: "/api/placeholder/150/150",
    category: "beverages",
  },
  {
    id: "4",
    name: "Apple Juice",
    price: 30.0,
    currentStock: 94,
    image: "/api/placeholder/150/150",
    category: "beverages",
  },
  {
    id: "5",
    name: "Lemon Tea",
    price: 12.0,
    currentStock: 94,
    image: "/api/placeholder/150/150",
    category: "beverages",
  },
];

const OrderManagementModal: React.FC<OrderManagementModalProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Lemon Tea",
      quantity: 1,
      amount: 12.0,
      price: 12.0,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = (item: FoodItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.id === item.id
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
                amount: (orderItem.quantity + 1) * orderItem.price,
              }
            : orderItem
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          amount: item.price,
          price: item.price,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return {
            ...item,
            quantity: newQuantity,
            amount: newQuantity * item.price,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden flex">
        <FoodSelectionSection
          onClose={onClose}
          onAddItem={handleAddItem}
          foodItems={foodItems}
        />
        <BillingSection
          orderItems={orderItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  );
};

export default OrderManagementModal;
