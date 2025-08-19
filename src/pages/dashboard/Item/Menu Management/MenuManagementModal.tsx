// src/components/MenuManagementModal.tsx
import React, { useState, useEffect } from "react";
import { Search, X, ChevronLeft, Plus } from "lucide-react";
import EditItemModal from "./EditItemModal"; // Import the new modal component

// Define a simplified MenuItem interface specifically for this modal's table
interface MenuItemForMenuManagement {
  id: string;
  name: string;
  hsnCode: string;
  totalVariants: number;
  category: string; // Add a category property to the menu item
}

// Define the structure for a variant (used for the right sidebar in MenuManagementModal)
interface Variant {
  name: string;
  imageUrl?: string; // Optional image URL for the variant
}

// Define the structure for a variant detail (used for the EditItemModal)
interface VariantDetail {
  name: string;
  posPrice: string;
  dineInPrice: string;
  deliveryPrice: string;
  zomatoPrice: string;
  swiggyPrice: string;
  appPrice: string;
  imageUrl?: string;
}

interface MenuManagementModalProps {
  onClose: () => void;
  menuItems: MenuItemForMenuManagement[];
  // onEditItem is now replaced by the internal state management for the EditItemModal
}

// Sample static variants data, still keyed by item name.
// IMPORTANT: For the EditItemModal, you'd typically fetch detailed variant data
// based on the item ID from an API. This is just for demonstration.
const sampleVariants: { [key: string]: Variant[] } = {
  "Tea": [
    { name: "Without", imageUrl: "https://i.imgur.com/Qk9jM0k.png" }, // Placeholder for 'Without' based on image_41bf40.png
    { name: "Half Sugar", imageUrl: "https://i.imgur.com/z4P8r1x.png" }, // Placeholder for 'Half Sugar' based on image_41bf40.png
    { name: "Double Strong Sugar", imageUrl: "https://i.imgur.com/aBCdE1y.png" }, // Placeholder for 'Double Strong Sugar' based on image_41bf40.png
    { name: "Light Tea", imageUrl: "https://i.imgur.com/b5X0X2g.png" }, // Placeholder for 'Light Tea' based on image_41bf40.png
    { name: "Medium Tea", imageUrl: "https://i.imgur.com/c6Y1Y3h.png" }, // Placeholder for 'Medium Tea' based on image_41bf40.png
    { name: "Strong Tea", imageUrl: "https://i.imgur.com/d7Z2Z4i.png" }, // Placeholder for 'Strong Tea' based on image_41bf40.png
    { name: "Double Strong Tea", imageUrl: "https://i.imgur.com/e8A3A5j.png" }, // Placeholder for 'Double Strong Tea' based on image_41bf40.png
  ],
  "Orange Juice": [
    { name: "Sweet", imageUrl: "https://via.placeholder.com/40x40?text=OS" },
    { name: "No Sugar", imageUrl: "https://via.placeholder.com/40x40?text=ONS" },
  ],
  "Vanilla Ice Cream": [
    { name: "Single Scoop", imageUrl: "https://via.placeholder.com/40x40?text=SS" },
    { name: "Double Scoop", imageUrl: "https://via.placeholder.com/40x40?text=DS" },
    { name: "With Sprinkles", imageUrl: "https://via.placeholder.com/40x40?text=WS" },
  ],
  "Medhu vada": [
    { name: "With Sambar", imageUrl: "https://via.placeholder.com/40x40?text=WS" },
    { name: "Plain", imageUrl: "https://via.placeholder.com/40x40?text=PL" },
  ],
};

