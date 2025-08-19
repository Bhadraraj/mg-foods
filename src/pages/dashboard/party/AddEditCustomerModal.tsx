import React, { useState, useEffect } from 'react';
import { AddEditCustomerFormData, Customer } from '../../../components/types/';

interface AddEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddEditCustomerFormData) => void;
  editingCustomer?: Customer | null;
}

const AddEditCustomerModal: React.FC<AddEditCustomerModalProps> = ({ isOpen, onClose, onSubmit, editingCustomer }) => {
  const [formData, setFormData] = useState<AddEditCustomerFormData>({
    customerName: '',
    mobileNumber: '',
    gstNumber: '',
    location: '',
    creditAmount: 0,
    rateType: '',
    creditLimitAmount: 0,
    creditLimitDays: 0,
    address: '',
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        customerName: editingCustomer.customerName,
        mobileNumber: editingCustomer.phoneNumber,
        gstNumber: editingCustomer.gstNumber,
        location: '',
        creditAmount: 0,
        rateType: '', 
        creditLimitAmount: editingCustomer.payLimit,
        creditLimitDays: editingCustomer.payLimitDays, 
        address: editingCustomer.address,
      });
    } else {
      setFormData({
        customerName: '', mobileNumber: '', gstNumber: '', location: '',
        creditAmount: 0, rateType: '', creditLimitAmount: 0, creditLimitDays: 0, address: ''
      });
    }
  }, [isOpen, editingCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Name" required />
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Mobile" required />
            </div>
            <div>
              <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">GST Number</label>
              <input type="text" id="gstNumber" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter GST" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Location" />
            </div>
            <div>
              <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700">Credit Amount</label>
              <input type="number" id="creditAmount" name="creditAmount" value={formData.creditAmount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0" />
            </div>
            <div>
              <label htmlFor="rateType" className="block text-sm font-medium text-gray-700">Rate Type</label>
              <select id="rateType" name="rateType" value={formData.rateType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Select Rate Type</option>
                <option value="Quotation sole">Quotation sole</option>
              </select>
            </div>
            <div>
              <label htmlFor="creditLimitAmount" className="block text-sm font-medium text-gray-700">Credit Limit Amount</label>
              <input type="number" id="creditLimitAmount" name="creditLimitAmount" value={formData.creditLimitAmount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0" />
            </div>
            <div>
              <label htmlFor="creditLimitDays" className="block text-sm font-medium text-gray-700">Credit Limit Days</label>
              <input type="number" id="creditLimitDays" name="creditLimitDays" value={formData.creditLimitDays} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Address"></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingCustomer ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCustomerModal;