// components/expenses/ExpenseComponent.tsx
import React, { useState } from "react";
import ExpenseTabs from "./expense/ExpenseTabs"; // Re-using the tab component
import ExpenseView from "./expense/ExpenseView"; // This will contain the existing ExpenseFilterAndAdd and ExpenseTable logic
import JournalView from "./expense/journal/JournalView"; // New: Placeholder for Journal view
import BalanceTransactionView from "./expense/balance-transactions/BalanceTransactionView"; // New: Placeholder for Balance Transaction view
import CreditNoteView from "./expense/creditnote/CreditNoteView"; // New: Placeholder for Credit Note view

const ExpenseComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Expense"); // Default active tab

  const renderContent = () => {
    switch (activeTab) {
      case "Expense":
        return <ExpenseView />;
      case "Journal":
        return <JournalView />;
      case "Balance Transaction":
        return <BalanceTransactionView />;
      case "Credit Note":
        return <CreditNoteView />;
      default:
        return <ExpenseView />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      <ExpenseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ExpenseComponent;