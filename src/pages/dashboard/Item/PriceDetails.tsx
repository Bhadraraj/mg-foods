import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface FormData {
  sellingPrice: string;
  purchasePrice: string;
  mrp: string;
  onlineDeliveryPrice: string;
  onlineSellingPrice: string;
  acSellingPrice: string;
  nonAcSellingPrice: string;
  taxPercentage: string;
  actualCost: string;
  discount: string;
  swiggy: string;
  zomato: string;
  diningPrice: string;
  customPrices?: { [key: string]: string }; // For dynamic price fields
}

interface PriceDetailsProps {
  isProduct: boolean;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  isProduct,
  formData,
  handleInputChange,
}) => {
  const [customPrices, setCustomPrices] = useState<{ [key: string]: string }>(
    formData.customPrices || {}
  );
  const [newPriceLabel, setNewPriceLabel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNewPrice = () => {
    if (newPriceLabel.trim()) {
      const newCustomPrices = {
        ...customPrices,
        [newPriceLabel]: ""
      };
      setCustomPrices(newCustomPrices);
      handleInputChange("customPrices", JSON.stringify(newCustomPrices));
      setNewPriceLabel("");
      setShowAddForm(false);
    }
  };

  const handleCustomPriceChange = (label: string, value: string) => {
    const updatedCustomPrices = {
      ...customPrices,
      [label]: value
    };
    setCustomPrices(updatedCustomPrices);
    handleInputChange("customPrices", JSON.stringify(updatedCustomPrices));
  };

  const handleRemoveCustomPrice = (label: string) => {
    const updatedCustomPrices = { ...customPrices };
    delete updatedCustomPrices[label];
    setCustomPrices(updatedCustomPrices);
    handleInputChange("customPrices", JSON.stringify(updatedCustomPrices));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Price details</h2>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add New Price
        </button>
      </div>

      {/* Add New Price Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Label
              </label>
              <input
                type="text"
                value={newPriceLabel}
                onChange={(e) => setNewPriceLabel(e.target.value)}
                placeholder="e.g., Wholesale Price, Bulk Price, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={handleAddNewPrice}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPriceLabel("");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price
          </label>
          <input
            type="number"
            value={formData.sellingPrice}
            onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isProduct && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Price
            </label>
            <input
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {isProduct && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRP
            </label>
            <input
              type="number"
              value={formData.mrp}
              onChange={(e) => handleInputChange("mrp", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Percentage
          </label>
          <input
            type="number"
            value={formData.taxPercentage}
            onChange={(e) => handleInputChange("taxPercentage", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Online Delivery Price
          </label>
          <input
            type="number"
            value={formData.onlineDeliveryPrice}
            onChange={(e) => handleInputChange("onlineDeliveryPrice", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Online Selling Price
          </label>
          <input
            type="number"
            value={formData.onlineSellingPrice}
            onChange={(e) => handleInputChange("onlineSellingPrice", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!isProduct && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AC Selling Price
              </label>
              <input
                type="number"
                value={formData.acSellingPrice}
                onChange={(e) => handleInputChange("acSellingPrice", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Non-AC Selling Price
              </label>
              <input
                type="number"
                value={formData.nonAcSellingPrice}
                onChange={(e) => handleInputChange("nonAcSellingPrice", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actual Cost
          </label>
          <input
            type="number"
            value={formData.actualCost}
            onChange={(e) => handleInputChange("actualCost", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount
          </label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => handleInputChange("discount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isProduct && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Swiggy
              </label>
              <input
                type="number"
                value={formData.swiggy}
                onChange={(e) => handleInputChange("swiggy", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zomato
              </label>
              <input
                type="number"
                value={formData.zomato}
                onChange={(e) => handleInputChange("zomato", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dine-in Price
              </label>
              <input
                type="number"
                value={formData.diningPrice}
                onChange={(e) => handleInputChange("diningPrice", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Custom Price Fields */}
        {Object.entries(customPrices).map(([label, value]) => (
          <div key={label} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={(e) => handleCustomPriceChange(label, e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveCustomPrice(label)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                title="Remove this price field"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceDetails;