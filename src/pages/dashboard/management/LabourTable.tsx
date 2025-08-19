import React from "react";
import { Labour } from "../../../components/types/index";

interface LabourTableProps {
  labours: Labour[];
  onEditLabour: (labour: Labour) => void;
}

const LabourTable: React.FC<LabourTableProps> = ({ labours, onEditLabour }) => {
 
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Salary</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labours.map((labour) => ( // Directly mapping over 'labours'
              <tr key={labour.no}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.no}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.mobile}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.address}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹ {labour.monthlySalary.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onEditLabour(labour)} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabourTable;