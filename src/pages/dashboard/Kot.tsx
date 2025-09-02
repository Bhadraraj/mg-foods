import React, { useState, useEffect } from "react";
import { Calendar, X, ChevronLeft, ChevronRight, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useKots, useKotStats } from '../../hooks/useKot';
import { Kot, KotItem as ApiKotItem } from '../../services/api/kot';

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
            {renderCalendar(fromMonth, fromYear, fromDate, (date) => handleDateSelection(date, 'from'), setFromMonth, setFromYear)}
          </div>
          <div className="flex-1">
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

const KotComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());

  // Use the actual API hooks with proper filtering
  const {
    kots,
    loading: kotsLoading,
    error: kotsError,
    fetchKots,
    updateKotItemStatus,
    deleteKot,
    updateItemStatusLoading,
    deleteLoading,
    pagination,
    handlePageChange
  } = useKots({
    status: activeTab === 'all' ? undefined : activeTab,
    page: 1,
    limit: 50,
    autoFetch: true
  });

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useKotStats();

  // Refetch KOTs when active tab changes
  useEffect(() => {
    fetchKots({
      status: activeTab === 'all' ? undefined : activeTab,
      page: 1,
      limit: 50
    });
  }, [activeTab]);

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
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

  // Get status button styling
  const getItemStatusClass = (status: ApiKotItem['status']) => {
    switch (status) {
      case 'served':
        return 'bg-green-100 text-green-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getKotStatusButtonClass = (kot: Kot) => {
    if (kot.status === 'completed') {
      return 'bg-green-600 text-white cursor-not-allowed opacity-70';
    }
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  // Handle item status toggle
  const handleItemStatusToggle = async (kotId: string, item: ApiKotItem) => {
    if (updateItemStatusLoading || item.status === 'served' || item.status === 'cancelled') return;

    let newStatus: ApiKotItem['status'];
    
    switch (item.status) {
      case 'pending':
        newStatus = 'preparing';
        break;
      case 'preparing':
        newStatus = 'ready';
        break;
      case 'ready':
        newStatus = 'served';
        break;
      default:
        return;
    }

    try {
      await updateKotItemStatus(kotId, item._id, { status: newStatus });
      // Refresh stats after successful update
      refetchStats();
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  // Handle KOT completion
  const handleCompleteKot = async (kotId: string) => {
    if (deleteLoading) return;
    
    try {
      await deleteKot(kotId);
      // Refresh stats after completion
      refetchStats();
    } catch (error) {
      console.error('Failed to complete KOT:', error);
    }
  };

  // Handle date filter changes
  const handleDateChange = (fromDate: Date, toDate: Date) => {
    setSelectedFromDate(fromDate);
    setSelectedToDate(toDate);
    
    // Refetch with new date filters if your API supports date filtering
    fetchKots({
      status: activeTab === 'all' ? undefined : activeTab,
      page: 1,
      limit: 50,
      // Add these if your API supports date filtering:
      // startDate: fromDate.toISOString(),
      // endDate: toDate.toISOString(),
    });
  };

  // Refresh data
  const handleRefresh = () => {
    fetchKots({
      status: activeTab === 'all' ? undefined : activeTab,
      page: 1,
      limit: 50
    });
    refetchStats();
  };

  // Calculate stats
  const totalOrders = stats?.overview.totalKOTs || 0;
  const activeOrders = stats?.overview.activeKOTs || 0;
  const completedOrders = stats?.overview.completedKOTs || 0;

  // Handle errors
  if (kotsError || statsError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading KOTs</h3>
          <p className="text-gray-500 mb-4">
            {kotsError || statsError || 'Something went wrong while loading the data.'}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen"> 
      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-800">KOT</h1>
              <button
                onClick={handleRefresh}
                disabled={kotsLoading || statsLoading}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={16} className={`${(kotsLoading || statsLoading) ? 'animate-spin' : ''}`} />
              </button>
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
                className={`bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer transition-all ${
                  activeTab === "all" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveTab("all")}
              >
                <span className="text-gray-600">Total Orders : </span>
                <span className="font-semibold text-gray-800">
                  {statsLoading ? '--' : totalOrders.toString().padStart(2, "0")}
                </span>
              </div>
              
              <div
                className={`bg-blue-600 text-white rounded-lg px-4 py-2 cursor-pointer transition-all ${
                  activeTab === "active" ? "ring-2 ring-blue-300" : ""
                }`}
                onClick={() => setActiveTab("active")}
              >
                <span>Active Orders : </span>
                <span className="font-semibold">
                  {statsLoading ? '--' : activeOrders.toString().padStart(2, "0")}
                </span>
              </div>
              
              <div
                className={`bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer transition-all ${
                  activeTab === "completed" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveTab("completed")}
              >
                <span className="text-gray-600">Completed Orders : </span>
                <span className="font-semibold text-gray-800">
                  {statsLoading ? '--' : completedOrders.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> 

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {kotsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading KOTs...</span>
          </div>
        ) : kots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No KOTs found</div>
            <p className="text-gray-400">
              {activeTab === 'all' 
                ? 'No orders available for the selected date range.'
                : `No ${activeTab} orders found.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kots.map((kot) => (
              <div
                key={kot._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              > 
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{kot.kotType}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">{kot.kotNumber}</span>
                        <span className="text-yellow-300 font-medium text-sm">
                          {kot.customerDetails.name}
                        </span>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      kot.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      {kot.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Table: {kot.tableNumber}</span>
                    <span>{formatTime(kot.createdAt)}</span>
                  </div>
                  {kot.notes && (
                    <div className="mt-2 text-xs text-blue-100">
                      Note: {kot.notes}
                    </div>
                  )}
                </div> 

                <div className="p-4">
                  <div className="space-y-3 h-32 overflow-y-auto">
                    {kot.items.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => handleItemStatusToggle(kot._id, item)}
                        disabled={
                          kot.status === 'completed' || 
                          item.status === 'served' || 
                          item.status === 'cancelled' ||
                          updateItemStatusLoading
                        }
                        className={`flex justify-between items-center w-full py-2 px-3 rounded-md transition-colors duration-200 ${getItemStatusClass(item.status)} ${
                          updateItemStatusLoading ? 'opacity-50 cursor-not-allowed' : ''
                        } ${item.status === 'served' || item.status === 'cancelled' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex-1 text-left">
                          <div className={`text-sm font-medium ${
                            item.status === 'served' || item.status === 'cancelled' ? 'line-through' : ''
                          }`}>
                            {item.itemName}
                          </div>
                          {item.variant && (
                            <div className="text-xs opacity-75 mt-1">
                              {item.variant}
                            </div>
                          )}
                          {item.kotNote && (
                            <div className="text-xs opacity-75 mt-1">
                              Note: {item.kotNote}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 capitalize">
                            {item.status}
                          </span>
                          <span className={`font-semibold ${
                            item.status === 'served' || item.status === 'cancelled' ? 'line-through' : ''
                          }`}>
                            {item.quantity}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div> 

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-lg">₹{kot.calculatedTotal}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                      <span>Order: {kot.orderReference}</span>
                      <span>{kot.customerDetails.mobile}</span>
                    </div>
                    <button
                      onClick={() => handleCompleteKot(kot._id)}
                      disabled={kot.status === 'completed' || deleteLoading}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${getKotStatusButtonClass(kot)} ${
                        deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {kot.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} KOTs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + Math.max(1, pagination.page - 2);
                if (pageNum > pagination.pages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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

export default KotComponent;