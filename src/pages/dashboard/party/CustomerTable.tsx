import React, { useState, useEffect } from 'react';
import { Customer } from '../../../types/party';
import { useCustomers } from '../../../hooks/useCustomers';
import { transformCustomerData } from '../../../utils/dataTransformers';
import Pagination from '../../../components/ui/Pagination';

interface CustomerTableProps {
  onEditCustomer: (customer: Customer) => void;
  searchTerm: string; 
}

const CustomerTable: React.FC<CustomerTableProps> = ({ onEditCustomer, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const {
    customers,
    loading,
    error,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    fetchCustomers
  } = useCustomers({
    search: localSearchTerm,
    autoFetch: true
  });

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
    if (searchTerm !== localSearchTerm) {
      fetchCustomers({ search: searchTerm });
    }
  }, [searchTerm, fetchCustomers]);

  // Transform the customer data to match the expected format
  const transformedCustomers = transformCustomerData(customers);

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-center text-red-500 py-8">
          Error loading customers: {error.message}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SI No.</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Limit</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Limit days</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transformedCustomers.map((customer, index) => (
            <tr key={customer.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.customerName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.phoneNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.gstNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.payLimit}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.payLimitDays}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.address}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEditCustomer(customer)} className="text-blue-600 hover:text-blue-900">
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
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerTable;