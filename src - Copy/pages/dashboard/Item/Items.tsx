import React, { useState } from "react";
import ItemList from "./Itemlist";
import NewItemForm from "./NewItemForm";
import AddVariants from "./AddVariants";

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