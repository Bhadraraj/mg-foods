import React from 'react';
import { Recipe } from '../../../components/types'; // Import Recipe interface

interface RecipeListTableProps {
  recipes: Recipe[];
}

const RecipeListTable: React.FC<RecipeListTableProps> = ({ recipes }) => {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full min-w-[700px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Headers matching image_7a061b.png, without "Action" */}
            {["No", "Product", "Date", "Total Manufactured", "Total Sold", "Balance"].map(header => (
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
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-500">No orders found matching your criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeListTable;