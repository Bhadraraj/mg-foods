import React from "react";

interface TrialBalanceData {
  particular: string;
  debit: string;
  credit: string;
}

interface TrialBalanceReportProps {
  trialBalanceData: TrialBalanceData[];
}

const TrialBalanceReport: React.FC<TrialBalanceReportProps> = ({
  trialBalanceData,
}) => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className=" mb-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Trial Balance Report</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Particular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trialBalanceData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.particular}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-left text-gray-900">
                    {item.debit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-left text-gray-900">
                    {item.credit}
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

export default TrialBalanceReport;
