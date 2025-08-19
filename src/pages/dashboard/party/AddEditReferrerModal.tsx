import React, { useState, useEffect } from 'react';
import { AddEditReferrerFormData, Referrer } from '../../../components/types/'; // Adjust path

interface AddEditReferrerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddEditReferrerFormData) => void;
  editingReferrer?: Referrer | null;
}

const AddEditReferrerModal: React.FC<AddEditReferrerModalProps> = ({ isOpen, onClose, onSubmit, editingReferrer }) => {
  const [formData, setFormData] = useState<AddEditReferrerFormData>({
    referrerName: '', mobileNumber: '', address: ''
  });

  useEffect(() => {
    if (editingReferrer) {
      setFormData({
        referrerName: editingReferrer.referrerName,
        mobileNumber: editingReferrer.phoneNumber,
        address: editingReferrer.address,
      });
    } else {
      setFormData({ referrerName: '', mobileNumber: '', address: '' });
    }
  }, [isOpen, editingReferrer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{editingReferrer ? "Edit Referrer" : "Add Referrer"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Referrer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="referrerName" className="block text-sm font-medium text-gray-700">Referrer Name</label>
              <input type="text" id="referrerName" name="referrerName" value={formData.referrerName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter Name" required />
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="" required />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder=""></textarea>
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
              {editingReferrer ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditReferrerModal;