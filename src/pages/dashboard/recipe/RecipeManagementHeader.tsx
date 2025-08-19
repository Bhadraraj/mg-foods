import React from "react";
import { Search, Plus, Sparkles } from "lucide-react";

interface RecipeManagementHeaderProps {
  activeMainTab: "recipe" | "orders";
  onTabChange: (tab: "recipe" | "orders") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dateRange: { from: Date; to: Date };
  onDateClick: () => void;
  selectedProductFilter: "product" | "sub-product";
  onProductFilterChange: (filter: "product" | "sub-product") => void;
  onAddDishVariant: () => void;
  onAddRecipe: () => void;
  onAddOrder: () => void; // This prop is used for the '+' button when on "orders" tab
}

const RecipeManagementHeader: React.FC<RecipeManagementHeaderProps> = ({
  activeMainTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  dateRange,
  onDateClick,
  selectedProductFilter,
  onProductFilterChange,
  onAddDishVariant,
  onAddRecipe,
  onAddOrder, // Destructure the prop
}) => {
  const formatDateRange = (from: Date, to: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    // Ensure consistent formatting and handle potential locale differences
    const format = (date: Date) => date.toLocaleDateString("en-GB", options).replace(/, /g, " ").replace(/\./g, "");
    return `${format(from)} - ${format(to)}`;
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center px-6 pt-4 pb-4">
        {/* Left side tabs */}
        <div className="flex space-x-8">
          <button
            onClick={() => onTabChange("recipe")}
            className={`pb-3 border-b-2 font-medium ${
              activeMainTab === "recipe"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Recipe
          </button>
          <button
            onClick={() => onTabChange("orders")}
            className={`pb-3 border-b-2 font-medium ${
              activeMainTab === "orders"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Orders
          </button>
        </div>

        {/* Right side search, date range, and action buttons */}
        <div className="flex items-center gap-2">
          {activeMainTab === "orders" && (
            <>
              <span className="text-sm text-gray-600 whitespace-nowrap mr-4">
                {formatDateRange(dateRange.from, dateRange.to)}
              </span>
              <button
                onClick={onDateClick}
                className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm whitespace-nowrap"
              >
                Date
              </button>
            </>
          )}

          {activeMainTab === "recipe" && (
            <select
              value={selectedProductFilter}
              onChange={(e) =>
                onProductFilterChange(e.target.value as "product" | "sub-product")
              }
              className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm whitespace-nowrap appearance-none pr-8 bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em",
              }}
            >
              <option value="product">Product</option>
              <option value="sub-product">Sub - Product</option>
            </select>
          )}

          {/* Search input and button */}
          <div className="relative flex-shrink-0 flex w-48">
            <input
              type="text"
              placeholder="Search"
              className="pl-3 pr-2 py-2 bg-white rounded-l-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-grow"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="flex-shrink-0 px-3 py-2 bg-black text-white rounded-r-md shadow-sm flex items-center justify-center -ml-px" title="Search">
              <Search size={20} />
            </button>
          </div>

          {/* Add Dish Variant Button */}
          {/* Conditional rendering for these buttons might be desired based on activeMainTab */}
          <button
            onClick={onAddDishVariant}
            className="flex-shrink-0 ml-2 ms-7 p-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center text-sm px-3"
            title="Add Dish Variant"
          >
            <Sparkles size={20} />
          </button>

          {/* Plus button (for adding new recipe/order) */}
          <button
            onClick={activeMainTab === "recipe" ? onAddRecipe : onAddOrder} // This is the core logic
            className="flex-shrink-0 ml-2 p-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 flex items-center justify-center text-sm px-3"
            title={activeMainTab === "recipe" ? "Add New Recipe" : "Add New Order"} // Dynamic title for accessibility
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeManagementHeader;