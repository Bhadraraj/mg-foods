import React, { useState, useEffect, useMemo } from 'react';
import { Customer } from '../../../types/party';
import { useCustomers } from '../../../hooks/useCustomers';
import { transformCustomerData } from '../../../utils/dataTransformers';
import Pagination from '../../../components/ui/Pagination';

interface CustomerTableProps {
  onEditCustomer: (customer: Customer) => void;
  searchTerm: string; 
}

const CustomerTable: React.FC<CustomerTableProps> = ({ onEditCustomer, searchTerm }) => {
  // Debounce search term to prevent excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    customers,
    loading,
    error,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
  } = useCustomers({
    search: debouncedSearch,
    autoFetch: true
  });

  // Memoize transformed data to prevent unnecessary recalculations
  const transformedCustomers = useMemo(() => {
    return transformCustomerData(customers);
  }, [customers]);

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
          <>
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
                {transformedCustomers.length > 0 ? (
                  transformedCustomers.map((customer, index) => (
                    <tr key={customer.id || customer._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {((pagination?.page || 1) - 1) * (pagination?.limit || 20) + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {customer.mobileNumber || customer.phoneNumber || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {customer.gstNumber || customer.gstNo || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ₹{(customer.creditLimitAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {customer.creditLimitDays || '-'} days
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {customer.address || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => onEditCustomer(customer)} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      {debouncedSearch ? 'No customers found matching your search.' : 'No customers found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
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