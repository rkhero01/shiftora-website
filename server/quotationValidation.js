/**
 * Server-side validation and deterministic pricing calculations for TOTER Quotations.
 */

export const MOVING_TYPES = [
  'Household Shifting',
  'Office Relocation',
  'Commercial Relocation',
  'Vehicle Shifting',
  'Other',
];

export const CHARGE_KEYS = [
  'freight',
  'packingCharge',
  'unpackingCharge',
  'loadingCharge',
  'unloadingCharge',
  'packingMaterialCharge',
  'otherCharge',
];

export function roundCurrency(num) {
  const n = Number(num);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateServerPricing(pricing = {}, movingInfo = {}) {
  const normalizedCharges = {};
  let subTotal = 0;

  for (const key of CHARGE_KEYS) {
    const row = pricing[key] || {};
    const mode = row.mode === 'included' ? 'included' : 'amount';
    const rawAmount = Number(row.amount);
    const amount = mode === 'amount' && Number.isFinite(rawAmount) && rawAmount >= 0 ? roundCurrency(rawAmount) : 0;

    normalizedCharges[key] = { mode, amount };
    if (mode === 'amount') {
      subTotal = roundCurrency(subTotal + amount);
    }
  }

  const insuranceRow = pricing.insuranceCharge || {};
  const insuranceMode = ['optional', 'included', 'percentage', 'manual'].includes(insuranceRow.mode)
    ? insuranceRow.mode
    : 'optional';

  const declaredValue = roundCurrency(
    insuranceRow.declaredValue !== undefined ? insuranceRow.declaredValue : movingInfo.declaredValue || 0
  );
  const percentage = roundCurrency(
    insuranceRow.percentage !== undefined ? insuranceRow.percentage : movingInfo.insurancePercentage || 3
  );
  const manualAmount = roundCurrency(insuranceRow.amount || 0);

  let effectiveInsuranceAmount = 0;
  if (insuranceMode === 'percentage') {
    effectiveInsuranceAmount = roundCurrency((declaredValue * percentage) / 100);
  } else if (insuranceMode === 'manual') {
    effectiveInsuranceAmount = manualAmount;
  }

  const totalAmount = roundCurrency(subTotal + effectiveInsuranceAmount);

  const normalizedPricing = {
    ...normalizedCharges,
    insuranceCharge: {
      mode: insuranceMode,
      amount: effectiveInsuranceAmount,
      declaredValue,
      percentage,
    },
    reverseCharge: typeof pricing.reverseCharge === 'string' ? pricing.reverseCharge.trim() : '',
  };

  return {
    pricing: normalizedPricing,
    subTotal,
    insuranceAmount: effectiveInsuranceAmount,
    totalAmount,
  };
}

export function validateQuotationPayload(body) {
  const errors = {};
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { form: 'Invalid quotation payload.' } };
  }

  const customerName = String(body.customerName || '').trim();
  if (!customerName || customerName.length < 2) {
    errors.customerName = 'Customer Name is required (minimum 2 characters).';
  }

  const customerPhone = String(body.customerPhone || '').trim();
  const digitsOnly = customerPhone.replace(/\D/g, '');
  if (!customerPhone || digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.customerPhone = 'Valid 10-digit Phone Number is required.';
  }

  const customerEmail = String(body.customerEmail || '').trim();
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    errors.customerEmail = 'Please enter a valid email address.';
  }

  const movingType = String(body.movingType || 'Household Shifting').trim();
  const customMovingType = String(body.customMovingType || '').trim();
  if (movingType === 'Other' && !customMovingType) {
    errors.customMovingType = 'Please specify the custom moving type.';
  }

  const quotationDate = String(body.quotationDate || '').trim();
  if (!quotationDate) {
    errors.quotationDate = 'Quotation Date is required.';
  }

  const moveFrom = body.moveFrom && typeof body.moveFrom === 'object' ? body.moveFrom : {};
  const moveTo = body.moveTo && typeof body.moveTo === 'object' ? body.moveTo : {};

  const fromCity = String(moveFrom.city || '').trim();
  const toCity = String(moveTo.city || '').trim();
  if (!fromCity) {
    errors.moveFromCity = 'Pickup City (Move From) is required.';
  }
  if (!toCity) {
    errors.moveToCity = 'Delivery City (Move To) is required.';
  }

  const movingFromSummary = String(body.movingFromSummary || fromCity).trim();
  const movingToSummary = String(body.movingToSummary || toCity).trim();

  // Check for negative pricing numbers
  if (body.pricing && typeof body.pricing === 'object') {
    for (const key of CHARGE_KEYS) {
      const row = body.pricing[key];
      if (row && row.mode === 'amount' && Number(row.amount) < 0) {
        errors[key] = 'Charge amount cannot be negative.';
      }
    }
    if (body.pricing.insuranceCharge && Number(body.pricing.insuranceCharge.amount) < 0) {
      errors.insuranceCharge = 'Insurance charge cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const sanitizedMoveFrom = {
    city: fromCity,
    state: String(moveFrom.state || '').trim(),
    country: String(moveFrom.country || 'India').trim(),
    address: String(moveFrom.address || '').trim(),
    floor: String(moveFrom.floor || 'Ground Floor').trim(),
    liftAvailable: String(moveFrom.liftAvailable || 'Yes').trim(),
  };

  const sanitizedMoveTo = {
    city: toCity,
    state: String(moveTo.state || '').trim(),
    country: String(moveTo.country || 'India').trim(),
    address: String(moveTo.address || '').trim(),
    floor: String(moveTo.floor || 'Ground Floor').trim(),
    liftAvailable: String(moveTo.liftAvailable || 'Yes').trim(),
  };

  const rawMovingInfo = body.movingInfo && typeof body.movingInfo === 'object' ? body.movingInfo : {};
  const sanitizedMovingInfo = {
    easyAccess: String(rawMovingInfo.easyAccess || 'Yes').trim(),
    balconyItems: String(rawMovingInfo.balconyItems || 'N/A').trim(),
    restrictions: String(rawMovingInfo.restrictions || 'N/A').trim(),
    specialNeeds: String(rawMovingInfo.specialNeeds || 'N/A').trim(),
    insurancePercentage: roundCurrency(
      rawMovingInfo.insurancePercentage !== undefined ? rawMovingInfo.insurancePercentage : 3
    ),
    declaredValue: roundCurrency(rawMovingInfo.declaredValue || 0),
    remarks: String(rawMovingInfo.remarks || 'N/A').trim(),
  };

  const calc = calculateServerPricing(body.pricing || {}, sanitizedMovingInfo);

  const defaultIntro = `We thank you for your valuable enquiry regarding the packing and shifting of your moving items from ${movingFromSummary} to ${movingToSummary}. We are pleased to quote the rates for the same as follows:`;

  return {
    valid: true,
    data: {
      quotationNumber: body.quotationNumber ? String(body.quotationNumber).trim() : undefined,
      quotationDate,
      customerName,
      customerPhone,
      customerEmail,
      movingType,
      customMovingType,
      movingFromSummary,
      movingToSummary,
      introText: String(body.introText || defaultIntro).trim(),
      moveFrom: sanitizedMoveFrom,
      moveTo: sanitizedMoveTo,
      movingInfo: sanitizedMovingInfo,
      pricing: calc.pricing,
      subTotal: calc.subTotal,
      insuranceAmount: calc.insuranceAmount,
      totalAmount: calc.totalAmount,
      businessSnapshot: body.businessSnapshot || undefined,
      bankSnapshot: body.bankSnapshot || undefined,
      termsSnapshot: body.termsSnapshot || undefined,
    },
  };
}

