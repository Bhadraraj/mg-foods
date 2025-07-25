import React, { useState } from "react";
import { X, Plus, ArrowLeft } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  posPrice: string;
  dineInPrice: string;
  deliveryPrice: string;
  zomatoPrice: string;
  swiggyPrice: string;
  appPrice: string;
  image?: string;
}
 
interface AddVariantsProps {
  onBack: () => void;
}

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVariant: (variant: Variant) => void;
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantName: string;
  onAddImage: (image: string) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  variantName,
  onAddImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (selectedImage) {
      onAddImage(selectedImage);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select / Upload image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-600">Variant</span>
          <span className="ml-2 font-medium">{variantName}</span>
        </div>

        <div className="mb-6">
          {selectedImage ? (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected variant"
                className="w-32 h-32 object-cover rounded border"
              />
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <button
          onClick={() =>
            document.getElementById("variant-image-input")?.click()
          }
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6 flex items-center gap-2"
        >
          <Plus size={16} />
          Add new image
        </button>

        <input
          id="variant-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const AddVariantModal: React.FC<AddVariantModalProps> = ({
  isOpen,
  onClose,
  onAddVariant,
}) => {
  const [variantName, setVariantName] = useState("");
  const [variantImage, setVariantImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleAdd = () => {
    if (variantName.trim()) {
      const newVariant: Variant = {
        id: Date.now().toString(),
        name: variantName,
        posPrice: "",
        dineInPrice: "",
        deliveryPrice: "",
        zomatoPrice: "",
        swiggyPrice: "",
        appPrice: "",
        image: variantImage || undefined,
      };
      onAddVariant(newVariant);
      setVariantName("");
      setVariantImage(null);
      onClose();
    }
  };

  const handleAddImage = (image: string) => {
    setVariantImage(image);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add new Variant</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Variant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter variant name"
            />
          </div>

          <button
            onClick={() => setShowImageModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-6 flex items-center gap-2"
          >
            <Plus size={16} />
            Add new image
          </button>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!variantName.trim()}
              className="bg-black text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        variantName={variantName}
        onAddImage={handleAddImage}
      />
    </>
  );
};

interface VariantsTableProps {
  variants: Variant[];
  onUpdateVariant: (id: string, field: keyof Variant, value: string) => void;
  onDeleteVariant: (id: string) => void;
  onViewImage: (variant: Variant) => void;
}

const VariantsTable: React.FC<VariantsTableProps> = ({
  variants,
  onUpdateVariant,
  onDeleteVariant,
  onViewImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variants
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                POS Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dine In Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zomato Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Swiggy Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                App Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {variant.name}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.posPrice}
                    onChange={(e) =>
                      onUpdateVariant(variant.id, "posPrice", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.dineInPrice}
                    onChange={(e) =>
                      onUpdateVariant(
                        variant.id,
                        "dineInPrice",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.deliveryPrice}
                    onChange={(e) =>
                      onUpdateVariant(
                        variant.id,
                        "deliveryPrice",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.zomatoPrice}
                    onChange={(e) =>
                      onUpdateVariant(
                        variant.id,
                        "zomatoPrice",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.swiggyPrice}
                    onChange={(e) =>
                      onUpdateVariant(
                        variant.id,
                        "swiggyPrice",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={variant.appPrice}
                    onChange={(e) =>
                      onUpdateVariant(variant.id, "appPrice", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onViewImage(variant)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddVariants: React.FC<AddVariantsProps> = ({ onBack }) => {
  const [variants, setVariants] = useState<Variant[]>([
    { id: "1", name: "Without", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "2", name: "Half Tea", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "3", name: "Strong", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "4", name: "Double Strong", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "5", name: "Light Tea", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "6", name: "Half sugar", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "7", name: "Double Sugar", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "8", name: "King's Golden", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "9", name: "Queen's Velvet", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "10", name: "Family Pack", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
    { id: "11", name: "Homely Pack", posPrice: "", dineInPrice: "", deliveryPrice: "", zomatoPrice: "", swiggyPrice: "", appPrice: "" },
  ]);

  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const handleAddVariant = (newVariant: Variant) => {
    setVariants([...variants, newVariant]);
  };

  const handleUpdateVariant = (
    id: string,
    field: keyof Variant,
    value: string
  ) => {
    setVariants(
      variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const handleViewImage = (variant: Variant) => {
    setSelectedVariant(variant);
    setShowImageModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={onBack}
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Variants
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                Save Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowAddVariantModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Variant
          </button>
        </div>

        <VariantsTable
          variants={variants}
          onUpdateVariant={handleUpdateVariant}
          onDeleteVariant={handleDeleteVariant}
          onViewImage={handleViewImage}
        />

        <AddVariantModal
          isOpen={showAddVariantModal}
          onClose={() => setShowAddVariantModal(false)}
          onAddVariant={handleAddVariant}
        />

        {selectedVariant && (
          <ImageUploadModal
            isOpen={showImageModal}
            onClose={() => {
              setShowImageModal(false);
              setSelectedVariant(null);
            }}
            variantName={selectedVariant.name}
            onAddImage={(image) => {
              handleUpdateVariant(selectedVariant.id, "image", image);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddVariants;