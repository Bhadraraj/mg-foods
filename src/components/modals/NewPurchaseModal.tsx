import React, { useState } from "react";
import { X, Plus, Image, MinusCircle, Minus } from "lucide-react"; 

interface ProductRow {
  id: number;
  image: string;  
  product: string;
  dp: string;
  discount: string;
  taxType: "IGST" | "SGST"; 
  hsn: string;
  mrp: string;
  purchasingPrice: string;
  poQty: string;
  piQty: string;
  invQty: string;
  taxableAmt: string;
  taxAmt: string;
  totalAmt: string;
}

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const generateUniqueId = (): number => Date.now() + Math.random();

  const createInitialProductRows = (count: number = 2): ProductRow[] => {
    const rows: ProductRow[] = [];
    for (let i = 0; i < count; i++) {
      rows.push({
        id: generateUniqueId(),
        image: "",
        product: "",
        dp: "",
        discount: "",
        taxType: "IGST", // Default tax type
        hsn: "",
        mrp: "",
        purchasingPrice: "",
        poQty: "",
        piQty: "",
        invQty: "",
        taxableAmt: "",
        taxAmt: "",
        totalAmt: "",
      });
    }
    return rows;
  };

  const [vendor, setVendor] = useState("");
  const [taxType, setTaxType] = useState("Bill Wise");
  const [billingType, setBillingType] = useState("SGST");
  const [vendorBrand, setVendorBrand] = useState("Brand");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [purchaseType, setPurchaseType] = useState("Sales");
  const [productRows, setProductRows] = useState<ProductRow[]>(
    createInitialProductRows()
  );

  // PI Summary states (newly added based on image)
  const [piTotalTaxableAmount, setPiTotalTaxableAmount] = useState(0);
  const [piTotalTax, setPiTotalTax] = useState(0);
  const [piRoundOff, setPiRoundOff] = useState(0);
  const [piNetTotal, setPiNetTotal] = useState(0);

  // Invoice Summary states (newly added based on image)
  const [invoiceTotalTaxableAmount, setInvoiceTotalTaxableAmount] = useState(0);
  const [invoiceTotalTax, setInvoiceTotalTax] = useState(0);
  const [invoiceRoundOff, setInvoiceRoundOff] = useState(0);
  const [invoiceNetTotal, setInvoiceNetTotal] = useState(0);
  const [selectedLedger, setSelectedLedger] = useState("");
  const [invoiceTaxAmt, setInvoiceTaxAmt] = useState("");

  // State for ledgers
  const [ledgers, setLedgers] = useState([
    { id: 1, selectedLedger: "Sales", taxAmount: "100.00" },
    { id: 2, selectedLedger: "Purchase", taxAmount: "50.00" },
    { id: 3, selectedLedger: "Service", taxAmount: "25.00" },
    { id: 4, selectedLedger: "Sales", taxAmount: "120.00" },
    { id: 5, selectedLedger: "Purchase", taxAmount: "60.00" },
    { id: 6, selectedLedger: "Service", taxAmount: "30.00" },
    { id: 7, selectedLedger: "Sales", taxAmount: "150.00" },
    { id: 8, selectedLedger: "Purchase", taxAmount: "75.00" },
    { id: 9, selectedLedger: "Service", taxAmount: "40.00" },
    { id: 10, selectedLedger: "Sales", taxAmount: "180.00" },
    { id: 11, selectedLedger: "Purchase", taxAmount: "90.00" },
    { id: 12, selectedLedger: "Service", taxAmount: "50.00" },
  ]);

  // State for discounts
  const [discounts, setDiscounts] = useState([
    { id: 1, description: "Early Bird", value: "10.00" },
    { id: 2, description: "Bulk Purchase", value: "5.00" },
    { id: 3, description: "Seasonal Offer", value: "2.50" },
    { id: 4, description: "Loyalty Discount", value: "15.00" },
  ]);

  // --- Ledger Handlers ---
  const addLedger = () => {
    setLedgers((prevLedgers) => [
      ...prevLedgers,
      {
        id: prevLedgers.length
          ? Math.max(...prevLedgers.map((l) => l.id)) + 1
          : 1,
        selectedLedger: "",
        taxAmount: "",
      },
    ]);
  };

  const handleLedgerChange = (id, field, value) => {
    setLedgers((prevLedgers) =>
      prevLedgers.map((ledger) =>
        ledger.id === id ? { ...ledger, [field]: value } : ledger
      )
    );
  };

  const removeLedger = (id) => {
    setLedgers((prevLedgers) =>
      prevLedgers.filter((ledger) => ledger.id !== id)
    );
  };

  // --- Discount Handlers ---
  const addDiscount = () => {
    setDiscounts((prevDiscounts) => [
      ...prevDiscounts,
      {
        id: prevDiscounts.length
          ? Math.max(...prevDiscounts.map((d) => d.id)) + 1
          : 1,
        description: "",
        value: "",
      },
    ]);
  };

  const handleDiscountChange = (id, field, value) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.map((discount) =>
        discount.id === id ? { ...discount, [field]: value } : discount
      )
    );
  };

  const removeDiscount = (id) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.filter((discount) => discount.id !== id)
    );
  };

  // --- Calculations ---
  const totalTaxableAmount = ledgers.reduce(
    (sum, ledger) => sum + parseFloat(ledger.taxAmount || 0),
    0
  );

  const totalTax = ledgers.reduce(
    (sum, ledger) => sum + parseFloat(ledger.taxAmount || 0) * 0.18,
    0
  );

  const totalDiscount = discounts.reduce(
    (sum, discount) => sum + parseFloat(discount.value || 0),
    0
  );

  const netTotalBeforeRoundOff = totalTaxableAmount + totalTax - totalDiscount;
  const netTotal = Math.round(netTotalBeforeRoundOff);
  const roundOff = netTotal - netTotalBeforeRoundOff;

  const addProductRow = () => {
    setProductRows((prevRows) => [
      ...prevRows,
      {
        id: generateUniqueId(),
        image: "",
        product: "",
        dp: "",
        discount: "",
        taxType: "IGST",
        hsn: "",
        mrp: "",
        purchasingPrice: "",
        poQty: "",
        piQty: "",
        invQty: "",
        taxableAmt: "",
        taxAmt: "",
        totalAmt: "",
      },
    ]);
  };

  const removeProductRow = (id: number) => {
    setProductRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleProductRowChange = (
    id: number,
    field: keyof ProductRow,
    value: string
  ) => {
    setProductRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmitPO = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Purchase Order Submitted:", {
      vendor,
      taxType,
      billingType,
      vendorBrand,
      invoiceNumber,
      invoiceDate,
      purchaseType,
      productRows,
      totalTaxableAmount,
      totalTax,
      roundOff,
      netTotal,
    });
    // Add your submission logic here
    onClose();
  };

  if (!isOpen) return null;
  const rowHeight = 40; // Approximate height of a table row
  // Set max height for 3 rows. You might need to adjust 'px' based on your actual row height including padding/borders
  const tableBodyMaxHeight = `${3 * rowHeight + 10}px`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full  h-full  relative flex flex-col">
        <div className="p-4 flex flex-col flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 flex-shrink-0">
            <div>
              <label
                htmlFor="vendor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vendor
              </label>
              <select
                id="vendor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              >
                <option value="">Select Vendor</option>
                {/* Add other vendor options */}
              </select>
            </div>
            <div>
              <label
                htmlFor="taxType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Type
              </label>
              <select
                id="taxType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
              >
                <option>Bill Wise</option>
                {/* Add other tax type options */}
              </select>
            </div>
            <div>
              <label
                htmlFor="billingType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Billing Type
              </label>
              <select
                id="billingType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={billingType}
                onChange={(e) => setBillingType(e.target.value)}
              >
                <option>SGST</option>
                {/* Add other billing type options */}
              </select>
            </div>
            <div>
              <label
                htmlFor="vendorBrand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vendor (Brand)
              </label>
              <select
                id="vendorBrand"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={vendorBrand}
                onChange={(e) => setVendorBrand(e.target.value)}
              >
                <option>Brand</option>
                {/* Add other brand options */}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 items-end flex-shrink-0">
            <div>
              <label
                htmlFor="invoiceNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice Number
              </label>
              <input
                type="text"
                id="invoiceNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="invoiceDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice Date
              </label>
              <input
                type="date"
                id="invoiceDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4 col-span-1 md:col-span-2 lg:col-span-1">
              {" "}
              {/* Adjust column span */}
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="purchaseType"
                  value="Sales"
                  checked={purchaseType === "Sales"}
                  onChange={(e) => setPurchaseType(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Sales</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="purchaseType"
                  value="Recipe"
                  checked={purchaseType === "Recipe"}
                  onChange={(e) => setPurchaseType(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Recipe</span>
              </label>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center font-bold text-lg">
              Purchase ID :{" "}
              <span className="text-blue-600 block text-xl">New Purchase</span>
            </div>
          </div>
          {/* Products Table Container - now with overflow-x-auto */}
          <div className="flex-grow overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* Table wrapper for horizontal scroll */}
              <div className="overflow-x-auto flex-grow">
                <table className="w-full">
                  {" "}
                  {/* Removed min-w-[1400px] */}
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    {" "}
                    {/* Made sticky for better UX */}
                    <tr className="border-b border-gray-300">
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-12"
                      >
                        No
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-16"
                      >
                        Image
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-40"
                      >
                        Product
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24"
                      >
                        DP
                        <br />
                        [W.O Tax]
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-20"
                      >
                        Discount
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24"
                      >
                        Tax %<br />
                        IGST
                        <br />
                        HSN
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-20"
                      >
                        MRP
                      </th>
                      <th
                        rowSpan={2}
                        className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24"
                      >
                        Purchasing
                        <br />
                        Price
                      </th>
                      <th
                        colSpan={3}
                        className="border-r border-gray-300 px-3 py-2 text-center text-xs font-medium text-blue-700"
                      >
                        Quantity
                      </th>
                      <th
                        colSpan={3}
                        className="px-3 py-2 text-center text-xs font-medium text-blue-700"
                      >
                        Amount
                      </th>
                      <th
                        rowSpan={2}
                        className="border-l border-gray-300 px-3 py-2 text-center text-xs font-medium text-blue-700 w-12"
                      ></th>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24">
                        PO Qty
                      </th>
                      <th className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24">
                        PI Qty
                      </th>
                      <th className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24">
                        INV Qty
                      </th>
                      <th className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-28">
                        Taxable Amt
                      </th>
                      <th className="border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-blue-700 w-24">
                        Tax Amt
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 w-28">
                        Total Amt
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="overflow-y-auto"
                    style={{ maxHeight: tableBodyMaxHeight }}
                  >
                    {productRows.map((row, index) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="border-r border-gray-200 px-3 py-2 text-sm text-gray-900 text-center w-12">
                          {index + 1}
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 text-center w-16">
                          <button className="text-gray-400 hover:text-blue-600 p-1 border border-gray-300 rounded">
                            <Image size={14} />
                          </button>
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-40">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.product}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "product",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.dp}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "dp",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-20">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.discount}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "discount",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <div className="space-y-1">
                            <select
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={row.taxType}
                              onChange={(e) =>
                                handleProductRowChange(
                                  row.id,
                                  "taxType",
                                  e.target.value as "IGST" | "SGST"
                                )
                              }
                            >
                              <option value="IGST">IGST</option>
                              <option value="SGST">SGST</option>
                            </select>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={row.hsn}
                              onChange={(e) =>
                                handleProductRowChange(
                                  row.id,
                                  "hsn",
                                  e.target.value
                                )
                              }
                              placeholder="HSN"
                            />
                          </div>
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-20">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.mrp}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "mrp",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.purchasingPrice}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "purchasingPrice",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.poQty}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "poQty",
                                e.target.value
                              )
                            }
                            placeholder="PO Qty"
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.piQty}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "piQty",
                                e.target.value
                              )
                            }
                            placeholder="PI Qty"
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.invQty}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "invQty",
                                e.target.value
                              )
                            }
                            placeholder="INV Qty"
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-28">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.taxableAmt}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "taxableAmt",
                                e.target.value
                              )
                            }
                            placeholder="Taxable Amt"
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-24">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.taxAmt}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "taxAmt",
                                e.target.value
                              )
                            }
                            placeholder="Tax Amt"
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-2 w-28">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={row.totalAmt}
                            onChange={(e) =>
                              handleProductRowChange(
                                row.id,
                                "totalAmt",
                                e.target.value
                              )
                            }
                            placeholder="Total Amt"
                          />
                        </td>
                        <td className="px-3 py-2 text-center w-12">
                          <button
                            type="button"
                            onClick={() => removeProductRow(row.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            title="Remove Row"
                          >
                            <Minus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
                <button
                  type="button"
                  onClick={addProductRow}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={16} /> Add
                </button>
                <div className="text-smfont-bold text-blue-600">
                  Total: ₹0.00
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end align-center gap-4 w-full mt-5">
            <div className="rounded-lg p-4 bg-white shadow-sm w-full max-w-xs border border-gray-200">
              <h3 className="text-sm font-bold  text-blue-600 mb-1">
                PO Summary
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total Taxable Amount</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Round Off</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 mt-2">
                  <span>Net Total</span>
                  <span className="text-lg">₹ 0.00</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-white shadow-sm w-full max-w-xs border border-gray-200">
              <h3 className="text-sm font-bold  text-blue-600 mb-1">
                PI Summary
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total Taxable Amount</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Round Off</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 mt-2">
                  <span>Net Total</span>
                  <span className="text-lg">₹ 0.00</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-white shadow-lg w-full max-w-md border border-gray-200 flex flex-col">
              {/* Fixed Header */}
              <h3 className="text-sm font-bold text-blue-700 mb-3 border-b pb-2 flex-shrink-0">
                Invoice Summary
              </h3>
              <div
                className="flex-grow overflow-y-auto pr-2"
                style={{ maxHeight: "150px" }}
              >
                <div className="space-y-3 text-sm text-gray-700">
                  {/* Ledgers Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">
                        Ledgers
                      </span>
                      <button
                        onClick={addLedger}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs transition duration-200 ease-in-out shadow-sm"
                      >
                        + Add Ledger
                      </button>
                    </div>
                    {ledgers.map((ledger) => (
                      <div
                        key={ledger.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm flex-grow focus:ring-blue-500 focus:border-blue-500"
                          value={ledger.selectedLedger}
                          onChange={(e) =>
                            handleLedgerChange(
                              ledger.id,
                              "selectedLedger",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Ledger</option>
                          <option value="Sales">Sales</option>
                          <option value="Purchase">Purchase</option>
                          <option value="Service">Service</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Tax Amt"
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:ring-blue-500 focus:border-blue-500"
                          value={ledger.taxAmount}
                          onChange={(e) =>
                            handleLedgerChange(
                              ledger.id,
                              "taxAmount",
                              e.target.value
                            )
                          }
                        />
                        <span className="font-medium text-nowrap">
                          ₹ {parseFloat(ledger.taxAmount || 0).toFixed(2)}
                        </span>
                        {ledgers.length > 1 && (
                          <button
                            onClick={() => removeLedger(ledger.id)}
                            className="text-red-500 hover:text-red-700 text-lg ml-1"
                            aria-label="Remove Ledger"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">
                        Discounts
                      </span>
                      <button
                        onClick={addDiscount}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs transition duration-200 ease-in-out shadow-sm"
                      >
                        + Add Discount
                      </button>
                    </div>
                    {discounts.map((discount) => (
                      <div
                        key={discount.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="text"
                          placeholder="Discount Description"
                          className="border border-gray-300 rounded px-2 py-1 text-sm flex-grow focus:ring-green-500 focus:border-green-500"
                          value={discount.description}
                          onChange={(e) =>
                            handleDiscountChange(
                              discount.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="number"
                          placeholder="Value"
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:ring-green-500 focus:border-green-500"
                          value={discount.value}
                          onChange={(e) =>
                            handleDiscountChange(
                              discount.id,
                              "value",
                              e.target.value
                            )
                          }
                        />
                        <span className="font-medium text-nowrap">
                          ₹ {parseFloat(discount.value || 0).toFixed(2)}
                        </span>
                        {discounts.length > 1 && (
                          <button
                            onClick={() => removeDiscount(discount.id)}
                            className="text-red-500 hover:text-red-700 text-lg ml-1"
                            aria-label="Remove Discount"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3 mt-3 space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>Total Taxable Amount</span>
                    <span className="font-medium text-nowrap">
                      ₹ {totalTaxableAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tax</span>
                    <span className="font-medium">₹ {totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Discount</span>
                    <span className="font-medium">
                      ₹ {totalDiscount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Round Off</span>
                    <span className="font-medium">₹ {roundOff.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 mt-2">
                    <span>Net Total</span>
                    <span className="text-xl text-blue-800">
                      ₹ {netTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                onClick={handleSubmitPO}
                className="px-3 py-2 h-[fit-content] bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Submit PO
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 h-[fit-content] bg-black text-white rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseModal;
