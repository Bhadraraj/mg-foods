import React from "react";

interface TableViewTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

const TableViewTabs: React.FC<TableViewTabsProps> = ({
  activeTab,
  setActiveTab,
  tabs,
}) => {
  return (
    <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === tab
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TableViewTabs;