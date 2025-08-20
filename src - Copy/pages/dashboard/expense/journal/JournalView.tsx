// components/journal/JournalView.tsx
import React, { useState, useEffect } from 'react';
import JournalFilterAndAdd from './JournalFilterAndAdd';
import JournalTable from './JournalTable';
import NewJournalModal from './NewJournalModal';
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal';

interface JournalEntry {
  id: number;
  billNo: string;
  billDate: string;
  financialYear: string;
  gstBill: 'yes' | 'no';
  amount: number;
} 
interface NewJournalFormData {
  billTaxType: 'GST Bill' | 'Non GST Bill';
  chooseDebitCategory: string;  
  chooseDebitBank: string; 
  chooseCreditCategory: string; 
  chooseCreditBank: string; // Example, adjust based on actual options
  billDate: string;
  totalAmount: string;
  billNo: string;
}

const JournalView: React.FC = () => {
  const [isNewJournalModalOpen, setIsNewJournalModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingJournalEntry, setEditingJournalEntry] = useState<JournalEntry | null>(null);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: 1, billNo: '481574725100', billDate: '2025-02-21 11:17:31', financialYear: '2024-2025', gstBill: 'no', amount: 2 },
  ]);

  const [formData, setFormData] = useState<NewJournalFormData>({
    billTaxType: 'GST Bill', chooseDebitCategory: "", chooseDebitBank: "", chooseCreditCategory: "", chooseCreditBank: "", billDate: "", totalAmount: "", billNo: "",
  });

  useEffect(() => {
    if (!isNewJournalModalOpen) {
      setFormData({
        billTaxType: 'GST Bill', chooseDebitCategory: "", chooseDebitBank: "", chooseCreditCategory: "", chooseCreditBank: "", billDate: "", totalAmount: "", billNo: "",
      });
      setEditingJournalEntry(null);
    } else if (editingJournalEntry) {
      setFormData({
        billTaxType: editingJournalEntry.gstBill === 'yes' ? 'GST Bill' : 'Non GST Bill',
        chooseDebitCategory: "", // Dummy mapping
        chooseDebitBank: "", // Dummy mapping
        chooseCreditCategory: "", // Dummy mapping
        chooseCreditBank: "", // Dummy mapping
        billDate: editingJournalEntry.billDate.split(' ')[0], // Extract just the date
        totalAmount: editingJournalEntry.amount.toString(),
        billNo: editingJournalEntry.billNo,
      });
    }
  }, [isNewJournalModalOpen, editingJournalEntry]);

  const handleSubmit = (data: NewJournalFormData) => {
    if (editingJournalEntry) {
      setJournalEntries(journalEntries.map((entry) =>
        entry.id === editingJournalEntry.id
          ? {
              ...entry,
              billNo: data.billNo,
              billDate: data.billDate + " 00:00:00", // Append dummy time for consistency if needed
              financialYear: "2024-2025", // This might need to be dynamically determined or removed
              gstBill: data.billTaxType === 'GST Bill' ? 'yes' : 'no',
              amount: parseFloat(data.totalAmount || "0"),
            }
          : entry
      ));
      console.log("Journal Entry updated:", data);
    } else {
      const newId = Math.max(...journalEntries.map(entry => entry.id)) + 1;
      const newEntry: JournalEntry = {
        id: newId,
        billNo: data.billNo,
        billDate: data.billDate + " 00:00:00",
        financialYear: "2024-2025", // Default
        gstBill: data.billTaxType === 'GST Bill' ? 'yes' : 'no',
        amount: parseFloat(data.totalAmount || "0"),
      };
      setJournalEntries([...journalEntries, newEntry]);
      console.log("New Journal Entry added:", newEntry);
    }
    setIsNewJournalModalOpen(false);
    setEditingJournalEntry(null);
  };

  const handleInputChange = (field: keyof NewJournalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchClick = () => {
    console.log("Searching journal with:", { searchDate, searchTerm });
  };

  const handleEditClick = (entry: JournalEntry) => {
    setEditingJournalEntry(entry);
    setIsNewJournalModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDeleteId(id);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDeleteId !== null) {
      setJournalEntries(journalEntries.filter(entry => entry.id !== itemToDeleteId));
      console.log("Journal Entry deleted with ID:", itemToDeleteId);
      setItemToDeleteId(null);
    }
    setIsDeleteConfirmModalOpen(false);
  };

  return (
    <>
      <JournalFilterAndAdd
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        onAddClick={() => { setIsNewJournalModalOpen(true); setEditingJournalEntry(null); }}
        onSearchClick={handleSearchClick}
      />
      <JournalTable entries={journalEntries} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      <NewJournalModal
        isOpen={isNewJournalModalOpen}
        onClose={() => { setIsNewJournalModalOpen(false); setEditingJournalEntry(null); }}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={!!editingJournalEntry}
        initialData={editingJournalEntry}
      />
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => { setIsDeleteConfirmModalOpen(false); setItemToDeleteId(null); }}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default JournalView;