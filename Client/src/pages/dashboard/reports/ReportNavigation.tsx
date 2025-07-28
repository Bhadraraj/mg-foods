import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ReportNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const mainTabs = [
  { id: 'gst', label: 'GST report' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'brand', label: 'Brand report' },
  { id: 'product', label: 'Product report' },
  { id: 'hsn', label: 'HSN Report' },
  { id: 'creditors', label: 'Creditors' },
  { id: 'debtors', label: 'Debtors' },
];

const accountsOptions = [
  { id: 'tax-report', label: 'Tax Report' },
  { id: 'cash-book', label: 'Cash Book' },
  { id: 'bank-report', label: 'Bank report' },
  { id: 'trade-pl', label: 'Trade & PL' },
  { id: 'trial-balance', label: 'Trial Balance' },
  { id: 'balance-sheet', label: 'Balance Sheet' },
  { id: 'discount', label: 'Discount' },
  { id: 'sales-round-off', label: 'Sales Round off' },
  { id: 'purchase-round-off', label: 'Purchase Round off' }
];

const moreOptions = [
  { id: 'stock-report', label: 'Stock report' },
  { id: 'labour-report', label: 'Labour report' },
  { id: 'sales-summary', label: 'Sales Summary' },
  { id: 'kot-support', label: 'KOT Support' }
];

const ReportNavigation: React.FC<ReportNavigationProps> = ({ activeTab, onTabChange }) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAccountsDropdown, setShowAccountsDropdown] = useState(false);

  const handleMainTabClick = (tabId: string) => {
    onTabChange(tabId);
    setShowMoreDropdown(false);
    setShowAccountsDropdown(false);
  };

  const handleAccountsDropdownToggle = () => {
    setShowAccountsDropdown(!showAccountsDropdown);
    setShowMoreDropdown(false);
  };

  const handleMoreDropdownToggle = () => {
    setShowMoreDropdown(!showMoreDropdown);
    setShowAccountsDropdown(false);
  };

  const handleDropdownItemClick = (tabId: string) => {
    onTabChange(tabId);
    setShowMoreDropdown(false);
    setShowAccountsDropdown(false);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleMainTabClick(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="relative">
          <button
            onClick={handleAccountsDropdownToggle}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${accountsOptions.some(opt => opt.id === activeTab)
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Accounts
            {showAccountsDropdown ? <ChevronDown size={16} className="ml-1" /> : <ChevronRight size={16} className="ml-1" />}
          </button>
          {showAccountsDropdown && (
            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {accountsOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDropdownItemClick(option.id)}
                    className={`block w-full text-left px-4 py-2 text-sm
                      ${activeTab === option.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                    `}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={handleMoreDropdownToggle}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
               ${moreOptions.some(opt => opt.id === activeTab)
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            More
            {showMoreDropdown ? <ChevronDown size={16} className="ml-1" /> : <ChevronRight size={16} className="ml-1" />}
          </button>
          {showMoreDropdown && (
            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {moreOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDropdownItemClick(option.id)}
                    className={`block w-full text-left px-4 py-2 text-sm
                     ${activeTab === option.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                    `}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default ReportNavigation;