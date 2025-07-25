// components/credit-notes/CreditNoteView.tsx
import React, { useState, useEffect } from 'react';
import CreditNoteFilterAndAdd from './CreditNoteFilterAndAdd';
import CreditNoteTable from './CreditNoteTable';
import NewCreditNoteModal from './NewCreditNoteModal'; // Corresponds to Credit Note Entry modal
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal';

interface CreditNote {
  id: number;
  origin: string;
  name: string;
  gstNonGst: string;
  transactionDate: string;
  amount: number;
  comment: string;
}

// Assuming NewCreditNoteFormData aligns with Credit Note Entry modal (image_33989f.png)
interface NewCreditNoteFormData {
  chooseOrigin: string;
  name: string; // Customer Name
  ledger: string; // This field might not directly map to table, but present in modal
  amount: string;
  date: string; // Transaction date
  comment: string;
}

const CreditNoteView: React.FC = () => {
  const [isNewCreditNoteModalOpen, setIsNewCreditNoteModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingCreditNote, setEditingCreditNote] = useState<CreditNote | null>(null);

  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([
    { id: 1, origin: 'Vendor', name: 'Asian Points', gstNonGst: 'Non GST', transactionDate: '2023-09-03 16:48:15', amount: 852, comment: 'CN' },
    { id: 2, origin: 'Vendor', name: 'Asian Points', gstNonGst: 'Non GST', transactionDate: '2023-09-03 16:48:15', amount: 852, comment: 'CN' },
    { id: 3, origin: 'Vendor', name: 'Asian Points', gstNonGst: 'Non GST', transactionDate: '2023-09-03 16:48:15', amount: 852, comment: 'CN' },
    { id: 4, origin: 'Vendor', name: 'Asian Points', gstNonGst: 'Non GST', transactionDate: '2023-09-03 16:48:15', amount: 852, comment: 'CN' },
  ]);

  const [formData, setFormData] = useState<NewCreditNoteFormData>({
    chooseOrigin: "", name: "", ledger: "", amount: "", date: "", comment: "",
  });

  useEffect(() => {
    if (!isNewCreditNoteModalOpen) {
      setFormData({
        chooseOrigin: "", name: "", ledger: "", amount: "", date: "", comment: "",
      });
      setEditingCreditNote(null);
    } else if (editingCreditNote) {
      setFormData({
        chooseOrigin: editingCreditNote.origin,
        name: editingCreditNote.name,
        ledger: "", // Dummy mapping for ledger
        amount: editingCreditNote.amount.toString(),
        date: editingCreditNote.transactionDate.split(' ')[0], // Extract just the date
        comment: editingCreditNote.comment,
      });
    }
  }, [isNewCreditNoteModalOpen, editingCreditNote]);

  const handleInputChange = (field: keyof NewCreditNoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (data: NewCreditNoteFormData) => {
    if (editingCreditNote) {
      setCreditNotes(creditNotes.map((note) =>
        note.id === editingCreditNote.id
          ? {
              ...note,
              origin: data.chooseOrigin,
              name: data.name,
              gstNonGst: "Non GST", // Defaulting as per image, adjust if modal changes
              transactionDate: data.date + " 16:48:15", // Append dummy time
              amount: parseFloat(data.amount || "0"),
              comment: data.comment,
            }
          : note
      ));
      console.log("Credit Note updated:", data);
    } else {
      const newId = Math.max(...creditNotes.map(note => note.id)) + 1;
      const newCreditNote: CreditNote = {
        id: newId,
        origin: data.chooseOrigin,
        name: data.name,
        gstNonGst: "Non GST", // Defaulting as per image
        transactionDate: data.date + " 16:48:15", // Default time
        amount: parseFloat(data.amount || "0"),
        comment: data.comment,
      };
      setCreditNotes([...creditNotes, newCreditNote]);
      console.log("New Credit Note added:", newCreditNote);
    }
    setIsNewCreditNoteModalOpen(false);
    setEditingCreditNote(null);
  };

  const handleSearchClick = () => {
    console.log("Searching credit notes with:", { searchDate, searchTerm });
  };

  const handleEditClick = (note: CreditNote) => {
    setEditingCreditNote(note);
    setIsNewCreditNoteModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDeleteId(id);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDeleteId !== null) {
      setCreditNotes(creditNotes.filter(note => note.id !== itemToDeleteId));
      console.log("Credit Note deleted with ID:", itemToDeleteId);
      setItemToDeleteId(null);
    }
    setIsDeleteConfirmModalOpen(false);
  };

  return (
    <>
      <CreditNoteFilterAndAdd
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => { setIsNewCreditNoteModalOpen(true); setEditingCreditNote(null); }}
        onSearchClick={handleSearchClick}
      />
      <CreditNoteTable notes={creditNotes} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      <NewCreditNoteModal
        isOpen={isNewCreditNoteModalOpen}
        onClose={() => { setIsNewCreditNoteModalOpen(false); setEditingCreditNote(null); }}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={!!editingCreditNote}
        initialData={editingCreditNote}
      />
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => { setIsDeleteConfirmModalOpen(false); setItemToDeleteId(null); }}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CreditNoteView;