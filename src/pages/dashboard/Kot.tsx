import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const getFirstDayOfMonth = (month: number, year: number) => (new Date(year, month, 1).getDay() + 6) % 7;

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
            {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Sales from</h4> */}
            {renderCalendar(fromMonth, fromYear, fromDate, (date) => handleDateSelection(date, 'from'), setFromMonth, setFromYear)}
          </div>
          <div className="flex-1">
            {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Sales to</h4> */}
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

interface KotItem {
  name: string;
  quantity: string;
  isCompleted: boolean; 
}

interface KotData {
  id: string;
  dineType: string;
  customerName: string;
  tableNumber: string;
  time: string;
  items: KotItem[];
  status: "New" | "Completed"; 
}

const Kot: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all"); 
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [kots, setKots] = useState<KotData[]>([
    {
      id: "#21",
      dineType: "Dine in (A8)",
      customerName: "Ram Kishore",
      tableNumber: "17:12", 
      time: "12:02 pm",
      items: [
        { name: "Veg Meals", quantity: "01", isCompleted: false },
        { name: "Biriyani", quantity: "01", isCompleted: false },
        { name: "Mutton Soup", quantity: "02", isCompleted: false },
        { name: "Chicken Tikka", quantity: "01", isCompleted: false },
        { name: "Garlic Naan", quantity: "02", isCompleted: false },
      ],
      status: "New",
    },
    {
      id: "#22",
      dineType: "Dine in (A9)",
      customerName: "John Doe",
      tableNumber: "18:15",
      time: "12:30 pm",
      items: [
        { name: "Chicken Curry", quantity: "01", isCompleted: false },
        { name: "Naan", quantity: "02", isCompleted: false },
        { name: "Dal Tadka", quantity: "01", isCompleted: false },
        { name: "Jeera Rice", quantity: "01", isCompleted: false },
        { name: "Raita", quantity: "01", isCompleted: false },
      ],
      status: "New",
    },
    {
      id: "#23",
      dineType: "Take Away",
      customerName: "Sarah Smith",
      tableNumber: "19:20",
      time: "01:15 pm",
      items: [
        { name: "Fish Fry", quantity: "01", isCompleted: false },
        { name: "Rice", quantity: "01", isCompleted: false },
        { name: "Fish Curry", quantity: "01", isCompleted: false },
        { name: "Pickle", quantity: "01", isCompleted: false },
        { name: "Papad", quantity: "02", isCompleted: false },
      ],
      status: "New",
    }, 
    {
      id: "#24",
      dineType: "Dine in (B1)",
      customerName: "Alice Johnson",
      tableNumber: "20:00",
      time: "02:00 pm",
      items: [
        { name: "Coffee", quantity: "01", isCompleted: true },
        { name: "Samosa", quantity: "02", isCompleted: true },
        { name: "Masala Tea", quantity: "01", isCompleted: true },
        { name: "Vada Pav", quantity: "01", isCompleted: true },
        { name: "Chutney", quantity: "01", isCompleted: true },
      ],
      status: "Completed",
    },
  ]); 
  
  const totalOrders = kots.length; 
  const remainingOrders = kots.filter((kot) => kot.status === "New").length;
  const completedOrders = kots.filter(
    (kot) => kot.status === "Completed"
  ).length;
 
  const toggleItemCompletion = (kotId: string, itemIndex: number) => {
    setKots((prevKots) =>
      prevKots.map((kot) => {
        if (kot.id === kotId) {
          const updatedItems = kot.items.map((item, idx) =>
            idx === itemIndex
              ? { ...item, isCompleted: !item.isCompleted }
              : item
          ); 
          const allItemsCompleted = updatedItems.every(
            (item) => item.isCompleted
          );
          return {
            ...kot,
            items: updatedItems, 
            status: allItemsCompleted ? "Completed" : "New",  
          };
        }
        return kot;
      })
    );
  };
 
  const handleRemoveKot = (kotId: string) => {
    setKots((prevKots) => prevKots.filter((kot) => kot.id !== kotId));
  };
 
  const getStatusButtonClass = (status: KotData["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-600 text-white hover:bg-green-700"; 
      case "New":
        return "bg-blue-600 text-white cursor-not-allowed opacity-70";  
      default:
        return "bg-gray-400 text-white cursor-not-allowed opacity-70"; 
    }
  };

  const handleDateChange = (fromDate: Date, toDate: Date) => {
    setSelectedFromDate(fromDate);
    setSelectedToDate(toDate);
    // You can add logic here to filter KOTs by date range
  };

  const formatDisplayDate = (fromDate: Date, toDate: Date) => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    };
    
    if (fromDate.toDateString() === toDate.toDateString()) {
      return formatDate(fromDate);
    }
    
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };
 
  const filteredKots = kots.filter((kot) => {
    if (activeTab === "all") return true;
    if (activeTab === "new") return kot.status === "New";
    if (activeTab === "completed") return kot.status === "Completed";
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen"> 
      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-800">KOT</h1>
           
            </div>
 
            <div className="flex gap-4">
                 <button
                onClick={() => setIsDateModalOpen(true)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                <Calendar size={16} />
                <span className="text-sm font-medium">{formatDisplayDate(selectedFromDate, selectedToDate)}</span>
              </button>
              <div
                className={`bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer ${
                  activeTab === "all" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveTab("all")}
              >
                <span className="text-gray-600">Total Orders : </span>
                <span className="font-semibold text-gray-800">
                  {totalOrders.toString().padStart(2, "0")}
                </span>
              </div>
              <div
                className={`bg-blue-600 text-white rounded-lg px-4 py-2 cursor-pointer ${
                  activeTab === "new" ? "ring-2 ring-blue-300" : ""
                }`}
                onClick={() => setActiveTab("new")}
              >
                <span>Remaining Orders : </span>
                <span className="font-semibold">
                  {remainingOrders.toString().padStart(2, "0")}
                </span>
              </div>
              <div
                className={`bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer ${
                  activeTab === "completed" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveTab("completed")}
              >
                <span className="text-gray-600">Completed Orders : </span>
                <span className="font-semibold text-gray-800">
                  {completedOrders.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredKots.map((kot) => (
            <div
              key={kot.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            > 
              <div className="bg-blue-600 text-white p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{kot.dineType}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">KOT No {kot.id} </span>
                      <span className="text-yellow-300 font-medium">
                        {kot.customerName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{kot.tableNumber}</span>
                  <span>{kot.time}</span>
                </div>
              </div> 
              <div className="p-4">
                <div className="space-y-3 h-32 overflow-y-auto">
                   {kot.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => toggleItemCompletion(kot.id, itemIndex)}
                      disabled={kot.status === "Completed"} 
                      className={`flex justify-between items-center w-full py-2 px-3 rounded-md transition-colors duration-200
                  ${
                    item.isCompleted
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                    >
                      <span
                        className={`${item.isCompleted ? "line-through" : ""}`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`font-semibold ${
                          item.isCompleted ? "text-green-800" : "text-gray-900"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </button>
                  ))}
                </div> 
                <div className="mt-6">
                  <button
                    onClick={() => handleRemoveKot(kot.id)} 
                    disabled={kot.status === "New"}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${getStatusButtonClass(
                      kot.status
                    )}`}
                  >
                    {kot.status === "Completed"
                      ? "Completed "
                      : "Mark Completed"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Modal */}
      <CalendarModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleDateChange}
        initialFromDate={selectedFromDate}
        initialToDate={selectedToDate}
      />
    </div>
  );
};

export default Kot;