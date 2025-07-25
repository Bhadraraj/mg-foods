import React from 'react';
import { Labour } from '../../../components/types';

interface LabourTableProps {
  labours: Labour[];
  onEditLabour: (labour: Labour) => void;
  searchTerm: string;
}

const LabourTable: React.FC<LabourTableProps> = ({ labours, onEditLabour, searchTerm }) => {

  const filteredLabours = labours.filter(labour =>
    labour.labourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    labour.phoneNumber.includes(searchTerm) ||
    labour.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SI No.</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labour name</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Income</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLabours.map((labour, index) => (
            <tr key={labour.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.labourName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.phoneNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹ {labour.monthlyIncome.toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.address}</td>
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
  );
};

export default LabourTable;