// Sample detailed variant data for the EditItemModal (simulate fetching)
const sampleDetailedVariants: { [key: string]: VariantDetail[] } = {
  "Tea": [
    { name: "Without", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/Qk9jM0k.png" }, // Placeholder
    { name: "Half Tea", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/z4P8r1x.png" }, // Placeholder
    { name: "Strong", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/d7Z2Z4i.png" }, // Placeholder
    { name: "Double Strong", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/e8A3A5j.png" }, // Placeholder
    { name: "Light Tea", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/b5X0X2g.png" }, // Placeholder
    { name: "Half Sugar", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/z4P8r1x.png" }, // Placeholder
    { name: "Double Sugar", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/aBCdE1y.png" }, // Placeholder
    { name: "Medium tea", posPrice: "0.00", dineInPrice: "0.00", deliveryPrice: "0.00", zomatoPrice: "0.00", swiggyPrice: "0.00", appPrice: "0.00", imageUrl: "https://i.imgur.com/c6Y1Y3h.png" }, // Placeholder
  ],
  "Medhu vada": [
    { name: "With Sambar", posPrice: "25.00", dineInPrice: "25.00", deliveryPrice: "30.00", zomatoPrice: "35.00", swiggyPrice: "35.00", appPrice: "30.00", imageUrl: "https://via.placeholder.com/40x40?text=WS" },
    { name: "Plain", posPrice: "20.00", dineInPrice: "20.00", deliveryPrice: "25.00", zomatoPrice: "30.00", swiggyPrice: "30.00", appPrice: "25.00", imageUrl: "https://via.placeholder.com/40x40?text=PL" },
  ],
  // Add detailed variants for other items as needed
};


const MenuManagementModal: React.FC<MenuManagementModalProps> = ({ onClose, menuItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [selectedCategoryDisplay, setSelectedCategoryDisplay] = useState<string>("All");

  const [categories, setCategories] = useState<string[]>(["All", "Tea shop", "Juice shop", "Icecream shop"]);
  const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");

  // State for the EditItemModal
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItemForMenuManagement | null>(null);

  // Effect to set the initial selected item when menuItems change or component mounts
  useEffect(() => {
    if (menuItems.length > 0) {
      const initialItem = menuItems[0];
      setSelectedItemName(initialItem.name);
      setSelectedCategoryDisplay(initialItem.category);
    } else {
      setSelectedItemName(null);
      setSelectedCategoryDisplay(activeCategoryFilter);
    }
  }, [menuItems, activeCategoryFilter]);

  // Filter items based on search term AND active category filter
  const filteredItems = menuItems.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hsnCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeCategoryFilter === "All" ? true : item.category === activeCategoryFilter)
  );

  // This function still gets variants based on an individual item name for the right sidebar
  const getVariantsForSelectedItem = (itemName: string | null): Variant[] => {
    if (!itemName) return [];
    return sampleVariants[itemName as keyof typeof sampleVariants] || [];
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== "" && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName("");
    }
  };

  const handleEditItemClick = (item: MenuItemForMenuManagement) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-full w-[95%] h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold">Menu Management</h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, item code"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm"
              >
                Filter by Category
              </button>
              {showCategoryFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <div className="p-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md ${activeCategoryFilter === category ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"}`}
                        onClick={() => {
                          setActiveCategoryFilter(category);
                          setShowCategoryFilter(false);

                          const firstItemInFilteredCategory = menuItems.find(
                            item => category === "All" ? true : item.category === category
                          );
                          if (firstItemInFilteredCategory) {
                            setSelectedItemName(firstItemInFilteredCategory.name);
                            setSelectedCategoryDisplay(firstItemInFilteredCategory.category);
                          } else {
                            setSelectedItemName(null);
                            setSelectedCategoryDisplay(category);
                          }
                        }}
                      >
                        {category}
                      </button>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <input
                        type="text"
                        placeholder="New category"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCategory();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddCategory}
                        className="flex items-center justify-center w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        <Plus size={16} className="mr-1" /> Add Category
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Close button (X) at the top right */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area: Table and Variants Sidebar */}
        <div className="flex flex-grow overflow-hidden">
          {/* Left Section: Item List Table */}
          <div className="flex-grow w-2/3 overflow-y-auto border-r border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    HSN Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Variants
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`cursor-pointer ${selectedItemName === item.name ? "bg-blue-50" : "hover:bg-gray-100"}`}
                    onClick={() => {
                      setSelectedItemName(item.name);
                      setSelectedCategoryDisplay(item.category);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.hsnCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalVariants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-700 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from firing
                          handleEditItemClick(item); // Open the EditItemModal
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No items found for "{activeCategoryFilter}" category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Right Section: Variants Sidebar */}
          <div className="w-1/3 p-4 bg-gray-50 overflow-y-auto flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Varients</h3>
            <div className="mb-4">
              <span className="text-blue-700 font-medium">{selectedCategoryDisplay}</span>
            </div>
            <div className="flex flex-col gap-3">
              {selectedItemName ? (
                getVariantsForSelectedItem(selectedItemName).map((variant, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-md shadow-sm border border-gray-200">
                    {variant.imageUrl ? (
                      <img src={variant.imageUrl} alt={variant.name} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Img
                      </div>
                    )}
                    <span className="text-gray-900">{variant.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Select an item from the table to view its variants.</p>
              )}
              {selectedItemName && getVariantsForSelectedItem(selectedItemName).length === 0 && (
                <p className="text-gray-500 text-sm">No variants available for "{selectedItemName}".</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render the EditItemModal conditionally */}
      {isEditModalOpen && itemToEdit && (
        <EditItemModal
          onClose={handleCloseEditModal}
          item={itemToEdit}
          // Pass the detailed variants. In a real app, you'd fetch this from an API.
          variantsData={sampleDetailedVariants[itemToEdit.name as keyof typeof sampleDetailedVariants] || []}
        />
      )}
    </div>
  );
};

export default MenuManagementModal;