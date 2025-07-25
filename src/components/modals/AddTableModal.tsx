// src/components/modals/AddTableModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTable: (tableName: string) => void;
}

const AddTableModal: React.FC<AddTableModalProps> = ({
  isOpen,
  onClose,
  onAddTable,
}) => {
  const [tableName, setTableName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableName.trim() === "") {
      setError("Table name cannot be empty.");
      return;
    }
    setError("");
    onAddTable(tableName.trim());
    setTableName(""); // Clear input after adding
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Add New Table</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tableName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Table Name
            </label>
            <input
              type="text"
              id="tableName"
              value={tableName}
              onChange={(e) => {
                setTableName(e.target.value);
                if (error) setError(""); // Clear error on typing
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Table G, Counter 1"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Add Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTableModal;
