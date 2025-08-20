import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";  

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (fromDate: Date, toDate: Date) => void;
  initialFromDate?: Date;
  initialToDate?: Date;
}

const CalendarModal: React.FC<CalendarProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFromDate,
  initialToDate,
}) => { 
  const getStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const getEndOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);


  const [fromDate, setFromDate] = useState(initialFromDate ? getStartOfDay(initialFromDate) : getStartOfDay(new Date()));
  const [toDate, setToDate] = useState(initialToDate ? getEndOfDay(initialToDate) : getEndOfDay(new Date()));

  const [fromMonth, setFromMonth] = useState(fromDate.getMonth());
  const [toMonth, setToMonth] = useState(toDate.getMonth());
  const [fromYear, setFromYear] = useState(fromDate.getFullYear());
  const [toYear, setToYear] = useState(toDate.getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => (new Date(year, month, 1).getDay() + 6) % 7; // Adjust for Monday-first week

  useEffect(() => {
    if (isOpen) {
      setFromDate(initialFromDate ? getStartOfDay(initialFromDate) : getStartOfDay(new Date()));
      setToDate(initialToDate ? getEndOfDay(initialToDate) : getEndOfDay(new Date()));
    }
  }, [isOpen, initialFromDate, initialToDate]);

  useEffect(() => {
    setFromMonth(fromDate.getMonth());
    setFromYear(fromDate.getFullYear());
  }, [fromDate]);

  useEffect(() => {
    setToMonth(toDate.getMonth());
    setToYear(toDate.getFullYear());
  }, [toDate]);

  const handleDateSelection = (date: Date, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromDate(getStartOfDay(date));
    } else {
      setToDate(getEndOfDay(date));
    }
  };

  const renderCalendar = (
    currentDisplayMonth: number,
    currentDisplayYear: number,
    selectedDate: Date,
    onDateSelect: (date: Date) => void,
    setDisplayedMonth: React.Dispatch<React.SetStateAction<number>>,
    setDisplayedYear: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const daysInMonth = getDaysInMonth(currentDisplayMonth, currentDisplayYear);
    const firstDay = getFirstDayOfMonth(currentDisplayMonth, currentDisplayYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDisplayYear, currentDisplayMonth, day);
      const isSelected = selectedDate.getDate() === day &&
                         selectedDate.getMonth() === currentDisplayMonth &&
                         selectedDate.getFullYear() === currentDisplayYear;

      const isWithinRange = date >= fromDate && date <= toDate;
      const isStartOfRange = isWithinRange && date.getTime() === fromDate.getTime();
      const isEndOfRange = isWithinRange && date.getTime() === toDate.getTime();

      let buttonClasses = `w-8 h-8 rounded-full flex items-center justify-center text-sm `;

      if (isSelected) {
        buttonClasses += "bg-blue-600 text-white";
      } else if (isWithinRange) {
        buttonClasses += "bg-blue-100 text-blue-800";
        if (isStartOfRange && !isEndOfRange) buttonClasses += " rounded-r-none";
        if (isEndOfRange && !isStartOfRange) buttonClasses += " rounded-l-none";
        if (isStartOfRange && isEndOfRange) buttonClasses += " rounded-full";
      } else {
        buttonClasses += "text-gray-700 hover:bg-blue-100";
      }

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={buttonClasses}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (currentDisplayMonth === 0) {
                setDisplayedMonth(11);
                setDisplayedYear(currentDisplayYear - 1);
              } else {
                setDisplayedMonth(currentDisplayMonth - 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-medium text-sm">
            {monthNames[currentDisplayMonth]} {currentDisplayYear}
          </h3>
          <button
            onClick={() => {
              if (currentDisplayMonth === 11) {
                setDisplayedMonth(0);
                setDisplayedYear(currentDisplayYear + 1);
              } else {
                setDisplayedMonth(currentDisplayMonth + 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-xs text-blue-600 text-center py-1 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-[600px] shadow-lg">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-6">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sales from</h4>
            {renderCalendar(fromMonth, fromYear, fromDate, (date) => handleDateSelection(date, 'from'), setFromMonth, setFromYear)}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sales to</h4>
            {renderCalendar(toMonth, toYear, toDate, (date) => handleDateSelection(date, 'to'), setToMonth, setToYear)}
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (fromDate > toDate) {
                alert("From date cannot be after To date.");
                return;
              }
              onApply(fromDate, toDate);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;