import crypto from 'node:crypto';

// Explicit allowlist of verified Shiftora relocation services
export const ALLOWED_SERVICE_TYPES = [
  'household-shifting',
  'office-relocation',
  'domestic-moving',
  'car-bike-transportation',
  'packing-unpacking',
  'storage-solutions',
];

/**
 * Normalizes an Indian mobile phone number.
 * Accepts formats: "+91 98765 43210", "9876543210", "09876543210", "+919876543210".
 * Returns normalized 10-digit number or null if invalid.
 */
export function normalizeAndValidatePhone(phone) {
  if (typeof phone !== 'string') return null;

  // Strip all spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check against Indian mobile pattern: optional +91, 91, or 0 followed by 10 digits starting with 6-9
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  if (!match) {
    return null;
  }

  // Return formatted normalized telephone (+91XXXXXXXXXX)
  return `+91${match[1]}`;
}

/**
 * Validates a tentative moving date string (YYYY-MM-DD).
 * Date must be valid, not in the past, and within 365 days.
 */
export function validateMoveDate(dateStr) {
  if (!dateStr) return { valid: true, sanitized: null };

  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false, error: 'Move date must be in YYYY-MM-DD format.' };
  }

  const parsed = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(parsed.getTime())) {
    return { valid: false, error: 'Invalid calendar date provided.' };
  }

  // Check date range
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const maxFuture = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);

  if (parsed < today) {
    return { valid: false, error: 'Move date cannot be in the past.' };
  }

  if (parsed > maxFuture) {
    return { valid: false, error: 'Move date must be within 12 months.' };
  }

  return { valid: true, sanitized: dateStr };
}

/**
 * Generates an unpredictable public reference code (e.g. SHF-2610-7B4F).
 * Never exposes auto-increment database IDs.
 */
export function generateReferenceCode() {
  const now = new Date();
  const yearSuffix = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `SHF-${yearSuffix}${month}-${randomHex}`;
}

/**
 * Comprehensive input validator for moving enquiries.
 */
export function validateEnquiryInput(body) {
  const errors = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { form: 'Invalid request payload.' } };
  }

  // 1. Honeypot check (anti-spam)
  if (body.website_url && String(body.website_url).trim().length > 0) {
    return { valid: false, isBot: true, errors: { bot: 'Spam submission detected.' } };
  }

  // 2. Customer Name (Required, 2-80 characters, safe alphabetic characters)
  const rawName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  if (!rawName) {
    errors.customerName = 'Please provide your name.';
  } else if (rawName.length < 2 || rawName.length > 80) {
    errors.customerName = 'Name must be between 2 and 80 characters.';
  } else if (!/^[a-zA-Z\s\.\-']{2,80}$/.test(rawName)) {
    errors.customerName = 'Name contains invalid characters.';
  }

  // 3. Contact Mobile Number (Required, Indian mobile format)
  const normalizedPhone = normalizeAndValidatePhone(body.phone);
  if (!normalizedPhone) {
    errors.phone = 'Please provide a valid 10-digit mobile number.';
  }

  // 4. Origin City / Area (Required, 2-100 characters)
  const rawOrigin = typeof body.originCity === 'string' ? body.originCity.trim() : '';
  if (!rawOrigin) {
    errors.originCity = 'Please specify moving origin location.';
  } else if (rawOrigin.length < 2 || rawOrigin.length > 100) {
    errors.originCity = 'Origin location must be between 2 and 100 characters.';
  }

  // 5. Destination City / Area (Required, 2-100 characters)
  const rawDest = typeof body.destinationCity === 'string' ? body.destinationCity.trim() : '';
  if (!rawDest) {
    errors.destinationCity = 'Please specify moving destination location.';
  } else if (rawDest.length < 2 || rawDest.length > 100) {
    errors.destinationCity = 'Destination location must be between 2 and 100 characters.';
  }

  // 6. Service Type (Required, must be in allowlist)
  const rawService = typeof body.serviceType === 'string' ? body.serviceType.trim() : '';
  if (!rawService) {
    errors.serviceType = 'Please select a service category.';
  } else if (!ALLOWED_SERVICE_TYPES.includes(rawService)) {
    errors.serviceType = 'Invalid service category selected.';
  }

  // 7. Move Date (Optional, validated format)
  const dateCheck = validateMoveDate(body.moveDate);
  if (!dateCheck.valid) {
    errors.moveDate = dateCheck.error;
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      customerName: rawName,
      phone: normalizedPhone,
      originCity: rawOrigin,
      destinationCity: rawDest,
      serviceType: rawService,
      moveDate: dateCheck.sanitized,
    },
  };
}
