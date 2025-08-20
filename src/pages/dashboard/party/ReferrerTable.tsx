import React, { useState, useEffect } from 'react';
import { Referrer } from '../../../types/party';
import { useReferrers } from '../../../hooks/useReferrers';
import Pagination from '../../../components/ui/Pagination';

interface ReferrerTableProps {
  onEditReferrer: (referrer: Referrer) => void;
  searchTerm: string;
}

const ReferrerTable: React.FC<ReferrerTableProps> = ({ onEditReferrer, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  const {
    referrers,
    loading,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    fetchReferrers
  } = useReferrers({
    initialPage: 1,
    initialLimit: 10,
    initialSearch: localSearchTerm
  });

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
    fetchReferrers();
  }, [searchTerm, fetchReferrers]);

  return (
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
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrers.map((referrer) => (
                <tr key={referrer.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{referrer.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{referrer.referrerName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{referrer.phoneNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{referrer.gstNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{referrer.address}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onEditReferrer(referrer)} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {pagination.pages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
                itemsPerPage={pagination.limit}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={pagination.total}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReferrerTable;