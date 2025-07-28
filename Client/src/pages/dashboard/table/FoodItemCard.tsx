import React from "react";
import { FoodItem } from "./types"; 
const FoodItemCard: React.FC<{
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
}> = ({ item, onAdd }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-blue-600 mb-1">{item.name}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>Current Stock</span>
          <span>{item.currentStock}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span>Price</span>
            <div className="font-medium text-black">₹{item.price.toFixed(2)}</div>
          </div>
          <button
            onClick={() => onAdd(item)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;