import { useState } from 'react';
import { useApiMutation } from './useApi';
import { rackService } from '../services/api';

interface ProductInRack {
  tempId?: string;
  itemName: string;
  itemCode: string;
  hsnCode: string;
  category: string;
  sellingPrice: number;
  purchasePrice: number;
  imageUrl?: string;
  isProductType: boolean;
  rackQuantities: Array<{ rackId: string; quantity: number }>;
}

interface AddProductToRackData {
  itemId: string;
  rackAssignments: Array<{ rack: string; quantity: number }>;
}

export const useAddProductToRack = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInRack | null>(null);

  const { mutate: addProductToRack, isLoading: addingProductToRack } = useApiMutation<
    AddProductToRackData,
    any
  >(
    (data) => rackService.addItemToRack(data),
    {
      onSuccess: () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
      },
    }
  );

  const openAddProductToRackModal = (productDetails: ProductInRack | null) => {
    setSelectedProduct(productDetails);
    setIsModalOpen(true);
  };

  const closeAddProductToRackModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProductToRack = (data: AddProductToRackData) => {
    addProductToRack(data);
  };

  return {
    isModalOpen,
    selectedProduct,
    addingProductToRack,
    openAddProductToRackModal,
    closeAddProductToRackModal,
    handleAddProductToRack,
  };
};