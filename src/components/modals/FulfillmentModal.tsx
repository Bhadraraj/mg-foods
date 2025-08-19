// src/components/modals/FulfillmentModal.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface FulfillmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseDetails: {
    id: string; // Purchase ID
    invoiceNo: string;
    invoiceDate: string;
    totalItems: number;
    totalQty: number;
    brand: string;
    createdBy: string;
    lastUpdatedBy: string;
    unit: string;
    mrp: number;
    storeRetailPrice: number;
    storeWholePrice: number;
    estimationPrice: number;
    quotation: number;
    igst: string;
    sgst: string;
    cgst: string;
    hsn: string;
    description: string;
    discount: number;
    items: Array<{
      // This 'items' array is likely for the overall purchase, not the current item details shown in this modal.
      no: string;
      image: string;
      productName: string;
      price: number;
      qty: number;
      inventoryQty: number;
    }>;
  };
}

const FulfillmentModal: React.FC<FulfillmentModalProps> = ({
  isOpen,
  onClose,
  purchaseDetails,
}) => {
  if (!isOpen) return null;

  // State for controllable fields if they were meant to be editable
  // For now, assuming they are displayed values based on `purchaseDetails` for the current item.
  const [currentUnit, setCurrentUnit] = useState(
    purchaseDetails.unit || "Select Unit"
  );
  const [currentQuantity, setCurrentQuantity] = useState(
    purchaseDetails.totalQty.toString()
  );
  const [currentDiscount, setCurrentDiscount] = useState(
    purchaseDetails.discount.toString()
  );

  const [isGoToDropdownOpen, setIsGoToDropdownOpen] = useState(false);
  const [selectedGoToOption, setSelectedGoToOption] = useState("Go To"); // New state for selected value

  const handleGoToClick = () => {
    setIsGoToDropdownOpen(!isGoToDropdownOpen);
  };

  const handleDropdownItemClick = (action: string) => { // Added type for 'action'
    console.log(`Navigating to: ${action}`);
    setSelectedGoToOption(action); // Update the selected option
    setIsGoToDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full  mx-auto flex flex-col shadow-lg h-[98vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-24 flex-shrink-0">
                Purchase ID
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.id}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-20 flex-shrink-0">
                Invoice No
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.invoiceNo}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-20 flex-shrink-0">
                Total Items
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.totalItems}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-20 flex-shrink-0">
                Created by
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.createdBy}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-24 flex-shrink-0">
                Brand
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.brand}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-20 flex-shrink-0">
                Invoice Date
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.invoiceDate}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-20 flex-shrink-0">
                Total Qty
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.totalQty}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 font-medium w-20 flex-shrink-0">
                Last Updated By
              </span>
              <span className="mx-2">:</span>
              <span className="text-gray-900 font-semibold">
                {purchaseDetails.lastUpdatedBy}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-2 flex flex-col justify-center items-center">
              {/* Changed flex-col and items-center for vertical stacking and horizontal centering */}
              <div className="bg-gray-200 w-full max-w-[192px] h-36 rounded-lg flex items-center justify-center border border-gray-300 overflow-hidden">
                {purchaseDetails.items[0]?.image ? (
                  <img
                    src={purchaseDetails.items[0].image}
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm text-center p-2">
                    Product Image Placeholder
                  </span>
                )}
              </div>

              <div className="p-4 flex items-center space-x-2 mt-2">
                {/* Added mt-2 for spacing */}
                <button className="bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors duration-200">
                  <ChevronLeft size={16} />
                </button>
                <button className="bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors duration-200">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            {/* Right side - Product Details Forms */}
            <div className="col-span-12 md:col-span-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {" "}
                {/* Reduced gap from gap-6 to gap-4 */}
                {/* Unit and Quantity Column */}
                <div className="lg:col-span-1 flex flex-col space-y-4">
                  {" "}
                  {/* Reduced space-y-6 to space-y-4 */}
                  <div>
                    <label
                      htmlFor="unit-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Unit
                    </label>{" "}
                    {/* Reduced mb-2 to mb-1 */}
                    <select
                      id="unit-select"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      value={currentUnit}
                      onChange={(e) => setCurrentUnit(e.target.value)}
                    >
                      <option value="Select Unit" disabled>
                        Select Unit
                      </option>
                      <option value="Pcs">Pcs</option>
                      <option value="Kg">Kg</option>
                      <option value="Ltr">Ltr</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="quantity-input"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantity
                    </label>{" "}
                    {/* Reduced mb-2 to mb-1 */}
                    <input
                      id="quantity-input"
                      type="text"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>
                {/* MRP Section */}
                <div className="lg:col-span-1 flex items-center justify-center">
                  <div className="bg-gray-100 rounded-lg p-4 text-center w-full h-full flex flex-col justify-center items-center border border-gray-200">
                    {" "}
                    {/* Reduced p-6 to p-4 */}
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      MRP
                    </div>{" "}
                    {/* Reduced mb-2 to mb-1 */}
                    <div className="text-4xl font-bold text-blue-600">
                      {purchaseDetails.mrp.toFixed(1)}
                    </div>{" "}
                    {/* Reduced text-5xl to text-4xl */}
                  </div>
                </div>
                {/* Price Columns (Retail, Wholesale, Estimation, Quotation) */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {" "}
                  {/* Reduced gap from gap-4 to gap-3 */}
                  <div className="text-center bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col justify-between">
                    {" "}
                    {/* Reduced p-4 to p-3 */}
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      Retail Price
                    </div>{" "}
                    {/* Reduced mb-2 to mb-1 */}
                    <div className="text-xs">
                      <div className="text-blue-600 font-semibold">
                        S.P : ₹ {purchaseDetails.storeRetailPrice.toFixed(2)}{" "}
                        (23 %)
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col justify-between">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      Wholesale Price
                    </div>
                    <div className="text-xs">
                      <div className="text-blue-600 font-semibold">
                        S.P : ₹ {purchaseDetails.storeWholePrice.toFixed(2)} (23
                        %)
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col justify-between col-span-full sm:col-span-1">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      Estimation Price
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center justify-center mb-0.5 text-gray-700">
                        <span className="mr-1">₹</span>
                        <span>Estimate</span>
                      </div>
                      <div className="text-blue-600 font-semibold">
                        S.P : ₹ {purchaseDetails.estimationPrice.toFixed(2)} (23
                        %)
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col justify-between col-span-full sm:col-span-1">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      Quotation
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center justify-center mb-0.5 text-gray-700">
                        <span className="mr-1">₹</span>
                        <span>Quotation</span>
                      </div>
                      <div className="text-blue-600 font-semibold">
                        S.P : ₹ {purchaseDetails.quotation.toFixed(2)} (23 %)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Combined Tax, Description, Discount, HSN, CGST, and Store Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {" "}
                {/* Reduced gap and mt */}
                <div>
                  <label
                    htmlFor="igst-input"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    IGST
                  </label>{" "}
                  <input
                    id="igst-input"
                    type="text"
                    value={purchaseDetails.igst}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sgst-input"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    SGST
                  </label>{" "}
                  <input
                    id="sgst-input"
                    type="text"
                    value={purchaseDetails.sgst}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
                  />
                </div>
                {/* New arrangement for HSN and CGST within the same row/grid */}
                <div>
                  <label
                    htmlFor="hsn-input"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    HSN
                  </label>{" "}
                  <input
                    id="hsn-input"
                    type="text"
                    value={purchaseDetails.hsn}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cgst-input"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    CGST
                  </label>{" "}
                  <input
                    id="cgst-input"
                    type="text"
                    value={purchaseDetails.cgst}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
                  />
                </div>
                {/* Moving Description and Discount here (if enough space)
            Alternatively, keep them in the same row as before and add Store as the 4th item if it fits */}
                <div>
                  <label
                    htmlFor="description-input"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    Description
                  </label>{" "}
                  <input
                    id="description-input"
                    type="text"
                    value={purchaseDetails.description}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="discount-input"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    Discount
                  </label>{" "}
                  <div className="flex items-center space-x-2">
                    <input
                      id="discount-input"
                      type="text"
                      value={currentDiscount}
                      onChange={(e) => setCurrentDiscount(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
                    />
                    <div className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-600 flex items-center">
                      <span className="mr-1">₹</span>
                      <span>▼</span>
                    </div>
                  </div>
                </div>
                {/* Store moved into this grid as the last item */}
                <div className="text-center bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col justify-center items-center col-span-full sm:col-span-2 lg:col-span-2">
                  <div className="text-sm font-medium text-blue-600 mb-1">
                    Store
                  </div>
                  <div className="text-base font-bold text-gray-800">NGL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start p-6 bg-white border-t border-gray-200 space-x-4">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200">
            Save & Next
          </button>
          {/* Go To Dropdown */}
          <div className="relative">
            <button
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors duration-200 flex items-center"
              onClick={handleGoToClick}
            >
              {selectedGoToOption} {/* Display the selected option here */}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isGoToDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {isGoToDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleDropdownItemClick("Invoice")}
                >
                  Invoice
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-700 hover:bg-gray-100" // Changed text-gray-700 to text-700
                  onClick={() => handleDropdownItemClick("Verification")}
                >
                  Verification
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleDropdownItemClick("Stock")}
                >
                  Stock
                </button>
                {/* You can add more options here as needed */}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FulfillmentModal;