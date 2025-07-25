import React, { useState } from 'react';
import { Search, Plus, Pencil } from 'lucide-react';
import AddEditCouponModal from './AddEditCouponModal';

interface Coupon {
  id: number;
  couponCode: string;
  couponValue: string;
  description: string;
  couponType: string;
  status: boolean; 
  validFrom: string;
  validTo: string;
}

const CouponsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
 
  const couponsData: Coupon[] = [
    {
      id: 1,
      couponCode: 'COI6657',
      couponValue: '2%',
      description: 'Promotion name without threshold - price',
      couponType: 'Promotional',
      status: true,
      validFrom: 'Tue Apr 01 2025',
      validTo: 'Tue Apr 01 2025',
    },
    {
      id: 2,
      couponCode: 'COI6657',
      couponValue: '4%',
      description: 'Flat 100 Off On 500 Purchase',
      couponType: 'Promotional',
      status: false,
      validFrom: 'Tue Apr 01 2025',
      validTo: 'Tue Apr 01 2025',
    },
    {
      id: 3,
      couponCode: 'COI6657',
      couponValue: '32%',
      description: 'Promotion name without threshold - price',
      couponType: 'Promotional',
      status: true,
      validFrom: 'Tue Apr 01 2025',
      validTo: 'Tue Apr 01 2025',
    },
    {
      id: 4,
      couponCode: 'COI6657',
      couponValue: '2%',
      description: 'Promotion name without threshold - price',
      couponType: 'Promotional',
      status: false,
      validFrom: 'Tue Apr 01 2025',
      validTo: 'Tue Apr 01 2025',
    },
  ];

  const handleOpenModal = (coupon?: Coupon) => {
    setEditingCoupon(coupon || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const toggleCouponStatus = (id: number) => { 
    console.log(`Toggling status for coupon ID: ${id}`);
    // For demo purposes, we'll just log it.
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Status
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Coupon type
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Validity
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Expiry / Available
        </button>
        <button className="p-2 border border-gray-300 rounded-md bg-black text-white">
          <Search size={20} />
        </button>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coupon Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coupon Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coupon Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid from / to
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {couponsData.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {coupon.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coupon.couponCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coupon.couponValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coupon.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coupon.couponType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={coupon.status}
                      onChange={() => toggleCouponStatus(coupon.id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="text-blue-600">{coupon.validFrom}</div>
                  <div className="text-red-600">{coupon.validTo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(coupon)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEditCouponModal isOpen={isModalOpen} onClose={handleCloseModal} editingCoupon={editingCoupon} />
    </div>
  );
};

export default CouponsTab;