import React, { useState } from "react";
import { X } from "lucide-react";
import BillDetailsSection from "./BillDetailsSection";
import SaleSummarySection from "./SaleSummarySection";
import { PaymentData } from "./types"; 
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paymentData }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cashReturn, setCashReturn] = useState("");
  const [txnNumber, setTxnNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Payment</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Customer Mobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BillDetailsSection paymentData={paymentData} />
          <SaleSummarySection
            paymentData={paymentData}
            amountReceived={amountReceived}
            setAmountReceived={setAmountReceived}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cashReturn={cashReturn}
            setCashReturn={setCashReturn}
            txnNumber={txnNumber}
            setTxnNumber={setTxnNumber}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;