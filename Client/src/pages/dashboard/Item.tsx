import React, { useState } from "react";
import ItemList from "./Item/Itemlist";
import NewItemForm from "./Item/NewItemForm";
import AddVariants from "./Item/AddVariants";

const Item: React.FC = () => {
  // State to manage the current view: 'list', 'form', or 'variants'
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'variants'>('list');

  // Render based on the current view
  switch (currentView) {
    case 'form':
      return (
        <NewItemForm
          onBack={() => setCurrentView('list')}
          onNavigateToVariants={() => setCurrentView('variants')}
        />
      );
    case 'variants':
      return (
        <AddVariants onBack={() => setCurrentView('form')} />
      );
    case 'list':
    default:
      return (
        <ItemList setShowNewItemForm={() => setCurrentView('form')} />
      );
  }
};

export default Item;