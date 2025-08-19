// src/components/ItemList.tsx
import React, { useState } from "react";
import { Search, X, Calendar } from "lucide-react";
import ImageUpload from "./ImageUpload"; // Assuming this component exists
import CategoryListTable, { Category } from "./Category/CategoryListTable"; // Assuming this component exists
import EditCategory from "./Category/EditCategory"; // Assuming this component exists
import AddCategory from "./Category/AddCategory"; // Assuming this component exists
import LedgerListTable from "./Ledger/LedgerListTable"; // Assuming this component exists
import AddLedger from "./Ledger/AddLedger"; // Assuming this component exists
import MenuManagementModal from "./Menu Management/MenuManagementModal"; // Import the new modal component

interface MenuItem {
  id: string;
  name: string;
  hsnCode: string;
  itemCode: string;
  sellPrice: string;
  purchasePrice: string;
  currentStock: number;
  category?: string;
  subCategory?: string;
  brandName?: string;
  status?: string;
  vendorName?: string;
  vendorContact?: string;
  unit?: string;
  minimumStock?: number;
  maximumStock?: number;
  manufacturingDate?: string;
  expirationDate?: string;
  mrp?: string;
  taxPercentage?: string;
  onlineDeliveryPrice?: string;
  onlineSellingPrice?: string;
  actualCost?: string;
  discount?: string;
  swiggy?: string;
  zomato?: string;
  dineInPrice?: string;
  imageUrl?: string;
  totalVariants?: number; // Added this new property for menu management
}

// Define Ledger interface based on the image
interface Ledger {
  slNo: string;
  ledgerCategory: string;
  ledgerGroup: string;
  ledgerName: string; // Renamed from 'ledger' to 'ledgerName' to avoid conflict
  tax: string;
  percentage: number;
}

interface ItemListProps {
  setShowNewItemForm: (show: boolean) => void;
}

