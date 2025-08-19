import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Download } from "lucide-react";
import DebtorDetailsModal from "./DebtorDetailsModal";

interface DebtorData {
  id: string;
  no: string;
  customer: string;
  gstNo: string;
  address: string;
  openingBalance: number;
  debit: number;
  credit: number;
  closingBalance: number;
  date: string;
}

const allDebtorsData: DebtorData[] = [
  {
    id: "d1",
    no: "01",
    customer: "ABC Retail Stores",
    gstNo: "33AABCA1234M1ZL",
    address: "15, Main Street, Madurai-625002",
    openingBalance: 75000.0,
    debit: 45000.0,
    credit: 20000.0,
    closingBalance: 100000.0,
    date: "2025-08-15",
  },
  {
    id: "d2",
    no: "02",
    customer: "ABC Retail Stores",
    gstNo: "33AABCA1234M1ZL",
    address: "15, Main Street, Madurai-625002",
    openingBalance: 50000.0,
    debit: 30000.0,
    credit: 10000.0,
    closingBalance: 70000.0,
    date: "2025-08-10",
  },
  {
    id: "d3",
    no: "03",
    customer: "XYZ Electronics Ltd.",
    gstNo: "29ABXYZ5678N2ZM",
    address: "22, Gandhi Road, Chennai-600001",
    openingBalance: 120000.0,
    debit: 80000.0,
    credit: 50000.0,
    closingBalance: 150000.0,
    date: "2025-07-20",
  },
  {
    id: "d4",
    no: "04",
    customer: "Global Trading Co.",
    gstNo: "07BCGLO9012P3ZN",
    address: "8, Park Avenue, Kolkata-700017",
    openingBalance: 200000.0,
    debit: 60000.0,
    credit: 40000.0,
    closingBalance: 220000.0,
    date: "2025-08-20",
  },
  {
    id: "d5",
    no: "05",
    customer: "MNO Wholesale Mart",
    gstNo: "19MNOWH3456Q4ZO",
    address: "5, Industrial Area, Mumbai-400001",
    openingBalance: 90000.0,
    debit: 35000.0,
    credit: 15000.0,
    closingBalance: 110000.0,
    date: "2025-08-12",
  },
];

interface DebtorsReportProps {
  initialDebtorsData?: DebtorData[];
}

const DebtorsReport: React.FC<DebtorsReportProps> = ({
  initialDebtorsData = allDebtorsData,
}) => {
  const [hideOpeningBalance, setHideOpeningBalance] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("All Customers");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<string>("");

  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef<HTMLButtonElement>(null);

  const uniqueCustomers = [
    "All Customers",
    ...new Set(initialDebtorsData.map((data) => data.customer)),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredDebtorsData = initialDebtorsData.filter((item) => {
    const matchesCustomer =
      selectedCustomer === "All Customers" || item.customer === selectedCustomer;
    const matchesDate = !selectedDate || item.date === selectedDate;
    const matchesSearch =
      searchQuery === "" ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gstNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.no.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCustomer && matchesDate && matchesSearch;
  }); 

  const calculateSummaryTotals = useCallback(() => {
    const totalOpeningBalance = filteredDebtorsData.reduce(
      (sum, item) => sum + item.openingBalance,
      0
    );
    const totalDebit = filteredDebtorsData.reduce(
      (sum, item) => sum + item.debit,
      0
    );
    const totalCredit = filteredDebtorsData.reduce(
      (sum, item) => sum + item.credit,
      0
    ); 
    const totalClosingBalance = filteredDebtorsData.reduce(
      (sum, item) => sum + item.closingBalance,
      0
    ); 
    const calculatedAmount = hideOpeningBalance
      ? totalDebit - totalCredit 
      : totalOpeningBalance + totalDebit - totalCredit;

    return {
      totalOpeningBalance,
      totalDebit,
      totalCredit,
      totalClosingBalance,
      calculatedAmount,
    };
  }, [filteredDebtorsData, hideOpeningBalance]);

  const summaryTotals = calculateSummaryTotals();

  const handleCustomerClick = (customerName: string) => {
    setSelectedCustomerForModal(customerName);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomerForModal("");
  };
 
  const handleDownload = useCallback(() => {
    const headers = [
      "No.",
      "Customer",
      "GST No.",
      "Address",
      !hideOpeningBalance ? "Opening Balance" : null,
      "Debit",
      "Credit",
      "Closing Balance",
    ]
      .filter(Boolean)
      .join(",");

    let csvContent = headers + "\n";
    filteredDebtorsData.forEach((item) => {
      const rowData = [
        item.no,
        `"${item.customer}"`,
        item.gstNo,
        `"${item.address}"`,
        !hideOpeningBalance ? item.openingBalance.toFixed(2) : null,
        item.debit.toFixed(2),
        item.credit.toFixed(2),
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
      link.setAttribute("download", "debtors_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [filteredDebtorsData, hideOpeningBalance, summaryTotals]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Debtors Report</h3>
      <div className="flex flex-wrap items-center gap-3 mb-6"> 
        <div className="relative">
          <button
            ref={customerDropdownRef}
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]"
            onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
          >
            {selectedCustomer} <ChevronDown size={16} className="ml-2" />
          </button>
          {isCustomerDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1">
              {uniqueCustomers.map((customer) => (
                <button
                  key={customer}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsCustomerDropdownOpen(false);
                  }}
                >
                  {customer}
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
            placeholder="Search customers..."
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
                Customer
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
                Debit
              </th>
              <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-4 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredDebtorsData.length > 0 ? (
              filteredDebtorsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {item.no}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    <button
                      onClick={() => handleCustomerClick(item.customer)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                    >
                      {item.customer}
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm  text-left text-red-600 font-medium">
                    ₹{" "}
                    {item.debit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm  text-left text-green-600 font-medium">
                    ₹{" "}
                    {item.credit.toLocaleString("en-IN", {
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
                  No debtors data found matching your criteria.
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

      {/* Customer Details Modal */}
      <DebtorDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        customer={selectedCustomerForModal}
        allDebtorsData={initialDebtorsData}
      />
    </div>
  );
};

export default DebtorsReport;