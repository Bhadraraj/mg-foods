import React from "react";
import DashboardCard from "../../components/DashboardCard";
import ReceivableCard from "../../components/ReceivableCard";
import TransactionTable from "../../components/TransactionTable";
import OnlineOrderCard from "../../components/OnlineOrderCard";
import { PlusCircle } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { dashboardAPI, salesAPI } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
const Overview: React.FC = () => {
  // API hooks for dashboard data
  const { data: overviewData, loading: overviewLoading } = useApi(dashboardAPI.getOverview);
  const { data: salesStats, loading: salesLoading } = useApi(salesAPI.getSalesStats);

  // Transform API data or use defaults
  const dashboardStats = overviewData?.data || {
    today: { totalSales: 0, totalOrders: 0, cashSales: 0, upiSales: 0, pendingAmount: 0 },
    customers: { totalCustomers: 0, activeCustomers: 0 },
    inventory: { lowStockItems: 0, outOfStockItems: 0 },
    pendingCredits: { totalAmount: 0, count: 0 }
  };

  const transactions = [
    { id: "01", customer: "Kumar", paymentType: "Cash", amount: "120" },
    { id: "02", customer: "Babu", paymentType: "Cash", amount: "120" },
    { id: "03", customer: "Ravi", paymentType: "Cash", amount: "120" },
    { id: "04", customer: "Ashok", paymentType: "Cash", amount: "120" },
    { id: "05", customer: "Ajith", paymentType: "Cash", amount: "120" },
    { id: "06", customer: "Vimal", paymentType: "Cash", amount: "120" },
  ];

  const onlineOrders = {
    todayStats: {
      totalOrders: "00",
      totalSales: "₹0.00",
    },
    platformStats: {
      zomato: {
        totalOrders: "00",
        totalSales: "₹0.00",
      },
      swiggy: {
        totalOrders: "00",
        totalSales: "₹0.00",
      },
      website: {
        totalOrders: "00",
        totalSales: "₹0.00",
      },
    },
  };

  const navigate = useNavigate();

  if (overviewLoading || salesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-400 via-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-400 via-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <DashboardCard 
            title="Total Sale" 
            value={`₹ ${dashboardStats.today.totalSales?.toLocaleString() || '0.00'}`} 
          />
          <DashboardCard 
            title="Total Money in" 
            value={`₹ ${(dashboardStats.today.cashSales + dashboardStats.today.upiSales)?.toLocaleString() || '0.00'}`} 
          />
          <DashboardCard 
            title="Today's Orders" 
            value={dashboardStats.today.totalOrders?.toString() || '0'} 
          />
          <DashboardCard 
            title="Pending Credits" 
            value={`₹ ${dashboardStats.pendingCredits.totalAmount?.toLocaleString() || '0.00'}`} 
          />
          <DashboardCard 
            title="Total Customers" 
            value={dashboardStats.customers.totalCustomers?.toString() || '0'} 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReceivableCard
          title="Total Receivable"
          subtitle="Total Unpaid Invoices"
          amount={`₹${dashboardStats.pendingCredits.totalAmount?.toLocaleString() || '0.00'}`}
          progressPercent={30}
          progressColor="bg-yellow-400"
          currentAmount={`₹ ${dashboardStats.pendingCredits.totalAmount?.toLocaleString() || '0.00'}`}
          overdueAmount="₹ 0.00"
        />
        <ReceivableCard
          title="Total Payables"
          subtitle="Total Unpaid bills"
          amount="₹0.00"
          progressPercent={70}
          progressColor="bg-red-500"
          currentAmount="₹ 0.00"
          overdueAmount="₹ 0.00"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OnlineOrderCard
          todayStats={onlineOrders.todayStats}
          platformStats={onlineOrders.platformStats}
        />
        <TransactionTable transactions={transactions} />
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <Link to="/dashboard/table-management">
          <button
            onClick={() => navigate("/table-management")}  
            className="bg-blue-700 text-white rounded-full px-6 py-3 shadow-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 text-xs   font-semibold"
          >
            <PlusCircle size={24} /> 
            <span>+ SALE | INVOICE</span>
          </button>
        </Link>
      </div>

       
    </div>
  );
};

export default Overview;
