import React, { useState } from 'react';
import { Search, Filter, Plus, Pencil, Tag } from 'lucide-react';
import AddEditOfferModal from './AddEditOfferModal';

interface Offer {
  id: number;
  name: string;
  offerEffectiveFrom: string;
  offerEffectiveUpto: string;
  discountType: string;
  discount: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  status: string;
}

const OffersTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
 
  const offersData: Offer[] = [
    {
      id: 1,
      name: 'Name',
      offerEffectiveFrom: '2025 May 12',
      offerEffectiveUpto: '2025 May 22',
      discountType: 'Percentage',
      discount: '7%',
      slug: 'Product',
      createdBy: 'Kumar 2025 May 12',
      updatedBy: 'Kumar 2025 May 22',
      status: 'Running',
    },
    {
      id: 2,
      name: 'Name',
      offerEffectiveFrom: '2025 May 12',
      offerEffectiveUpto: '2025 May 22',
      discountType: 'Percentage',
      discount: '7%',
      slug: 'Product',
      createdBy: 'Kumar 2025 May 12',
      updatedBy: 'Kumar 2025 May 22',
      status: 'Running',
    },
    {
      id: 3,
      name: 'Name',
      offerEffectiveFrom: '2025 May 12',
      offerEffectiveUpto: '2025 May 22',
      discountType: 'Percentage',
      discount: '7%',
      slug: 'Product',
      createdBy: 'Kumar 2025 May 12',
      updatedBy: 'Kumar 2025 May 22',
      status: 'Running',
    },
    {
      id: 4,
      name: 'Name',
      offerEffectiveFrom: '2025 May 12',
      offerEffectiveUpto: '2025 May 22',
      discountType: 'Percentage',
      discount: '7%',
      slug: 'Product',
      createdBy: 'Kumar 2025 May 12',
      updatedBy: 'Kumar 2025 May 22',
      status: 'Running',
    },
  ];

  const handleOpenModal = (offer?: Offer) => {
    setEditingOffer(offer || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          >
            <Plus size={18} />
            <span>New Offer</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer Effective from
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer Effective upto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created by / at
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated by / at
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offersData.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {offer.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.offerEffectiveFrom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.offerEffectiveUpto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.discountType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.discount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {offer.updatedBy}
                </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                 
                      onChange={() => toggleOfferStatus(coupon.id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    offer.status === 'Running' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {offer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(offer)}
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

      <AddEditOfferModal isOpen={isModalOpen} onClose={handleCloseModal} editingOffer={editingOffer} />
    </div>
  );
};

export default OffersTab;