import React from "react";
import { ChevronDown, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormData {
  expirationDate: string | number | readonly string[] | undefined;
  manufacturingDate: string | number | readonly string[] | undefined;
  unit: string;
  currentQuantity: string;
  minimumStock: string;
  maximumStock: string;
}

interface StockDetailsProps {
  isProduct: boolean;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  manufacturingDate: Date | null;
  setManufacturingDate: (date: Date | null) => void;
  expirationDate: Date | null;
  setExpirationDate: (date: Date | null) => void;
}

const StockDetails: React.FC<StockDetailsProps> = ({
  isProduct,
  formData,
  handleInputChange,
  setManufacturingDate,
  expirationDate,
  setExpirationDate,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-6">Stock details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange("unit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select unit</option>
              {isProduct ? (
                <>
                  <option value="kg">Kg</option>
                  <option value="piece">Piece</option>
                  <option value="liter">Liter</option>
                  <option value="gram">Gram</option>
                </>
              ) : (
                <option value="unit">Unit</option>
              )}
            </select>
            <ChevronDown
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Quantity
          </label>
          <input
            type="number"
            value={formData.currentQuantity}
            onChange={(e) =>
              handleInputChange("currentQuantity", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isProduct && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock
              </label>
              <input
                type="number"
                value={formData.minimumStock}
                onChange={(e) =>
                  handleInputChange("minimumStock", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Stock
              </label>
              <input
                type="number"
                value={formData.maximumStock}
                onChange={(e) =>
                  handleInputChange("maximumStock", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturing Date
              </label>
              <input
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) =>
                  handleInputChange("manufacturingDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) =>
                  handleInputChange("manufacturingDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockDetails;
