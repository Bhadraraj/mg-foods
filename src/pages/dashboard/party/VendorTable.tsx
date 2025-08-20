import React, { useState, useEffect } from 'react';
import { Vendor } from '../../../components/types/';
import { useVendors } from '../../../hooks/useVendors';
import Pagination from '../../../components/ui/Pagination';

interface VendorTableProps {
  onEditVendor: (vendor: Vendor) => void;
  searchTerm: string;
}

const VendorTable: React.FC<VendorTableProps> = ({ onEditVendor, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const {
    vendors,
    loading,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    fetchVendors
  } = useVendors({
    search: localSearchTerm,
    autoFetch: true
  });

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
    fetchVendors({ search: searchTerm });
  }, [searchTerm, fetchVendors]);

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
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name/Code</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST No</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Total</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Total</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vendors.map((vendor, index) => (
            <tr key={vendor.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.vendorNameCode}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.gstNo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.phoneNumber}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.address}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.purchaseTotal}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.paidTotal}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.balance}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{vendor.account}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEditVendor(vendor)} className="text-blue-600 hover:text-blue-900">
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

export default VendorTable;