// components/expenses/ExpenseTabs.tsx
import React from 'react';

interface ExpenseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ExpenseTabs: React.FC<ExpenseTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["Expense", "Journal", "Balance Transaction", "Credit Note"];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              } font-medium whitespace-nowrap`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTabs;