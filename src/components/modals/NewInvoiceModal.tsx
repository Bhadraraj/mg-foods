import React, { useState, useEffect } from "react";
import { X, Calculator } from "lucide-react";
import AddCustomerModal from "../modals/AddCustomerModal"; // Adjust path as needed
import AddReferrerModal from "../modals/AddReferrerModal";
import SalesSummary from '../../components/modals/SalesSummary'; // Adjust the import path as needed


interface ProductRow {
  id: number;
  item: string;
  mrp: string;
  sellingPrice: string;
  quantity: string;
  amount: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBill: any; // Consider defining a more specific type for editingBill
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  editingBill,
}) => {
  // Helper function to generate a unique ID
  const generateUniqueId = (): number => {
    return Date.now() + Math.random();
  };

  // Initialize productRows with 5 empty rows by default
  const createInitialProductRows = (count: number = 5): ProductRow[] => {
    const rows: ProductRow[] = [];
    for (let i = 0; i < count; i++) {
      rows.push({
        id: generateUniqueId(),
        item: "",
        mrp: "",
        sellingPrice: "",
        quantity: "",
        amount: "",
      });
    }
    return rows;
  };

  const [productRows, setProductRows] = useState<ProductRow[]>(createInitialProductRows());

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [referrerNumber, setReferrerNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [category, setCategory] = useState("GST");
  const [selectRate, setSelectRate] = useState("Select Sale");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [returnBillNo, setReturnBillNo] = useState("");
  const [splDiscount, setSplDiscount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isReferrerModalOpen, setIsReferrerModalOpen] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
  const openCustomerModal = () => setIsCustomerModalOpen(true);
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const openReferrerModal = () => setIsReferrerModalOpen(true);
  const closeReferrerModal = () => setIsReferrerModalOpen(false);

  useEffect(() => {
    if (isOpen) { // Only reset or load data when the modal becomes open
      if (editingBill) {
        setCustomerName(editingBill.customer?.name || "");
        setMobileNumber(editingBill.customer?.phone || "");

        const existingProducts = editingBill.products?.map(
          (p: any) => ({
            id: generateUniqueId(), // Assign new unique IDs to avoid conflicts if editingBill changes
            item: p.name || "",
            mrp: p.mrp || "", // Assuming these properties exist on p
            sellingPrice: p.sellingPrice || "",
            quantity: p.quantity || "",
            amount: p.amount || "",
          })
        ) || [];

        // Ensure a minimum of 5 rows
        if (existingProducts.length < 5) {
          const remainingRows = 5 - existingProducts.length;
          setProductRows([...existingProducts, ...createInitialProductRows(remainingRows)]);
        } else {
          setProductRows(existingProducts);
        }

      } else {
        // Reset all fields when there's no editingBill or it's a new invoice
        setCustomerName("");
        setMobileNumber("");
        setReferrerName("");
        setReferrerNumber("");
        setGstin("");
        setCategory("GST");
        setSelectRate("Select Sale");
        setDeliveryDate("");
        setReturnBillNo("");
        setSplDiscount("");
        setCouponCode("");
        // Always set to 5 empty rows for a new invoice
        setProductRows(createInitialProductRows(5));
      }
    }
  }, [editingBill, isOpen]); // Depend on editingBill and isOpen

  const addProductRow = () => {
    // Generate new ID based on existing rows or a fresh start
    const newId = productRows.length > 0 ? Math.max(...productRows.map((row) => row.id)) + 1 : 1;
    setProductRows([
      ...productRows,
      {
        id: newId,
        item: "",
        mrp: "",
        sellingPrice: "",
        quantity: "",
        amount: "",
      },
    ]);
  };

  const removeProductRow = (id: number) => {
    setProductRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const [invoicePaymentData, setInvoicePaymentData] = useState<PaymentData>({
        billNo: "INV-001-2025",
        tableNo: "T-05",
        date: new Date().toLocaleDateString("en-IN"),
        waiterTip: 15.00,
        items: [
            { id: "1", name: "Chicken Biryani", quantity: 2, amount: 450.00 },
            { id: "2", name: "Cold Drink", quantity: 3, amount: 90.00 },
            { id: "3", name: "Butter Naan", quantity: 4, amount: 120.00 },
        ],
        charges: {
            service: 25.00,
            ac: 10.00,
            gst: 50.00,
            cgst: 50.00,
        },
    });
  const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log("Sales Summary modal closed.");
    };

  const handleSave = () => {
  console.log("Saving invoice:", {
    customerName,
    mobileNumber,
    referrerName,
    referrerNumber,
    gstin,
    category,
    selectRate,
    deliveryDate,
    returnBillNo,
    productRows,
    splDiscount,
    couponCode,
  });
  // Instead of closing the InvoiceModal, open the SalesSummary modal
  setIsModalOpen(true);
  console.log("Save Invoice button clicked, opening Sales Summary modal.");
};
  if (!isOpen) return null;

  return (
    <div className="fixed newinvoice inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 z-50 overflow-y-auto">
      <div className="bg-white rounded-sm w-full">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-blue-600 font-semibold">Amount Received</div>
              <div className="text-2xl font-bold">₹ 0.00</div>
              <div className="text-sm text-blue-600">Total Items: 00</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-blue-600 font-semibold">Balance</div>
              <div className="text-2xl font-bold">₹ 0.00</div>
              <div className="text-sm text-blue-600">Total Qty: 00</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-blue-600 font-semibold">MRP Total</div>
              <div className="text-2xl font-bold">₹ 0.00</div>
              <div className="text-sm text-blue-600">Total Savings: 00</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-blue-600 font-semibold">Net Amount</div>
              <div className="text-2xl font-bold">₹ 0.00</div>
              <div className="text-sm text-blue-600">Total Tax: 00</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-blue-600 font-semibold">Advance Amount</div>
              <div className="text-2xl font-bold">₹ 0.00</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-blue-600 font-semibold">Credit Balance</div>
              <div className="text-2xl font-bold">₹ 0.00</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-600 font-semibold">
                  Customer Details
                </h3>
                <button
                  onClick={openCustomerModal}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  + Add
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-900 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-900 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-600 font-semibold">
                  Referrer Details
                </h3>
                <button
                  onClick={openReferrerModal}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  + Add
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-900 mb-1">
                    Referrer Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-900 mb-1">
                    Referrer Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={referrerNumber}
                    onChange={(e) => setReferrerNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <div>
              <label className="block text-sm text-gray-900 mb-1">GSTIN</label>
              <input
                type="text"
                placeholder="33CNLPS1428Q1ZD"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-900 mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>GST</option>
                <option>Estimation</option>
                <option>Proforma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-900 mb-1">
                Select Rate
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={selectRate}
                onChange={(e) => setSelectRate(e.target.value)}
              >
                <option>Select Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-900 mb-1">
                Delivery date
              </label>
              <input
                type="date"
                placeholder="Select Date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-900 mb-1">
                Return bill no.
              </label>
              <input
                type="text"
                placeholder="Return bill no."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={returnBillNo}
                onChange={(e) => setReturnBillNo(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    MRP
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Selling Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
            </table>
            <div className="overflow-y-auto max-h-[200px] scrollbar-invisible">
              <table className="w-full">
                <tbody>
                  {productRows.map((row, index) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="Select item"
                          value={row.item}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].item = e.target.value;
                            setProductRows(newRows);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={row.mrp}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].mrp = e.target.value;
                            setProductRows(newRows);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={row.sellingPrice}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].sellingPrice = e.target.value;
                            setProductRows(newRows);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={row.quantity}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].quantity = e.target.value;
                            setProductRows(newRows);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={row.amount}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].amount = e.target.value;
                            setProductRows(newRows);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => removeProductRow(row.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                          <button className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            <Calculator size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2 border-t bg-gray-50">
              <button
                onClick={addProductRow}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Row
              </button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discounts */}
            <div className="space-y-4">
              <div>
                <label className="block text-blue-600 font-medium mb-2">
                  Spl. Discount (-)
                </label>
                <input
                  type="text"
                  placeholder="₹ 0.00"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={splDiscount}
                  onChange={(e) => setSplDiscount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-blue-600 font-medium mb-2">
                  Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code"
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="px-4 py-2 bg-green-500 text-white rounded font-medium">
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium">Sub total</span>
                <span className="font-bold">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium">Other Charges</span>
                <span className="font-bold">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium">Round off</span>
                <span className="font-bold">₹ 0.00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-blue-600 font-medium">Grand total</span>
                <span className="font-bold text-lg">₹ 0.00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-6 py-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded font-medium"
          >
            Cancel
          </button>
   <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
            >
                Save Invoice
            </button>

        </div>

        <AddCustomerModal
          isOpen={isCustomerModalOpen}
          onClose={closeCustomerModal}
        />
        <AddReferrerModal
          isOpen={isReferrerModalOpen}
          onClose={closeReferrerModal}
        />
        <SalesSummary
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                paymentData={invoicePaymentData}
            />
      </div>
    </div>
  );
};

export default InvoiceModal;