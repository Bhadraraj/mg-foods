import React, { useState } from 'react';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemCode?: string;
  currentStock: number;
  maxStock?: number;
  minStock?: number;
  onSave: (currentStock: number, maxStock: number, minStock: number) => void;
}

const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemCode,
  currentStock,
  maxStock = 100,
  minStock = 10,
  onSave,
}) => {
  const [current, setCurrent] = useState(currentStock);
  const [maximum, setMaximum] = useState(maxStock);
  const [minimum, setMinimum] = useState(minStock);

  if (!isOpen) return null;

  const StockControl: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ label, value, onChange }) => (
    <div className="mb-8">
      <div className="text-gray-400 text-sm mb-4 text-center">{label}</div>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-250 flex items-center justify-center text-gray-500 font-light text-2xl"
        >
          −
        </button>
        <div className="text-5xl font-light text-gray-900 min-w-[120px] text-center tracking-wider">
          {value.toString().padStart(3, '0')}
        </div>
        <button
          onClick={() => onChange(value + 1)}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-250 flex items-center justify-center text-gray-500 font-light text-2xl"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-1">{itemName}</h2>
          {itemCode && (
            <div className="text-sm text-gray-400 font-light">{itemCode}</div>
          )}
        </div>

        <StockControl label="Current Stock" value={current} onChange={setCurrent} />
        <StockControl label="Maximum Stock" value={maximum} onChange={setMaximum} />
        <StockControl label="Minimum Stock" value={minimum} onChange={setMinimum} />

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(current, maximum, minimum)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustStockModal;
