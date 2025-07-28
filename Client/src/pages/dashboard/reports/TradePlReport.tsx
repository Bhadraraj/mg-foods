import React from "react";

interface TradePlData {
  particular: string;
  amount: string;
}

interface TradePlReportProps {
  tradePLData: TradePlData[];
}

const TradePlReport: React.FC<TradePlReportProps> = ({ tradePLData }) => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="  overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">
            Trade & Profit & Loss Account
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Particular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tradePLData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.particular}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-left text-gray-900">
                    {item.amount}
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

export default TradePlReport;
