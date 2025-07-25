import React from 'react';
import { Edit2, XCircle } from 'lucide-react'; 
import { MasterIngredientOption } from '../../../components/types';

interface MasterIngredientsListProps {
  masterIngredients: MasterIngredientOption[];
  onEditMasterIngredient: (ingredient: MasterIngredientOption) => void;
  onDeleteMasterIngredient: (id: string) => void;
}

const MasterIngredientsList: React.FC<MasterIngredientsListProps> = ({
  masterIngredients,
  onEditMasterIngredient,
  onDeleteMasterIngredient
}) => {
  return (
    <div className="mt-4">
      {masterIngredients.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturing Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ingredients</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {masterIngredients.map((ing, index) => (
                <tr key={ing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{ing.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹{ing.purchasePrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹{ ((ing as any).sellingPrice || 2820).toFixed(2) }</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{ing.currentStock}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditMasterIngredient(ing)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteMasterIngredient(ing.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 p-4">No master ingredients defined.</p>
      )}
    </div>
  );
};

export default MasterIngredientsList;