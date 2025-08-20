// src/components/MenuItemDetailsModal.tsx
import React, { useState, useEffect } from "react";
import { Plus, Minus, X } from "lucide-react";
import { FoodItem, OrderItem } from "../types/OrdermanagementTable";

interface MenuItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FoodItem | null; // The food item to configure
  onAdd: (item: OrderItem) => void; // Callback to add the configured item to order
}

const MenuItemDetailsModal: React.FC<MenuItemDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  onAdd,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [kotNote, setKotNote] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1); // Reset quantity
      setKotNote(""); // Reset KOT Note
      const initialVariants: { [key: string]: string } = {};
      item.variants?.forEach((variantType) => {
        if (variantType.options.length > 0) {
          // Set the first option as default if available
          initialVariants[variantType.label] = variantType.options[0].value;
        }
      });
      setSelectedVariants(initialVariants); // Reset variants
      setImageError(false); // Reset image error
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleAddClick = () => {
    let finalPrice = item.price;
    let variantDescription = "";

    // Calculate price based on selected variants and build description
    item.variants?.forEach((variantType) => {
      const selectedOptionValue = selectedVariants[variantType.label];
      if (selectedOptionValue) {
        const selectedOption = variantType.options.find(
          (opt) => opt.value === selectedOptionValue
        );
        if (selectedOption?.priceAdjustment) {
          finalPrice += selectedOption.priceAdjustment;
        }
        if (variantDescription) {
          variantDescription += ", ";
        }
        variantDescription += selectedOption.label;
      }
    });

    const orderItem: OrderItem = {
      id: item.id,
      name: item.name + (variantDescription ? ` (${variantDescription})` : ""), // Append variant to name
      quantity: quantity,
      price: finalPrice, // Base price + variant adjustment
      amount: finalPrice * quantity,
      kot: "Kot 01", // Default KOT, adjust if needed
      kotNote: kotNote || undefined, // Add KOT Note if available
      variant: variantDescription || undefined, // Store selected variant description
    };
    onAdd(orderItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative flex flex-col max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        {/* Fixed Header Section */}
        <div className="flex-shrink-0 pb-4 border-b">
          <h2 className="text-xl sm:text-2xl mb-4 text-center">Variant</h2>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
              {!imageError && item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-2xl sm:text-3xl mb-1">🍽️</div>
                  <div className="text-xs sm:text-sm">No Image</div>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Current Stock: {item.currentStock ?? "N/A"}
              </p>
              <p className="text-base sm:text-lg font-bold text-blue-600 mt-2">
                ₹{item.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        {/* Changed scrollbar-hide to scrollbar-invisible to match your provided CSS */}
        <div className="flex-grow overflow-y-auto py-4 scrollbar-invisible">
          {/* Variants Section */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-6">
              {item.variants.map((variantType, typeIndex) => (
                <div key={variantType.label} className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                    {variantType.label}
                  </h4>
                  {variantType.type === "radio" && (
                    <div className="flex flex-wrap gap-3">
                      {variantType.options.map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex items-center"
                        >
                          <input
                            type="radio"
                            name={`variant-${variantType.label}`}
                            value={option.value}
                            checked={
                              selectedVariants[variantType.label] ===
                              option.value
                            }
                            onChange={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variantType.label]: option.value,
                              }))
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {variantType.type === "image-radio" && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {variantType.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [variantType.label]: option.value,
                            }))
                          }
                          className={`border rounded-lg p-2 flex flex-col items-center justify-center text-center transition-all ${
                            selectedVariants[variantType.label] === option.value
                              ? "border-blue-600 ring-2 ring-blue-200"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {option.image && (
                            <img
                              src={option.image}
                              alt={option.label}
                              className="w-12 h-12 object-contain mb-1"
                            />
                          )}
                          <span className="text-xs font-medium text-gray-700">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {variantType.type === "size" && (
                    <div className="flex flex-wrap gap-3">
                      {variantType.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [variantType.label]: option.value,
                            }))
                          }
                          className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                            selectedVariants[variantType.label] === option.value
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}{" "}
                          {option.priceAdjustment
                            ? `(+₹${option.priceAdjustment.toFixed(2)})`
                            : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* KOT Note */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">KOT Note</h4>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows={3}
              placeholder="Add a special note for the kitchen..."
              value={kotNote}
              onChange={(e) => setKotNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Fixed Footer Section */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              <Minus size={14} />
            </button>
            <span className="text-lg font-semibold w-10 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddClick}
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetailsModal;
