import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil } from 'lucide-react';
import { useCoupons } from '../../../hooks/useCoupons';
import AddEditCouponModal from './AddEditCouponModal';
import Pagination from '../../../components/ui/Pagination'; // Import the Pagination component

const CouponsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const {
    coupons,
    loading,
    error,
    pagination,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    toggleLoading,
  } = useCoupons({
    search: searchTerm,
    status: statusFilter,
    couponType: typeFilter,
    sortOrder: 'desc',
  });

  // Add useEffect to fetch coupons when filters change
  useEffect(() => {
    fetchCoupons({ 
      search: searchTerm, 
      status: statusFilter,
      couponType: typeFilter 
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const handleOpenModal = (coupon = null) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCoupons({ 
      search: searchTerm, 
      status: statusFilter,
      couponType: typeFilter 
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleCouponStatus(id);
    } catch (error) {
      console.error('Failed to toggle coupon status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);
    
    let status = coupon.status;
    let statusClass = '';

    if (!coupon.isActive) {
      status = 'Inactive';
      statusClass = 'bg-gray-100 text-gray-800';
    } else if (now < validFrom) {
      status = 'Pending';
      statusClass = 'bg-yellow-100 text-yellow-800';
    } else if (now > validTo) {
      status = 'Expired';
      statusClass = 'bg-red-100 text-red-800';
    } else {
      status = 'Active';
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
        <p className="text-red-600">Failed to load coupons. Please try again.</p>
        <button 
          onClick={() => fetchCoupons()}
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Promotional">Promotional</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Event">Event</option>
          </select>

          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="Search coupons..."
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
          Add Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading coupons...</p>
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
                  Coupon Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid from / to
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!coupons || coupons.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, index) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(pagination.current - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.discountType === 'Percentage' ? `${coupon.couponValue}%` : `₹${coupon.couponValue}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {coupon.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.couponType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-blue-600">{formatDate(coupon.validFrom)}</div>
                      <div className="text-red-600">{formatDate(coupon.validTo)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{coupon.currentUsageCount} / {coupon.totalUsageLimit || 'Unlimited'}</div>
                      <div className="text-xs text-gray-500">
                        {coupon.remainingUsage} remaining
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={coupon.isActive}
                          onChange={() => handleToggleStatus(coupon._id)}
                          disabled={toggleLoading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(coupon)}
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

      {/* Use the Pagination component instead of custom pagination */}
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

      <AddEditCouponModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editingCoupon={editingCoupon}
        onSubmit={editingCoupon ? updateCoupon : createCoupon}
        loading={editingCoupon ? updateLoading : createLoading}
      />
    </div>
  );
};

export default CouponsTab;