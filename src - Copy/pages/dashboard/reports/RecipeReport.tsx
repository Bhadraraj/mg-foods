import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Download, X } from "lucide-react";

interface RecipeData {
  id: string;
  no: string;
  product: string;
  ingredients: number;
  totalManufacturingPrice: number;
  totalManufacturingQty: number;
  totalSellingPrice: number;
  totalSellingQty: number;
  status: string;
  wastage: number;
  date: string;
}

interface RecipeDetail {
  no: string;
  product: string;
  ingredients: number;
  totalManufacturingPrice: number;
  totalManufacturingQty: number;
  totalSellingPrice: number;
  totalSellingQty: number;
  status: string;
  wastage: number;
}

const allRecipesData: RecipeData[] = [
  {
    id: "r1",
    no: "01",
    product: "Biriyani",
    ingredients: 20,
    totalManufacturingPrice: 1202,
    totalManufacturingQty: 30,
    totalSellingPrice: 2207,
    totalSellingQty: 26,
    status: "Profit",
    wastage: 4,
    date: "2025-07-15",
  },
  {
    id: "r2",
    no: "02",
    product: "Egg Rice",
    ingredients: 10,
    totalManufacturingPrice: 202,
    totalManufacturingQty: 20,
    totalSellingPrice: 807,
    totalSellingQty: 14,
    status: "Profit",
    wastage: 6,
    date: "2025-07-18",
  },
  {
    id: "r3",
    no: "03",
    product: "Chicken Curry",
    ingredients: 15,
    totalManufacturingPrice: 850,
    totalManufacturingQty: 25,
    totalSellingPrice: 1200,
    totalSellingQty: 22,
    status: "Profit",
    wastage: 3,
    date: "2025-07-20",
  },
  {
    id: "r4",
    no: "04",
    product: "Fish Fry",
    ingredients: 8,
    totalManufacturingPrice: 400,
    totalManufacturingQty: 15,
    totalSellingPrice: 650,
    totalSellingQty: 12,
    status: "Loss",
    wastage: 3,
    date: "2025-07-22",
  },
  {
    id: "r5",
    no: "05",
    product: "Mutton Biryani",
    ingredients: 25,
    totalManufacturingPrice: 1800,
    totalManufacturingQty: 20,
    totalSellingPrice: 2400,
    totalSellingQty: 18,
    status: "Profit",
    wastage: 2,
    date: "2025-07-25",
  },
];

// Recipe Details Modal Component
interface RecipeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: string;
  allRecipesData: RecipeData[];
}

const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
  allRecipesData,
}) => {
  if (!isOpen) return null;

  const recipeDetails = allRecipesData.filter((recipe) => recipe.product === product);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recipe Details - {product}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-medium">No</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Ingredients</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total Manufacturing Price/Qty</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total Selling Price/Qty</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Wastage</th>
              </tr>
            </thead>
            <tbody>
              {recipeDetails.map((recipe, index) => (
                <tr
                  key={recipe.id}
                  className={index % 2 === 0 ? "bg-blue-600 text-white" : "bg-white text-gray-800"}
                >
                  <td className="px-4 py-3 text-sm">{recipe.no}</td>
                  <td className="px-4 py-3 text-sm">{recipe.product}</td>
                  <td className="px-4 py-3 text-sm">{recipe.ingredients}</td>
                  <td className="px-4 py-3 text-sm">
                    ₹ {recipe.totalManufacturingPrice} / {recipe.totalManufacturingQty}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    ₹ {recipe.totalSellingPrice} / {recipe.totalSellingQty}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={recipe.status === 'Profit' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {recipe.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{recipe.wastage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

interface RecipeReportProps {
  initialRecipesData?: RecipeData[];
}

const RecipeReport: React.FC<RecipeReportProps> = ({
  initialRecipesData = allRecipesData,
}) => {
  const [hideManufacturingPrice, setHideManufacturingPrice] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("All Products");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<string>("");

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const productDropdownRef = useRef<HTMLButtonElement>(null);

  const uniqueProducts = [
    "All Products",
    ...new Set(initialRecipesData.map((data) => data.product)),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredRecipesData = initialRecipesData.filter((item) => {
    const matchesProduct =
      selectedProduct === "All Products" || item.product === selectedProduct;
    const matchesDate = !selectedDate || item.date === selectedDate;
    const matchesSearch =
      searchQuery === "" ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.no.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProduct && matchesDate && matchesSearch;
  }); 

  const calculateSummaryTotals = useCallback(() => {
    const totalIngredients = filteredRecipesData.reduce(
      (sum, item) => sum + item.ingredients,
      0
    );
    const totalManufacturingPrice = filteredRecipesData.reduce(
      (sum, item) => sum + item.totalManufacturingPrice,
      0
    );
    const totalSellingPrice = filteredRecipesData.reduce(
      (sum, item) => sum + item.totalSellingPrice,
      0
    ); 
    const totalWastage = filteredRecipesData.reduce(
      (sum, item) => sum + item.wastage,
      0
    ); 
    const totalProfit = totalSellingPrice - totalManufacturingPrice;

    return {
      totalIngredients,
      totalManufacturingPrice,
      totalSellingPrice,
      totalWastage,
      totalProfit,
    };
  }, [filteredRecipesData]);

  const summaryTotals = calculateSummaryTotals();

  const handleProductClick = (productName: string) => {
    setSelectedProductForModal(productName);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProductForModal("");
  };
 
  const handleDownload = useCallback(() => {
    const headers = [
      "No.",
      "Product",
      "Ingredients",
      !hideManufacturingPrice ? "Manufacturing Price" : null,
      "Manufacturing Qty",
      "Selling Price",
      "Selling Qty",
      "Status",
      "Wastage",
    ]
      .filter(Boolean)
      .join(",");

    let csvContent = headers + "\n";
    filteredRecipesData.forEach((item) => {
      const rowData = [
        item.no,
        `"${item.product}"`,
        item.ingredients,
        !hideManufacturingPrice ? item.totalManufacturingPrice.toFixed(2) : null,
        item.totalManufacturingQty,
        item.totalSellingPrice.toFixed(2),
        item.totalSellingQty,
        item.status,
        item.wastage,
      ]
        .filter(Boolean)
        .join(",");
      csvContent += rowData + "\n";
    }); 

    csvContent += "\nSummary Totals\n";
    csvContent += `Total Ingredients,${summaryTotals.totalIngredients}\n`;
    if (!hideManufacturingPrice) {
      csvContent += `Total Manufacturing Price,${summaryTotals.totalManufacturingPrice.toFixed(2)}\n`;
    } 
    csvContent += `Total Selling Price,${summaryTotals.totalSellingPrice.toFixed(2)}\n`;
    csvContent += `Total Profit,${summaryTotals.totalProfit.toFixed(2)}\n`;
    csvContent += `Total Wastage,${summaryTotals.totalWastage}\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "recipe_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [filteredRecipesData, hideManufacturingPrice, summaryTotals]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recipe Report</h3>
      <div className="flex flex-wrap items-center gap-3 mb-6"> 
        <div className="relative">
          <button
            ref={productDropdownRef}
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]"
            onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
          >
            {selectedProduct} <ChevronDown size={16} className="ml-2" />
          </button>
          {isProductDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1">
              {uniqueProducts.map((product) => (
                <button
                  key={product}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsProductDropdownOpen(false);
                  }}
                >
                  {product}
                </button>
              ))}
            </div>
          )}
        </div> 
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="Select Date"
        /> 
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-w-[200px]"
          />
          <button className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-white bg-black rounded-r-md hover:bg-gray-800 transition-colors">
            <Search size={20} />
          </button>
        </div> 
        <div className="text-sm font-medium text-gray-600 ml-auto mr-4">
          15 Jul 2025 - 25 Jul 2025 
        </div> 
        <button
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={handleDownload}
        >
          Download <Download size={16} className="ml-2" />
        </button>
      </div> 
      <div className="p-4 pt-0">
        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
            checked={hideManufacturingPrice}
            onChange={() => setHideManufacturingPrice(!hideManufacturingPrice)}
          />
          <span>Hide Manufacturing Price</span>
        </label>
      </div> 
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingredients
              </th>
              {!hideManufacturingPrice && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Manufacturing Price/Qty
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Selling Price/Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wastage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredRecipesData.length > 0 ? (
              filteredRecipesData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.no}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    <button
                      onClick={() => handleProductClick(item.product)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                    >
                      {item.product}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.ingredients}
                  </td>
                  {!hideManufacturingPrice && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      ₹ {item.totalManufacturingPrice.toLocaleString("en-IN")} / {item.totalManufacturingQty}
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    ₹ {item.totalSellingPrice.toLocaleString("en-IN")} / {item.totalSellingQty}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={item.status === 'Profit' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.wastage}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={hideManufacturingPrice ? 6 : 7}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No recipe data found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> 
      <div className="p-4 mt-4 flex justify-end">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border border-gray-200 rounded-md bg-white">
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-700">Total Ingredients</span>
            <span className="text-sm text-gray-900 font-medium">
              {summaryTotals.totalIngredients}
            </span>
          </div>
          {!hideManufacturingPrice && (
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-700">Manufacturing Cost</span>
              <span className="text-sm text-gray-900 font-medium">
                ₹ {summaryTotals.totalManufacturingPrice.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-700">Total Selling</span>
            <span className="text-sm text-gray-900 font-medium">
              ₹ {summaryTotals.totalSellingPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-700">Total Profit</span>
            <span className={`text-sm font-medium ${summaryTotals.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹ {summaryTotals.totalProfit.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-700">Total Wastage</span>
            <span className="text-sm text-red-600 font-medium">
              {summaryTotals.totalWastage}
            </span>
          </div>
        </div>
      </div>

      {/* Recipe Details Modal */}
      <RecipeDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProductForModal}
        allRecipesData={initialRecipesData}
      />
    </div>
  );
};

export default RecipeReport;