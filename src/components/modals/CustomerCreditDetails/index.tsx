import React, { useState } from "react";
import Modal from "../../ui/Modal";
import { Button, Input } from "../../ui";

interface CustomerCreditDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tableNo: string;
}

const CustomerCreditDetails: React.FC<CustomerCreditDetailsProps> = ({ 
  isOpen, 
  onClose, 
  tableNo 
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [duePeriod, setDuePeriod] = useState("");

  const handleSaveAndContinue = () => {
    console.log("Saving Customer Credit Details:", {
      tableNo,
      customerName,
      customerMobile,
      duePeriod,
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Customer Credit Details - ${tableNo}`}
      size="sm"
    >
      <div className="p-6 space-y-4">
        <Input
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        
        <Input
          label="Customer Mobile"
          type="tel"
          value={customerMobile}
          onChange={(e) => setCustomerMobile(e.target.value)}
          required
        />
        
        <Input
          label="Due period"
          value={duePeriod}
          onChange={(e) => setDuePeriod(e.target.value)}
          placeholder="e.g., 7 days, 1 month"
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="primary" onClick={handleSaveAndContinue}>
            Save & Continue
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerCreditDetails;