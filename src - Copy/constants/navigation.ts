export const NAVIGATION_ITEMS = {
  BUSINESS: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      roles: ["admin", "manager", "cashier", "staff", "chef"],
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: "FileBarChart",
      roles: ["admin", "manager"],
    },
    {
      name: "Sale",
      path: "/dashboard/sale",
      icon: "ShoppingBag",
      roles: ["admin", "manager", "cashier"],
    },
    {
      name: "Purchase",
      path: "/dashboard/purchase",
      icon: "ShoppingCart",
      roles: ["admin", "manager"],
    },
    {
      name: "Expense",
      path: "/dashboard/expense",
      icon: "Receipt",
      roles: ["admin", "manager"],
    },
    {
      name: "KOT",
      path: "/dashboard/kot",
      icon: "Ticket",
      roles: ["admin", "manager", "staff"],
    },
    {
      name: "Offers",
      path: "/dashboard/offers",
      icon: "Tag",
      roles: ["admin", "manager"],
    },
    {
      name: "Recipe",
      path: "/dashboard/recipe",
      icon: "ChefHat",
      roles: ["admin", "manager", "chef"],
    },
  ],
  MANAGEMENT: [
    {
      name: "Inventory",
      path: "/dashboard/inventory",
      icon: "PackageOpen",
      roles: ["admin", "manager"],
    },
    {
      name: "Item",
      path: "/dashboard/item",
      icon: "Package",
      roles: ["admin", "manager"],
    },
    {
      name: "Party",
      path: "/dashboard/party",
      icon: "Users",
      roles: ["admin", "manager"],
    },
    {
      name: "Table Management",
      path: "/dashboard/table-management",
      icon: "Settings",
      roles: ["admin", "manager", "staff"],
    },
  ],
  ADMINISTRATION: [
    {
      name: "Management",
      path: "/dashboard/management",
      icon: "Settings",
      roles: ["admin"],
    },
  ],
} as const;

export const COMPANY_INFO = {
  name: "MG Foodcourt",
  phone: "7540022411",
  id: "2345",
} as const;