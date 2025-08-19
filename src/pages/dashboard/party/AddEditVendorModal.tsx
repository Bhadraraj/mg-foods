import React, { useState, useEffect } from 'react';
import { AddEditVendorFormData, Vendor }from '../../../components/types/'; // Adjust path

interface AddEditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddEditVendorFormData) => void;
  editingVendor?: Vendor | null;
}

const AddEditVendorModal: React.FC<AddEditVendorModalProps> = ({ isOpen, onClose, onSubmit, editingVendor }) => {
  const [formData, setFormData] = useState<AddEditVendorFormData>({
    vendorName: '', vendorCode: '', gst: '', address: '', mobileNumber: '', location: '',
    accountName: '', accountBankName: '', branchName: '', accountNumber: '', ifscCode: '', upiId: ''
  });

  useEffect(() => {
    if (editingVendor) {
      setFormData({
        vendorName: editingVendor.vendorNameCode,
        vendorCode: '', 
        gst: editingVendor.gstNo,
        address: editingVendor.address,
        mobileNumber: editingVendor.phoneNumber,
        location: '',
        accountName: editingVendor.account.split(',')[0]?.trim() || '',
        accountBankName: editingVendor.account.split(',')[1]?.trim() || '',
        branchName: '',
        accountNumber: editingVendor.account.split(',')[2]?.trim() || '',
        ifscCode: editingVendor.account.split(',')[3]?.trim() || '',
        upiId: '',
      });
    } else {
      setFormData({
        vendorName: '', vendorCode: '', gst: '', address: '', mobileNumber: '', location: '',
        accountName: '', accountBankName: '', branchName: '', accountNumber: '', ifscCode: '', upiId: ''
      });
    }
  }, [isOpen, editingVendor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{editingVendor ? "Edit Vendor" : "Add Vendor"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Vendor Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Vendor Name</label>
              <input type="text" id="vendorName" name="vendorName" value={formData.vendorName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Name" required />
            </div>
            <div>
              <label htmlFor="vendorCode" className="block text-sm font-medium text-gray-700">Vendor Code</label>
              <input type="text" id="vendorCode" name="vendorCode" value={formData.vendorCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Code" />
            </div>
            <div>
              <label htmlFor="gst" className="block text-sm font-medium text-gray-700">GST</label>
              <input type="text" id="gst" name="gst" value={formData.gst} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter GST" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={1} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder=""></textarea>
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
              <input type="text" id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
            <div>
              <label htmlFor="accountBankName" className="block text-sm font-medium text-gray-700">Account Bank Name</label>
              <input type="text" id="accountBankName" name="accountBankName" value={formData.accountBankName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
            <div>
              <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">Branch Name</label>
              <input type="text" id="branchName" name="branchName" value={formData.branchName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
              <input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
            <div>
              <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">Account IFSC Code</label>
              <input type="text" id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
            </div>
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input type="text" id="upiId" name="upiId" value={formData.upiId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" />
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
              {editingVendor ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditVendorModal;