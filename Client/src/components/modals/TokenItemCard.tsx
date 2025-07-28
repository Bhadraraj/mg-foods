// src/components/CardsAndGrids/TokenItemCard.tsx
import React from "react";

interface TokenItemCardProps {
  item: {
    id: string;
    name: string;
    quantity: number; // Quantity associated with this token item
  };
  onRemove: (itemId: string) => void;
}

const TokenItemCard: React.FC<TokenItemCardProps> = ({ item, onRemove }) => {
  return (
    <div className="relative bg-blue-600 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-md">
      <div className="text-sm font-semibold">{item.name}</div>
      {item.quantity > 0 && (
        <div className="absolute -top-1 -right-1 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-blue-600">
          {item.quantity}
        </div>
      )}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Remove ${item.name}`}
      >
        <span className="sr-only">Remove</span> {/* For accessibility */}
        &times;
      </button>
    </div>
  );
};

export default TokenItemCard;