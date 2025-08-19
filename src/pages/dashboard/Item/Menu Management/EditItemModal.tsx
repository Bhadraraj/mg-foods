// src/components/EditItemModal.tsx
import React, { useState } from "react";
import { X, ChevronLeft, Search } from "lucide-react";
import AddVariantModal from "./AddVariantModal";
import ViewEditImageModal from "./ViewEditImageModal"; // Import the new modal

interface VariantDetail {
  name: string;
  posPrice: string;
  dineInPrice: string;
  deliveryPrice: string;
  zomatoPrice: string;
  swiggyPrice: string;
  appPrice: string;
  imageUrl?: string; // Add imageUrl for the variant
}

interface EditItemModalProps {
  onClose: () => void;
  item: {
    id: string;
    name: string;
    hsnCode: string;
    // Potentially add more item details if needed for the edit screen
  };
  variantsData: VariantDetail[]; // This will now be the initial variants
}

const EditItemModal: React.FC<EditItemModalProps> = ({ onClose, item, variantsData: initialVariantsData }) => {
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState<boolean>(false);
  const [isViewEditImageModalOpen, setIsViewEditImageModalOpen] = useState<boolean>(false);
  const [currentVariantForImage, setCurrentVariantForImage] = useState<VariantDetail | null>(null);

  const [variants, setVariants] = useState<VariantDetail[]>(initialVariantsData);

  const handleAddVariantClick = () => {
    setIsAddVariantModalOpen(true);
  };

  const handleCloseAddVariantModal = () => {
    setIsAddVariantModalOpen(false);
  };

  const handleSaveNewVariant = (variantName: string, imageUrl: string | null) => {
    const newVariant: VariantDetail = {
      name: variantName,
      posPrice: "0.00", // Default values for new variant
      dineInPrice: "0.00",
      deliveryPrice: "0.00",
      zomatoPrice: "0.00",
      swiggyPrice: "0.00",
      appPrice: "0.00",
      imageUrl: imageUrl || undefined, // Use provided image URL or undefined
    };
    setVariants((prevVariants) => [...prevVariants, newVariant]);
    // In a real application, you would also send this new variant to your backend API
    console.log("New variant added:", newVariant);
  };

  const handleViewImageClick = (variant: VariantDetail) => {
    setCurrentVariantForImage(variant);
    setIsViewEditImageModalOpen(true);
  };

  const handleCloseViewEditImageModal = () => {
    setIsViewEditImageModalOpen(false);
    setCurrentVariantForImage(null);
  };

  const handleSaveVariantImage = (newImageUrl: string | null) => {
    if (currentVariantForImage) {
      setVariants((prevVariants) =>
        prevVariants.map((v) =>
          v.name === currentVariantForImage.name // Assuming variant names are unique for simplicity
            ? { ...v, imageUrl: newImageUrl || undefined }
            : v
        )
      );
      // In a real app, send this update to your backend
      console.log(`Image for variant ${currentVariantForImage.name} updated to:`, newImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-full w-[95%] h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold">
              {item.name} - {item.hsnCode}
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, item code"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm">
              Save Changes
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area - Variants Table */}
        <div className="flex-grow overflow-y-auto p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={handleAddVariantClick}
                      className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-lg leading-none"
                      title="Add New Variant"
                    >
                      +
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  POS Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dine In Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Delivery Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Zomato Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Swiggy Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  App Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Images
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.map((variant, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" defaultChecked />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {variant.imageUrl ? (
                        <img src={variant.imageUrl} alt={variant.name} className="h-8 w-8 object-cover rounded" />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          No Img
                        </div>
                      )}
                      {variant.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={variant.posPrice} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={variant.dineInPrice} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={variant.deliveryPrice} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={variant.zomatoPrice} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={variant.swiggyPrice} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={variant.appPrice} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-right" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-700 hover:text-blue-800"
                      onClick={() => handleViewImageClick(variant)} // Add click handler here
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {variants.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No variants available for this item. Click '+' to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the AddVariantModal conditionally */}
      {isAddVariantModalOpen && (
        <AddVariantModal
          onClose={handleCloseAddVariantModal}
          onSave={handleSaveNewVariant}
        />
      )}

      {/* Render the ViewEditImageModal conditionally */}
      {isViewEditImageModalOpen && currentVariantForImage && (
        <ViewEditImageModal
          onClose={handleCloseViewEditImageModal}
          variantName={currentVariantForImage.name}
          currentImageUrl={currentVariantForImage.imageUrl}
          onSave={handleSaveVariantImage}
        />
      )}
    </div>
  );
};

export default EditItemModal;