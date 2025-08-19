import React from 'react';

interface OrderStats {
  totalOrders: string;
  totalSales: string;
}

interface OnlineOrdersProps {
  todayStats: OrderStats;
  platformStats: {
    [key: string]: OrderStats;
    zomato: OrderStats;
    swiggy: OrderStats;
    website: OrderStats;
  };
}

const OnlineOrderCard: React.FC<OnlineOrdersProps> = ({ todayStats, platformStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <h3 className="text-gray-700 font-medium">Online Orders</h3>
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          Sort
        </button>
      </div>
      
      <div className="p-4">
        <h4 className="font-medium text-gray-900">Today</h4>
        <div className="mt-1 flex justify-between text-sm text-gray-500">
          <span>Total Orders</span>
          <span className="font-medium">{todayStats.totalOrders}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-gray-500">
          <span>Total Sales</span>
          <span className="font-medium">{todayStats.totalSales}</span>
        </div>
      </div>
      
      <div className="px-4 pb-4 grid grid-cols-3 gap-4">
        <div className="bg-red-500 text-white rounded-md p-3">
          <h4 className="font-medium">Zomato</h4>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>{platformStats.zomato.totalOrders}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total Sales</span>
              <span>{platformStats.zomato.totalSales}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-500 text-white rounded-md p-3">
          <h4 className="font-medium">Swiggy</h4>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>{platformStats.swiggy.totalOrders}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total Sales</span>
              <span>{platformStats.swiggy.totalSales}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-500 text-white rounded-md p-3">
          <h4 className="font-medium">Website</h4>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>{platformStats.website.totalOrders}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total Sales</span>
              <span>{platformStats.website.totalSales}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineOrderCard;