// import React, { useState } from "react";
// import { Search, ArrowLeft, Plus, ChevronDown, Calendar } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface MenuItem {
//   id: string;
//   name: string;
//   hsnCode: string;
//   itemCode: string;
//   sellPrice: string;
//   purchasePrice: string;
//   currentStock: number;
// }

// interface FormData {
//   itemName: string;
//   category: string;
//   subCategory: string;
//   brandName: string;
//   status: string;
//   vendorName: string;
//   vendorContact: string;
//   unit: string;
//   currentQuantity: string;
//   minimumStock: string;
//   maximumStock: string;
//   manufacturingDate: string;
//   expirationDate: string;
//   sellingPrice: string;
//   purchasePrice: string;
//   mrp: string;
//   onlineDeliveryPrice: string;
//   onlineSellingPrice: string;
//   acSellingPrice: string;
//   nonAcSellingPrice: string;
//   taxPercentage: string;
//   actualCost: string;
//   discount: string;
//   swiggy: string;
//   zomato: string;
//   diningPrice: string;
//   barcode01: string;
//   barcode02: string;
//   barcode03: string;
//   qrCode: string;
// }

// const Item: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"item" | "category">("item");
//   const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
//   const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState<boolean>(false);
//   const [isMenuManagementOpen, setIsMenuManagementOpen] = useState<boolean>(false);
//   const [showNewItemForm, setShowNewItemForm] = useState<boolean>(false);
//   const [isProduct, setIsProduct] = useState<boolean>(true);
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const [formData, setFormData] = useState<FormData>({
//     itemName: "",
//     category: "",
//     subCategory: "",
//     brandName: "",
//     status: "",
//     vendorName: "",
//     vendorContact: "",
//     unit: "",
//     currentQuantity: "",
//     minimumStock: "",
//     maximumStock: "",
//     manufacturingDate: "",
//     expirationDate: "",
//     sellingPrice: "",
//     purchasePrice: "",
//     mrp: "",
//     onlineDeliveryPrice: "",
//     onlineSellingPrice: "",
//     acSellingPrice: "",
//     nonAcSellingPrice: "",
//     taxPercentage: "",
//     actualCost: "",
//     discount: "",
//     swiggy: "",
//     zomato: "",
//     diningPrice: "",
//     barcode01: "",
//     barcode02: "",
//     barcode03: "",
//     qrCode: "",
//   });

//   const [manufacturingDate, setManufacturingDate] = useState<Date | null>(null);
//   const [expirationDate, setExpirationDate] = useState<Date | null>(null);

//   const menuItems: MenuItem[] = [
//     {
//       id: "01",
//       name: "5-Star",
//       hsnCode: "IGF908",
//       itemCode: "IGF908",
//       sellPrice: "₹0.00",
//       purchasePrice: "₹0.00",
//       currentStock: 97,
//     },
//   ];

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const generateBarcode = (type: string) => {
//     const timestamp = Date.now().toString();
//     const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
//     const generatedCode = `${type}${timestamp.slice(-6)}${randomSuffix}`;

//     if (type === "QR") {
//       handleInputChange("qrCode", generatedCode);
//     } else {
//       handleInputChange(`barcode${type.padStart(2, "0")}` as keyof FormData, generatedCode);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveItem = () => {
//     console.log("Saving item:", {
//       ...formData,
//       manufacturingDate: manufacturingDate?.toISOString() || "",
//       expirationDate: expirationDate?.toISOString() || "",
//       image: image ? image.name : null,
//     });
//     setShowNewItemForm(false);
//   };

//   const handleToggleChange = (type: "product" | "service") => {
//     setIsProduct(type === "product");
//   };

//   if (showNewItemForm) {
//     return (
//       <div className="bg-white min-h-screen">
//         <div className="bg-blue-700 text-white p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setShowNewItemForm(false)}
//                 className="text-white hover:bg-blue-600 p-2 rounded"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <h1 className="text-xl font-semibold">New {isProduct ? "Item" : "Item"}</h1>
//             </div>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setIsAddVariantModalOpen(true)}
//                 className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
//               >
//                 Add Variant
//               </button>
//               <button
//                 onClick={handleSaveItem}
//                 className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded font-medium"
//               >
//                 Save {isProduct ? "Item" : "Item"}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h2 className="text-lg font-medium mb-4">Add image</h2>
//             <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               ) : (
//                 <div className="text-center">
//                   <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-2">
//                     <Plus className="text-white" size={24} />
//                   </div>
//                   <p className="text-sm text-gray-500">Upload Image</p>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//             </div>
//           </div>

//           <div className="mb-8">
//             <h2 className="text-lg font-medium mb-6">Basic details</h2>
//             <div className="flex items-center gap-4 mb-6">
//               <button
//                 onClick={() => handleToggleChange("product")}
//                 className={`px-4 py-2 rounded-md ${
//                   isProduct ? "bg-blue-700 text-white" : "text-gray-700"
//                 }`}
//               >
//                 Product
//               </button>
//               <button
//                 onClick={() => handleToggleChange("service")}
//                 className={`px-4 py-2 rounded-md ${
//                   !isProduct ? "bg-blue-700 text-white" : "text-gray-700"
//                 }`}
//               >
//                 Service
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {isProduct ? "Product Name" : "Service Name"} <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.itemName}
//                   onChange={(e) => handleInputChange("itemName", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.category}
//                     onChange={(e) => handleInputChange("category", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                   >
//                     <option value="">Select category</option>
//                     <option value="food">Food</option>
//                     <option value="beverage">Beverage</option>
//                     {isProduct ? null : <option value="service">Service</option>}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sub Category
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.subCategory}
//                     onChange={(e) => handleInputChange("subCategory", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                   >
//                     <option value="">Select sub category</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Brand Name
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.brandName}
//                     onChange={(e) => handleInputChange("brandName", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                   >
//                     <option value="">Select brand</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.status}
//                     onChange={(e) => handleInputChange("status", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                   >
//                     <option value="">Select status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Vendor Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.vendorName}
//                   onChange={(e) => handleInputChange("vendorName", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Vendor Contact
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.vendorContact}
//                   onChange={(e) => handleInputChange("vendorContact", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mb-8">
//             <h2 className="text-lg font-medium mb-6">Stock details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Unit <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.unit}
//                     onChange={(e) => handleInputChange("unit", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                   >
//                     <option value="">Select unit</option>
//                     {isProduct ? (
//                       <>
//                         <option value="kg">Kg</option>
//                         <option value="piece">Piece</option>
//                         <option value="liter">Liter</option>
//                         <option value="gram">Gram</option>
//                       </>
//                     ) : (
//                       <option value="unit">Unit</option>
//                     )}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Current Quantity
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.currentQuantity}
//                   onChange={(e) => handleInputChange("currentQuantity", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {isProduct && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Minimum Stock
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.minimumStock}
//                       onChange={(e) => handleInputChange("minimumStock", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Maximum Stock
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.maximumStock}
//                       onChange={(e) => handleInputChange("maximumStock", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Manufacturing Date
//                     </label>
//                     <div className="relative">
//                       <DatePicker
//                         selected={manufacturingDate}
//                         onChange={(date: Date | null) => setManufacturingDate(date)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholderText="Select date"
//                         dateFormat="yyyy-MM-dd"
//                       />
//                       <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Expiration Date
//                     </label>
//                     <div className="relative">
//                       <DatePicker
//                         selected={expirationDate}
//                         onChange={(date: Date | null) => setExpirationDate(date)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholderText="Select date"
//                         dateFormat="yyyy-MM-dd"
//                       />
//                       <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h2 className="text-lg font-medium mb-6">Price details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Selling Price
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.sellingPrice}
//                   onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {isProduct && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Purchase Price
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.purchasePrice}
//                     onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               )}

