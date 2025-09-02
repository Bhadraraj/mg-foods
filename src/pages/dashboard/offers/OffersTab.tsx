import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Tag } from 'lucide-react';
import { useOffers } from '../../../hooks/useOffers';
import AddEditOfferModal from './AddEditOfferModal';
import Pagination from '../../../components/ui/Pagination'; 

const OffersTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('');

  const {
    offers,
    loading,
    error,
    pagination,
    fetchOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    toggleLoading,
  } = useOffers({
    search: searchTerm,
    status: statusFilter,
    discountType: discountTypeFilter,
    sortOrder: 'desc',
  });

  // Add useEffect to fetch offers when filters change
  useEffect(() => {
    fetchOffers({ 
      search: searchTerm, 
      status: statusFilter,
      discountType: discountTypeFilter 
    });
  }, [searchTerm, statusFilter, discountTypeFilter]);

  const handleOpenModal = (offer = null) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOffers({ 
      search: searchTerm, 
      status: statusFilter,
      discountType: discountTypeFilter 
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleOfferStatus(id);
    } catch (error) {
      console.error('Failed to toggle offer status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getStatusBadge = (offer) => {
    const now = new Date();
    const validFrom = new Date(offer.offerEffectiveFrom);
    const validTo = new Date(offer.offerEffectiveUpto);
    
    let status = offer.status;
    let statusClass = '';

    if (!offer.isActive) {
      status = 'Paused';
      statusClass = 'bg-gray-100 text-gray-800';
    } else if (now < validFrom) {
      status = 'Draft';
      statusClass = 'bg-yellow-100 text-yellow-800';
    } else if (now > validTo) {
      status = 'Expired';
      statusClass = 'bg-red-100 text-red-800';
    } else {
      status = 'Running';
      statusClass = 'bg-green-100 text-green-800';
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {status}
      </span>
    );
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load offers. Please try again.</p>
        <button 
          onClick={() => fetchOffers()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Running">Running</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
            <option value="Draft">Draft</option>
          </select>
          
          <select
            value={discountTypeFilter}
            onChange={(e) => setDiscountTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Discount Types</option>
            <option value="Percentage">Percentage</option>
            <option value="Fixed">Fixed</option>
            <option value="BOGO">BOGO</option>
          </select>

          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          <button 
            type="submit"
            className="p-2 border border-gray-300 rounded-md bg-black text-white hover:bg-gray-800"
          >
            <Search size={20} />
          </button>
        </form>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          <Plus size={18} />
          New Offer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading offers...</p>
        </div>
      ) : (
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
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
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
              {!offers || offers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                    No offers found
                  </td>
                </tr>
              ) : (
                offers.map((offer, index) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(pagination.current - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(offer.offerEffectiveFrom)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(offer.offerEffectiveUpto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.discountType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.discountType === 'Percentage' ? `${offer.discount}%` : 
                       offer.discountType === 'Fixed' ? `₹${offer.discount}` : 
                       offer.discountType === 'BOGO' ? 'Buy 1 Get 1' : offer.discount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{offer.createdBy?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{formatDate(offer.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{offer.updatedBy?.name || offer.createdBy?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{formatDate(offer.updatedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={offer.isActive}
                          onChange={() => handleToggleStatus(offer._id)}
                          disabled={toggleLoading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(offer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(offer)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={updateLoading}
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Use the Pagination component */}
      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.current}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
        />
      )}

      <AddEditOfferModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editingOffer={editingOffer}
        onSubmit={editingOffer ? updateOffer : createOffer}
        loading={editingOffer ? updateLoading : createLoading}
      />
    </div>
  );
};

export default OffersTab;