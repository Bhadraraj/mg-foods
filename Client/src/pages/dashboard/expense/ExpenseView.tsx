import React, { useState, useEffect } from "react";  
import ExpenseFilterAndAdd from "./ExpenseFilterAndAdd";
import ExpenseTable from "./ExpenseTable";
import NewExpenseModal from "./NewExpenseModal";

// Define the type for an Expense item (updated with optional id for new expenses)
interface Expense {
  id: number;
  entryDate: string;
  transactionType: string;
  voucherNo: string;
  txnRefNo: string;
  comments: string;
  transactionDate: string;
  credit: number;
  debit: number;
  balanceAmount: number;
}

// Define the type for the New Expense form data (match NewExpenseModal internal state)
interface NewExpenseFormData {
  ledger: string;
  bankName: string;
  financialYear: string;
  paymentMode: string;
  transactionNo: string;
  debitAmount: string;
  vendorName: string;
  purchaseId: string;
  comment: string;
}

const ExpenseView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("Bank");
  const [txnMethod, setTxnMethod] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null); // New state for editing

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      entryDate: "2025-05-17",
      transactionType: "Other Transaction",
      voucherNo: "BNK-VOC-NO:96",
      txnRefNo: "475008027559",
      comments: "-",
      transactionDate: "2025-05-17",
      credit: 0,
      debit: 12.93,
      balanceAmount: 0,
    },
    {
      id: 2,
      entryDate: "2025-05-17",
      transactionType: "Balance Transaction",
      voucherNo: "BNK-VOC-NO:96",
      txnRefNo: "475008027559",
      comments: "-",
      transactionDate: "2025-05-17",
      credit: 1167,
      debit: 0,
      balanceAmount: 0,
    },
    {
      id: 3,
      entryDate: "2025-05-17",
      transactionType: "Other Transaction",
      voucherNo: "BNK-VOC-NO:96",
      txnRefNo: "475008027559",
      comments: "-",
      transactionDate: "2025-05-17",
      credit: 1167,
      debit: 12.93,
      balanceAmount: 0,
    },
    {
      id: 4,
      entryDate: "2025-05-17",
      transactionType: "Settlement",
      voucherNo: "BNK-VOC-NO:96",
      txnRefNo: "475008027559",
      comments: "-",
      transactionDate: "2025-05-17",
      credit: 0,
      debit: 12.93,
      balanceAmount: 0,
    },
  ]);

  // Note: This formData is used for the modal's internal state.
  // When editing, the modal will initialize its internal state from editingExpense.
  const [formData, setFormData] = useState<NewExpenseFormData>({
    ledger: "",
    bankName: "",
    financialYear: "",
    paymentMode: "",
    transactionNo: "",
    debitAmount: "",
    vendorName: "",
    purchaseId: "",
    comment: "",
  });

  // Effect to reset formData when modal is closed or editingExpense changes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        ledger: "", bankName: "", financialYear: "", paymentMode: "",
        transactionNo: "", debitAmount: "", vendorName: "", purchaseId: "", comment: "",
      });
      setEditingExpense(null); // Clear editing expense when modal closes
    } else if (editingExpense) {
      // When opening for edit, populate formData from editingExpense
      // This mapping needs to be accurate based on how your modal fields align with Expense properties
      setFormData({
        ledger: "Default Ledger", // You'll need to map this from Expense if available
        bankName: "Default Bank", // Map from Expense
        financialYear: "2025-2026", // Map from Expense
        paymentMode: "Bank", // Map from Expense
        transactionNo: editingExpense.txnRefNo,
        debitAmount: editingExpense.debit.toString(),
        vendorName: "Default Vendor", // Map from Expense
        purchaseId: editingExpense.voucherNo, // Example: Using voucherNo as purchaseId
        comment: editingExpense.comments,
      });
      setActiveModalTab("Bank"); // Or based on transactionType
    }
  }, [isModalOpen, editingExpense]);


  const transactionTypes = [
    "Other Transaction",
    "Balance Transaction",
    "Settlement",
    "Purchase Transaction",
    "Sale Transaction",
  ];

  const handleSubmit = (data: NewExpenseFormData) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(expenses.map((exp) =>
        exp.id === editingExpense.id
          ? {
              ...exp,
              // Update relevant fields from formData
              txnRefNo: data.transactionNo,
              debit: parseFloat(data.debitAmount || "0"),
              comments: data.comment,
              voucherNo: data.purchaseId, // Example mapping
              // ... other fields as needed
            }
          : exp
      ));
      console.log("Expense updated:", data);
    } else {
      // Add new expense
      const newId = Math.max(...expenses.map(exp => exp.id)) + 1;
      const newExpense: Expense = {
        id: newId,
        entryDate: new Date().toISOString().split('T')[0], // Current date
        transactionType: "Other Transaction", // Default or determine from data
        voucherNo: data.purchaseId || `VOC-${newId}`,
        txnRefNo: data.transactionNo || `REF-${newId}`,
        comments: data.comment,
        transactionDate: new Date().toISOString().split('T')[0], // Current date
        credit: 0, // Default for new expense, adjust as needed
        debit: parseFloat(data.debitAmount || "0"),
        balanceAmount: 0, // Calculate based on logic
      };
      setExpenses([...expenses, newExpense]);
      console.log("New expense added:", newExpense);
    }
    setIsModalOpen(false);
    setEditingExpense(null); // Clear editing state
  };

  const handleInputChange = (field: keyof NewExpenseFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchClick = () => {
    console.log("Searching expenses with:", { txnMethod, searchDate, searchTerm });
    // Implement actual search/filter logic for expenses here
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenseFilterAndAdd
        txnMethod={txnMethod}
        setTxnMethod={setTxnMethod}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => { setIsModalOpen(true); setEditingExpense(null); }} // Clear editing state on Add
        onSearchClick={handleSearchClick}
        transactionTypes={transactionTypes}
      />
      <ExpenseTable expenses={expenses} onEdit={handleEditClick} /> {/* Pass onEdit */}
      <NewExpenseModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
        activeTab={activeModalTab}
        setActiveTab={setActiveModalTab}
        formData={formData} // Pass current formData (either new or pre-filled)
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={!!editingExpense} // Pass a flag for edit mode
        initialData={editingExpense} 
      />
    </>
  );
};

export default ExpenseView;