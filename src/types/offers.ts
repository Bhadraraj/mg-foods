export interface Offer {
  slNo: string;
  name: string;
  offerEffectiveFrom: string;
  offerEffectiveUpto: string;
  discountType: string;
  discount: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  status: "Running" | "Expired";
}

export interface Coupon {
  slNo: string;
  couponCode: string;
  couponValue: string;
  description: string;
  couponType: string;
  status: boolean;
  validFrom: string;
  validTo: string;
}

export interface AddOfferFormData {
  offerName: string;
  product: string;
  offerType: "Discount" | "Free";
  discountType: string;
  discount: number;
  effectiveFrom: string;
  effectiveUpto: string;
}

export interface AddCouponFormData {
  couponType: string;
  couponName: string;
  qrCode?: File;
  status: boolean;
  couponCode: string;
  couponValue: string;
  billType: string;
  couponValidityFrom: string;
  couponValidityTo: string;
  type: string;
  description: string;
}