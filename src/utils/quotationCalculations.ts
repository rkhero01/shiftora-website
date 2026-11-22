import type {
  BankDetailsSettings,
  BusinessInfoSettings,
  ChargeRow,
  MovingInfoDetails,
  QuotationFormData,
  QuotationPricing,
  TermsConditionItem,
} from '../types/quotation';

export const MOVING_TYPE_OPTIONS = [
  'Household Shifting',
  'Office Relocation',
  'Commercial Relocation',
  'Vehicle Shifting',
  'Other',
] as const;

export const DEFAULT_BANK_DETAILS: BankDetailsSettings = {
  beneficiaryName: 'TOTER',
  bankName: 'Punjab National Bank',
  accountNumber: '2116001700120478',
  ifscCode: 'PUNB0211600',
};

export const CONFIRMED_TOTER_ADDRESS =
  'Shop No. 27, Rishid Residency, Near Pooja Farm, Lamba Turning, Narolgam, Ahmedabad, Gujarat – 382405, India.';

export const DEFAULT_BUSINESS_INFO: BusinessInfoSettings = {
  brandName: 'TOTER',
  legalName: 'TOTER PACKERS & MOVERS',
  shopNumber: 'Shop No. 27',
  fullAddress: CONFIRMED_TOTER_ADDRESS,
  gstNumber: '',
  phone: '7575096349',
  email: 'contact.toter@gmail.com',
  website: 'https://toter.in',
  paymentPhonePe: '7575096349',
  paymentGooglePay: '7575096349',
  logoUrl: '/images/dynamic-t-logistics-logo.png',
  signatureImageUrl: '',
};

/**
 * Formats the business address for the quotation header without duplicating Shop No. 27
 * when fullAddress already starts with the shop number.
 */
export function formatBusinessHeaderAddress(businessInfo: BusinessInfoSettings): string {
  const full = (businessInfo.fullAddress || '').trim();
  const shop = (businessInfo.shopNumber || '').trim();
  if (!full) {
    return shop || CONFIRMED_TOTER_ADDRESS;
  }
  if (!shop || full.toLowerCase().startsWith(shop.toLowerCase()) || full.toLowerCase().startsWith('shop no')) {
    return full;
  }
  return `${shop}, ${full}`;
}

export const DEFAULT_TERMS_ITEMS: TermsConditionItem[] = [
  {
    id: 'term-1',
    order: 1,
    text: 'We do not undertake Electrical, Carpentry & Plumber Job.',
  },
  {
    id: 'term-2',
    order: 2,
    text: 'The Vehicle transportation charges as given above as based on the present prevailing market rate.',
  },
  {
    id: 'term-3',
    order: 3,
    text: 'We or our agent shall be exempted from any kind of loss or damage done due to accident, pilferage, fire, rain collision or any other road/ rive.',
  },
  {
    id: 'term-4',
    order: 4,
    text: 'Hazard Or any natural claim. Soto avoid loss or damage we advise you to insure your consignment covering all risk Please be noted while carrier Risk. On individual policy / receipt, from the insurance Company will be given.',
  },
  {
    id: 'term-5',
    order: 5,
    text: "We request you to us 80 % as advance on total amount along with your purchase order and the balance amount, on Completion of you're at loading point. The insurance premium will be paid in loading point only, before departure of your household consignment. The above rates quoted by keeping in view of our basis standard packing materials used in packing of your valued house hold articles.",
  },
  {
    id: 'term-6',
    order: 6,
    text: 'If required we also provide storage facility to our customer at very nominal charge.',
  },
  {
    id: 'term-7',
    order: 7,
    text: 'We would be thankful, if you could give us prior intimation of 4-5 days in advance to start the packing of your valued articles. Car should have at least 10 Litters of Petrol.',
  },
  {
    id: 'term-8',
    order: 8,
    text: 'Extra payment will be charged for Wooden Packing on Moving Date.',
  },
  {
    id: 'term-9',
    order: 9,
    text: 'We are not responsible for Gold & Cash. Please keep in your custody lock.',
  },
  {
    id: 'term-10',
    order: 10,
    text: 'Interest will be charged @24% if payment is not made within 15 days.',
    flaggedForReview: true,
    reviewNote: 'Original PDF had a whiteout gap between "@24%" and "ot made within 15 days."',
  },
  {
    id: 'term-11',
    order: 11,
    text: 'Payment will be in the favour of TOTER by Cash/Cheque.',
  },
  {
    id: 'term-12',
    order: 12,
    text: 'Thanking you and awaiting for your valuable order to serve you.',
    flaggedForReview: true,
    reviewNote: 'Original PDF had a whiteout gap between "awaiting for y" and "e you."',
  },
];

