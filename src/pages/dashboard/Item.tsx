import React, { useState } from "react";
import { useApi, useApiMutation } from "../../hooks/useApi";
import { itemsAPI } from "../../services/api";
import ItemList from "./Item/Itemlist";
import NewItemForm from "./Item/NewItemForm";

  const [selectedItem, setSelectedItem] = useState(null);

  // API hooks
  const { data: itemsData, loading, error, refetch } = useApi(itemsAPI.getItems);
  const { mutate: createItem, loading: createLoading } = useApiMutation(itemsAPI.createItem);
  const { mutate: updateItem, loading: updateLoading } = useApiMutation(itemsAPI.updateItem);
  const { mutate: deleteItem } = useApiMutation(itemsAPI.deleteItem);

  const handleCreateItem = async (itemData) => {
    try {
      await createItem(itemData);
      refetch();
      setCurrentView('list');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (itemData) => {
    try {
      await updateItem(selectedItem.id, itemData);
      refetch();
      setCurrentView('list');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
        refetch();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setCurrentView('form');
  };
const Item: React.FC = () => { 
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'variants'>('list'); 
  switch (currentView) {
    case 'form':
      return (
        <NewItemForm
          onBack={() => setCurrentView('list')}
          onNavigateToVariants={() => setCurrentView('variants')}
          onSave={selectedItem ? handleUpdateItem : handleCreateItem}
          initialData={selectedItem}
          loading={createLoading || updateLoading}
        />
      );
    case 'variants':
      return (
        <AddVariants onBack={() => setCurrentView('form')} />
      );
    case 'list':
    default:
      return (
        <ItemList 
          setShowNewItemForm={() => {
            setSelectedItem(null);
            setCurrentView('form');
          }}
          items={itemsData?.data?.items || []}
          loading={loading}
          error={error}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />
      );
  }
};

export default Item;