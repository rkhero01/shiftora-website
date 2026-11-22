export type ChargeMode = 'amount' | 'included';
export type InsuranceMode = 'optional' | 'included' | 'percentage' | 'manual';

export interface ChargeRow {
  mode: ChargeMode;
  amount: number;
}

export interface InsuranceChargeRow {
  mode: InsuranceMode;
  amount: number;
  declaredValue: number;
  percentage: number;
}

export interface QuotationPricing {
  freight: ChargeRow;
  packingCharge: ChargeRow;
  unpackingCharge: ChargeRow;
  loadingCharge: ChargeRow;
  unloadingCharge: ChargeRow;
  packingMaterialCharge: ChargeRow;
  otherCharge: ChargeRow;
  insuranceCharge: InsuranceChargeRow;
  reverseCharge: string;
}

export interface MoveLocationDetails {
  city: string;
  state: string;
  country: string;
  address: string;
  floor: string;
  liftAvailable: 'Yes' | 'No';
}

export interface MovingInfoDetails {
  easyAccess: string;
  balconyItems: string;
  restrictions: string;
  specialNeeds: string;
  insurancePercentage: number;
  declaredValue: number;
  remarks: string;
}

export interface BankDetailsSettings {
  beneficiaryName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface BusinessInfoSettings {
  brandName: string;
  legalName: string;
  shopNumber: string;
  fullAddress: string;
  gstNumber: string;
  phone: string;
  email: string;
  website: string;
  paymentPhonePe: string;
  paymentGooglePay: string;
  logoUrl: string;
  signatureImageUrl: string;
}

export interface TermsConditionItem {
  id: string;
  order: number;
  text: string;
  flaggedForReview?: boolean;
  reviewNote?: string;
}

export interface AllQuotationSettings {
  bankDetails: BankDetailsSettings;
  businessInfo: BusinessInfoSettings;
  termsConditions: TermsConditionItem[];
}

export interface QuotationFormData {
  quotationNumber: string;
  quotationDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  movingType: string;
  customMovingType: string;
  movingFromSummary: string;
  movingToSummary: string;
  introText: string;
  moveFrom: MoveLocationDetails;
  moveTo: MoveLocationDetails;
  movingInfo: MovingInfoDetails;
  pricing: QuotationPricing;
  businessSnapshot?: BusinessInfoSettings;
  bankSnapshot?: BankDetailsSettings;
  termsSnapshot?: TermsConditionItem[];
}

export interface QuotationRecord extends QuotationFormData {
  id: number;
  subTotal: number;
  insuranceAmount: number;
  totalAmount: number;
  businessSnapshot: BusinessInfoSettings;
  bankSnapshot: BankDetailsSettings;
  termsSnapshot: TermsConditionItem[];
  createdAt: string;
  updatedAt: string;
}

