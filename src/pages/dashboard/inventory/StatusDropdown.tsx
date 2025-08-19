import React, { useState, useRef, useEffect } from 'react';

interface StatusDropdownProps {
  onStatusChange?: (status: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = ['All', 'Low Stock', 'Well Stocked', 'Out Of Stock'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsOpen(false);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none flex items-center justify-between min-w-[120px]"
      >
        <span>{selectedStatus}</span>
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleStatusSelect(option)}
              className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg focus:bg-gray-50 focus:outline-none"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
