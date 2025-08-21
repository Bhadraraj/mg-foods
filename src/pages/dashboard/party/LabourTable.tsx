import React, { useState, useEffect } from 'react';
import { Labour } from '../../../types/party';
import { useLabour } from '../../../hooks/useLabour';
import { transformLabourData } from '../../../utils/dataTransformers';
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
    error,
    pagination, 
    handlePageChange, 
    handleItemsPerPageChange 
  } = useLabour({
    search: localSearchTerm,
    autoFetch: true
  });
  
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Transform the labour data to match the expected format
  const transformedLabours = transformLabourData(labours);

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-center text-red-500 py-8">
          Error loading labour records: {error.message}
        </div>
      </div>
    );
  }
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
              {transformedLabours.map((labour, index) => (
            <tr key={labour.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.name || labour.labourName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{labour.mobileNumber || labour.phoneNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹ {(labour.monthlySalary || labour.monthlyIncome || 0).toLocaleString()}</td>
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
      {pagination && pagination.pages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
          />
        </div>
      )}  
    </div>
  );
};

export default LabourTable;