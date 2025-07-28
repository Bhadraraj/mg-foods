import React, { useState, useEffect } from "react";
import { AttendanceRecord } from "../../../components/types/";
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";

interface AttendanceTableProps {
  attendanceRecords: AttendanceRecord[];
  searchTerm: string;
  selectedDate: string;
  selectedMonth: string;
  onDateChange: (date: string) => void;
  onMonthChange: (month: string) => void; 
  onNavigateDate: (direction: "prev" | "next") => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceRecords,
  searchTerm,
  selectedDate,
  selectedMonth,
  onDateChange,
  onMonthChange,
  onNavigateDate,
}) => {
  const [editableRecords, setEditableRecords] =
    useState<AttendanceRecord[]>(attendanceRecords);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDailyView, setIsDailyView] = useState(true);
  useEffect(() => {
    setEditableRecords(attendanceRecords);
  }, [attendanceRecords]);
  const handleRecordChange = (
    id: string,
    field: keyof AttendanceRecord,
    value: any
  ) => {
    setEditableRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };
  const handleSave = (record: AttendanceRecord) => {
    console.log("Saving record:", record);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditableRecords(attendanceRecords);
    setEditingId(null);
  };
  const filteredRecords = editableRecords.filter((record) => {
    const matchesSearch = record.labourName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (isDailyView) {
      return matchesSearch && record.date === selectedDate;
    } else {
      const selectedMonthParts = selectedMonth.split(" ");
      const displayMonthYear = `${selectedMonthParts[1]} ${selectedMonthParts[2]}`;
      const recordDateParts = record.date.split(" ");
      const recordMonthYear = `${recordDateParts[1]} ${recordDateParts[2]}`;

      return matchesSearch && recordMonthYear === displayMonthYear;
    }
  });

  const generateMonths = () => {
    const months = [];
    const today = new Date(); 
    for (let i = -6; i <= 6; i++) { 
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(
        d.toLocaleString("en-US", { month: "short", year: "numeric" })
      );
    }
    return [...new Set(months)]; 
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -5; i <= 5; i++) { 
      years.push(String(currentYear + i));
    }
    return years;
  };

  const currentMonthDisplay = new Date(selectedMonth).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
  const currentYear = new Date(selectedMonth).getFullYear().toString();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-end items-center mb-4 gap-3">
        <div className="flex items-center gap-2"> 
          <span className="text-gray-700 font-semibold">Daily View</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!isDailyView} 
              onChange={() => setIsDailyView((prev) => !prev)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-gray-700 font-semibold">Monthly View</span>
        </div>

        {isDailyView ? (
          <div className="flex items-center gap-2"> 
            <span className="text-gray-700 font-semibold">Date:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={
                selectedDate
                  ? new Date(selectedDate).toISOString().split("T")[0]
                  : ""
              }  
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                onDateChange(
                  newDate.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                );
              }}
            /> 
            <button
              onClick={() => onNavigateDate("prev")}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onNavigateDate("next")}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() =>
                onDateChange(
                  new Date().toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                )
              }
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Today
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-semibold">Month:</span>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentMonthDisplay} 
              onChange={(e) => {
                const [monthStr, yearStr] = e.target.value.split(" ");
                const newDate = new Date(`${monthStr} 1, ${yearStr}`); 
                onMonthChange(
                  newDate.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                );
              }}
            >
              {generateMonths().map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select> 
            <span className="text-gray-700 font-semibold">Year:</span>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentYear}
              onChange={(e) => {
                const selectedYear = e.target.value;
                const newDate = new Date(
                  `${new Date(selectedMonth).getMonth() + 1}/1/${selectedYear}`
                );
                onMonthChange(
                  newDate.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                );
              }}
            >
              {generateYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SI No.
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Labour name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Attendance
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Clock In / out
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last 7 days status
              </th>
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={record.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.labourName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        record.attendance === "Present"
                          ? "bg-green-600  text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {record.attendance}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2">
                      <>
                        <input
                          type="text"
                          value={record.clockIn}
                          className="w-20 p-1 border border-gray-300 rounded-md text-center text-sm"
                          readOnly
                        />
                        <input
                          type="text"
                          value={record.clockOut}
                          className="w-20 p-1 border border-gray-300 rounded-md text-center text-sm"
                          readOnly
                        />
                      </>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      {record.last7DaysStatus.map((status, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full inline-block ${
                            status === "present"
                              ? "text-white bg-green-500"
                              : "text-white  bg-red-500"
                          }`}
                          title={status === "present" ? "Present" : "Absent"}
                        ></span>
                      ))}
                    </div>
                  </td> 
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-3 text-center text-sm text-gray-500"
                >
                  No attendance records found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