export const PRICING_ROW_DEFINITIONS: Array<{
  key: keyof Omit<QuotationPricing, 'insuranceCharge' | 'reverseCharge'>;
  label: string;
  pdfLabel: string;
  compactZeroInPdf?: boolean;
}> = [
  { key: 'freight', label: 'Freight Charges', pdfLabel: 'Freight' },
  { key: 'packingCharge', label: 'Packing Charges', pdfLabel: 'Packing Charge' },
  { key: 'unpackingCharge', label: 'Unpacking Charges', pdfLabel: 'Un Packing Charge' },
  { key: 'loadingCharge', label: 'Loading Charges', pdfLabel: 'Loading Charge' },
  { key: 'unloadingCharge', label: 'Unloading Charges', pdfLabel: 'Un Loading Charge' },
  { key: 'packingMaterialCharge', label: 'Packing Material Charges', pdfLabel: 'Pack. Material Charge' },
  { key: 'otherCharge', label: 'Other Charges', pdfLabel: 'Other Charge', compactZeroInPdf: true },
];

export function roundRupees(val: number | string): number {
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Formats an amount in standard Indian Rupee display format: ₹59,580.00
 */
export function formatIndianCurrency(amount: number): string {
  const safe = roundRupees(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

/**
 * Formats an amount for the original PDF "Amount (Rs.)" column (e.g., "59580.00" or "0" for zero Other Charge)
 */
export function formatPdfTableAmount(amount: number, compactZero = false): string {
  const safe = roundRupees(amount);
  if (compactZero && safe === 0) {
    return '0';
  }
  return safe.toFixed(2);
}

export function formatChargeCellForPdf(row: ChargeRow, compactZero = false): string {
  if (row.mode === 'included') {
    return 'Included';
  }
  return formatPdfTableAmount(row.amount, compactZero);
}

export function calculateQuotationTotals(
  pricing: QuotationPricing,
  movingInfo?: MovingInfoDetails
): {
  subTotal: number;
  insuranceAmount: number;
  totalAmount: number;
  insuranceDisplayForPdf: string;
} {
  let subTotal = 0;

  for (const def of PRICING_ROW_DEFINITIONS) {
    const row = pricing[def.key];
    if (row && row.mode === 'amount') {
      subTotal = roundRupees(subTotal + roundRupees(row.amount));
    }
  }

  const ins = pricing.insuranceCharge;
  const declaredVal = roundRupees(
    ins.declaredValue !== undefined ? ins.declaredValue : movingInfo?.declaredValue ?? 0
  );
  const pct = roundRupees(
    ins.percentage !== undefined ? ins.percentage : movingInfo?.insurancePercentage ?? 3
  );

  let insuranceAmount = 0;
  let insuranceDisplayForPdf = 'Optional';

  if (ins.mode === 'optional') {
    insuranceAmount = 0;
    insuranceDisplayForPdf = 'Optional';
  } else if (ins.mode === 'included') {
    insuranceAmount = 0;
    insuranceDisplayForPdf = 'Included';
  } else if (ins.mode === 'percentage') {
    insuranceAmount = roundRupees((declaredVal * pct) / 100);
    insuranceDisplayForPdf = formatPdfTableAmount(insuranceAmount);
  } else if (ins.mode === 'manual') {
    insuranceAmount = roundRupees(ins.amount);
    insuranceDisplayForPdf = formatPdfTableAmount(insuranceAmount);
  }

  const totalAmount = roundRupees(subTotal + insuranceAmount);

  return {
    subTotal,
    insuranceAmount,
    totalAmount,
    insuranceDisplayForPdf,
  };
}

/**
 * Formats YYYY-MM-DD into DD-MM-YYYY to match original PDF "Quotation Date 22-11-2026"
 */
export function formatDateForPdf(dateStr: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return dateStr;
}

export function createEmptyQuotationForm(nextQuotationNumber = `${new Date().getFullYear()}/001`): QuotationFormData {
  const todayIso = new Date().toISOString().slice(0, 10);

  return {
    quotationNumber: nextQuotationNumber,
    quotationDate: todayIso,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    movingType: 'Household Shifting',
    customMovingType: '',
    movingFromSummary: '',
    movingToSummary: '',
    introText:
      'We thank you for your valuable enquiry regarding the packing and shifting of your moving items from [Moving From] to [Moving To]. We are pleased to quote the rates for the same as follows:',
    moveFrom: {
      city: '',
      state: '',
      country: 'India',
      address: '',
      floor: 'Ground Floor',
      liftAvailable: 'Yes',
    },
    moveTo: {
      city: '',
      state: '',
      country: 'India',
      address: '',
      floor: 'Ground Floor',
      liftAvailable: 'Yes',
    },
    movingInfo: {
      easyAccess: 'Yes',
      balconyItems: 'N/A',
      restrictions: 'N/A',
      specialNeeds: 'N/A',
      insurancePercentage: 3,
      declaredValue: 0,
      remarks: 'N/A',
    },
    pricing: {
      freight: { mode: 'amount', amount: 0 },
      packingCharge: { mode: 'included', amount: 0 },
      unpackingCharge: { mode: 'included', amount: 0 },
      loadingCharge: { mode: 'included', amount: 0 },
      unloadingCharge: { mode: 'included', amount: 0 },
      packingMaterialCharge: { mode: 'included', amount: 0 },
      otherCharge: { mode: 'amount', amount: 0 },
      insuranceCharge: {
        mode: 'optional',
        amount: 0,
        declaredValue: 0,
        percentage: 3,
      },
      reverseCharge: '',
    },
  };
}

export function validateQuotationFormClient(form: QuotationFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.customerName.trim() || form.customerName.trim().length < 2) {
    errors.customerName = 'Customer Name is required (at least 2 characters).';
  }

  const digits = form.customerPhone.replace(/\D/g, '');
  if (!form.customerPhone.trim() || digits.length < 10 || digits.length > 15) {
    errors.customerPhone = 'Enter a valid 10-digit Phone Number.';
  }

  if (form.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
    errors.customerEmail = 'Enter a valid Email Address.';
  }

  if (form.movingType === 'Other' && !form.customMovingType.trim()) {
    errors.customMovingType = 'Please specify the custom moving type.';
  }

  if (!form.quotationDate.trim()) {
    errors.quotationDate = 'Quotation Date is required.';
  }

  if (!form.moveFrom.city.trim()) {
    errors.moveFromCity = 'Pickup City (Move From) is required.';
  }

  if (!form.moveTo.city.trim()) {
    errors.moveToCity = 'Delivery City (Move To) is required.';
  }

  for (const def of PRICING_ROW_DEFINITIONS) {
    const row = form.pricing[def.key];
    if (row.mode === 'amount' && (Number.isNaN(Number(row.amount)) || Number(row.amount) < 0)) {
      errors[def.key] = `${def.label} must be a non-negative amount.`;
    }
  }

  if (form.pricing.insuranceCharge.mode === 'manual' && Number(form.pricing.insuranceCharge.amount) < 0) {
    errors.insuranceCharge = 'Insurance charge cannot be negative.';
  }

  return errors;
}

