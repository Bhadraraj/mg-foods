import React, { useState, useEffect } from 'react';
import { Labour } from '../../../components/types/';

interface AddEditLabourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Labour) => void;
  editingLabour?: Labour | null;
}

const AddEditLabourModal: React.FC<AddEditLabourModalProps> = ({ isOpen, onClose, onSubmit, editingLabour }) => {
  const [formData, setFormData] = useState<Labour>({
      id: '', labourName: '', phoneNumber: '', monthlyIncome: 0, address: '',
      name: ''
  });

  useEffect(() => {
    if (editingLabour) {
      setFormData(editingLabour);
    } else {
      setFormData({ id: '', labourName: '', phoneNumber: '', monthlyIncome: 0, address: '' });
    }
  }, [isOpen, editingLabour]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{editingLabour ? "Edit Labour" : "Add Labour"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Labour Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="labourName" className="block text-sm font-medium text-gray-700">Labour Name</label>
              <input type="text" id="labourName" name="labourName" value={formData.labourName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">Monthly Income</label>
              <input type="number" id="monthlyIncome" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
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
              {editingLabour ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditLabourModal;