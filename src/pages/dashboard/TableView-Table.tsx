import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Users, MapPin } from 'lucide-react';
import { useTables } from '../../hooks/useTables';
import AddEditTableModal from '../../components/modals/AddTableModal';
import Pagination from '../../components/ui/Pagination';

const TablesTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const {
    tables,
    stats,
    loading,
    error,
    statsLoading,
    pagination,
    fetchTables,
    fetchTableStats,
    createTable,
    updateTable,
    updateTableStatus,
    deleteTable,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    updateStatusLoading,
  } = useTables({
    search: searchTerm,
    status: statusFilter,
    location: locationFilter,
    sortOrder: 'desc',
  });

  // Add useEffect to fetch tables when filters change
  useEffect(() => {
    fetchTables({ 
      search: searchTerm, 
      status: statusFilter,
      location: locationFilter 
    });
  }, [searchTerm, statusFilter, locationFilter]);

  const handleOpenModal = (table = null) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTables({ 
      search: searchTerm, 
      status: statusFilter,
      location: locationFilter 
    });
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      await updateTableStatus(tableId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update table status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Available: 'bg-green-100 text-green-800',
      Running: 'bg-blue-100 text-blue-800',
      Reserved: 'bg-yellow-100 text-yellow-800',
      Cleaning: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getElapsedTime = (elapsedMinutes) => {
    if (elapsedMinutes === 0) return '-';
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load tables. Please try again.</p>
        <button 
          onClick={() => fetchTables()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Tables</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.occupied}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-semibold text-green-600">{stats.available}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.revenue}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Running">Running</option>
            <option value="Reserved">Reserved</option>
            <option value="Cleaning">Cleaning</option>
          </select>
          
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            <option value="Ground Floor">Ground Floor</option>
            <option value="First Floor">First Floor</option>
            <option value="Second Floor">Second Floor</option>
            <option value="Terrace">Terrace</option>
          </select>

          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="Search tables..."
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
          New Table
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading tables...</p>
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
                  Table Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Elapsed Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent/Child
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
              {!tables || tables.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    No tables found
                  </td>
                </tr>
              ) : (
                tables.map((table, index) => (
                  <tr key={table._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(pagination.current - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {table.tableNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users size={16} className="mr-1 text-gray-400" />
                        {table.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {table.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={table.status}
                        onChange={(e) => handleStatusChange(table._id, e.target.value)}
                        disabled={updateStatusLoading}
                        className="text-xs rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                        style={{ 
                          backgroundColor: table.status === 'Available' ? '#dcfce7' : 
                                           table.status === 'Running' ? '#dbeafe' :
                                           table.status === 'Reserved' ? '#fef3c7' : '#f3f4f6',
                          color: table.status === 'Available' ? '#166534' : 
                                 table.status === 'Running' ? '#1e40af' :
                                 table.status === 'Reserved' ? '#92400e' : '#374151'
                        }}
                      >
                        <option value="Available">Available</option>
                        <option value="Running">Running</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Cleaning">Cleaning</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{table.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getElapsedTime(table.elapsedMinutes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.parentTable ? (
                        <span className="text-blue-600">Child of {table.parentTable.tableNumber}</span>
                      ) : table.childTables && table.childTables.length > 0 ? (
                        <span className="text-green-600">{table.childTables.length} child(s)</span>
                      ) : (
                        <span className="text-gray-400">Standalone</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={table.isActive}
                          onChange={() => updateTable(table._id, { isActive: !table.isActive })}
                          disabled={updateLoading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(table)}
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

      <AddEditTableModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editingTable={editingTable}
        onSubmit={editingTable ? updateTable : createTable}
        loading={editingTable ? updateLoading : createLoading}
      />
    </div>
  );
};

export default TablesTab;