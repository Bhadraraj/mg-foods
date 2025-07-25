import React, { useState } from "react";
import ItemList from "./Item/Itemlist";
import NewItemForm from "./Item/NewItemForm";
import AddVariants from "./Item/AddVariants";

const Item: React.FC = () => { 
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'variants'>('list'); 
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