//               {isProduct && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     MRP
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.mrp}
//                     onChange={(e) => handleInputChange("mrp", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Tax Percentage
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.taxPercentage}
//                   onChange={(e) => handleInputChange("taxPercentage", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Online Delivery Price
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.onlineDeliveryPrice}
//                   onChange={(e) => handleInputChange("onlineDeliveryPrice", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Online Selling Price
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.onlineSellingPrice}
//                   onChange={(e) => handleInputChange("onlineSellingPrice", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {!isProduct && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       AC Selling Price
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.acSellingPrice}
//                       onChange={(e) => handleInputChange("acSellingPrice", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Non-AC Selling Price
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.nonAcSellingPrice}
//                       onChange={(e) => handleInputChange("nonAcSellingPrice", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Actual Cost
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.actualCost}
//                   onChange={(e) => handleInputChange("actualCost", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.discount}
//                   onChange={(e) => handleInputChange("discount", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {isProduct && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Swiggy
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.swiggy}
//                       onChange={(e) => handleInputChange("swiggy", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Zomato
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.zomato}
//                       onChange={(e) => handleInputChange("zomato", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Dine-in Price
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.diningPrice}
//                       onChange={(e) => handleInputChange("diningPrice", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {isProduct && (
//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-6">Code details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Barcode 01
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={formData.barcode01}
//                       onChange={(e) => handleInputChange("barcode01", e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={() => generateBarcode("01")}
//                       className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
//                     >
//                       Generate
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     * Title, Item Number, Sell Price.
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Barcode 02
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={formData.barcode02}
//                       onChange={(e) => handleInputChange("barcode02", e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={() => generateBarcode("02")}
//                       className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
//                     >
//                       Generate
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     *Title, Sell Price, MRP, Number (Bigger Sticker).
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Barcode 03
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={formData.barcode03}
//                       onChange={(e) => handleInputChange("barcode03", e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={() => generateBarcode("03")}
//                       className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
//                     >
//                       Generate
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     *Title, Sell Price, MRP, Number, HSN Code
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     QR Code
//                   </label>
//                   <div className="flex gap-2 max-w-md">
//                     <input
//                       type="text"
//                       value={formData.qrCode}
//                       onChange={(e) => handleInputChange("qrCode", e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={() => generateBarcode("QR")}
//                       className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
//                     >
//                       Generate
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       <div className="p-4">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex gap-4">
//             <button
//               className={`px-4 py-2 rounded-md ${
//                 activeTab === "item" ? "bg-blue-700 text-white" : "text-gray-700"
//               }`}
//               onClick={() => setActiveTab("item")}
//             >
//               Item
//             </button>
//             <button
//               className={`px-4 py-2 rounded-md ${
//                 activeTab === "category" ? "bg-blue-700 text-white" : "text-gray-700"
//               }`}
//               onClick={() => setActiveTab("category")}
//             >
//               Category
//             </button>
//           </div>

//           <div className="flex gap-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name, item code"
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
//               />
//               <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
//             </div>
//             <button
//               onClick={() => setIsMenuManagementOpen(true)}
//               className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
//             >
//               Menu Management
//             </button>
//             <button
//               onClick={() => setShowNewItemForm(true)}
//               className="px-4 py-2 text-blue-700 hover:text-blue-800"
//             >
//               Add new item
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 SI no.
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Item Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 HSN Code
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Item Code
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Sell Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Purchase Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Current Stock
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {menuItems.map((item) => (
//               <tr key={item.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.id}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="h-10 w-10 bg-blue-700 rounded"></div>
//                     <span className="ml-3 text-sm text-gray-900">{item.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.hsnCode}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.itemCode}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {item.sellPrice}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {item.purchasePrice}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.currentStock}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button className="text-blue-700 hover:text-blue-800">Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Item;