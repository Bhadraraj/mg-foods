// CategoryListTable.tsx
import React from 'react';
import { Search } from 'lucide-react'; // Assuming you might want Search icon here too, or pass it from parent

// Interface for a Category item
interface Category {
  slNo: string;
  categoryName: string;
  totalItems: number;
}

// Props for the CategoryListTable component
interface CategoryListTableProps {
  categories: Category[]; // Array of category data
  onEditCategory: (category: Category) => void; // Function to handle editing a category
  onAddCategory: () => void; // Function to handle adding a new category
  onSearch: (searchTerm: string) => void; // Function to handle search in category list
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({
  categories,
  onEditCategory,
  onAddCategory,
  onSearch,
}) => {
  return (
    <>
      {/* Search and Add Category for Category tab */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by category name"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
            onChange={(e) => onSearch(e.target.value)}
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
    </>
  );
};

export default CategoryListTable;

export type { Category }; // Export Category interface for use in other files if needed