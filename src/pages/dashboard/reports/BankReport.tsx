import React from "react";
import { Search } from "lucide-react";

interface BankData {
  no: string;
  date: string;
  particular: string;
  debit: string;
  credit: string;
  balance: string;
}

interface BankReportProps {
  bankReportData: BankData[];
}

const BankReport: React.FC<BankReportProps> = ({ bankReportData }) => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h3 className="text-lg font-semibold mb-4">Bank Report</h3>
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
            <Search size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Particular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bankReportData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.particular}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-left text-gray-900">
                    {item.debit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-left text-gray-900">
                    {item.credit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-left text-gray-900">
                    {item.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BankReport;
