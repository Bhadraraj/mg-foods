import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

// Define an enum for product movement status
enum MovingStatus {
  Fast = "Fast Moving",
  Slow = "Slow Moving",
}

// 1. Updated ProductData interface with new fields
interface ProductData {
  slNo: string;
  category: string;
  productName: string;
  mrp: number;
  purchaseAmount: number;
  saleAmount: number; // Renamed from totalSalesPrice for clarity
  profitAmount: number;
  salesCount: number;
  saleDate: string; // Added for month-wise filtering (YYYY-MM-DD)
  movingStatus: MovingStatus;
}

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// 2. Updated sample data with new fields and varied dates
const sampleProductData: ProductData[] = [
  {
    slNo: "01",
    category: "Main Course",
    productName: "Chicken Biryani",
    mrp: 280,
    purchaseAmount: 24640, // Cost of ingredients
    saleAmount: 78400, // 280 * 280
    profitAmount: 53760,
    salesCount: 280,
    saleDate: "2025-07-15",
    movingStatus: MovingStatus.Fast,
  },
  {
    slNo: "02",
    category: "Appetizers",
    productName: "Gobi Manchurian",
    mrp: 190,
    purchaseAmount: 8550, // Cost of ingredients
    saleAmount: 28500, // 190 * 150
    profitAmount: 19950,
    salesCount: 150,
    saleDate: "2025-07-10",
    movingStatus: MovingStatus.Fast,
  },
  {
    slNo: "03",
    category: "Main Course",
    productName: "Mutton Rogan Josh",
    mrp: 450,
    purchaseAmount: 13500, // Cost of ingredients
    saleAmount: 31500, // 450 * 70
    profitAmount: 18000,
    salesCount: 70,
    saleDate: "2025-06-22",
    movingStatus: MovingStatus.Slow,
  },
  {
    slNo: "04",
    category: "Beverages",
    productName: "Fresh Lime Soda",
    mrp: 90,
    purchaseAmount: 5400, // Cost of ingredients
    saleAmount: 27000, // 90 * 300
    profitAmount: 21600,
    salesCount: 300,
    saleDate: "2025-06-18",
    movingStatus: MovingStatus.Fast,
  },
  {
    slNo: "05",
    category: "Desserts",
    productName: "Sizzling Brownie",
    mrp: 250,
    purchaseAmount: 5000, // Cost of ingredients
    saleAmount: 20000, // 250 * 80
    profitAmount: 15000,
    salesCount: 80,
    saleDate: "2025-05-30",
    movingStatus: MovingStatus.Slow,
  },
];

// Dynamically get unique months from data for the filter dropdown
const availableMonths = [
  ...new Set(
    sampleProductData.map((p) =>
      new Date(p.saleDate).toLocaleString("default", { month: "long" })
    )
  ),
];

const ProductReport: React.FC = () => {
  // State for new filters
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = sampleProductData.filter((item) => {
    const itemMonth = new Date(item.saleDate).toLocaleString("default", {
      month: "long",
    });

    // 3. Implemented filtering logic for all criteria
    const matchesMonth = !monthFilter || itemMonth === monthFilter;
    const matchesStatus = !statusFilter || item.movingStatus === statusFilter;
    const matchesSearch =
      !searchQuery ||
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesMonth && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-sans">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Product Sales Report</h3>
      
      {/* --- Filter Section --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Month Filter */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Months</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value={MovingStatus.Fast}>Fast Moving</option>
            <option value={MovingStatus.Slow}>Slow Moving</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search report..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-64"
          />
          <Search size={20} className="absolute right-3 text-gray-400" />
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* 4. Added new headers to the table */}
              {["Sl No", "Product Name", "Category", "MRP", "Sales Count", "Purchase Amount", "Sale Amount", "Profit Amount", "Status"].map(header => (
                 <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   {header}
                 </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              // 5. Applied conditional row coloring based on moving status
              <tr
                key={item.slNo}
                className={`hover:bg-gray-100 transition-colors duration-200 ${
                  item.movingStatus === MovingStatus.Fast
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                {/* 6. Added new cells to display all data */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{item.slNo}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.category}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{formatCurrency(item.mrp)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-gray-800">{item.salesCount}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{formatCurrency(item.purchaseAmount)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{formatCurrency(item.saleAmount)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700">{formatCurrency(item.profitAmount)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.movingStatus === MovingStatus.Fast
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.movingStatus}
                  </span>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-500">
                  No product data found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductReport;