import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Download } from "lucide-react";
import VendorDetailsModal from "./VendorDetailsModal";

interface CreditorData {
  id: string;
  no: string;
  vendor: string;
  gstNo: string;
  address: string;
  openingBalance: number;
  credit: number;
  debit: number;
  closingBalance: number;
  date: string;
}

const allCreditorsData: CreditorData[] = [
  {
    id: "c1",
    no: "01",
    vendor: "Eskay Traders (Vendor)",
    gstNo: "33AAWFB1839P1ZT",
    address: "73-B, West Mosi Street, Madurai-625001",
    openingBalance: 1103360.0,
    credit: 138685.0,
    debit: 138685.0,
    closingBalance: 942045.0,
    date: "2025-08-15",
  },
  {
    id: "c2",
    no: "02",
    vendor: "Eskay Traders (Vendor)",
    gstNo: "33AAWFB1839P1ZT",
    address: "73-B, West Mosi Street, Madurai-625001",
    openingBalance: 1103360.0,
    credit: 138685.0,
    debit: 138685.0,
    closingBalance: 942045.0,
    date: "2025-08-10",
  },
  {
    id: "c3",
    no: "03",
    vendor: "New Vendor Enterprises",
    gstNo: "29ABCDE1234F5Z5",
    address: "45, Anna Salai, Chennai-600002",
    openingBalance: 50000.0,
    credit: 20000.0,
    debit: 10000.0,
    closingBalance: 60000.0,
    date: "2025-07-20",
  },
  {
    id: "c4",
    no: "04",
    vendor: "Supplier XYZ Ltd.",
    gstNo: "07BCAFG6789H9Z9",
    address: "10, Park Street, Kolkata-700016",
    openingBalance: 200000.0,
    credit: 50000.0,
    debit: 200000.0,
    closingBalance: 50000.0,
    date: "2025-08-20",
  },
];

interface CreditorsReportProps {
  initialCreditorsData?: CreditorData[];
}

const CreditorsReport: React.FC<CreditorsReportProps> = ({
  initialCreditorsData = allCreditorsData,
}) => {
  const [hideOpeningBalance, setHideOpeningBalance] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>("All Vendors");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<string>("");

  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const vendorDropdownRef = useRef<HTMLButtonElement>(null);

  const uniqueVendors = [
    "All Vendors",
    ...new Set(initialCreditorsData.map((data) => data.vendor)),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        vendorDropdownRef.current &&
        !vendorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsVendorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCreditorsData = initialCreditorsData.filter((item) => {
    const matchesVendor =
      selectedVendor === "All Vendors" || item.vendor === selectedVendor;
    const matchesDate = !selectedDate || item.date === selectedDate;
    const matchesSearch =
      searchQuery === "" ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gstNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.no.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVendor && matchesDate && matchesSearch;
  }); 

  const calculateSummaryTotals = useCallback(() => {
    const totalOpeningBalance = filteredCreditorsData.reduce(
      (sum, item) => sum + item.openingBalance,
      0
    );
    const totalCredit = filteredCreditorsData.reduce(
      (sum, item) => sum + item.credit,
      0
    );
    const totalDebit = filteredCreditorsData.reduce(
      (sum, item) => sum + item.debit,
      0
    ); 
    const totalClosingBalance = filteredCreditorsData.reduce(
      (sum, item) => sum + item.closingBalance,
      0
    ); 
    const calculatedAmount = hideOpeningBalance
      ? totalCredit - totalDebit 
      : totalOpeningBalance + totalCredit - totalDebit;

    return {
      totalOpeningBalance,
      totalCredit,
      totalDebit,
      totalClosingBalance,
      calculatedAmount,
    };
  }, [filteredCreditorsData, hideOpeningBalance]);

  const summaryTotals = calculateSummaryTotals();

  const handleVendorClick = (vendorName: string) => {
    setSelectedVendorForModal(vendorName);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVendorForModal("");
  };
 
  const handleDownload = useCallback(() => {
    const headers = [
      "No.",
      "Vendor",
      "GST No.",
      "Address",
      !hideOpeningBalance ? "Opening Balance" : null,
      "Credit",
      "Debit",
      "Closing Balance",
    ]
      .filter(Boolean)
      .join(",");

    let csvContent = headers + "\n";
    filteredCreditorsData.forEach((item) => {
      const rowData = [
        item.no,
        `"${item.vendor}"`,
        item.gstNo,
        `"${item.address}"`,
        !hideOpeningBalance ? item.openingBalance.toFixed(2) : null,
        item.credit.toFixed(2),
        item.debit.toFixed(2),
        item.closingBalance.toFixed(2),
      ]
        .filter(Boolean)
        .join(",");
      csvContent += rowData + "\n";
    }); 

    csvContent += "\nSummary Totals\n";
    if (!hideOpeningBalance) {
      csvContent += `Opening Balance,${summaryTotals.totalOpeningBalance.toFixed(
        2
      )}\n`;
    } 
    csvContent += `Calculated Amount,${summaryTotals.calculatedAmount.toFixed(
      2
    )}\n`;
    csvContent += `Closing Balance,${summaryTotals.totalClosingBalance.toFixed(
      2
    )}\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "creditors_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [filteredCreditorsData, hideOpeningBalance, summaryTotals]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Creditors Report</h3>
      <div className="flex flex-wrap items-center gap-3 mb-6"> 
        <div className="relative">
          <button
            ref={vendorDropdownRef}
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
            onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
          >
            {selectedVendor} <ChevronDown size={16} className="ml-2" />
          </button>
          {isVendorDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1">
              {uniqueVendors.map((vendor) => (
                <button
                  key={vendor}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setIsVendorDropdownOpen(false);
                  }}
                >
                  {vendor}
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
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-w-[200px]"
          />
          <button className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-white bg-black rounded-r-md hover:bg-gray-800 transition-colors">
            <Search size={20} />
          </button>
        </div> 
        <div className="text-sm font-medium text-gray-600 ml-auto mr-4">
          12 Aug 2025 - 22 Aug 2025 
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
            checked={hideOpeningBalance}
            onChange={() => setHideOpeningBalance(!hideOpeningBalance)}
          />
          <span>Hide Opening Balance</span>
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
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GST No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              {!hideOpeningBalance && (
                <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opening Balance
                </th>
              )}
              <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredCreditorsData.length > 0 ? (
              filteredCreditorsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.no}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    <button
                      onClick={() => handleVendorClick(item.vendor)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                    >
                      {item.vendor}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.gstNo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.address}
                  </td>
                  {!hideOpeningBalance && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm  text-left text-gray-800">
                      ₹{" "}
                      {item.openingBalance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm  text-left text-gray-800">
                    ₹{" "}
                    {item.credit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm  text-left text-gray-800">
                    ₹{" "}
                    {item.debit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm  text-left text-gray-800">
                    ₹{" "}
                    {item.closingBalance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={hideOpeningBalance ? 7 : 8}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No creditors data found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> 
      <div className="p-4 mt-4 flex justify-end">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border border-gray-200 rounded-md bg-white">
          {!hideOpeningBalance && (
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-700">Opening Balance</span>
              <span className="text-sm text-gray-900 font-medium">
                ₹{" "}
                {summaryTotals.totalOpeningBalance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-700">Calculated Amount</span>
            <span className="text-sm text-gray-900 font-medium">
              ₹{" "}
              {summaryTotals.calculatedAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-700">Closing Balance</span>
            <span className="text-sm text-gray-900 font-medium">
              ₹{" "}
              {summaryTotals.totalClosingBalance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vendor={selectedVendorForModal}
        allCreditorsData={initialCreditorsData}
      />
    </div>
  );
};

export default CreditorsReport;