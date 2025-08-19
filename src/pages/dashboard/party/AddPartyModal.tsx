import React, { useState, useEffect } from 'react';
import { AddPartyFormData, Party } from '../../../components/types/';

interface AddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: AddPartyFormData) => void;
}

const AddPartyModal: React.FC<AddPartyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<AddPartyFormData>({
    partyName: '', partyType: 'Customer', mobileNumber: '', email: '',
    openingBalance: 0, gstType: '', gstin: '', state: '', address: '',
    accountName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Add Party</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Party Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="partyName" className="block text-sm font-medium text-gray-700">Party Name</label>
              <input type="text" id="partyName" name="partyName" value={formData.partyName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label htmlFor="partyType" className="block text-sm font-medium text-gray-700">Party Type</label>
              <select id="partyType" name="partyType" value={formData.partyType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                <option value="Customer">Customer</option>
                <option value="Supplier">Supplier</option>
              </select>
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="openingBalance" className="block text-sm font-medium text-gray-700">Opening Balance</label>
              <input type="number" id="openingBalance" name="openingBalance" value={formData.openingBalance} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="gstType" className="block text-sm font-medium text-gray-700">GST Type</label>
              <input type="text" id="gstType" name="gstType" value={formData.gstType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">GSTIN</label>
              <input type="text" id="gstin" name="gstin" value={formData.gstin} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
              <input type="text" id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input type="text" id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
              <input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input type="text" id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input type="text" id="upiId" name="upiId" value={formData.upiId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartyModal;