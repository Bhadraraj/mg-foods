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
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItem {
  name: string;
  path?: string; // Make path optional for special items like logout
  icon: React.ReactNode;
  roles?: string[];
  action?: () => void; // Add action property for special items
  isSpecial?: boolean; // Flag to identify special items that aren't links
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout action
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

  // Define all menu items with their required roles
  const sidebarSections: SidebarSection[] = [
    {
      title: "BUSINESS",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard size={20} />,
          roles: ["admin", "manager", "cashier", "staff"], // All roles can access
        },
        {
          name: "Reports",
          path: "/dashboard/reports",
          icon: <FileBarChart size={20} />,
          roles: ["admin", "manager"], // Only admin and manager
        },
        {
          name: "Sale",
          path: "/dashboard/sale",
          icon: <ShoppingBag size={20} />,
          roles: ["admin", "manager", "cashier"], // Admin, manager, cashier
        },
        {
          name: "Purchase",
          path: "/dashboard/purchase",
          icon: <ShoppingCart size={20} />,
          roles: ["admin", "manager"], // Admin and manager only
        },
        {
          name: "Expense",
          path: "/dashboard/expense",
          icon: <Receipt size={20} />,
          roles: ["admin", "manager"], // Admin and manager only
        },
        {
          name: "KOT",
          path: "/dashboard/kot",
          icon: <Ticket size={20} />,
          roles: ["admin", "manager", "staff"], // Kitchen and management access
        },
        {
          name: "Offers",
          path: "/dashboard/offers",
          icon: <Tag size={20} />,
          roles: ["admin", "manager"], // Admin and manager only
        },
        {
          name: "Recipe",
          path: "/dashboard/recipe",
          icon: <ChefHat size={20} />,
          roles: ["admin", "manager", "chef"], // Kitchen management
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          name: "Inventory",
          path: "/dashboard/inventory",
          icon: <PackageOpen size={20} />,
          roles: ["admin", "manager"], // Admin and manager only
        },
        {
          name: "Item",
          path: "/dashboard/item",
          icon: <Package size={20} />,
          roles: ["admin", "manager"], // Admin and manager only
        },
        {
          name: "Party",
          path: "/dashboard/party",
          icon: <Users size={20} />,
          roles: ["admin", "manager"], // Admin and manager only
        },
        {
          name: "Table Management",
          path: "/dashboard/table-management",
          icon: <Settings size={20} />,
          roles: ["admin", "manager", "staff"], // Service staff access
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          name: "Management",
          path: "/dashboard/management",
          icon: <Settings size={20} />,
          roles: ["admin"], // Admin only
        },
        {
          name: isLoggingOut ? "Logging out..." : "Logout",
          icon: <LogOut size={20} />,
          roles: ["admin", "manager", "cashier", "staff", "chef"], // All roles can logout
          action: handleLogout,
          isSpecial: true,
        },
      ],
    },
  ];

  // Function to check if user has required role
  const hasAccess = (requiredRoles?: string[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role restriction
    }
    
    if (!user?.role) {
      return false; // No user role defined
    }

    return requiredRoles.includes(user.role);
  };

  // Filter items based on user role
  const getFilteredItems = (items: SidebarItem[]): SidebarItem[] => {
    return items.filter(item => hasAccess(item.roles));
  };

  const renderSidebarItems = (items: SidebarItem[]) => {
    const filteredItems = getFilteredItems(items);
    
    return filteredItems.map((item, index) => {
      // Handle special items (like logout)
      if (item.isSpecial && item.action) {
        return (
          <button
            key={`special-${item.name}-${index}`}
            onClick={item.action}
            disabled={isLoggingOut}
            className={clsx(
              "w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 text-left",
              isLoggingOut
                ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                : "text-red-600 hover:text-red-700 hover:bg-red-50"
            )}
          >
            <span className="mr-3 flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="truncate">{item.name}</span>}
          </button>
        );
      }

      // Handle regular navigation items
      return (
        <Link
          key={item.path}
          to={item.path!}
          className={clsx(
            "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
            location.pathname === item.path
              ? "text-blue-700 bg-blue-50 border-r-2 border-blue-700"
              : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
          )}
        >
          <span className="mr-3 flex-shrink-0">{item.icon}</span>
          {isOpen && <span className="truncate">{item.name}</span>}
        </Link>
      );
    });
  };

  // Function to check if a section has any visible items
  const sectionHasVisibleItems = (items: SidebarItem[]): boolean => {
    return getFilteredItems(items).length > 0;
  };

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
              <h1 className="text-lg font-bold ms-3">MG Foodcourt</h1>
              <div className="ms-2 text-center text-white text-sm flex items-center justify-start mt-2">
                <span className="mr-2 flex-shrink-0">
                  <Phone size={16} />
                </span>
                <span>7540022411</span>
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
        <div className="px-3 py-4">
          {sidebarSections.map((section, index) => {
            // Only render section if it has visible items
            if (!sectionHasVisibleItems(section.items)) {
              return null;
            }

            return (
              <div key={section.title}>
                {index > 0 && <div className="mt-6" />}
                {isOpen && (
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </p>
                )}
                <nav className="mt-2 space-y-1">
                  {renderSidebarItems(section.items)}
                </nav>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Info Footer (when expanded) */}
      {isOpen && user && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

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