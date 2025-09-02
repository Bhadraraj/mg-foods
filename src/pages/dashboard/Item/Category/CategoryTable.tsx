import React, { useState, useMemo, useCallback } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import Pagination from '../../../../components/ui/Pagination';
import { useCategories } from '../../../../hooks/useCategories';
import { Category } from '../../../../services/api/category';
 

// Interface for display purposes (mapped from API response)
interface DisplayCategory {
  slNo: string;
  categoryName: string;
  description: string;
  totalItems: number;
  status: string;
  id: string;
  _id: string;
}

// Props for the CategoryListTable component
interface CategoryListTableProps {
  onEditCategory: (category: DisplayCategory) => void;
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({
  onEditCategory,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Memoize the options object to prevent unnecessary re-renders
  const categoriesOptions = useMemo(() => ({
    search: searchTerm,
    autoFetch: true
  }), [searchTerm]);
  
  // Use the categories hook with pagination support
  const {
    categories,
    loading,
    error,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    deleteCategory,
    deleteLoading,
  } = useCategories(categoriesOptions);
  
  // Map API categories to the format expected by the component
  const mappedCategories: DisplayCategory[] = useMemo(() => 
    categories.map((category, index) => ({
      slNo: ((pagination.page - 1) * pagination.limit + index + 1).toString().padStart(2, '0'),
      categoryName: category.name,
      description: category.description || '',
      totalItems: category.totalItems || 0,
      status: category.status,
      id: category.id,
      _id: category._id,
    }))
  , [categories, pagination.page, pagination.limit]);
  
  // Handle search input changes with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Handle delete with confirmation
  const handleDelete = useCallback(async (categoryId: string, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      try {
        await deleteCategory(categoryId);
        onDeleteCategory(categoryId);
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  }, [deleteCategory, onDeleteCategory]);
  
  // Show loading state
  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">Error loading categories: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with search and add button */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by category name"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={onAddCategory}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap"
            >
              Add New Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SI No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mappedCategories.length > 0 ? (
                mappedCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.totalItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={() => onEditCategory(category)}
                          title="Edit category"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          onClick={() => handleDelete(category._id, category.categoryName)}
                          disabled={deleteLoading}
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-gray-400 mb-2">
                        <Search size={48} />
                      </div>
                      {loading ? (
                        <div>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mx-auto mb-2"></div>
                          <span>Loading categories...</span>
                        </div>
                      ) : searchTerm ? (
                        <div>
                          <p className="text-lg font-medium mb-1">No categories found</p>
                          <p>No categories match "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium mb-1">No categories yet</p>
                          <p>Get started by creating your first category</p>
                          <button
                            onClick={onAddCategory}
                            className="mt-3 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
                          >
                            Add New Category
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination component */}
        {pagination.pages > 1 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
        
        {/* Loading overlay for subsequent requests */}
        {loading && categories.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
              <span className="text-gray-600">Updating categories...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListTable;
export type { DisplayCategory as Category };