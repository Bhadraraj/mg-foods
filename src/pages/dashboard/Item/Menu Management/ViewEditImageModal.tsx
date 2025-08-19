// src/components/ViewEditImageModal.tsx
import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface ViewEditImageModalProps {
  onClose: () => void;
  variantName: string;
  currentImageUrl?: string;
  onSave: (newImageUrl: string | null) => void;
}

const ViewEditImageModal: React.FC<ViewEditImageModalProps> = ({
  onClose,
  variantName,
  currentImageUrl,
  onSave,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl || null);

  // Update imagePreview if currentImageUrl changes (e.g., when switching variants)
  useEffect(() => {
    setImagePreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSaveClick = () => {
    onSave(imagePreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">View / Edit image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Variant: {variantName}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="editVariantImageUpload"
              onChange={handleImageChange}
            />
            <label
              htmlFor="editVariantImageUpload"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 text-sm"
            >
              <Plus size={16} className="mr-2" /> Add new image
            </label>
          </div>

          <div className="flex justify-center items-center h-48 w-48 mx-auto border border-gray-300 rounded-lg overflow-hidden relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Variant Image" className="h-full w-full object-contain" />
            ) : (
              <div className="text-gray-500 text-sm">No image</div>
            )}
            {/* Blue circle indicator - purely visual, adjust as needed */}
            {imagePreview && (
              <div className="absolute bottom-2 right-2 h-4 w-4 bg-blue-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-6 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEditImageModal;