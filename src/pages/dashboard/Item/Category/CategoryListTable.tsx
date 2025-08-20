// CategoryListTable.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Pagination from '../../../../components/ui/Pagination';
import { useCategories } from '../../../../hooks';

// Interface for a Category item
interface Category {
  slNo: string;
  categoryName: string;
  totalItems: number;
}

// Props for the CategoryListTable component
interface CategoryListTableProps {
  onEditCategory: (category: Category) => void; // Function to handle editing a category
  onAddCategory: () => void; // Function to handle adding a new category
  onSearch: (searchTerm: string) => void; // Function to handle search in category list
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({
  onEditCategory,
  onAddCategory,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the categories hook with pagination support
  const {
    categories: apiCategories,
    loading,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    fetchCategories
  } = useCategories({
    search: searchTerm,
    autoFetch: true
  });
  
  // Map API categories to the format expected by the component
  const categories: Category[] = apiCategories.map((category, index) => ({
    slNo: (index + 1).toString().padStart(2, '0'),
    categoryName: category.name,
    totalItems: category.itemCount || 0
  }));
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  // Refresh categories when search term changes
  useEffect(() => {
    fetchCategories({ search: searchTerm });
  }, [searchTerm, fetchCategories]);
  return (
    <>
      {/* Search and Add Category for Category tab */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by category name"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          onClick={onAddCategory}
          className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          Add new Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SI No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.slNo}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.categoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.totalItems}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-700 hover:text-blue-800"
                    onClick={() => onEditCategory(category)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination component */}
      {pagination.pages > 1 && (
        <div className="mt-4">
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
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
    </>
  );
};

export default CategoryListTable;

export type { Category }; // Export Category interface for use in other files if needed