import React from 'react';
import { Vendor } from '../../../components/types/';

interface VendorTableProps {
  vendors: Vendor[];
  onEditVendor: (vendor: Vendor) => void;
  searchTerm: string;
}

const VendorTable: React.FC<VendorTableProps> = ({ vendors, onEditVendor, searchTerm }) => {

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendorNameCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.gstNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.phoneNumber.includes(searchTerm) ||
    vendor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
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
          {filteredVendors.map((vendor, index) => (
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
    </div>
  );
};

export default VendorTable;