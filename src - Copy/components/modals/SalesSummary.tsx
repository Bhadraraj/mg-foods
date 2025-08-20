import React, { useState, useEffect } from "react";
import { X, MinusCircle } from "lucide-react";
import { PaymentData } from "../types";

interface SalesSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData;
}

interface Discount {
  id: string;
  comment: string;
  type: "percentage" | "fixed";
  value: string;
  amount: number;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  isOpen,
  onClose,
  paymentData,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cashReturn, setCashReturn] = useState("");
  const [txnNumber, setTxnNumber] = useState("");
  const [waiterTip, setWaiterTip] = useState(paymentData.waiterTip.toFixed(2));
  const [showDiscountInputs, setShowDiscountInputs] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const calculateTotals = () => {
    let currentSubTotal = paymentData.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    let currentTotal =
      currentSubTotal +
      paymentData.charges.service +
      paymentData.charges.ac +
      paymentData.charges.gst +
      paymentData.charges.cgst +
      parseFloat(waiterTip || "0");

    let totalDiscountAmount = 0;
    discounts.forEach((discount) => {
      totalDiscountAmount += discount.amount;
    });
    currentTotal -= totalDiscountAmount;

    if (currentTotal < 0) {
      currentTotal = 0;
    }

    return {
      subTotal: currentSubTotal,
      total: currentTotal,
      grandTotal: currentTotal,
    };
  };

  const { subTotal, total, grandTotal } = calculateTotals();

  useEffect(() => {
    const received = parseFloat(amountReceived);
    if (!isNaN(received) && received > grandTotal) {
      setCashReturn((received - grandTotal).toFixed(2));
    } else {
      setCashReturn("0.00");
    }
  }, [amountReceived, grandTotal]);

  const handleAddDiscount = () => {
    setDiscounts((prevDiscounts) => [
      ...prevDiscounts,
      {
        id: Date.now().toString(),
        comment: "",
        type: "percentage",
        value: "",
        amount: 0,
      },
    ]);
    setShowDiscountInputs(true);
  };

  const handleDiscountChange = (
    id: string,
    field: keyof Discount,
    value: string
  ) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.map((disc) => {
        if (disc.id === id) {
          const updatedDisc = { ...disc, [field]: value };

          if (field === "value" || field === "type") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              if (updatedDisc.type === "percentage") {
                updatedDisc.amount = subTotal * (numValue / 100);
              } else {
                updatedDisc.amount = numValue;
              }
            } else {
              updatedDisc.amount = 0;
            }
          }
          return updatedDisc;
        }
        return disc;
      })
    );
  };

  const handleRemoveDiscount = (id: string) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.filter((disc) => disc.id !== id)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      {" "}
      {/* Added responsive padding */}
      <div className="bg-white rounded-lg w-full max-w-5xl mx-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {" "}
        {/* Adjusted max-w and max-h */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg font-medium text-blue-800 mb-2 sm:mb-0">
            Payment
          </h2>{" "}
          {/* Responsive text size, margin */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {" "}
            {/* Stack on small, row on medium */}
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded-md text-sm w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Customer Mobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded-md text-sm w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-200 transition-colors self-end sm:self-auto"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow overflow-hidden">
          {/* Bill Details Section (Left Side) */}
          <div className="space-y-3 flex flex-col overflow-hidden">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Bill No</span>
                <br />
                <span className="text-gray-900">{paymentData.billNo}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Table No</span>
                <br />
                <span className="text-gray-900">{paymentData.tableNo}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date</span>
                <br />
                <span className="text-gray-900">{paymentData.date}</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm flex-grow min-h-0 flex flex-col">
              <button
                onClick={handleAddDiscount}
                className="flex items-center justify-center sm:justify-start gap-1 font-medium text-gray-800 py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 mb-2 text-sm w-full sm:w-auto"
              >
                + Discount
              </button>

              {showDiscountInputs && (
                <div
                  className="space-y-2 mb-3 overflow-y-auto custom-scrollbar pr-2"
                  style={{ maxHeight: "70px" }}
                >
                  {discounts.length > 0 ? (
                    discounts.map((disc) => (
                      <div
                        key={disc.id}
                        className="grid grid-cols-5 gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Comment"
                          value={disc.comment}
                          onChange={(e) =>
                            handleDiscountChange(
                              disc.id,
                              "comment",
                              e.target.value
                            )
                          }
                          className="col-span-2 px-2 py-0.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <select
                          value={disc.type}
                          onChange={(e) =>
                            handleDiscountChange(
                              disc.id,
                              "type",
                              e.target.value as "percentage" | "fixed"
                            )
                          }
                          className="px-2 py-0.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">₹</option>
                        </select>
                        <input
                          type="number"
                          placeholder="00.00"
                          value={disc.value}
                          onChange={(e) =>
                            handleDiscountChange(
                              disc.id,
                              "value",
                              e.target.value
                            )
                          }
                          className="px-2 py-0.5 border border-gray-300 rounded-md text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveDiscount(disc.id)}
                          className="text-red-500 hover:text-red-700 p-0.5 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <MinusCircle size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-[30px] flex items-center justify-center text-gray-400 text-sm italic">
                      No discounts added. Click '+ Discount' to add one.
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-sm text-gray-700 mt-auto">
                <div className="flex justify-between">
                  <span>Service charges</span>
                  <span>₹ {paymentData.charges.service.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>AC Charges</span>
                  <span>₹ {paymentData.charges.ac.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹ {paymentData.charges.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span>₹ {paymentData.charges.cgst.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-gray-700">Waiter's tip</span>
              <input
                type="number"
                value={waiterTip}
                onChange={(e) => setWaiterTip(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 font-bold text-base text-gray-900">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold  "
                placeholder="Amount received"
              />
              <button className="w-full py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm">
                Advance
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => setPaymentMethod("Cash")}
                className={`py-1.5 px-3 rounded-md border text-base font-medium ${
                  paymentMethod === "Cash"
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                } transition-all`}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod("Card")}
                className={`py-1.5 px-3 rounded-md border text-base font-medium ${
                  paymentMethod === "Card"
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                } transition-all`}
              >
                Card
              </button>
            </div>
            <button
              onClick={() => setPaymentMethod("UPI")}
              className={`w-full py-1.5 px-3 rounded-md border text-base font-medium ${
                paymentMethod === "UPI"
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              } transition-all`}
            >
              UPI
            </button>
          </div>
          <div className="space-y-3 flex flex-col overflow-hidden">
            <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm flex-grow flex flex-col min-h-0">
              <h3 className="font-medium mb-2 text-gray-800">Sale summary</h3>
              <div className="grid grid-cols-4 gap-3 text-sm font-semibold mb-1.5 pb-1 border-b border-gray-200 text-gray-700">
                <span>#</span>
                <span>Item</span>
                <span>Qty</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-1.5">
                {paymentData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-4 gap-3 text-sm py-1 border-b border-gray-100 last:border-b-0 text-gray-800"
                  >
                    <span>{index + 1}</span>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span className="text-right">
                      ₹ {item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5 text-gray-800">
                <div className="flex justify-between text-sm">
                  <span>
                    Total Qty:{" "}
                    <span className="font-medium">
                      {paymentData.items.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </span>
                  </span>
                  <span>
                    Sub Total:{" "}
                    <span className="font-medium">₹ {subTotal.toFixed(2)}</span>
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Grand Total</span>
                  <span>₹ {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                placeholder="Cash Return"
                value={cashReturn}
                readOnly
                className="px-2 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-gray-50 focus:outline-none text-sm"
              />
              <input
                type="text"
                placeholder="Txn Number"
                value={txnNumber}
                onChange={(e) => setTxnNumber(e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-black text-white py-2 px-3 rounded-md hover:bg-gray-800 transition-colors text-base font-medium">
                Save
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-base font-medium">
                Save & Print
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-base font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
