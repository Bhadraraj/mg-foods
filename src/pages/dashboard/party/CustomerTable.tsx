import React from 'react';
import { Customer } from '../../../components/types/';

interface CustomerTableProps {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
  searchTerm: string; 
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onEditCustomer, searchTerm }) => {

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm) ||
    customer.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
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
          {filteredCustomers.map((customer, index) => (
            <tr key={customer.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.id}</td>
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
    </div>
  );
};

export default CustomerTable;