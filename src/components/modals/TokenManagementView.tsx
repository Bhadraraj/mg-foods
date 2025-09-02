// src/views/TokenManagementView.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddTokenModal from "../modals/AddTokenModal";
import { useTokens } from "../../hooks/useTokens";
import { CreateTokenData, UpdateTokenData, UpdateTokenPaymentData } from "../../services/api/token";

// Define PaymentStatus type
type PaymentStatus = "Pending" | "Paid" | "Refunded";

interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
}

interface UITokenOrder {
  id: string;
  tokenNumber: string;
  displayToken: string;
  date: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  items: SelectedItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: string;
  orderType: string;
  priority: string;
  orderNotes?: string;
  estimatedTime?: number;
  totalTea: number;
  totalVada: number;
}

const TokenManagementView: React.FC = () => {
  const {
    tokens: apiTokens,
    loading: tokensLoading,
    error: tokensError,
    createToken,
    updateToken,
    updateTokenPayment,
    fetchTokens,
  } = useTokens();

  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);
  const [selectedTokenToEdit, setSelectedTokenToEdit] = useState<UITokenOrder | null>(null);

  // Transform API tokens to UI format
  const transformTokenForUI = (apiToken: any): UITokenOrder => {
    // Transform orderItems to UI items format
    const items: SelectedItem[] = apiToken.orderItems?.map((orderItem: any) => ({
      id: orderItem.item?.id || orderItem.item?._id || orderItem._id,
      name: orderItem.itemName || orderItem.item?.productName || 'Unknown Item',
      quantity: orderItem.quantity || 0,
      amount: orderItem.totalPrice || 0,
    })) || [];

    // Calculate totals
    const totalTea = items.reduce((sum, item) => 
      item.name.toLowerCase().includes('tea') || item.name.toLowerCase().includes('coffee') 
        ? sum + item.quantity : sum, 0);
    
    const totalVada = items.reduce((sum, item) => 
      item.name.toLowerCase().includes('vada') ? sum + item.quantity : sum, 0);

    return {
      id: apiToken.id || apiToken._id,
      tokenNumber: apiToken.tokenNumber || '',
      displayToken: apiToken.displayToken || apiToken.tokenNumber || '',
      date: new Date(apiToken.createdAt || apiToken.orderTiming || Date.now()).toLocaleDateString(),
      customerName: apiToken.customerDetails?.name || '',
      customerMobile: apiToken.customerDetails?.mobile || '',
      customerEmail: apiToken.customerDetails?.email,
      customerAddress: apiToken.customerDetails?.address,
      items,
      totalAmount: apiToken.orderSummary?.grandTotal || 0,
      paymentStatus: apiToken.paymentDetails?.status || 'Pending',
      orderStatus: apiToken.orderStatus || 'Placed',
      orderType: apiToken.orderType || 'Takeaway',
      priority: apiToken.priority || 'Normal',
      orderNotes: apiToken.orderNotes,
      estimatedTime: apiToken.estimatedTime,
      totalTea,
      totalVada,
    };
  };

  // Transform UI tokens from API data
  const tokenOrders: UITokenOrder[] = apiTokens?.map(transformTokenForUI) || [];

  const handleAddTokenClick = () => {
    setSelectedTokenToEdit(null);
    setIsAddTokenModalOpen(true);
  };

  const handleEditTokenClick = (token: UITokenOrder) => {
    setSelectedTokenToEdit(token);
    setIsAddTokenModalOpen(true);
  };

  const handleSaveTokenOrder = async (data: {
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    customerAddress?: string;
    items: SelectedItem[];
    orderType: string;
    priority: string;
    orderNotes?: string;
    estimatedTime?: number;
  }) => {
    try {
      if (selectedTokenToEdit) {
        // Update existing token
        const updateData: UpdateTokenData = {
          customerDetails: {
            name: data.customerName,
            mobile: data.customerMobile,
            email: data.customerEmail,
            address: data.customerAddress,
          },
          orderItems: data.items.map(item => ({
            item: item.id, // This should be the actual item ID from your menu/products
            quantity: item.quantity,
            specialInstructions: '',
          })),
          orderType: data.orderType as 'Dine-in' | 'Takeaway' | 'Delivery',
          priority: data.priority as 'Low' | 'Normal' | 'High',
          orderNotes: data.orderNotes,
          estimatedTime: data.estimatedTime,
        };

        await updateToken(selectedTokenToEdit.id, updateData);
      } else {
        // Create new token
        const createData: CreateTokenData = {
          customerDetails: {
            name: data.customerName,
            mobile: data.customerMobile,
            email: data.customerEmail,
            address: data.customerAddress,
          },
          orderItems: data.items.map(item => ({
            item: item.id, // This should be the actual item ID from your menu/products
            quantity: item.quantity,
            specialInstructions: '',
          })),
          orderType: data.orderType as 'Dine-in' | 'Takeaway' | 'Delivery',
          priority: data.priority as 'Low' | 'Normal' | 'High',
          orderNotes: data.orderNotes,
          estimatedTime: data.estimatedTime,
        };

        await createToken(createData);
      }
      
      setIsAddTokenModalOpen(false);
      setSelectedTokenToEdit(null);
    } catch (error) {
      console.error('Error saving token order:', error);
      alert('Error saving token order. Please try again.');
    }
  };

  const handleChangePaymentStatus = async (tokenId: string, newStatus: PaymentStatus) => {
    try {
      const updateData: UpdateTokenPaymentData = {
        status: newStatus,
        method: 'Cash', // You might want to make this configurable
        paidAmount: newStatus === 'Paid' ? tokenOrders.find(t => t.id === tokenId)?.totalAmount : 0,
      };

      await updateTokenPayment(tokenId, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status. Please try again.');
    }
  };

  // Show loading state
  if (tokensLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tokens...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (tokensError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading tokens: {tokensError}</p>
          <button 
            onClick={fetchTokens}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">  
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Token Management</h2>
        <button
          onClick={handleAddTokenClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Token
        </button>
      </div> 
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Detail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tea
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Vada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tokenOrders.map((token, index) => (
                <tr key={token.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {token.displayToken}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {token.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{token.customerName}</div>
                      <div className="text-gray-500">{token.customerMobile}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {token.totalTea.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      {token.totalVada.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ₹{token.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${token.paymentStatus === "Paid" ? "bg-green-100 text-green-800" : ""}
                      ${token.paymentStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${token.paymentStatus === "Refunded" ? "bg-red-100 text-red-800" : ""}
                    `}>
                      {token.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full
                      ${token.orderType === "Dine-in" ? "bg-blue-100 text-blue-800" : ""}
                      ${token.orderType === "Takeaway" ? "bg-green-100 text-green-800" : ""}
                      ${token.orderType === "Delivery" ? "bg-purple-100 text-purple-800" : ""}
                    `}>
                      {token.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTokenClick(token)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <select
                        value={token.paymentStatus}
                        onChange={(e) => handleChangePaymentStatus(token.id, e.target.value as PaymentStatus)}
                        className="block py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tokenOrders.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="mb-4">
              <Plus size={48} className="mx-auto text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No token orders found</h3>
            <p className="text-sm">Click "Add New Token" to create your first order.</p>
          </div>
        )}
      </div>

      {/* AddTokenModal Integration */}
      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        onClose={() => {
          setIsAddTokenModalOpen(false);
          setSelectedTokenToEdit(null);
        }}
        onSaveTokenOrder={handleSaveTokenOrder}
        initialTokenData={selectedTokenToEdit ? {
          customerName: selectedTokenToEdit.customerName,
          customerMobile: selectedTokenToEdit.customerMobile,
          customerEmail: selectedTokenToEdit.customerEmail,
          customerAddress: selectedTokenToEdit.customerAddress,
          items: selectedTokenToEdit.items,
          orderType: selectedTokenToEdit.orderType,
          priority: selectedTokenToEdit.priority,
          orderNotes: selectedTokenToEdit.orderNotes,
          estimatedTime: selectedTokenToEdit.estimatedTime,
        } : undefined}
      />
    </div>
  );
};

export default TokenManagementView;