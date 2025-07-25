import React from "react";
import { ChevronDown } from "lucide-react";

interface FormData {
  itemName: string;
  category: string;
  subCategory: string;
  brandName: string;
  status: string;
  vendorName: string;
  vendorContact: string;
}

interface BasicDetailsProps {
  isProduct: boolean;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleToggleChange: (type: "product" | "service") => void;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({
  isProduct,
  formData,
  handleInputChange,
  handleToggleChange,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-6">Basic details</h2>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => handleToggleChange("product")}
          className={`px-4 py-2 rounded-md ${
            isProduct ? "bg-blue-700 text-white" : "text-gray-700"
          }`}
        >
          Product
        </button>
        <button
          onClick={() => handleToggleChange("service")}
          className={`px-4 py-2 rounded-md ${
            !isProduct ? "bg-blue-700 text-white" : "text-gray-700"
          }`}
        >
          Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isProduct ? "Product Name" : "Service Name"} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.itemName}
            onChange={(e) => handleInputChange("itemName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select category</option>
              <option value="food">Food</option>
              <option value="beverage">Beverage</option>
              {!isProduct && <option value="service">Service</option>}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Category
          </label>
          <div className="relative">
            <select
              value={formData.subCategory}
              onChange={(e) => handleInputChange("subCategory", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select sub category</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name
          </label>
          <div className="relative">
            <select
              value={formData.brandName}
              onChange={(e) => handleInputChange("brandName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select brand</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Name
          </label>
          <input
            type="text"
            value={formData.vendorName}
            onChange={(e) => handleInputChange("vendorName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Contact
          </label>
          <input
            type="text"
            value={formData.vendorContact}
            onChange={(e) => handleInputChange("vendorContact", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;