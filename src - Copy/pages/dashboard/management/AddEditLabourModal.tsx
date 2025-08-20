import React, { useState, useEffect } from "react";
import { AddLabourFormData, Labour } from "../../../types/index";

interface AddEditLabourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddLabourFormData) => void;
  editingLabour?: Labour | null;
}

const AddEditLabourModal: React.FC<AddEditLabourModalProps> = ({ isOpen, onClose, onSubmit, editingLabour }) => {
  const [formData, setFormData] = useState<AddLabourFormData>({
    name: "",
    mobile: "",
    address: "",
    monthlySalary: 0,
  });

  useEffect(() => { 
    const initialFormData = editingLabour
      ? {
          name: editingLabour.name ?? "",
          mobile: editingLabour.mobile ?? "",
          address: editingLabour.address ?? "",
          monthlySalary: editingLabour.monthlySalary ?? 0,
        }
      : {
          name: "",
          mobile: "",
          address: "",
          monthlySalary: 0,
        };
    setFormData(initialFormData);
  }, [editingLabour]) 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{editingLabour ? "Edit Labour" : "Add New Labour"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Mobile"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="monthlySalary" className="block text-gray-700 font-medium mb-2">
              Monthly Salary
            </label>
            <input
              type="number"
              id="monthlySalary"
              name="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Monthly Salary"
              required
            />
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
