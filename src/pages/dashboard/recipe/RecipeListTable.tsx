import React from 'react';
import { Edit2, XCircle } from 'lucide-react'; 
import { Recipe } from '../../../components/types'; 

interface RecipeListTableProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}

const RecipeListTable: React.FC<RecipeListTableProps> = ({ recipes, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full min-w-[700px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr> 
            {["No", "Product", "Date", "Total Manufactured", "Total Sold", "Balance", "Action"].map(header => (
              <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recipes.length > 0 ? recipes.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.totalManufactured}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.totalSold}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.balance}</td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <div className="flex space-x-2">
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800 p-1">
                    <XCircle size={18} />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">No orders found matching your criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeListTable;