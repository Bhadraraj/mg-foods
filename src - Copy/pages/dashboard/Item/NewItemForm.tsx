import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "./ImageUpload";
import BasicDetails from "./BasicDetails";
import StockDetails from "./StockDetails";
import PriceDetails from "./PriceDetails";
import CodeDetails from "./CodeDetails";

// The data structure for the form
interface FormData {
  itemName: string;
  category: string;
  subCategory: string;
  brandName: string;
  status: string;
  vendorName: string;
  vendorContact: string;
  unit: string;
  currentQuantity: string;
  minimumStock: string;
  maximumStock: string;
  manufacturingDate: string;
  expirationDate: string;
  sellingPrice: string;
  purchasePrice: string;
  mrp: string;
  onlineDeliveryPrice: string;
  onlineSellingPrice: string;
  acSellingPrice: string;
  nonAcSellingPrice: string;
  taxPercentage: string;
  actualCost: string;
  discount: string;
  swiggy: string;
  zomato: string;
  diningPrice: string;
  barcode01: string;
  barcode02: string;
  barcode03: string;
  qrCode: string;
}

// Props interface defining the functions passed from the parent component
interface NewItemFormProps {
  onBack: () => void;
  onNavigateToVariants: () => void;
}

const NewItemForm: React.FC<NewItemFormProps> = ({
  onBack,
  onNavigateToVariants,
}) => {
  // State for managing form data and UI elements within the form
  const [isProduct, setIsProduct] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    category: "",
    subCategory: "",
    brandName: "",
    status: "",
    vendorName: "",
    vendorContact: "",
    unit: "",
    currentQuantity: "",
    minimumStock: "",
    maximumStock: "",
    manufacturingDate: "",
    expirationDate: "",
    sellingPrice: "",
    purchasePrice: "",
    mrp: "",
    onlineDeliveryPrice: "",
    onlineSellingPrice: "",
    acSellingPrice: "",
    nonAcSellingPrice: "",
    taxPercentage: "",
    actualCost: "",
    discount: "",
    swiggy: "",
    zomato: "",
    diningPrice: "",
    barcode01: "",
    barcode02: "",
    barcode03: "",
    qrCode: "",
  });
  const [manufacturingDate, setManufacturingDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // Updates the form state when an input field changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generates a unique barcode or QR code
  const generateBarcode = (type: string) => {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const generatedCode = `${type}${timestamp.slice(-6)}${randomSuffix}`;

    if (type === "QR") {
      handleInputChange("qrCode", generatedCode);
    } else {
      handleInputChange(
        `barcode${type.padStart(2, "0")}` as keyof FormData,
        generatedCode
      );
    }
  };

  // Handles image selection and creates a preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggles between "Product" and "Service" type
  const handleToggleChange = (type: "product" | "service") => {
    setIsProduct(type === "product");
  };

  // Handles saving the item and navigates back to the item list
  const handleSaveItem = () => {
    console.log("Saving item:", {
      ...formData,
      manufacturingDate: manufacturingDate?.toISOString() || "",
      expirationDate: expirationDate?.toISOString() || "",
      image: image ? image.name : null,
    });
    onBack(); // Use the onBack prop to return to the list view
  };

  return (
    <div className="bg-white min-h-screen">
      {/*
        Sticky Header:
        - `sticky`: Makes the element stick to the viewport.
        - `top-0`: Sticks it to the very top (0 pixels from the top).
        - `z-10`: Ensures it stays on top of other content as you scroll.
      */}
      <div className="bg-blue-700 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white hover:bg-blue-600 p-2 rounded"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">New Item</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onNavigateToVariants}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
            >
              Add Variants
            </button>
            <button
              onClick={handleSaveItem}
              className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded font-medium"
            >
              Save Item
            </button>
          </div>
        </div>
      </div>

      {/*
        Main Content Area:
        - `p-6 max-w-7xl mx-auto`: Existing padding and centering.
        - `pt-[64px]`: This is CRUCIAL. It adds padding to the top of the content
                       area, equal to the height of your sticky header. This
                       creates space so that content doesn't scroll *under*
                       the header.
                       **REMEMBER TO REPLACE `64px` with the ACTUAL COMPUTED
                       HEIGHT of your blue header (use browser dev tools to find this).**
      */}
      <div className="p-6 max-w-7xl mx-auto pt-[64px]">
        {/* All form content is rendered via child components */}
        <ImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
        />
        <BasicDetails
          isProduct={isProduct}
          formData={formData}
          handleInputChange={handleInputChange}
          handleToggleChange={handleToggleChange}
        />
        <StockDetails
          isProduct={isProduct}
          formData={formData}
          handleInputChange={handleInputChange}
          manufacturingDate={manufacturingDate}
          setManufacturingDate={setManufacturingDate}
          expirationDate={expirationDate}
          setExpirationDate={setExpirationDate}
        />
        <PriceDetails
          isProduct={isProduct}
          formData={formData}
          handleInputChange={handleInputChange}
        />
        {isProduct && (
          <CodeDetails
            formData={formData}
            handleInputChange={handleInputChange}
            generateBarcode={generateBarcode}
          />
        )}
      </div>
    </div>
  );
};

export default NewItemForm;