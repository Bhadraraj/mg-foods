import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Offer {
  id: number;
  name: string;
  product: string;
  offerType: 'Discount' | 'Free';
  offerEffectiveFrom: string;
  offerEffectiveUpto: string;
  discountType: string;
  discount: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  status: string;
}

interface AddEditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingOffer?: Offer | null;
}

const AddEditOfferModal: React.FC<AddEditOfferModalProps> = ({ isOpen, onClose, editingOffer }) => {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [offerType, setOfferType] = useState<'Discount' | 'Free'>('Discount');
  const [offerEffectiveFrom, setOfferEffectiveFrom] = useState('');
  const [offerEffectiveUpto, setOfferEffectiveUpto] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discount, setDiscount] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('Running');

  useEffect(() => {
    if (editingOffer) {
      setName(editingOffer.name);
      setProduct(editingOffer.product);
      setOfferType(editingOffer.offerType);
      setOfferEffectiveFrom(editingOffer.offerEffectiveFrom);
      setOfferEffectiveUpto(editingOffer.offerEffectiveUpto);
      setDiscountType(editingOffer.discountType);
      setDiscount(editingOffer.discount);
      setSlug(editingOffer.slug);
      setStatus(editingOffer.status);
    } else {
      
      setName('');
      setProduct(''); 
      setOfferType('Discount');
      setOfferEffectiveFrom('');
      setOfferEffectiveUpto('');
      setDiscountType('Percentage');
      setDiscount('');
      setSlug('');
      setStatus('Running');
    }
  }, [editingOffer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: Offer = {
      id: editingOffer?.id || Date.now(),
      name,
      product,
      offerType,
      offerEffectiveFrom,
      offerEffectiveUpto,
      discountType,
      discount,
      slug,
      createdBy: 'Admin',
      updatedBy: 'Admin',
      status,
    };
    console.log('Saving Offer:', newOffer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">
            {editingOffer ? 'Edit Offer' : 'Add New Offer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Offer Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                Product
              </label>
              <select
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Product</option>
                <option value="Product A">Product A</option>
                <option value="Product B">Product B</option>
                <option value="Product C">Product C</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="offerType" className="block text-sm font-medium text-gray-700">
              Offer Type
            </label>
            <select
              id="offerType"
              value={offerType}
              onChange={(e) => setOfferType(e.target.value as 'Discount' | 'Free')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="Discount">Discount</option>
              <option value="Free">Free</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed Amount">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                type="text"
                id="discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                Effective From
              </label>
              <input
                type="date"
                id="from"
                value={offerEffectiveFrom}
                onChange={(e) => setOfferEffectiveFrom(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="upto" className="block text-sm font-medium text-gray-700">
                Effective Upto
              </label>
              <input
                type="date"
                id="upto"
                value={offerEffectiveUpto}
                onChange={(e) => setOfferEffectiveUpto(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="Running">Running</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              {editingOffer ? 'Update Offer' : 'Add Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOfferModal;