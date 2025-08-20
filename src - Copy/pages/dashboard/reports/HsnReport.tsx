import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Download } from "lucide-react";

// --- Interfaces (Updated HsnDetailData) ---
interface HsnSummaryData {
  no: string;
  hsnCode: string;
  cgst25: { sAmt: string; tax: string };
  cgst06: { sAmt: string; tax: string };
  cgst09: { sAmt: string; tax: string };
}

interface HsnDetailData {
  no: string;
  hsnCode: string;
  purchase: string;
  purchase2: string;
  sales: string;
  closingBalance: string;
  gstRate: number; // Updated to number
}

// --- Sample Data (Updated HsnDetailData) ---
const sampleHsnSummaryData: HsnSummaryData[] = [
  {
    no: "01",
    hsnCode: "878787KBJ",
    cgst25: { sAmt: "100000", tax: "2500" }, // Full sales & tax from Detail Row 1
    cgst06: { sAmt: "00", tax: "00" },
    cgst09: { sAmt: "00", tax: "00" },
  },
  {
    no: "02",
    hsnCode: "878787KBJ",
    cgst25: { sAmt: "00", tax: "00" },
    cgst06: { sAmt: "40000", tax: "2400" }, // Full sales & tax from Detail Row 2
    cgst09: { sAmt: "00", tax: "00" },
  },
  {
    no: "03",
    hsnCode: "878787KBJ",
    cgst25: { sAmt: "00", tax: "00" },
    cgst06: { sAmt: "00", tax: "00" },
    cgst09: { sAmt: "5000", tax: "450" }, // Full sales & tax from Detail Row 3
  },
  // ... other rows ...
];
const sampleHsnDetailData: HsnDetailData[] = [
  {
    no: "01",
    hsnCode: "878787KBJ",
    purchase: "₹ 65,000",
    purchase2: "₹ 15,000",
    sales: "₹ 1,00000",
    closingBalance: "₹ 1,00000",
    gstRate: 2.5,
  },
  {
    no: "02",
    hsnCode: "878787KBJ",
    purchase: "₹ 35,000",
    purchase2: "₹ 15,000",
    sales: "₹ 40,000",
    closingBalance: "₹ 10000",
    gstRate: 6,
  },
  {
    no: "03",
    hsnCode: "878787KBJ",
    purchase: "₹ 10,000",
    purchase2: "₹ 25,000",
    sales: "₹ 5000",
    closingBalance: "₹ -15,000",
    gstRate: 9,
  },
];

interface HsnReportProps {
  hsnSummaryData?: HsnSummaryData[];
  hsnDetailData?: HsnDetailData[];
}

const HsnReport: React.FC<HsnReportProps> = ({
  hsnSummaryData = sampleHsnSummaryData,
  hsnDetailData = sampleHsnDetailData,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    "Sales" | "Purchase" | "All"
  >("Sales");
  const [customerTypeFilter, setCustomerTypeFilter] = useState<
    "All" | "GST Customer" | "Non-GST Customer"
  >("All");
  const [dateFilter, setDateFilter] = useState("");
  const [searchHsnCode, setSearchHsnCode] = useState("");

  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [isCustomerTypeDropdownOpen, setIsCustomerTypeDropdownOpen] =
    useState(false);

  const salesDropdownRef = useRef<HTMLButtonElement>(null);
  const customerTypeDropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        salesDropdownRef.current &&
        !salesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSalesDropdownOpen(false);
      }
      if (
        customerTypeDropdownRef.current &&
        !customerTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const parseCurrency = (value: string): number => {
    if (typeof value !== "string") return 0;
    return parseFloat(value.replace(/[₹,]/g, ""));
  };

  const filteredHsnSummaryData = hsnSummaryData.filter((item) => {
    const matchesHsnCode =
      searchHsnCode === "" ||
      item.hsnCode.toLowerCase().includes(searchHsnCode.toLowerCase());
    return matchesHsnCode;
  });

  const filteredHsnDetailData = hsnDetailData.filter((item) => {
    const matchesHsnCode =
      searchHsnCode === "" ||
      item.hsnCode.toLowerCase().includes(searchHsnCode.toLowerCase());
    return matchesHsnCode;
  });

  // --- Calculations for HSN Summary Table Totals ---
  const totalCgst25SAmt = filteredHsnSummaryData
    .reduce((acc, curr) => acc + (parseFloat(curr.cgst25.sAmt) || 0), 0)
    .toFixed(2);
  const totalCgst25Tax = filteredHsnSummaryData
    .reduce((acc, curr) => acc + (parseFloat(curr.cgst25.tax) || 0), 0)
    .toFixed(2);
  const totalCgst06SAmt = filteredHsnSummaryData
    .reduce((acc, curr) => acc + (parseFloat(curr.cgst06.sAmt) || 0), 0)
    .toFixed(2);
  const totalCgst06Tax = filteredHsnSummaryData
    .reduce((acc, curr) => acc + (parseFloat(curr.cgst06.tax) || 0), 0)
    .toFixed(2);
  const totalCgst09SAmt = filteredHsnSummaryData
    .reduce((acc, curr) => acc + (parseFloat(curr.cgst09.sAmt) || 0), 0)
    .toFixed(2);
  const totalCgst09Tax = filteredHsnSummaryData
    .reduce((acc, curr) => acc + (parseFloat(curr.cgst09.tax) || 0), 0)
    .toFixed(2);

  // Grand total for Summary table (Sum of all S Amts + Sum of all Taxes)
  const overallTotalSummary = (
    parseFloat(totalCgst25SAmt) +
    parseFloat(totalCgst25Tax) +
    parseFloat(totalCgst06SAmt) +
    parseFloat(totalCgst06Tax) +
    parseFloat(totalCgst09SAmt) +
    parseFloat(totalCgst09Tax)
  ).toFixed(2);

  // --- Calculations for HSN Detail Table Totals ---
  const totalPurchase = filteredHsnDetailData.reduce(
    (sum, row) => sum + parseCurrency(row.purchase),
    0
  );
  const totalSales = filteredHsnDetailData.reduce(
    (sum, row) => sum + parseCurrency(row.sales),
    0
  );
  const totalClosingBalance = filteredHsnDetailData.reduce(
    (sum, row) => sum + parseCurrency(row.closingBalance),
    0
  );

  // Calculate total tax from detail data (Sales amount * GST Rate)
  const totalTaxFromDetails = filteredHsnDetailData.reduce((sum, row) => {
    const salesValue = parseCurrency(row.sales);
    // gstRate is already a number due to interface update
    const gstRateValue = row.gstRate || 0; 
    return sum + (salesValue * (gstRateValue / 100));
  }, 0);

  // Overall Total for Detail table (Total Sales + Total Calculated Tax)
  const overallTotalDetails = (totalSales + totalTaxFromDetails).toFixed(2);


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">HSN Report</h3>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <button
            ref={salesDropdownRef}
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
            onClick={() => setIsSalesDropdownOpen(!isSalesDropdownOpen)}
          >
            {activeFilter} <ChevronDown size={16} className="ml-2" />
          </button>
          {isSalesDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setActiveFilter("Sales");
                  setIsSalesDropdownOpen(false);
                }}
              >
                Sales
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setActiveFilter("Purchase");
                  setIsSalesDropdownOpen(false);
                }}
              >
                Purchase
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setActiveFilter("All");
                  setIsSalesDropdownOpen(false);
                }}
              >
                All
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            ref={customerTypeDropdownRef}
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[150px]"
            onClick={() =>
              setIsCustomerTypeDropdownOpen(!isCustomerTypeDropdownOpen)
            }
          >
            {customerTypeFilter} <ChevronDown size={16} className="ml-2" />
          </button>
          {isCustomerTypeDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setCustomerTypeFilter("All");
                  setIsCustomerTypeDropdownOpen(false);
                }}
              >
                All
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setCustomerTypeFilter("GST Customer");
                  setIsCustomerTypeDropdownOpen(false);
                }}
              >
                GST Customer
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setCustomerTypeFilter("Non-GST Customer");
                  setIsCustomerTypeDropdownOpen(false);
                }}
              >
                Non-GST Customer
              </button>
            </div>
          )}
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Date"
        />

        <div className="relative flex items-center ml-auto">
          <input
            type="text"
            placeholder="Search | HSN Code"
            value={searchHsnCode}
            onChange={(e) => setSearchHsnCode(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-w-[200px]"
          />
          <button className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-white bg-black rounded-r-md hover:bg-gray-800 transition-colors">
            <Search size={20} />
          </button>
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
          Download <Download size={16} className="ml-2" />
        </button>
        <div className="text-sm font-medium text-gray-600 ml-4">
          12 Aug 2025 - 22 Aug 2025
        </div>
      </div>

      {/* --- HSN Summary Table --- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                rowSpan={2}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                No
              </th>
              <th
                rowSpan={2}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                HSN Code
              </th>
              <th
                colSpan={2}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                CGST | SGST (2.5 %)
              </th>
              <th
                colSpan={2}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                CGST | SGST (06 %)
              </th>
              <th
                colSpan={2}
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                CGST | SGST (09 %)
              </th>
              <th
                rowSpan={2}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                Total Amount
              </th>{" "}
              {/* New column for total amount */}
            </tr>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S Amt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S Amt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S Amt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredHsnSummaryData.map((row) => (
              <tr key={row.no} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                  {row.no}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                  {row.hsnCode}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.cgst25.sAmt}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.cgst25.tax}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.cgst06.sAmt}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.cgst06.tax}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.cgst09.sAmt}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.cgst09.tax}
                </td>
                {/* Calculate and display row-wise total amount */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800 font-medium">
                  {(
                    parseFloat(row.cgst25.sAmt) +
                    parseFloat(row.cgst25.tax) +
                    parseFloat(row.cgst06.sAmt) +
                    parseFloat(row.cgst06.tax) +
                    parseFloat(row.cgst09.sAmt) +
                    parseFloat(row.cgst09.tax)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-blue-50 hover:bg-blue-100 font-semibold">
              <td
                colSpan={8} // Spans "No" through "CGST | SGST (09 %) Tax"
                className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
              >
                Grand Total:
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-900">
                {overallTotalSummary}
              </td>
            </tr>
            {filteredHsnSummaryData.length === 0 && (
              <tr>
                <td
                  colSpan={9} // Updated colspan to include the new column
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No summary data found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- HSN Detail Table --- */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purchase
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sales
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GST Rate
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Closing Balance
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>{" "}
            {/* New column for total amount */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredHsnDetailData.map((row) => {
            const taxPercentage = row.gstRate || 0;
            const salesValue = parseCurrency(row.sales);
            const calculatedTax = salesValue * (taxPercentage / 100);
            const rowTotalAmount = (salesValue + calculatedTax).toFixed(2);

            return (
              <tr key={row.no} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                  {row.no}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.purchase}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {row.sales}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  {taxPercentage > 0 ? `${taxPercentage.toFixed(2)}%` : "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800">
                  <span
                    className={
                      parseCurrency(row.closingBalance) < 0 ? "text-red-500" : ""
                    }
                  >
                    {row.closingBalance}
                  </span>
                </td>
                {/* Display row-wise total amount */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-800 font-medium">
                  {rowTotalAmount}
                </td>
              </tr>
            );
          })}
          {/* Total Row for HSN Detail Table */}
          <tr className="bg-blue-50 hover:bg-blue-100 font-semibold">
            <td
              colSpan={1} // "No" column
              className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
            >
              Grand Total:
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-900">
              ₹ {totalPurchase.toFixed(2)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-900">
              ₹ {totalSales.toFixed(2)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-900">
              Tax: ₹ {totalTaxFromDetails.toFixed(2)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-900">
              ₹ {totalClosingBalance.toFixed(2)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-900">
              ₹ {overallTotalDetails}
            </td>
          </tr>
          {filteredHsnDetailData.length === 0 && (
            <tr>
              <td
                colSpan={6} // Updated colspan to include the new column
                className="px-4 py-4 text-center text-sm text-gray-500"
              >
                No detail data found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HsnReport;