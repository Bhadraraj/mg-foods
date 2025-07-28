import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseDetails: {
    id: string;
    invoiceNo: string;
    invoiceDate: string;
    totalItems: number;
    totalQty: number;
    brand: string;
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
  };
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  purchaseDetails,
}) => {
  if (!isOpen) return null;

  // Sample product data to match the image
  const products = [
    {
      id: "01",
      name: "Product 01",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      image: "https://via.placeholder.com/64x64",
    },
    {
      id: "02",
      name: "Product 02",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      image: "https://via.placeholder.com/64x64",
    },
    {
      id: "03",
      name: "Product 03",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      image: "https://via.placeholder.com/64x64",
    },
    {
      id: "04",
      name: "Product 04",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
    {
      id: "05",
      name: "Product 05",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
    {
      id: "06",
      name: "Product 06",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
    {
      id: "07",
      name: "Product 07",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
    {
      id: "08",
      name: "Product 08",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
    {
      id: "09",
      name: "Product 09",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
    {
      id: "10",
      name: "Product 10",
      price: "₹ 0.00",
      qty: 5,
      inventoryQty: 5,
      // image: "https://via.placeholder.com/64x64",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full   mx-auto flex flex-col shadow-lg h-[100vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 flex-shrink-0">
          {/* Purchase ID Card */}
          <div className="flex  bg-gray-50 flex-col p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Purchase ID :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              {purchaseDetails.id}
            </span>
          </div>

          {/* Invoice No Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Invoice No :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              {purchaseDetails.invoiceNo}
            </span>
          </div>

          {/* Total Items Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Total Items :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              {purchaseDetails.totalItems || "-"}
            </span>
          </div>

          {/* Created by Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Created by :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              karthi@gmail.com
            </span>
          </div>

          {/* Brand Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Brand :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              {purchaseDetails.brand}
            </span>
          </div>

          {/* Invoice Date Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Invoice Date :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              {purchaseDetails.invoiceDate}
            </span>
          </div>

          {/* Total Qty Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Total Qty :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              {purchaseDetails.totalQty || "-"}
            </span>
          </div>

          {/* Last Updated By Card */}
          <div className="flex flex-col  bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-blue-600 font-medium mb-1">
              Last Updated By :
            </span>
            <span className="text-base text-gray-900 font-semibold">
              karthi@gmail.com
            </span>
          </div>
        </div>
        <div className="flex-grow mx-5 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                  <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 w-[5%] min-w-[50px]">
                    No.
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-sm font-medium text-blue-600 w-[10%] min-w-[100px]">
                    Image
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-sm font-medium text-blue-600 w-[30%] min-w-[200px]">
                    Product Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-sm font-medium text-blue-600 w-[15%] min-w-[100px]">
                    Price
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-sm font-medium text-blue-600 w-[20%] min-w-[150px]">
                    Qty
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-sm font-medium text-blue-600 w-[20%] min-w-[150px]">
                    Print Selected
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 p-3 text-sm text-gray-700">
                      {product.id}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded overflow-hidden"></div>
                    </td>
                    <td className="border border-gray-300 p-3 text-sm text-gray-700">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 p-3 text-sm text-gray-700">
                      {product.price}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="flex flex-col items-start">
                        <div className="flex gap-2 mb-1">
                          <div className="bg-blue-600 text-white px-3 py-2 rounded text-lg font-bold w-12 h-12 flex items-center justify-center">
                            {product.qty}
                          </div>
                          <div className="bg-blue-600 text-white px-3 py-2 rounded text-lg font-bold w-12 h-12 flex items-center justify-center">
                            {product.inventoryQty}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-xs text-gray-600 w-12 text-center">
                            Qty
                          </div>
                          <div className="text-xs text-gray-600 w-12 text-center">
                            Inventory Qty
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-blue-600">Print</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Scan Code"
                          className="border border-gray-300 p-2 rounded w-full max-w-[150px] text-sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-start p-6 bg-white border-t border-gray-200 gap-3 flex-shrink-0">
          <button className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
            Move scanned products
          </button>
          <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400">
            Go To
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
