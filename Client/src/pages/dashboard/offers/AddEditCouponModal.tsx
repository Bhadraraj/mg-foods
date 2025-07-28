import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Coupon {
  id: number;
  couponType: string; // This will now hold 'AC' or 'Non AC'
  couponName: string;
  qrCode: string;
  status: boolean;
  couponCode: string;
  couponValue: number;
  discountType: 'percentage' | 'fixed';
  billType: string;
  validFrom: string;
  validTo: string;
  type: string;
  description: string;
}

interface AddEditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCoupon?: Coupon | null;
}

const AddEditCouponModal: React.FC<AddEditCouponModalProps> = ({ isOpen, onClose, editingCoupon }) => {
  const [couponType, setCouponType] = useState('');
  const [couponName, setCouponName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState<number | ''>('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [billType, setBillType] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingCoupon) {
      setCouponType(editingCoupon.couponType);
      setCouponName(editingCoupon.couponName);
      setQrCode(editingCoupon.qrCode);
      setStatus(editingCoupon.status);
      setCouponCode(editingCoupon.couponCode);
      setCouponValue(editingCoupon.couponValue);
      setDiscountType(editingCoupon.discountType);
      setBillType(editingCoupon.billType);
      setValidFrom(editingCoupon.validFrom);
      setValidTo(editingCoupon.validTo);
      setType(editingCoupon.type);
      setDescription(editingCoupon.description);
    } else {
      setCouponType('');
      setCouponName('');
      setQrCode('');
      setStatus(false);
      setCouponCode('');
      setCouponValue('');
      setDiscountType('fixed');
      setBillType('');
      setValidFrom('');
      setValidTo('');
      setType('');
      setDescription('');
    }
  }, [editingCoupon, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCouponValue = typeof couponValue === 'number' ? couponValue : parseFloat(couponValue || '0');

    const newCoupon: Coupon = {
      id: editingCoupon?.id || Date.now(),
      couponType,
      couponName,
      qrCode,
      status,
      couponCode,
      couponValue: finalCouponValue,
      discountType,
      billType,
      validFrom,
      validTo,
      type,
      description,
    };
    console.log('Saving Coupon:', newCoupon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">
            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="couponType" className="block text-sm font-medium text-gray-700">
                Coupon type
              </label>
              <select
                id="couponType"
                value={couponType}
                onChange={(e) => setCouponType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Type</option>
                {/* Changed options here */}
                <option value="AC">AC</option>
                <option value="Non AC">Non AC</option>
              </select>
            </div>
            <div>
              <label htmlFor="couponName" className="block text-sm font-medium text-gray-700">
                Coupon Name
              </label>
              <input
                type="text"
                id="couponName"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="flex items-center space-x-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <label htmlFor="status" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="status"
                    className="sr-only"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                  <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </label>
              <style>{`
                input:checked + .block {
                    background-color: #2563eb; /* Blue for active */
                }
                input:checked + .block + .dot {
                    transform: translateX(100%);
                }
              `}</style>
            </div>
            <div className="h-24 border border-gray-300 rounded-md flex items-center justify-center text-gray-400">
              QR Code Placeholder
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                id="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
            <div>
              <label htmlFor="couponValue" className="block text-sm font-medium text-gray-700">
                Coupon Value {discountType === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                id="couponValue"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                min={discountType === 'percentage' ? "0" : undefined}
                max={discountType === 'percentage' ? "100" : undefined}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="billType" className="block text-sm font-medium text-gray-700">
                Bill Type
              </label>
              <select
                id="billType"
                value={billType}
                onChange={(e) => setBillType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Bill Type</option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Coupon Validity
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    id="validFrom"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <input
                    type="date"
                    id="validTo"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select Type</option>
              <option value="Ac Price">Ac Price</option>
              <option value="Normal Price ">Normal Price</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
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
              {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCouponModal;