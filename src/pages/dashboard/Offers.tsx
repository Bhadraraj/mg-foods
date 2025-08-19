import React, { useState } from 'react';
import OffersTab from './offers/OffersTab';
import CouponsTab from './offers/CouponsTab';
import ReferrerPointsTab from './offers/ReferrerPointsTab';

const OffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'coupon' | 'referrerPoints'>('offers');

  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Offers & Discounts</h1>
             {activeTab === 'offers' && (
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                </div>
            )} 
             {activeTab === 'coupon' && (
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              </div>
            )}
          </div>
        </div>

        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'offers' ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('offers')}
            >
              Offers
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'coupon' ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('coupon')}
            >
              Coupon
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'referrerPoints' ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('referrerPoints')}
            >
              Referrer points
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'coupon' && <CouponsTab />}
          {activeTab === 'referrerPoints' && <ReferrerPointsTab />}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;