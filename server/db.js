import { DatabaseSync } from 'node:sqlite';
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

const dbPath = path.join(dataDir, 'shiftora.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for concurrent performance and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Create enquiries table matching exact requirements
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

// Prepared statement for inserting an enquiry safely with parameters
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

// Prepared statement for checking an enquiry by reference code
const selectByRefStmt = db.prepare(`
  SELECT id, reference_code, customer_name, origin_city, destination_city, service_type, move_date, created_at, status
  FROM enquiries
  WHERE reference_code = ?
`);

/**
 * Inserts a new validated customer moving enquiry.
 * Returns the created enquiry metadata with reference code.
 */
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

/**
 * Retrieves enquiry by reference code.
 */
export function getEnquiryByRef(referenceCode) {
  return selectByRefStmt.get(referenceCode);
}

export { db, dbPath };
