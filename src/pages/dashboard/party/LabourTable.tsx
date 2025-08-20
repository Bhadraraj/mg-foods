import React, { useState, useEffect } from 'react';
import { Labour } from '../../../components/types';
import { useLabour } from '../../../hooks/useLabour';
import Pagination from '../../../components/ui/Pagination';

interface LabourTableProps {
  onEditLabour: (labour: Labour) => void;
  searchTerm: string;
}

const LabourTable: React.FC<LabourTableProps> = ({ onEditLabour, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  const { 
    labour: labours, 
    loading, 
    pagination, 
    handlePageChange, 
    handleItemsPerPageChange 
  } = useLabour({
    search: localSearchTerm,
    page: 1,
    limit: 10
  });
  
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
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
              {labours.map((labour) => (
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
        )}
      </div>
      {pagination.pages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}  
    </div>
  );
};

export default LabourTable;