import React from "react";
import { PaymentData } from "./types";  
interface SaleSummarySectionProps {
  paymentData: PaymentData;
  amountReceived: string;
  setAmountReceived: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cashReturn: string;
  setCashReturn: (value: string) => void;
  txnNumber: string;
  setTxnNumber: (value: string) => void;
  onClose: () => void;
}

const SaleSummarySection: React.FC<SaleSummarySectionProps> = ({
  paymentData,
  amountReceived,
  setAmountReceived,
  paymentMethod,
  setPaymentMethod,
  cashReturn,
  setCashReturn,
  txnNumber,
  setTxnNumber,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Sale summary</h3>
        <div className="grid grid-cols-4 gap-4 text-sm font-medium mb-2">
          <span>#</span>
          <span>Item</span>
          <span>Qty</span>
          <span className="text-right">Amount</span>
        </div>
        {paymentData.items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-4 gap-4 text-sm py-1"
          >
            <span>{index + 1}</span>
            <span>{item.name}</span>
            <span>{item.quantity}</span>
            <span className="text-right">₹ {item.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>Total Qty: {paymentData.items.length}</span>
            <span>Sub Total: ₹ {paymentData.subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span></span>
            <span>Grand Total: ₹ {paymentData.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center text-gray-600">Amount received</div>
        <input
          type="number"
          value={amountReceived}
          onChange={(e) => setAmountReceived(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
          placeholder="0.00"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={`py-2 px-4 rounded-md border ${
              paymentMethod === "Cash"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "border-gray-300"
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod("Card")}
            className={`py-2 px-4 rounded-md border ${
              paymentMethod === "Card"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "border-gray-300"
            }`}
          >
            Card
          </button>
        </div>

        <button
          onClick={() => setPaymentMethod("UPI")}
          className={`w-full py-2 px-4 rounded-md border ${
            paymentMethod === "UPI"
              ? "bg-blue-100 border-blue-300 text-blue-700"
              : "border-gray-300"
          }`}
        >
          UPI
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cash Return"
          value={cashReturn}
          onChange={(e) => setCashReturn(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Txn Number"
          value={txnNumber}
          onChange={(e) => setTxnNumber(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
          Save
        </button>
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Save & Print
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SaleSummarySection;