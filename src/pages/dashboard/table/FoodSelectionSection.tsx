import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import FoodItemCard from "./FoodItemCard";
import { FoodItem, OrderItem } from "./types"; 
interface FoodSelectionSectionProps {
  onClose: () => void;
  onAddItem: (item: FoodItem) => void;
  foodItems: FoodItem[]; 
}

const FoodSelectionSection: React.FC<FoodSelectionSectionProps> = ({
  onClose,
  onAddItem,
  foodItems,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All Items",
    "Tea Shop (KOT1)",
    "Juice shop (KOT2)",
    "Ice cream shop (KOT3)",
  ];

  const filteredItems = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All Items" || item.category === selectedCategory)
  );

  return (
    <div className="flex-1 border-r border-gray-200">
      <div className="p-4 border-b">
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, item code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex h-full"> 
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="space-y-2">
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
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <FoodItemCard key={item.id} item={item} onAdd={onAddItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSelectionSection;