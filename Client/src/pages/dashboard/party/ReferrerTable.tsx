import React from 'react';
import { Referrer } from '../../../components/types/';

interface ReferrerTableProps {
  referrers: Referrer[];
  onEditReferrer: (referrer: Referrer) => void;
  searchTerm: string;
}

const ReferrerTable: React.FC<ReferrerTableProps> = ({ referrers, onEditReferrer, searchTerm }) => {

  const filteredReferrers = referrers.filter(referrer =>
    referrer.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referrer.phoneNumber.includes(searchTerm) ||
    (referrer.gstNumber && referrer.gstNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    referrer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
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
          {filteredReferrers.map((referrer, index) => (
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
    </div>
  );
};

export default ReferrerTable;