export function validateBankSettings(body) {
  const errors = {};
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { form: 'Invalid bank details.' } };
  }

  const beneficiaryName = String(body.beneficiaryName || '').trim();
  const bankName = String(body.bankName || '').trim();
  const accountNumber = String(body.accountNumber || '').trim();
  const ifscCode = String(body.ifscCode || '').trim().toUpperCase();

  if (!beneficiaryName) errors.beneficiaryName = 'Beneficiary Name is required.';
  if (!bankName) errors.bankName = 'Bank Name is required.';
  if (!accountNumber || !/^\d{6,24}$/.test(accountNumber)) {
    errors.accountNumber = 'Valid numeric Bank Account Number is required.';
  }
  if (!ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
    errors.ifscCode = 'Valid 11-character IFSC Code is required (e.g. PUNB0211600).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      beneficiaryName,
      bankName,
      accountNumber,
      ifscCode,
    },
  };
}

export function validateBusinessSettings(body) {
  const errors = {};
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { form: 'Invalid business settings.' } };
  }

  const brandName = String(body.brandName || 'TOTER').trim();
  const legalName = String(body.legalName || 'TOTER PACKERS & MOVERS').trim();
  const shopNumber = String(body.shopNumber || '').trim();
  const fullAddress = String(body.fullAddress || '').trim();
  const gstNumber = String(body.gstNumber || '').trim().toUpperCase();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  const website = String(body.website || '').trim();
  const paymentPhonePe = String(body.paymentPhonePe || phone).trim();
  const paymentGooglePay = String(body.paymentGooglePay || phone).trim();
  const logoUrl = String(body.logoUrl || '/images/dynamic-t-logistics-logo.png').trim();
  const signatureImageUrl = String(body.signatureImageUrl || '');

  if (!brandName) errors.brandName = 'Brand Name is required.';
  if (!phone) errors.phone = 'Phone Number is required.';
  if (!email) errors.email = 'Email is required.';
  if (!website) errors.website = 'Website is required.';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      brandName,
      legalName,
      shopNumber,
      fullAddress,
      gstNumber,
      phone,
      email,
      website,
      paymentPhonePe,
      paymentGooglePay,
      logoUrl,
      signatureImageUrl,
    },
  };
}

export function validateTermsSettings(body) {
  if (!body || !Array.isArray(body.termsConditions)) {
    return { valid: false, errors: { terms: 'Terms & Conditions list must be an array.' } };
  }

  const sanitized = body.termsConditions
    .map((item, idx) => ({
      id: String(item.id || `term-${Date.now()}-${idx}`),
      order: idx + 1,
      text: String(item.text || '').trim(),
      flaggedForReview: Boolean(item.flaggedForReview),
      reviewNote: item.reviewNote ? String(item.reviewNote) : undefined,
    }))
    .filter((item) => item.text.length > 0);

  if (sanitized.length === 0) {
    return { valid: false, errors: { terms: 'At least one Terms & Conditions item is required.' } };
  }

  return {
    valid: true,
    data: sanitized,
  };
}

