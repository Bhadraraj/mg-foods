import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Menu, Bell, LogOut } from "lucide-react";
import { COMPANY_INFO } from "../../../constants/navigation";
import { formatDateTime } from "../../../utils/formatters";

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const currentDateTime = formatDateTime(new Date());

  return (
    <header className="bg-blue-700 text-white shadow-md h-[100px]">
      <div className="flex justify-between items-center px-4 py-2 h-full">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Menu size={24} />
          </button>

          <div className="ml-4">
            <div className="bg-white text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
              {COMPANY_INFO.id} | {COMPANY_INFO.name}
            </div>
            <div className="text-xs mt-1">Last Sync at {currentDateTime}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white">
            <Bell size={20} />
          </button>

          <div className="flex items-center bg-white text-black rounded-full px-3 py-1">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                {user?.name?.[0] || "S"}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "Sundar"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors duration-200"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;