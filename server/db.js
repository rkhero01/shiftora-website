import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store database outside public web root
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'toter.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for concurrent performance and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// 1. Existing Enquiries Table (untouched)
db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    service_type TEXT NOT NULL,
    move_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'quoted', 'scheduled', 'completed', 'cancelled'))
  );

  CREATE INDEX IF NOT EXISTS idx_enquiries_reference ON enquiries(reference_code);
  CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
`);

// 2. Quotation Generator Tables (Settings, Counters, Quotations, Admin Auth)
db.exec(`
  CREATE TABLE IF NOT EXISTS quotation_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quotation_counters (
    year INTEGER PRIMARY KEY,
    last_seq INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_number TEXT NOT NULL UNIQUE,
    quotation_date TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL DEFAULT '',
    moving_type TEXT NOT NULL,
    custom_moving_type TEXT NOT NULL DEFAULT '',
    moving_from_summary TEXT NOT NULL,
    moving_to_summary TEXT NOT NULL,
    intro_text TEXT NOT NULL,
    move_from_json TEXT NOT NULL,
    move_to_json TEXT NOT NULL,
    moving_info_json TEXT NOT NULL,
    pricing_json TEXT NOT NULL,
    sub_total REAL NOT NULL DEFAULT 0,
    insurance_amount REAL NOT NULL DEFAULT 0,
    total_amount REAL NOT NULL DEFAULT 0,
    business_snapshot_json TEXT NOT NULL,
    bank_snapshot_json TEXT NOT NULL,
    terms_snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quotation_number);
  CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customer_name);
  CREATE INDEX IF NOT EXISTS idx_quotations_date ON quotations(quotation_date);
  CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(created_at);

  CREATE TABLE IF NOT EXISTS admin_credentials (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Default Confirmed Settings (from Master Prompt & Original PDF)
export const DEFAULT_BANK_SETTINGS = {
  beneficiaryName: 'TOTER',
  bankName: 'Punjab National Bank',
  accountNumber: '2116001700120478',
  ifscCode: 'PUNB0211600',
};

export const DEFAULT_BUSINESS_SETTINGS = {
  brandName: 'TOTER',
  legalName: 'TOTER PACKERS & MOVERS',
  shopNumber: 'Shop No 27',
  fullAddress: '',
  gstNumber: '',
  phone: '7575096349',
  email: 'contact.toter@gmail.com',
  website: 'https://toter.in',
  paymentPhonePe: '7575096349',
  paymentGooglePay: '7575096349',
  logoUrl: '/images/dynamic-t-logistics-logo.png',
  signatureImageUrl: '',
};

export const DEFAULT_TERMS_CONDITIONS = [
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

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

// Seed default settings and admin credentials if not already present
const getSettingStmt = db.prepare('SELECT value_json FROM quotation_settings WHERE key = ?');
const upsertSettingStmt = db.prepare(`
  INSERT INTO quotation_settings (key, value_json, updated_at)
  VALUES (?, ?, datetime('now'))
  ON CONFLICT(key) DO UPDATE SET
    value_json = excluded.value_json,
    updated_at = datetime('now')
`);

function ensureDefaultSettings() {
  if (!getSettingStmt.get('bank_details')) {
    upsertSettingStmt.run('bank_details', JSON.stringify(DEFAULT_BANK_SETTINGS));
  }
  if (!getSettingStmt.get('business_info')) {
    upsertSettingStmt.run('business_info', JSON.stringify(DEFAULT_BUSINESS_SETTINGS));
  }
  if (!getSettingStmt.get('terms_conditions')) {
    upsertSettingStmt.run('terms_conditions', JSON.stringify(DEFAULT_TERMS_CONDITIONS));
  }

  const adminRow = db.prepare('SELECT username FROM admin_credentials WHERE username = ?').get('admin');
  if (!adminRow) {
    const defaultPassword = process.env.TOTER_ADMIN_PASSWORD || 'Toter@272026';
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(defaultPassword, salt);
    db.prepare(`
      INSERT INTO admin_credentials (username, password_hash, salt, updated_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run('admin', passwordHash, salt);
  }
}

ensureDefaultSettings();

// ── Enquiries Functions ──────────────────────────────────────────────
const insertStmt = db.prepare(`
  INSERT INTO enquiries (
    reference_code,
    customer_name,
    phone,
    origin_city,
    destination_city,
    service_type,
    move_date,
    status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const selectByRefStmt = db.prepare(`
  SELECT id, reference_code, customer_name, origin_city, destination_city, service_type, move_date, created_at, status
  FROM enquiries
  WHERE reference_code = ?
`);

export function insertEnquiry({
  referenceCode,
  customerName,
  phone,
  originCity,
  destinationCity,
  serviceType,
  moveDate,
  status = 'new',
}) {
  insertStmt.run(
    referenceCode,
    customerName,
    phone,
    originCity,
    destinationCity,
    serviceType,
    moveDate || null,
    status
  );

  return selectByRefStmt.get(referenceCode);
}

export function getEnquiryByRef(referenceCode) {
  return selectByRefStmt.get(referenceCode);
}

// ── Admin Authentication Functions ───────────────────────────────────
export function verifyAdminLogin(username, password) {
  const cleanUser = String(username || '').trim().toLowerCase();
  const row = db
    .prepare('SELECT username, password_hash, salt FROM admin_credentials WHERE username = ?')
    .get(cleanUser);
  if (!row) return null;

  const computed = hashPassword(String(password || ''), row.salt);
  const a = Buffer.from(computed, 'hex');
  const b = Buffer.from(row.password_hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  // Generate session token valid for 24 hours
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Clean up expired sessions
  db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?').run(new Date().toISOString());

  db.prepare(`
    INSERT INTO admin_sessions (token_hash, username, expires_at, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(tokenHash, row.username, expiresAt);

  return {
    token: rawToken,
    username: row.username,
    expiresAt,
  };
}

export function verifyAdminToken(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const tokenHash = hashToken(rawToken);
  const session = db
    .prepare('SELECT username, expires_at FROM admin_sessions WHERE token_hash = ?')
    .get(tokenHash);
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash);
    return null;
  }
  return session;
}

export function revokeAdminToken(rawToken) {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash);
}

export function updateAdminPassword(username, currentPassword, newPassword) {
  const verified = verifyAdminLogin(username, currentPassword);
  if (!verified) {
    return { success: false, message: 'Current password is incorrect.' };
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);
  db.prepare(`
    UPDATE admin_credentials
    SET password_hash = ?, salt = ?, updated_at = datetime('now')
    WHERE username = ?
  `).run(passwordHash, salt, username);
  return { success: true };
}

// ── Quotation Settings Functions ─────────────────────────────────────
export function getQuotationSettings() {
  const bankRow = getSettingStmt.get('bank_details');
  const businessRow = getSettingStmt.get('business_info');
  const termsRow = getSettingStmt.get('terms_conditions');

  return {
    bankDetails: bankRow ? JSON.parse(bankRow.value_json) : DEFAULT_BANK_SETTINGS,
    businessInfo: businessRow ? JSON.parse(businessRow.value_json) : DEFAULT_BUSINESS_SETTINGS,
    termsConditions: termsRow ? JSON.parse(termsRow.value_json) : DEFAULT_TERMS_CONDITIONS,
  };
}

export function saveQuotationSetting(key, valueObj) {
  upsertSettingStmt.run(key, JSON.stringify(valueObj));
  return getQuotationSettings();
}

// ── Atomic Sequential Quotation Numbering ────────────────────────────
function getHighestExistingSequenceForYear(year) {
  const prefix = `${year}/`;
  const rows = db
    .prepare('SELECT quotation_number FROM quotations WHERE quotation_number LIKE ?')
    .all(`${prefix}%`);
  let maxSeq = 0;
  for (const r of rows) {
    const parts = String(r.quotation_number).split('/');
    if (parts.length === 2) {
      const n = parseInt(parts[1], 10);
      if (!Number.isNaN(n) && n > maxSeq) {
        maxSeq = n;
      }
    }
  }
  return maxSeq;
}

export function peekNextQuotationNumber(year = new Date().getFullYear()) {
  const counterRow = db
    .prepare('SELECT last_seq FROM quotation_counters WHERE year = ?')
    .get(year);
  const counterSeq = counterRow ? counterRow.last_seq : 0;
  const maxExisting = getHighestExistingSequenceForYear(year);
  const nextSeq = Math.max(counterSeq, maxExisting) + 1;
  return `${year}/${String(nextSeq).padStart(3, '0')}`;
}

export function allocateNextQuotationNumber(year = new Date().getFullYear()) {
  db.exec('BEGIN IMMEDIATE TRANSACTION;');
  try {
    const counterRow = db
      .prepare('SELECT last_seq FROM quotation_counters WHERE year = ?')
      .get(year);
    const counterSeq = counterRow ? counterRow.last_seq : 0;
    const maxExisting = getHighestExistingSequenceForYear(year);
    const nextSeq = Math.max(counterSeq, maxExisting) + 1;

    db.prepare(`
      INSERT INTO quotation_counters (year, last_seq, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(year) DO UPDATE SET
        last_seq = excluded.last_seq,
        updated_at = datetime('now')
    `).run(year, nextSeq);

    db.exec('COMMIT;');
    return `${year}/${String(nextSeq).padStart(3, '0')}`;
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

// ── Quotation CRUD Functions ─────────────────────────────────────────
function mapQuotationRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    quotationNumber: row.quotation_number,
    quotationDate: row.quotation_date,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    movingType: row.moving_type,
    customMovingType: row.custom_moving_type,
    movingFromSummary: row.moving_from_summary,
    movingToSummary: row.moving_to_summary,
    introText: row.intro_text,
    moveFrom: JSON.parse(row.move_from_json),
    moveTo: JSON.parse(row.move_to_json),
    movingInfo: JSON.parse(row.moving_info_json),
    pricing: JSON.parse(row.pricing_json),
    subTotal: row.sub_total,
    insuranceAmount: row.insurance_amount,
    totalAmount: row.total_amount,
    businessSnapshot: JSON.parse(row.business_snapshot_json),
    bankSnapshot: JSON.parse(row.bank_snapshot_json),
    termsSnapshot: JSON.parse(row.terms_snapshot_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listQuotations({ search = '', movingType = '', dateFrom = '', dateTo = '' } = {}) {
  let sql = 'SELECT * FROM quotations WHERE 1=1';
  const params = [];

  if (search && String(search).trim()) {
    const q = `%${String(search).trim()}%`;
    sql += ' AND (customer_name LIKE ? OR quotation_number LIKE ? OR customer_phone LIKE ? OR moving_from_summary LIKE ? OR moving_to_summary LIKE ?)';
    params.push(q, q, q, q, q);
  }

  if (movingType && String(movingType).trim()) {
    sql += ' AND moving_type = ?';
    params.push(String(movingType).trim());
  }

  if (dateFrom && String(dateFrom).trim()) {
    sql += ' AND quotation_date >= ?';
    params.push(String(dateFrom).trim());
  }

  if (dateTo && String(dateTo).trim()) {
    sql += ' AND quotation_date <= ?';
    params.push(String(dateTo).trim());
  }

  sql += ' ORDER BY id DESC';
  const rows = db.prepare(sql).all(...params);
  return rows.map(mapQuotationRow);
}

export function getQuotationById(id) {
  const row = db.prepare('SELECT * FROM quotations WHERE id = ?').get(Number(id));
  return mapQuotationRow(row);
}

export function getQuotationByNumber(quotationNumber) {
  const row = db
    .prepare('SELECT * FROM quotations WHERE quotation_number = ?')
    .get(String(quotationNumber));
  return mapQuotationRow(row);
}

export function createQuotationRecord(payload) {
  const year = new Date().getFullYear();
  let quotationNumber = payload.quotationNumber;

  // Ensure uniqueness; allocate a fresh sequential number if missing or already taken
  if (!quotationNumber || getQuotationByNumber(quotationNumber)) {
    quotationNumber = allocateNextQuotationNumber(year);
  } else {
    // Sync counter if a higher sequence number was used
    const parts = String(quotationNumber).split('/');
    const parsedYear = parseInt(parts[0], 10);
    const parsedSeq = parseInt(parts[1], 10);
    if (!Number.isNaN(parsedYear) && !Number.isNaN(parsedSeq)) {
      const counterRow = db
        .prepare('SELECT last_seq FROM quotation_counters WHERE year = ?')
        .get(parsedYear);
      const currentMax = counterRow ? counterRow.last_seq : 0;
      if (parsedSeq > currentMax) {
        db.prepare(`
          INSERT INTO quotation_counters (year, last_seq, updated_at)
          VALUES (?, ?, datetime('now'))
          ON CONFLICT(year) DO UPDATE SET
            last_seq = excluded.last_seq,
            updated_at = datetime('now')
        `).run(parsedYear, parsedSeq);
      }
    }
  }

  const settings = getQuotationSettings();
  const businessSnapshot = payload.businessSnapshot || settings.businessInfo;
  const bankSnapshot = payload.bankSnapshot || settings.bankDetails;
  const termsSnapshot = payload.termsSnapshot || settings.termsConditions;

  const stmt = db.prepare(`
    INSERT INTO quotations (
      quotation_number,
      quotation_date,
      customer_name,
      customer_phone,
      customer_email,
      moving_type,
      custom_moving_type,
      moving_from_summary,
      moving_to_summary,
      intro_text,
      move_from_json,
      move_to_json,
      moving_info_json,
      pricing_json,
      sub_total,
      insurance_amount,
      total_amount,
      business_snapshot_json,
      bank_snapshot_json,
      terms_snapshot_json,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const result = stmt.run(
    quotationNumber,
    payload.quotationDate,
    payload.customerName,
    payload.customerPhone,
    payload.customerEmail || '',
    payload.movingType,
    payload.customMovingType || '',
    payload.movingFromSummary,
    payload.movingToSummary,
    payload.introText,
    JSON.stringify(payload.moveFrom),
    JSON.stringify(payload.moveTo),
    JSON.stringify(payload.movingInfo),
    JSON.stringify(payload.pricing),
    Number(payload.subTotal) || 0,
    Number(payload.insuranceAmount) || 0,
    Number(payload.totalAmount) || 0,
    JSON.stringify(businessSnapshot),
    JSON.stringify(bankSnapshot),
    JSON.stringify(termsSnapshot)
  );

  return getQuotationById(result.lastInsertRowid);
}

export function updateQuotationRecord(id, payload) {
  const existing = getQuotationById(id);
  if (!existing) return null;

  const businessSnapshot = payload.businessSnapshot || existing.businessSnapshot;
  const bankSnapshot = payload.bankSnapshot || existing.bankSnapshot;
  const termsSnapshot = payload.termsSnapshot || existing.termsSnapshot;

  db.prepare(`
    UPDATE quotations SET
      quotation_date = ?,
      customer_name = ?,
      customer_phone = ?,
      customer_email = ?,
      moving_type = ?,
      custom_moving_type = ?,
      moving_from_summary = ?,
      moving_to_summary = ?,
      intro_text = ?,
      move_from_json = ?,
      move_to_json = ?,
      moving_info_json = ?,
      pricing_json = ?,
      sub_total = ?,
      insurance_amount = ?,
      total_amount = ?,
      business_snapshot_json = ?,
      bank_snapshot_json = ?,
      terms_snapshot_json = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    payload.quotationDate,
    payload.customerName,
    payload.customerPhone,
    payload.customerEmail || '',
    payload.movingType,
    payload.customMovingType || '',
    payload.movingFromSummary,
    payload.movingToSummary,
    payload.introText,
    JSON.stringify(payload.moveFrom),
    JSON.stringify(payload.moveTo),
    JSON.stringify(payload.movingInfo),
    JSON.stringify(payload.pricing),
    Number(payload.subTotal) || 0,
    Number(payload.insuranceAmount) || 0,
    Number(payload.totalAmount) || 0,
    JSON.stringify(businessSnapshot),
    JSON.stringify(bankSnapshot),
    JSON.stringify(termsSnapshot),
    Number(id)
  );

  return getQuotationById(id);
}

export function duplicateQuotationRecord(id) {
  const existing = getQuotationById(id);
  if (!existing) return null;

  const newQuotationNumber = allocateNextQuotationNumber(new Date().getFullYear());
  const todayIso = new Date().toISOString().slice(0, 10);

  return createQuotationRecord({
    ...existing,
    quotationNumber: newQuotationNumber,
    quotationDate: todayIso,
  });
}

export function deleteQuotationRecord(id) {
  const existing = getQuotationById(id);
  if (!existing) return false;
  db.prepare('DELETE FROM quotations WHERE id = ?').run(Number(id));
  return true;
}

export { db, dbPath };
