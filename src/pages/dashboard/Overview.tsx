import React from "react";
import { DashboardCard, ReceivableCard, OnlineOrderCard } from "../../components/cards";
import { TransactionTable } from "../../components/tables";
import { PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Overview: React.FC = () => {
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

  const handleNavigateToTableManagement = () => {
    navigate("/table-management");
  };
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-400 via-blue-500 to-blue-600 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <DashboardCard title="Total Sale" value="₹ 0.00" />
          <DashboardCard title="Total Money in" value="₹ 0.00" />
          <DashboardCard title="Today's New Customers" value="0000" />
          <DashboardCard title="Pending Credits" value="0000" />
          <DashboardCard title="Loyal Customers" value="0000" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReceivableCard
          title="Total Receivable"
          subtitle="Total Unpaid Invoices"
          amount="₹0.00"
          progressPercent={30}
          progressColor="bg-yellow-400"
          currentAmount="₹ 0.00"
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
