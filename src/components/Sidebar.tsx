import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
import PermissionGate from "./PermissionGate";
import { PERMISSIONS } from "../constants/permissions";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const businessItems: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      permission: PERMISSIONS.DASHBOARD_VIEW,
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: <FileBarChart size={20} />,
      permission: PERMISSIONS.REPORTS_VIEW,
    },
    { 
      name: "Sale", 
      path: "/dashboard/sale", 
      icon: <ShoppingBag size={20} />,
      permission: PERMISSIONS.SALES_VIEW,
    },
    {
      name: "Purchase",
      path: "/dashboard/purchase",
      icon: <ShoppingCart size={20} />,
      permission: PERMISSIONS.PURCHASE_VIEW,
    },
    {
      name: "Expense",
      path: "/dashboard/expense",
      icon: <Receipt size={20} />,
      permission: PERMISSIONS.EXPENSE_VIEW,
    },
    { 
      name: "KOT", 
      path: "/dashboard/kot", 
      icon: <Ticket size={20} />,
      permission: PERMISSIONS.KOT_VIEW,
    },
    { 
      name: "Offers", 
      path: "/dashboard/offers", 
      icon: <Tag size={20} />,
      permission: PERMISSIONS.OFFERS_VIEW,
    },
    { 
      name: "Recipe", 
      path: "/dashboard/recipe", 
      icon: <ChefHat size={20} />,
      permission: PERMISSIONS.RECIPE_VIEW,
    },
  ];

  const managementItems: SidebarItem[] = [
    {
      name: "Inventory",
      path: "/dashboard/inventory",
      icon: <PackageOpen size={20} />,
      permission: PERMISSIONS.INVENTORY_VIEW,
    },
    { 
      name: "Item", 
      path: "/dashboard/item", 
      icon: <Package size={20} />,
      permission: PERMISSIONS.ITEMS_VIEW,
    },
    { 
      name: "Party", 
      path: "/dashboard/party", 
      icon: <Users size={20} />,
      permission: PERMISSIONS.PARTY_VIEW,
    },
  ];

  const administrationItems: SidebarItem[] = [
    {
      name: "Management",
      path: "/dashboard/management",
      icon: <Settings size={20} />,
      permission: PERMISSIONS.USERS_VIEW,
    },
    { name: "Logout", path: "/dashboard/logout", icon: <LogOut size={20} /> },
  ];

  const renderSidebarItems = (items: SidebarItem[]) => {
    return items.map((item) => (
      <PermissionGate key={item.path} permission={item.permission}>
        <Link
          to={item.path}
          className={clsx(
            "flex items-center px-4 py-3 text-sm font-medium rounded-md",
            location.pathname === item.path
              ? "text-blue-700 bg-blue-50"
              : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
          )}
        >
          <span className="mr-3">{item.icon}</span>
          {isOpen && <span>{item.name}</span>}
        </Link>
      </PermissionGate>
    ));
  };

  return (
    <div
      className={clsx(
        "bg-white border-r border-gray-200 transition-all duration-300 z-20",
        isOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="px-4 py-6 bg-blue-700 text-white min-h-[100px] flex items-center justify-start">
          <div>
            {isOpen ? (
              <>
                <h1 className="text-lg font-bold ms-3">MG Foodcourt</h1>
                <div className="  ms-2 text-center text-white text-sm flex items-center justify-start">
                  <span className="mr-2">
                    <Phone size={20} /> 
                  </span>

                  <span>7540022411</span>
                </div>
              </>
            ) : (
              <span className="text-xl font-bold">MG</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-invisible">
          <div className="px-3 py-4">
            {isOpen && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                BUSINESS
              </p>
            )}
            <nav className="mt-2 space-y-1">
              {renderSidebarItems(businessItems)}
            </nav>

            {isOpen && (
              <p className="px-3 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                MANAGEMENT
              </p>
            )}
            <nav className="mt-2 space-y-1">
              {renderSidebarItems(managementItems)}
            </nav>

            {isOpen && (
              <p className="px-3 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                ADMINISTRATION
              </p>
            )}
            <nav className="mt-2 space-y-1">
              {renderSidebarItems(administrationItems)}
            </nav>
          </div>
        </div>
      </div>
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

        .scrollbar-invisible::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-invisible::-webkit-scrollbar-thumb {
          background: transparent;
        }

        .scrollbar-invisible::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;