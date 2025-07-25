import React from "react";

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
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-6">Price details</h2>
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
      </div>
    </div>
  );
};

export default PriceDetails;