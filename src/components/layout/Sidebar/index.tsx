import React, { useState } from "react";
import {
  LayoutDashboard,
  FileBarChart,
  ShoppingBag,
  ShoppingCart,
  Receipt,
  Ticket,
  Tag,
  ChefHat,
  PackageOpen,
  Package,
  Users,
  Phone,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../../contexts/AuthContext";
import { NAVIGATION_ITEMS, COMPANY_INFO } from "../../../constants/navigation";
import SidebarSection from "./SidebarSection";
import UserInfo from "./UserInfo";

interface SidebarProps {
  isOpen: boolean;
}

const iconMap = {
  LayoutDashboard,
  FileBarChart,
  ShoppingBag,
  ShoppingCart,
  Receipt,
  Ticket,
  Tag,
  ChefHat,
  PackageOpen,
  Package,
  Users,
  Settings,
  LogOut,
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
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

  const hasAccess = (requiredRoles?: string[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user?.role) return false;
    return requiredRoles.includes(user.role);
  };

  const getFilteredItems = (items: typeof NAVIGATION_ITEMS.BUSINESS) => {
    return items
      .filter(item => hasAccess(item.roles))
      .map(item => ({
        name: item.name,
        path: item.path,
        icon: React.createElement(iconMap[item.icon as keyof typeof iconMap], { size: 20 }),
      }));
  };

  const businessItems = getFilteredItems(NAVIGATION_ITEMS.BUSINESS);
  const managementItems = getFilteredItems(NAVIGATION_ITEMS.MANAGEMENT);
  const administrationItems = [
    ...getFilteredItems(NAVIGATION_ITEMS.ADMINISTRATION),
    {
      name: isLoggingOut ? "Logging out..." : "Logout",
      icon: React.createElement(LogOut, { size: 20 }),
      action: handleLogout,
      isSpecial: true,
      disabled: isLoggingOut,
    },
  ];

  return (
    <div
      className={clsx(
        "bg-white border-r border-gray-200 transition-all duration-300 z-20 flex flex-col h-full",
        isOpen ? "w-60" : "w-16"
      )}
    >
      {/* Header Section */}
      <div className="px-4 py-6 bg-blue-700 text-white min-h-[100px] flex items-center justify-start flex-shrink-0">
        <div className="w-full">
          {isOpen ? (
            <>
              <h1 className="text-lg font-bold ms-3">{COMPANY_INFO.name}</h1>
              <div className="ms-2 text-center text-white text-sm flex items-center justify-start mt-2">
                <span className="mr-2 flex-shrink-0">
                  <Phone size={16} />
                </span>
                <span>{COMPANY_INFO.phone}</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <span className="text-xl font-bold">MG</span>
              {user?.role && (
                <div className="text-xs mt-1 opacity-75">
                  {user.role.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto scrollbar-invisible">
        <div className="px-3 py-4 space-y-6">
          <SidebarSection title="BUSINESS" items={businessItems} isOpen={isOpen} />
          <SidebarSection title="MANAGEMENT" items={managementItems} isOpen={isOpen} />
          <SidebarSection title="ADMINISTRATION" items={administrationItems} isOpen={isOpen} />
        </div>
      </div>

      {/* User Info Footer */}
      {user && <UserInfo user={user} isOpen={isOpen} />}

      <style>{`
        .scrollbar-invisible {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-invisible::-webkit-scrollbar {
          width: 0;
          height: 0;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;