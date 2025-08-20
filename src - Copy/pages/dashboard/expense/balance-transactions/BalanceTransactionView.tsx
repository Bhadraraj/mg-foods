// components/balance-transactions/BalanceTransactionView.tsx
import React, { useState, useEffect } from 'react';
import BalanceTransactionFilterAndAdd from './BalanceTransactionFilterAndAdd';
import BalanceTransactionTable from './BalanceTransactionTable';
import NewBalanceTransactionModal from './NewBalanceTransactionModal'; // Corresponds to Add Old Balance modal
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal';

interface BalanceTransaction {
  id: number;
  origin: string;
  customerName: string;
  transactionType: string;
  accountType: string;
  transactionDate: string;
  amount: number;
  settled: 'Yes' | 'No';
  comment: string;
}

// Assuming NewBalanceTransactionFormData aligns with Add Old Balance modal (image_3398e1.png)
interface NewBalanceTransactionFormData {
  chooseOrigin: string;
  customerName: string; // Assuming this maps to Customer Name in table
  chooseBank: string;
  paymentMode: string;
  transactionNo: string;
  amount: string;
  date: string; // Corresponds to Transaction Date in table
  accountType: 'Credit' | 'Debit';
  transactionType: 'Cash' | 'Bank'; // This is payment method here, not type of transaction (deposit/withdrawal)
  comment: string;
}

const BalanceTransactionView: React.FC = () => {
  const [isNewBalanceModalOpen, setIsNewBalanceModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [editingBalanceTransaction, setEditingBalanceTransaction] = useState<BalanceTransaction | null>(null);

  const [balanceTransactions, setBalanceTransactions] = useState<BalanceTransaction[]>([
    { id: 1, origin: 'Vendor', customerName: 'Sri Senthi Points\n[9176614091]', transactionType: 'Cash', accountType: 'Debit', transactionDate: '2022-04-04\n08:36:25', amount: 32353, settled: 'Yes', comment: 'IMPS No:\n209418828148' },
    { id: 2, origin: 'Vendor', customerName: 'Sri Senthi Points\n[9176614091]', transactionType: 'Cash', accountType: 'Debit', transactionDate: '2022-04-04\n08:36:25', amount: 32353, settled: 'Yes', comment: 'IMPS No:\n209418828148' },
  ]);

  const [formData, setFormData] = useState<NewBalanceTransactionFormData>({
    chooseOrigin: "", customerName: "", chooseBank: "", paymentMode: "", transactionNo: "", amount: "", date: "", accountType: 'Credit', transactionType: 'Cash', comment: "",
  });

  useEffect(() => {
    if (!isNewBalanceModalOpen) {
      setFormData({
        chooseOrigin: "", customerName: "", chooseBank: "", paymentMode: "", transactionNo: "", amount: "", date: "", accountType: 'Credit', transactionType: 'Cash', comment: "",
      });
      setEditingBalanceTransaction(null);
    } else if (editingBalanceTransaction) {
      setFormData({
        chooseOrigin: editingBalanceTransaction.origin,
        customerName: editingBalanceTransaction.customerName.split('\n')[0], // Extract just the name
        chooseBank: "", // Dummy mapping
        paymentMode: editingBalanceTransaction.transactionType, // Maps 'Cash' to paymentMode
        transactionNo: editingBalanceTransaction.comment.replace('IMPS No:\n', ''), // Extract transaction no from comment
        amount: editingBalanceTransaction.amount.toString(),
        date: editingBalanceTransaction.transactionDate.split('\n')[0], // Extract just the date
        accountType: editingBalanceTransaction.accountType as 'Credit' | 'Debit',
        transactionType: editingBalanceTransaction.transactionType as 'Cash' | 'Bank', // Maps 'Cash' to transactionType radio
        comment: editingBalanceTransaction.comment,
      });
    }
  }, [isNewBalanceModalOpen, editingBalanceTransaction]);

  const transactionTypes = ["Deposit", "Withdrawal", "Transfer"]; // This might be more related to the 'type' shown in image_339c5e.png, not 'Balance TXN' tab

  const handleSubmit = (data: NewBalanceTransactionFormData) => {
    if (editingBalanceTransaction) {
      setBalanceTransactions(balanceTransactions.map((txn) =>
        txn.id === editingBalanceTransaction.id
          ? {
              ...txn,
              origin: data.chooseOrigin,
              customerName: data.customerName,
              transactionType: data.paymentMode, // Use paymentMode for Transaction Type in table
              accountType: data.accountType,
              transactionDate: data.date + " 08:00:00", // Append dummy time
              amount: parseFloat(data.amount || "0"),
              settled: 'Yes', // Default to Yes
              comment: data.comment || `IMPS No:\n${data.transactionNo}`, // Reconstruct comment
            }
          : txn
      ));
      console.log("Balance Transaction updated:", data);
    } else {
      const newId = Math.max(...balanceTransactions.map(txn => txn.id)) + 1;
      const newTransaction: BalanceTransaction = {
        id: newId,
        origin: data.chooseOrigin,
        customerName: data.customerName,
        transactionType: data.paymentMode,
        accountType: data.accountType,
        transactionDate: data.date + " 08:00:00", // Default time
        amount: parseFloat(data.amount || "0"),
        settled: 'Yes', // Default
        comment: data.comment || `IMPS No:\n${data.transactionNo}`,
      };
      setBalanceTransactions([...balanceTransactions, newTransaction]);
      console.log("New Balance Transaction added:", newTransaction);
    }
    setIsNewBalanceModalOpen(false);
    setEditingBalanceTransaction(null);
  };

  const handleInputChange = (field: keyof NewBalanceTransactionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchClick = () => {
    console.log("Searching balance transactions with:", { searchType, searchTerm });
  };

  const handleEditClick = (transaction: BalanceTransaction) => {
    setEditingBalanceTransaction(transaction);
    setIsNewBalanceModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDeleteId(id);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDeleteId !== null) {
      setBalanceTransactions(balanceTransactions.filter(txn => txn.id !== itemToDeleteId));
      console.log("Balance Transaction deleted with ID:", itemToDeleteId);
      setItemToDeleteId(null);
    }
    setIsDeleteConfirmModalOpen(false);
  };

  return (
    <>
      <BalanceTransactionFilterAndAdd
        searchType={searchType}
        setSearchType={setSearchType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => { setIsNewBalanceModalOpen(true); setEditingBalanceTransaction(null); }}
        onSearchClick={handleSearchClick}
        transactionTypes={transactionTypes} // Still using this for filter, if applicable
      />
      <BalanceTransactionTable
        transactions={balanceTransactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <NewBalanceTransactionModal
        isOpen={isNewBalanceModalOpen}
        onClose={() => { setIsNewBalanceModalOpen(false); setEditingBalanceTransaction(null); }}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={!!editingBalanceTransaction}
        initialData={editingBalanceTransaction}
      />
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => { setIsDeleteConfirmModalOpen(false); setItemToDeleteId(null); }}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default BalanceTransactionView;