const ItemList: React.FC<ItemListProps> = ({ setShowNewItemForm }) => {
  const [activeTab, setActiveTab] = useState<"item" | "category" | "ledger">("item"); // Added "ledger" tab
  const [isMenuManagementOpen, setIsMenuManagementOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeProductTab, setActiveProductTab] = useState<"Product" | "Service" | "Token">("Product");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State for Category editing
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State for Add Category modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);

  // State for Add Ledger modal
  const [isAddLedgerModalOpen, setIsAddLedgerModalOpen] = useState<boolean>(false);

  // Existing Sample Menu Items - UPDATED WITH totalVariants
  const menuItems: MenuItem[] = [
    {
      id: "01",
      name: "Tea", // Changed name to match image
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Beverage", // Example category
      subCategory: "Hot Drinks",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 7, // Example variants count
    },
    {
      id: "02",
      name: "Medhu vada", // Changed name to match image
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Snacks", // Example category
      subCategory: "Fried Items",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 2, // Example variants count
    },
    {
      id: "03",
      name: "Medhu vada",
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Snacks",
      subCategory: "Fried Items",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 2,
    },
    {
      id: "04",
      name: "Medhu vada",
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Snacks",
      subCategory: "Fried Items",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 2,
    },
    {
      id: "05",
      name: "Medhu vada",
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Snacks",
      subCategory: "Fried Items",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 2,
    },
    {
      id: "06",
      name: "Medhu vada",
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Snacks",
      subCategory: "Fried Items",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 2,
    },
    {
      id: "07",
      name: "Medhu vada",
      hsnCode: "IGF908",
      itemCode: "IGF908",
      sellPrice: "₹0.00",
      purchasePrice: "₹0.00",
      currentStock: 97,
      category: "Snacks",
      subCategory: "Fried Items",
      brandName: "Brand A",
      status: "Active",
      vendorName: "Vendor ABC",
      vendorContact: "9876543210",
      unit: "Piece",
      minimumStock: 10,
      maximumStock: 100,
      manufacturingDate: "2024-01-01",
      expirationDate: "2024-12-31",
      mrp: "₹100.00",
      taxPercentage: "18",
      onlineDeliveryPrice: "₹95.00",
      onlineSellingPrice: "₹90.00",
      actualCost: "₹80.00",
      discount: "10",
      swiggy: "₹85.00",
      zomato: "₹87.00",
      dineInPrice: "₹88.00",
      imageUrl: "",
      totalVariants: 2,
    },
    {
      id: "08",
      name: "Dairy Milk", // Example item with 0 variants
      hsnCode: "CHOC123",
      itemCode: "CHOC123",
      sellPrice: "₹50.00",
      purchasePrice: "₹40.00",
      currentStock: 150,
      category: "Food",
      subCategory: "Chocolates",
      brandName: "Brand B",
      status: "Active",
      vendorName: "Vendor XYZ",
      vendorContact: "1234567890",
      unit: "Piece",
      minimumStock: 20,
      maximumStock: 200,
      manufacturingDate: "2024-03-01",
      expirationDate: "2024-09-30",
      mrp: "₹50.00",
      taxPercentage: "5",
      onlineDeliveryPrice: "₹55.00",
      onlineSellingPrice: "₹52.00",
      actualCost: "₹45.00",
      discount: "5",
      swiggy: "₹50.00",
      zomato: "₹51.00",
      dineInPrice: "₹48.00",
      imageUrl: "",
      totalVariants: 0,
    },
  ];

  // Sample Category Data (can be managed here or fetched from an API)
  const [categories, setCategories] = useState<Category[]>([
    { slNo: '01', categoryName: 'Tea Shop', totalItems: 112 },
    { slNo: '02', categoryName: 'Juice Shop', totalItems: 123 },
    { slNo: '03', categoryName: 'Bakery Items', totalItems: 85 },
    { slNo: '04', categoryName: 'Coffee & Beverages', totalItems: 70 },
  ]);

  // Sample Ledger Data
  const [ledgers, setLedgers] = useState<Ledger[]>([
    { slNo: '01', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
    { slNo: '02', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
    { slNo: '03', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
    { slNo: '04', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
    { slNo: '05', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
    { slNo: '06', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
    { slNo: '07', ledgerCategory: 'Current Liabilities', ledgerGroup: 'Indirect Income', ledgerName: 'Accrued Income', tax: '-', percentage: 5 },
  ]);


  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setImagePreview(item.imageUrl || null);
    setIsEditModalOpen(true);
  };

  // Handler for edit action coming from the MenuManagementModal
  const handleEditItemFromMenuManagement = (item: { id: string; name: string; hsnCode: string; totalVariants: number; }) => {
    // Find the full item details from your main menuItems array
    const fullItem = menuItems.find(mi => mi.id === item.id);
    if (fullItem) {
      handleEdit(fullItem); // Use the existing handleEdit function
    } else {
      console.warn("Full item details not found for ID:", item.id);
      // Optionally, handle the case where the full item isn't found
    }
  };


  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
    setImagePreview(null);
  };

  const handleInputChange = (field: keyof MenuItem, value: string | number) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [field]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        if (editingItem) {
          setEditingItem({
            ...editingItem,
            imageUrl: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      if (editingItem) {
        setEditingItem({
          ...editingItem,
          imageUrl: undefined,
        });
      }
    }
  };

  const generateBarcode = (type: string) => {
    console.log(`Generating ${type} barcode`);
  };

  // Handler for editing a category (passed to CategoryListTable)
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  // Handler to close the Edit Category modal
  const handleCloseEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Handler to update a category (e.g., after editing in the modal)
  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.slNo === updatedCategory.slNo ? updatedCategory : cat
      )
    );
    console.log("Category updated:", updatedCategory);
    // In a real app, you would send this update to your backend.
  };

  // Handler for adding a new category (passed to CategoryListTable)
  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true); // Open the AddCategory modal
  };

  // Handler to close the Add Category modal
  const handleCloseAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  // Handler to save a new category
  const handleSaveNewCategory = (newCategoryData: Omit<Category, 'slNo' | 'totalItems'> & { items: string[] }) => {
    // In a real application, you would send newCategoryData to your backend.
    // The backend would typically return the full category object with slNo and totalItems.
    console.log("New category to save:", newCategoryData);

    // For demonstration, let's mock adding it to the state
    const newSlNo = String(categories.length + 1).padStart(2, '0');
    const newCategory: Category = {
      slNo: newSlNo,
      categoryName: newCategoryData.categoryName,
      totalItems: newCategoryData.items.length, // Total items from the form
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
    handleCloseAddCategoryModal(); // Close the modal after saving
  };


  // Handler for category search (passed to CategoryListTable)
  const handleCategorySearch = (searchTerm: string) => {
    console.log("Searching categories for:", searchTerm);
    // Implement your category search logic here, e.g., filter the 'categories' array.
  };

  // Handler for adding a new ledger
  const handleAddLedger = () => {
    setIsAddLedgerModalOpen(true);
  };

  // Handler to close the Add Ledger modal
  const handleCloseAddLedgerModal = () => {
    setIsAddLedgerModalOpen(false);
  };

  // Handler to save a new ledger
  const handleSaveNewLedger = (newLedgerData: Omit<Ledger, 'slNo' | 'tax'> & { isTaxLedger: 'Yes' | 'No' }) => {
    console.log("New ledger to save:", newLedgerData);
    const newSlNo = String(ledgers.length + 1).padStart(2, '0');
    const newLedger: Ledger = {
      slNo: newSlNo,
      ledgerCategory: newLedgerData.ledgerCategory,
      ledgerGroup: newLedgerData.ledgerGroup,
      ledgerName: newLedgerData.ledgerName,
      tax: newLedgerData.isTaxLedger === 'Yes' ? 'Yes' : '-', // Assuming 'Yes' or '-' based on isTaxLedger
      percentage: newLedgerData.percentage,
    };
    setLedgers(prevLedgers => [...prevLedgers, newLedger]);
    handleCloseAddLedgerModal();
  };

  // Handler for ledger search
  const handleLedgerSearch = (searchTerm: string) => {
    console.log("Searching ledgers for:", searchTerm);
    // Implement your ledger search logic here
  };

  // Handler for editing a ledger (placeholder for future implementation)
  const handleEditLedger = (ledger: Ledger) => {
    console.log("Editing ledger:", ledger);
    // Implement actual edit functionality here, e.g., open an edit modal for ledgers
  };


  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "item" ? "bg-blue-700 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("item")}
            >
              Item
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "category" ? "bg-blue-700 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("category")}
            >
              Category
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "ledger" ? "bg-blue-700 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("ledger")}
            >
              Ledger
            </button>
          </div>

          {/* Conditional rendering of search and action buttons based on activeTab */}
          {activeTab === "item" && (
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, item code"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button
                onClick={() => setIsMenuManagementOpen(true)}
                className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
              >
                Menu Management
              </button>
              <button
                onClick={() => setShowNewItemForm(true)}
                className="px-4 py-2 text-blue-700 hover:text-blue-800"
              >
                Add new item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conditional rendering of tables */}
      {activeTab === "item" && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SI no.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  HSN Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sell Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover rounded" />
                        ) : (
                          "No Img"
                        )}
                      </div>
                      <span className="ml-3 text-sm text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.hsnCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.itemCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sellPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.purchasePrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-700 hover:text-blue-800"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "category" && (
        <CategoryListTable
          categories={categories}
          onEditCategory={handleEditCategory}
          onAddCategory={handleAddCategory} // Pass the new handler
          onSearch={handleCategorySearch}
        />
      )}

      {activeTab === "ledger" && (
        <LedgerListTable
          ledgers={ledgers}
          onAddLedger={handleAddLedger}
          onSearch={handleLedgerSearch}
          onEditLedger={handleEditLedger}
        />
      )}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && editingCategory && (
        <EditCategory
          category={editingCategory}
          onClose={handleCloseEditCategoryModal}
          onUpdate={handleUpdateCategory}
        />
      )}

      {/* Add New Category Modal */}
      {isAddCategoryModalOpen && (
        <AddCategory
          onClose={handleCloseAddCategoryModal}
          onSave={handleSaveNewCategory}
        />
      )}

      {/* Add New Ledger Modal */}
      {isAddLedgerModalOpen && (
        <AddLedger
          onClose={handleCloseAddLedgerModal}
          onSave={handleSaveNewLedger}
        />
      )}

      {/* Menu Management Modal - Conditionally Rendered */}
      {isMenuManagementOpen && (
        <MenuManagementModal
          onClose={() => setIsMenuManagementOpen(false)}
          menuItems={menuItems.map(item => ({ // Map to the simplified interface for the modal
            id: item.id,
            name: item.name,
            hsnCode: item.hsnCode,
            totalVariants: item.totalVariants || 0, // Ensure totalVariants is always a number
          }))}
          onEditItem={handleEditItemFromMenuManagement} // Pass the handler for editing items from this modal
        />
      )}

      {/* Edit Item Modal (remains specific to MenuItem) */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Item</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {/* Image Upload */}
              <ImageUpload imagePreview={imagePreview} handleImageChange={handleImageChange} />

              {/* Basic Details */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Basic details</h3>

                {/* Product Type Tabs */}
                <div className="flex gap-2 mb-6">
                  {["Product", "Service", "Token"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-md text-sm ${
                        activeProductTab === tab
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveProductTab(tab as "Product" | "Service" | "Token")}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingItem.category || ""}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Food">Food</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name
                    </label>
                    <select
                      value={editingItem.brandName || ""}
                      onChange={(e) => handleInputChange("brandName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select brand</option>
                      <option value="Brand A">Brand A</option>
                      <option value="Brand B">Brand B</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={editingItem.status || ""}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={editingItem.vendorName || ""}
                      onChange={(e) => handleInputChange("vendorName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Contact
                    </label>
                    <input
                      type="text"
                      value={editingItem.vendorContact || ""}
                      onChange={(e) => handleInputChange("vendorContact", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Details */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Stock details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={editingItem.unit || ""}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select unit</option>
                      <option value="Piece">Piece</option>
                      <option value="Kg">Kg</option>
                      <option value="Liter">Liter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Quantity
                    </label>
                    <input
                      type="number"
                      value={editingItem.currentStock}
                      onChange={(e) => handleInputChange("currentStock", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Stock
                    </label>
                    <input
                      type="number"
                      value={editingItem.minimumStock || 0}
                      onChange={(e) => handleInputChange("minimumStock", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Stock
                    </label>
                    <input
                      type="number"
                      value={editingItem.maximumStock || 0}
                      onChange={(e) => handleInputChange("maximumStock", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturing Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.manufacturingDate || ""}
                      onChange={(e) => handleInputChange("manufacturingDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.expirationDate || ""}
                      onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Price details</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    + Add New Price
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.sellPrice}
                      onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.purchasePrice}
                      onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP
                    </label>
                    <input
                      type="text"
                      value={editingItem.mrp || ""}
                      onChange={(e) => handleInputChange("mrp", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Percentage
                    </label>
                    <input
                      type="text"
                      value={editingItem.taxPercentage || ""}
                      onChange={(e) => handleInputChange("taxPercentage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Online Delivery Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.onlineDeliveryPrice || ""}
                      onChange={(e) => handleInputChange("onlineDeliveryPrice", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Online Selling Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.onlineSellingPrice || ""}
                      onChange={(e) => handleInputChange("onlineSellingPrice", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Cost
                    </label>
                    <input
                      type="text"
                      value={editingItem.actualCost || ""}
                      onChange={(e) => handleInputChange("actualCost", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    {/* Discount field - assuming it was cut off from the previous snippet, adding it to complete the grid */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount
                    </label>
                    <input
                      type="text"
                      value={editingItem.discount || ""}
                      onChange={(e) => handleInputChange("discount", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {/* Additional Price Details as per the original full snippet */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Swiggy Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.swiggy || ""}
                      onChange={(e) => handleInputChange("swiggy", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zomato Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.zomato || ""}
                      onChange={(e) => handleInputChange("zomato", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dine-in Price
                    </label>
                    <input
                      type="text"
                      value={editingItem.dineInPrice || ""}
                      onChange={(e) => handleInputChange("dineInPrice", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* End of the content for the Edit Item Modal */}
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                // onClick={handleUpdateItem} // Add actual update logic here
                className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;