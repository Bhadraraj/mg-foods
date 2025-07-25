import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (fromDate: Date, toDate: Date) => void;
  initialFromDate: Date;
  initialToDate: Date;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFromDate,
  initialToDate,
}) => {
  const [fromDate, setFromDate] = useState<Date>(initialFromDate);
  const [toDate, setToDate] = useState<Date>(initialToDate);
  const [currentMonthFrom, setCurrentMonthFrom] = useState(initialFromDate.getMonth());
  const [currentYearFrom, setCurrentYearFrom] = useState(initialFromDate.getFullYear());
  const [currentMonthTo, setCurrentMonthTo] = useState(initialToDate.getMonth());
  const [currentYearTo, setCurrentYearTo] = useState(initialToDate.getFullYear());

  useEffect(() => {
    if (isOpen) {
      setFromDate(initialFromDate);
      setToDate(initialToDate);
      setCurrentMonthFrom(initialFromDate.getMonth());
      setCurrentYearFrom(initialFromDate.getFullYear());
      setCurrentMonthTo(initialToDate.getMonth());
      setCurrentYearTo(initialToDate.getFullYear());
    }
  }, [isOpen, initialFromDate, initialToDate]);

  if (!isOpen) return null;

  const generateDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePrevMonth = (type: 'from' | 'to') => {
    if (type === 'from') {
      setCurrentMonthFrom(prev => (prev === 0 ? 11 : prev - 1));
      if (currentMonthFrom === 0) setCurrentYearFrom(prev => prev - 1);
    } else {
      setCurrentMonthTo(prev => (prev === 0 ? 11 : prev - 1));
      if (currentMonthTo === 0) setCurrentYearTo(prev => prev - 1);
    }
  };

  const handleNextMonth = (type: 'from' | 'to') => {
    if (type === 'from') {
      setCurrentMonthFrom(prev => (prev === 11 ? 0 : prev + 1));
      if (currentMonthFrom === 11) setCurrentYearFrom(prev => prev + 1);
    } else {
      setCurrentMonthTo(prev => (prev === 11 ? 0 : prev + 1));
      if (currentMonthTo === 11) setCurrentYearTo(prev => prev + 1);
    }
  };

  const handleDayClick = (day: number | null, month: number, year: number, type: 'from' | 'to') => {
    if (day === null) return;
    const selectedDate = new Date(year, month, day);

    if (type === 'from') {
      setFromDate(selectedDate);
      if (selectedDate > toDate) {
        setToDate(selectedDate);
      }
    } else {
      setToDate(selectedDate);
      if (selectedDate < fromDate) {
        setFromDate(selectedDate);
      }
    }
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-6">Add New</h2> 
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-3">Sales from</h3>
            <div className="border border-gray-300 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => handlePrevMonth('from')} className="p-2 rounded-full hover:bg-gray-200">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-medium">{monthNames[currentMonthFrom]} {currentYearFrom}</span>
                <button onClick={() => handleNextMonth('from')} className="p-2 rounded-full hover:bg-gray-200">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {weekdays.map(day => (
                  <div key={day} className="font-semibold text-gray-600">{day}</div>
                ))}
                {generateDaysInMonth(currentMonthFrom, currentYearFrom).map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day, currentMonthFrom, currentYearFrom, 'from')}
                    className={`p-2 rounded-full cursor-pointer
                      ${day === null ? 'invisible' : ''}
                      ${fromDate && day === fromDate.getDate() && currentMonthFrom === fromDate.getMonth() && currentYearFrom === fromDate.getFullYear() ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}
                      ${(fromDate && toDate && new Date(currentYearFrom, currentMonthFrom, day || 0) >= fromDate && new Date(currentYearFrom, currentMonthFrom, day || 0) <= toDate) && day !== fromDate.getDate() && day !== toDate.getDate() ? 'bg-blue-100' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-3">Sales to</h3>
            <div className="border border-gray-300 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => handlePrevMonth('to')} className="p-2 rounded-full hover:bg-gray-200">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-medium">{monthNames[currentMonthTo]} {currentYearTo}</span>
                <button onClick={() => handleNextMonth('to')} className="p-2 rounded-full hover:bg-gray-200">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {weekdays.map(day => (
                  <div key={day} className="font-semibold text-gray-600">{day}</div>
                ))}
                {generateDaysInMonth(currentMonthTo, currentYearTo).map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day, currentMonthTo, currentYearTo, 'to')}
                    className={`p-2 rounded-full cursor-pointer
                      ${day === null ? 'invisible' : ''}
                      ${toDate && day === toDate.getDate() && currentMonthTo === toDate.getMonth() && currentYearTo === toDate.getFullYear() ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}
                      ${(fromDate && toDate && new Date(currentYearTo, currentMonthTo, day || 0) >= fromDate && new Date(currentYearTo, currentMonthTo, day || 0) <= toDate) && day !== fromDate.getDate() && day !== toDate.getDate() ? 'bg-blue-100' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(fromDate, toDate)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;