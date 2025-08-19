import React, { useState, useMemo } from "react";
import { Search, Download, ChevronDown } from "lucide-react";

interface GstReportData {
  no: number;
  billNo: string;
  billDate: string;
  customerName: string;
  gstNo: string;
  gst5: { sAmt: number; tax: number };
  gst12: { sAmt: number; tax: number };
  gst18: { sAmt: number; tax: number };
  igst: { sAmt: number; tax: number };
  type?: "Sales" | "Purchase";
  customerType?: "GST" | "Non GST";
  billType?: "All" | "Credit" | "Settled";
}

interface GstReportProps {
  gstReportData?: GstReportData[];
}
const sampleData: GstReportData[] = [
  {
    no: 1,
    billNo: "MGST20250501001",
    billDate: "2025-05-02 16:26:17",
    customerName: "Customer01",
    gstNo: "33BSAPC0157K1Z7",
    gst5: { sAmt: 2000, tax: 100 },
    gst12: { sAmt: 3000, tax: 360 },
    gst18: { sAmt: 2000, tax: 360 },
    igst: { sAmt: 1500, tax: 135 },
    type: "Sales",
    customerType: "GST",
    billType: "All",
  },
  {
    no: 2,
    billNo: "MGST20250501002",
    billDate: "2025-05-03 10:15:30",
    customerName: "Customer02",
    gstNo: "33BSAPC0157K1Z8",
    gst5: { sAmt: 1500, tax: 75 },
    gst12: { sAmt: 2500, tax: 300 },
    gst18: { sAmt: 1800, tax: 324 },
    igst: { sAmt: 1200, tax: 108 },
    type: "Sales",
    customerType: "Non GST",
    billType: "Credit",
  },
  {
    no: 3,
    billNo: "MGST20250501003",
    billDate: "2025-05-04 14:20:45",
    customerName: "Customer03",
    gstNo: "33BSAPC0157K1Z9",
    gst5: { sAmt: 1000, tax: 50 },
    gst12: { sAmt: 4000, tax: 480 },
    gst18: { sAmt: 2500, tax: 450 },
    igst: { sAmt: 800, tax: 72 },
    type: "Purchase",
    customerType: "GST",
    billType: "Settled",
  },
  {
    no: 4,
    billNo: "MGST20250501004",
    billDate: "2025-05-05 09:30:15",
    customerName: "Customer04",
    gstNo: "33BSAPC0157K1Z0",
    gst5: { sAmt: 3000, tax: 150 },
    gst12: { sAmt: 1500, tax: 180 },
    gst18: { sAmt: 3500, tax: 630 },
    igst: { sAmt: 2000, tax: 180 },
    type: "Purchase",
    customerType: "Non GST",
    billType: "All",
  },
];

const GstReport: React.FC<GstReportProps> = ({ gstReportData }) => {
  const [filters, setFilters] = useState({
    type: "",
    customerType: "",
    billType: "",
    billNo: "",
  });
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const dataToUse = useMemo(() => {
    if (!gstReportData || gstReportData.length === 0) {
      return sampleData;
    }

    return gstReportData.map((item) => ({
      ...item,
      type: item.type || "Sales",
      customerType: item.customerType || "GST",
      billType: item.billType || "All",
    }));
  }, [gstReportData]);
  const filteredData = useMemo(() => {
    return dataToUse.filter((item) => {
      const typeMatch =
        !filters.type ||
        filters.type === "" ||
        (item.type && item.type.toLowerCase() === filters.type.toLowerCase());

      const customerTypeMatch =
        !filters.customerType ||
        filters.customerType === "" ||
        (item.customerType &&
          item.customerType.toLowerCase() ===
            filters.customerType.toLowerCase());

      const billTypeMatch =
        !filters.billType ||
        filters.billType === "" ||
        (item.billType &&
          item.billType.toLowerCase() === filters.billType.toLowerCase());

      const billNoMatch =
        !filters.billNo ||
        filters.billNo === "" ||
        item.billNo.toLowerCase().includes(filters.billNo.toLowerCase());

      return typeMatch && customerTypeMatch && billTypeMatch && billNoMatch;
    });
  }, [dataToUse, filters]);

  const summaryData = useMemo(() => {
    const summary = {
      gst5: { taxableAmount: 0, taxAmount: 0, totalAmount: 0 },
      gst12: { taxableAmount: 0, taxAmount: 0, totalAmount: 0 },
      gst18: { taxableAmount: 0, taxAmount: 0, totalAmount: 0 },
      total: { taxableAmount: 0, taxAmount: 0, totalAmount: 0 },
    };

    filteredData.forEach((item) => {
      summary.gst5.taxableAmount += item.gst5.sAmt;
      summary.gst5.taxAmount += item.gst5.tax;
      summary.gst5.totalAmount += item.gst5.sAmt + item.gst5.tax;
      summary.gst12.taxableAmount += item.gst12.sAmt;
      summary.gst12.taxAmount += item.gst12.tax;
      summary.gst12.totalAmount += item.gst12.sAmt + item.gst12.tax;
      summary.gst18.taxableAmount += item.gst18.sAmt;
      summary.gst18.taxAmount += item.gst18.tax;
      summary.gst18.totalAmount += item.gst18.sAmt + item.gst18.tax;
    });
    summary.total.taxableAmount =
      summary.gst5.taxableAmount +
      summary.gst12.taxableAmount +
      summary.gst18.taxableAmount;
    summary.total.taxAmount =
      summary.gst5.taxAmount +
      summary.gst12.taxAmount +
      summary.gst18.taxAmount;
    summary.total.totalAmount =
      summary.gst5.totalAmount +
      summary.gst12.totalAmount +
      summary.gst18.totalAmount;

    return summary;
  }, [filteredData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log("Search with filters:", filters);
  };

  const handleDownload = (format: string) => {
    console.log(`Download as ${format}`);
    setShowDownloadMenu(false);

    if (format === "Excel") {
      downloadAsExcel();
    } else if (format === "Json") {
      downloadAsJson();
    } else if (format === "Print") {
      handlePrint();
    }
  };

  const downloadAsExcel = () => {
    const headers = [
      "No",
      "Bill No",
      "Bill Date",
      "Customer Name",
      "GST No",
      "GST5 S Amt",
      "GST5 Tax",
      "GST12 S Amt",
      "GST12 Tax",
      "GST18 S Amt",
      "GST18 Tax",
      "IGST S Amt",
      "IGST Tax",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.no,
          row.billNo,
          row.billDate,
          row.customerName,
          row.gstNo,
          row.gst5.sAmt,
          row.gst5.tax,
          row.gst12.sAmt,
          row.gst12.tax,
          row.gst18.sAmt,
          row.gst18.tax,
          row.igst.sAmt,
          row.igst.tax,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "gst_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsJson = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "gst_report.json");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>GST Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>GST Report</h2>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Bill No</th>
                <th>Bill Date</th>
                <th>Customer Name</th>
                <th>GST No</th>
                <th>GST5 S Amt</th>
                <th>GST5 Tax</th>
                <th>GST12 S Amt</th>
                <th>GST12 Tax</th>
                <th>GST18 S Amt</th>
                <th>GST18 Tax</th>
                <th>IGST S Amt</th>
                <th>IGST Tax</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (row) => `
                <tr>
                  <td>${row.no}</td>
                  <td>${row.billNo}</td>
                  <td>${row.billDate}</td>
                  <td>${row.customerName}</td>
                  <td>${row.gstNo}</td>
                  <td>${row.gst5.sAmt}</td>
                  <td>${row.gst5.tax}</td>
                  <td>${row.gst12.sAmt}</td>
                  <td>${row.gst12.tax}</td>
                  <td>${row.gst18.sAmt}</td>
                  <td>${row.gst18.tax}</td>
                  <td>${row.igst.sAmt}</td>
                  <td>${row.igst.tax}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">GST Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Type Filter */}
        <div>
          <label
            htmlFor="reportType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Report Type
          </label>
          <select
            id="reportType"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
          >
            <option value="">All</option>
            <option value="Sales">Sales</option>
            <option value="Purchase">Purchase</option>
          </select>
        </div>

        {/* Customer Type Filter */}
        <div>
          <label
            htmlFor="customerType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Type
          </label>
          <select
            id="customerType"
            value={filters.customerType}
            onChange={(e) => handleFilterChange("customerType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
          >
            <option value="">All</option>
            <option value="GST">GST</option>
            <option value="Non GST">Non GST</option>
          </select>
        </div>

        {/* Bill Type Filter */}
        <div>
          <label
            htmlFor="billType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bill Type
          </label>
          <select
            id="billType"
            value={filters.billType}
            onChange={(e) => handleFilterChange("billType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
          >
            <option value="">All</option>{" "}
            {/* Changed from "All" to "" for consistency with other filters */}
            <option value="Credit">Credit</option>
            <option value="Settled">Settled</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          {" "}
          {/* Align button to the bottom */}
          <button
            onClick={handleSearch}
            className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors w- "
          >
            <Search size={20} className="mx-auto" />
          </button>
        </div>
      </div>
      <div className="px-4 pb-4 flex justify-between items-center">
        <div></div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              Download
              <ChevronDown size={16} />
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleDownload("Excel")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Excel
                </button>
                <button
                  onClick={() => handleDownload("Print")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Print
                </button>
                <button
                  onClick={() => handleDownload("Json")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Json
                </button>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Bill No."
            value={filters.billNo}
            onChange={(e) => handleFilterChange("billNo", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                No
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Bill No
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Bill Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Customer Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                GST No
              </th>
              <th
                colSpan={3}
                className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
              >
                GST / SGST (5%)
              </th>
              <th
                colSpan={3}
                className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
              >
                GST / SGST (12%)
              </th>
              <th
                colSpan={3}
                className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                GST / SGST (18%)
              </th>
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th colSpan={5} className="border-r border-gray-200"></th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                S Amt
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Tax
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Total
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                S Amt
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Tax
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Total
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                S Amt
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Tax
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.map((row, index) => (
              <tr
                key={row.no}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-2 text-sm text-gray-500 border-r border-gray-200">
                  {row.no}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                  {row.billNo}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 border-r border-gray-200">
                  {row.billDate}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">
                  {row.customerName}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 border-r border-gray-200">
                  {row.gstNo}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-green-50">
                  {row.gst5.sAmt}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-green-50">
                  {row.gst5.tax}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-green-100 font-medium">
                  {row.gst5.sAmt + row.gst5.tax}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-blue-50">
                  {row.gst12.sAmt}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-blue-50">
                  {row.gst12.tax}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-blue-100 font-medium">
                  {row.gst12.sAmt + row.gst12.tax}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-orange-50">
                  {row.gst18.sAmt}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 border-r border-gray-200 bg-orange-50">
                  {row.gst18.tax}
                </td>
                <td className="px-3 py-2 text-sm  text-left text-gray-900 bg-orange-100 font-medium">
                  {row.gst18.sAmt + row.gst18.tax}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex justify-end">
        {" "}
        <div className="max-w-md">
          <div className="mt-8 flex justify-end">
            <div className="max-w-md w-full p-4 border border-gray-200 rounded-md bg-white">
               
              <div className="flex justify-between py-1 border-b border-gray-300 bg-blue-100 px-2 rounded-t-md">
                <span className="text-sm font-medium text-gray-700 w-1/4">
                  Tax Rate
                </span>
                <span className="text-sm font-medium text-gray-700 w-1/4 text-right">
                  Taxable Amount
                </span>
                <span className="text-sm font-medium text-gray-700 w-1/4 text-right">
                  Tax Amount
                </span>
                <span className="text-sm font-medium text-gray-700 w-1/4 text-right">
                  Total Amount
                </span>
              </div>

              {/* 5% Tax Row */}
              <div className="flex justify-between py-1 border-b border-gray-300 px-2">
                <span className="text-sm text-gray-700 w-1/4">5%</span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst5.taxableAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst5.taxAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst5.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* 12% Tax Row */}
              <div className="flex justify-between py-1 border-b border-gray-300 px-2">
                <span className="text-sm text-gray-700 w-1/4">12%</span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst12.taxableAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst12.taxAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst12.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* 18% Tax Row */}
              <div className="flex justify-between py-1 border-b border-gray-300 px-2">
                <span className="text-sm text-gray-700 w-1/4">18%</span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst18.taxableAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst18.taxAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 font-medium w-1/4 text-right">
                  ₹{summaryData.gst18.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between py-1 bg-gray-100 font-semibold px-2 rounded-b-md">
                <span className="text-sm text-gray-700 w-1/4">Total</span>
                <span className="text-sm text-gray-900 w-1/4 text-right">
                  ₹{summaryData.total.taxableAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 w-1/4 text-right">
                  ₹{summaryData.total.taxAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-900 w-1/4 text-right">
                  ₹{summaryData.total.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GstReport;
