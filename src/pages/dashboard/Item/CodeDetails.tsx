import React from "react";

interface FormData {
  barcode01: string;
  barcode02: string;
  barcode03: string;
  qrCode: string;
}

interface CodeDetailsProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  generateBarcode: (type: string) => void;
}

const CodeDetails: React.FC<CodeDetailsProps> = ({
  formData,
  handleInputChange,
  generateBarcode,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-6">Code details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode 01
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.barcode01}
              onChange={(e) => handleInputChange("barcode01", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generateBarcode("01")}
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * Title, Item Number, Sell Price.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode 02
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.barcode02}
              onChange={(e) => handleInputChange("barcode02", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generateBarcode("02")}
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            *Title, Sell Price, MRP, Number (Bigger Sticker).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode 03
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.barcode03}
              onChange={(e) => handleInputChange("barcode03", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generateBarcode("03")}
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            *Title, Sell Price, MRP, Number, HSN Code
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            QR Code
          </label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={formData.qrCode}
              onChange={(e) => handleInputChange("qrCode", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generateBarcode("QR")}
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDetails;