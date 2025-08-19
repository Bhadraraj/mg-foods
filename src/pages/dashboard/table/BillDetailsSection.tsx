import React from "react";
import { PaymentData } from "./types"; 
interface BillDetailsSectionProps {
  paymentData: PaymentData;
}

const BillDetailsSection: React.FC<BillDetailsSectionProps> = ({ paymentData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">Bill No:</span> {paymentData.billNo}
        </div>
        <div>
          <span className="font-medium">Table No:</span> {paymentData.tableNo}
        </div>
        <div>
          <span className="font-medium">Date:</span> {paymentData.date}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">+ Discount</span>
        </div>
        <div className="space-y-2 text-sm">
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

      <div className="flex justify-between items-center py-2 border-t">
        <span>Waiter's tip</span>
        <span>₹ {paymentData.waiterTip.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center py-2 border-t font-medium">
        <span>Total</span>
        <span>₹ {paymentData.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BillDetailsSection;