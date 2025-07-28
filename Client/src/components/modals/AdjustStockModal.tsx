// components/modals/BillReturnModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BillReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  billData: any;
}

const BillReturnModal: React.FC<BillReturnModalProps> = ({ isOpen, onClose, billData }) => {
  const [returnProducts, setReturnProducts] = useState<any[]>([]);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);

  useEffect(() => {
    if (isOpen && billData && billData.products) {
      const initialReturnProducts = billData.products.map((p: any, index: number) => ({
        ...p,
        id: p.id || index,
        selectedForReturn: false,
        returnAmount: 0,
      }));
      setReturnProducts(initialReturnProducts);
      setTotalReturnAmount(0);
    }
  }, [isOpen, billData]);

  const handleProductReturnToggle = (productId: number) => {
    setReturnProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p =>
        p.id === productId ? { ...p, selectedForReturn: !p.selectedForReturn } : p
      );
      const newTotal = updatedProducts.reduce((sum, p) =>
        p.selectedForReturn ? sum + (parseFloat(p.amount) || 0) : sum, 0
      );
      setTotalReturnAmount(newTotal);
      return updatedProducts;
    });
  };

  const handleReturnAmountChange = (productId: number, value: string) => {
    setReturnProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p =>
        p.id === productId ? { ...p, returnAmount: parseFloat(value) || 0 } : p
      );
      const newTotal = updatedProducts.reduce((sum, p) =>
        sum + (p.selectedForReturn ? p.returnAmount : 0), 0
      );
      setTotalReturnAmount(newTotal);
      return updatedProducts;
    });
  };

  const handleReturn = () => {
    console.log("Returning bill:", billData.billNo, "Products to return:", returnProducts.filter(p => p.selectedForReturn));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Bill return</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {billData ? (
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Bill Details</h3>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Bill no:</strong> <span className="text-blue-600 font-medium">{billData.billNo}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Bill Date:</strong> {billData.billDate}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Sale rep:</strong> {billData.saleRep}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Bill Amount:</strong> ₹ {billData.billAmount}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Customer Details</h3>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Name:</strong> <span className="text-blue-600 font-medium">{billData.customer?.name}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Mobile Number:</strong> {billData.customer?.mobileNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Address:</strong> {billData.customer?.address || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">GSTIN:</strong> {billData.customer?.gstin || 'N/A'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Bill no:</strong> <span className="text-blue-600 font-medium">{billData.payment?.billNo}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Sale rep:</strong> ₹ {billData.payment?.saleRep}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Bill Amount:</strong> ₹ {billData.payment?.billAmount}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Details</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">No</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Product details</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Product Total Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Amount Return</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Choose products for return</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 h-28 overflow-y-auto block"> 
                    {returnProducts.map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50 table-row">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{product.name} - {product.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{product.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹ {product.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="w-20 border border-gray-300 rounded-sm px-2 py-1 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            value={product.returnAmount.toFixed(2)}
                            onChange={(e) => handleReturnAmountChange(product.id, e.target.value)}
                            disabled={!product.selectedForReturn}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={product.selectedForReturn}
                            onChange={() => handleProductReturnToggle(product.id)}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                            placeholder=""
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <span className="text-xl font-medium text-gray-900">Total Return :</span>
              <span className="text-2xl font-bold text-red-600">₹ {totalReturnAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleReturn}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Return
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="p-6 text-center text-gray-600">No bill data available for return.</p>
        )}
      </div>
    </div>
  );
};

export default BillReturnModal;