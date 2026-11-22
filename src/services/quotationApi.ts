import type {
  AllQuotationSettings,
  BankDetailsSettings,
  BusinessInfoSettings,
  QuotationFormData,
  QuotationRecord,
  TermsConditionItem,
} from '../types/quotation';
import {
  DEFAULT_BANK_DETAILS,
  DEFAULT_BUSINESS_INFO,
  DEFAULT_TERMS_ITEMS,
  calculateQuotationTotals,
} from '../utils/quotationCalculations';

const SESSION_TOKEN_KEY = 'toter_admin_session_token';
const FALLBACK_DB_KEY = 'toter_quotation_db_mirror_v1';
const FALLBACK_AUTH_KEY = 'toter_admin_cred_hash_v1';

interface FallbackDatabase {
  settings: AllQuotationSettings;
  counters: Record<number, number>;
  quotations: QuotationRecord[];
}

function getDefaultFallbackDb(): FallbackDatabase {
  return {
    settings: {
      bankDetails: { ...DEFAULT_BANK_DETAILS },
      businessInfo: { ...DEFAULT_BUSINESS_INFO },
      termsConditions: DEFAULT_TERMS_ITEMS.map((t) => ({ ...t })),
    },
    counters: {},
    quotations: [],
  };
}

function loadFallbackDb(): FallbackDatabase {
  try {
    const raw = localStorage.getItem(FALLBACK_DB_KEY);
    if (!raw) return getDefaultFallbackDb();
    const parsed = JSON.parse(raw) as Partial<FallbackDatabase>;
    return {
      settings: {
        bankDetails: { ...DEFAULT_BANK_DETAILS, ...(parsed.settings?.bankDetails ?? {}) },
        businessInfo: { ...DEFAULT_BUSINESS_INFO, ...(parsed.settings?.businessInfo ?? {}) },
        termsConditions:
          Array.isArray(parsed.settings?.termsConditions) && parsed.settings.termsConditions.length > 0
            ? parsed.settings.termsConditions
            : DEFAULT_TERMS_ITEMS.map((t) => ({ ...t })),
      },
      counters: parsed.counters ?? {},
      quotations: Array.isArray(parsed.quotations) ? parsed.quotations : [],
    };
  } catch {
    return getDefaultFallbackDb();
  }
}

function saveFallbackDb(db: FallbackDatabase): void {
  try {
    localStorage.setItem(FALLBACK_DB_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage quota warnings
  }
}

async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return input;
}

export function getAdminSessionToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminSessionToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch {
    // Ignore
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<{ ok: boolean; status: number; data: T | null }> {
  const token = getAdminSessionToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(path, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { ok: false, status: res.status, data: null };
    }
    const data = (await res.json()) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  } finally {
    clearTimeout(timer);
  }
}

export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiRequest<{ success: boolean; token?: string; message?: string }>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.success && res.data.token) {
      setAdminSessionToken(res.data.token);
      return { success: true };
    }
    return {
      success: false,
      message: res.data.message || 'Invalid administrator username or password.',
    };
  }

  // Static-host fallback verification when backend server is not running
  const cleanUser = username.trim().toLowerCase();
  const defaultHash = await sha256Hex('admin:Toter@272026');
  const storedHash = localStorage.getItem(FALLBACK_AUTH_KEY) || defaultHash;
  const candidateHash = await sha256Hex(`${cleanUser}:${password}`);

  if (cleanUser === 'admin' && candidateHash === storedHash) {
    const fallbackToken = `local_${await sha256Hex(`${Date.now()}:${candidateHash}`)}`;
    setAdminSessionToken(fallbackToken);
    return { success: true };
  }

  return {
    success: false,
    message: 'Invalid administrator username or password.',
  };
}

export async function checkAdminSession(): Promise<boolean> {
  const token = getAdminSessionToken();
  if (!token) return false;

  if (token.startsWith('local_')) {
    return true;
  }

  const res = await apiRequest<{ success: boolean }>('/api/admin/auth/session');
  if (res.status === 0) {
    return true;
  }
  if (!res.ok) {
    setAdminSessionToken(null);
    return false;
  }
  return Boolean(res.data?.success);
}

export async function logoutAdmin(): Promise<void> {
  const token = getAdminSessionToken();
  if (token && !token.startsWith('local_')) {
    await apiRequest('/api/admin/auth/logout', { method: 'POST' });
  }
  setAdminSessionToken(null);
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const res = await apiRequest<{ success: boolean; message: string }>('/api/admin/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (res.status !== 0 && res.data) {
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message || (res.ok ? 'Password updated.' : 'Failed to update password.'),
    };
  }

  const defaultHash = await sha256Hex('admin:Toter@272026');
  const storedHash = localStorage.getItem(FALLBACK_AUTH_KEY) || defaultHash;
  const currentHash = await sha256Hex(`admin:${currentPassword}`);
  if (currentHash !== storedHash) {
    return { success: false, message: 'Current password is incorrect.' };
  }
  const newHash = await sha256Hex(`admin:${newPassword}`);
  localStorage.setItem(FALLBACK_AUTH_KEY, newHash);
  return { success: true, message: 'Administrator password updated successfully.' };
}

export async function fetchAllSettings(): Promise<AllQuotationSettings> {
  const res = await apiRequest<{ success: boolean; settings: AllQuotationSettings }>('/api/admin/settings');
  if (res.ok && res.data?.settings) {
    const db = loadFallbackDb();
    db.settings = res.data.settings;
    saveFallbackDb(db);
    return res.data.settings;
  }
  return loadFallbackDb().settings;
}

export async function updateBankDetailsSettings(
  bankDetails: BankDetailsSettings
): Promise<{ success: boolean; message: string; settings?: AllQuotationSettings }> {
  const res = await apiRequest<{ success: boolean; message: string; settings?: AllQuotationSettings }>(
    '/api/admin/settings/bank',
    {
      method: 'PUT',
      body: JSON.stringify(bankDetails),
    }
  );

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.settings) {
      const db = loadFallbackDb();
      db.settings = res.data.settings;
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
      settings: res.data.settings,
    };
  }

  const db = loadFallbackDb();
  db.settings.bankDetails = { ...bankDetails };
  saveFallbackDb(db);
  return {
    success: true,
    message: 'Bank details saved successfully.',
    settings: db.settings,
  };
}

export async function updateBusinessInfoSettings(
  businessInfo: BusinessInfoSettings
): Promise<{ success: boolean; message: string; settings?: AllQuotationSettings }> {
  const res = await apiRequest<{ success: boolean; message: string; settings?: AllQuotationSettings }>(
    '/api/admin/settings/business',
    {
      method: 'PUT',
      body: JSON.stringify(businessInfo),
    }
  );

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.settings) {
      const db = loadFallbackDb();
      db.settings = res.data.settings;
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
      settings: res.data.settings,
    };
  }

  const db = loadFallbackDb();
  db.settings.businessInfo = { ...businessInfo };
  saveFallbackDb(db);
  return {
    success: true,
    message: 'Business information settings saved successfully.',
    settings: db.settings,
  };
}

export async function updateTermsConditionsSettings(
  termsConditions: TermsConditionItem[]
): Promise<{ success: boolean; message: string; settings?: AllQuotationSettings }> {
  const res = await apiRequest<{ success: boolean; message: string; settings?: AllQuotationSettings }>(
    '/api/admin/settings/terms',
    {
      method: 'PUT',
      body: JSON.stringify({ termsConditions }),
    }
  );

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.settings) {
      const db = loadFallbackDb();
      db.settings = res.data.settings;
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
      settings: res.data.settings,
    };
  }

  const db = loadFallbackDb();
  db.settings.termsConditions = termsConditions.map((t, idx) => ({
    ...t,
    order: idx + 1,
  }));
  saveFallbackDb(db);
  return {
    success: true,
    message: 'Terms & Conditions saved successfully.',
    settings: db.settings,
  };
}

function computeNextFallbackNumber(db: FallbackDatabase, year = new Date().getFullYear()): string {
  const prefix = `${year}/`;
  let maxExisting = db.counters[year] || 0;
  for (const q of db.quotations) {
    if (q.quotationNumber.startsWith(prefix)) {
      const seq = parseInt(q.quotationNumber.split('/')[1] || '0', 10);
      if (!Number.isNaN(seq) && seq > maxExisting) {
        maxExisting = seq;
      }
    }
  }
  return `${year}/${String(maxExisting + 1).padStart(3, '0')}`;
}

function allocateNextFallbackNumber(db: FallbackDatabase, year = new Date().getFullYear()): string {
  const nextNumber = computeNextFallbackNumber(db, year);
  const seq = parseInt(nextNumber.split('/')[1] || '1', 10);
  db.counters[year] = seq;
  return nextNumber;
}

export async function fetchNextQuotationNumber(): Promise<string> {
  const res = await apiRequest<{ success: boolean; nextQuotationNumber: string }>(
    '/api/admin/quotations/next-number'
  );
  if (res.ok && res.data?.nextQuotationNumber) {
    return res.data.nextQuotationNumber;
  }
  const db = loadFallbackDb();
  return computeNextFallbackNumber(db);
}

export async function fetchQuotationsList(filters?: {
  search?: string;
  movingType?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<QuotationRecord[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.movingType) params.set('movingType', filters.movingType);
  if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.set('dateTo', filters.dateTo);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await apiRequest<{ success: boolean; quotations: QuotationRecord[] }>(
    `/api/admin/quotations${query}`
  );

  if (res.ok && Array.isArray(res.data?.quotations)) {
    if (!filters?.search && !filters?.movingType && !filters?.dateFrom && !filters?.dateTo) {
      const db = loadFallbackDb();
      db.quotations = res.data.quotations;
      saveFallbackDb(db);
    }
    return res.data.quotations;
  }

  const db = loadFallbackDb();
  let list = [...db.quotations];

  if (filters?.search?.trim()) {
    const s = filters.search.trim().toLowerCase();
    list = list.filter(
      (q) =>
        q.customerName.toLowerCase().includes(s) ||
        q.quotationNumber.toLowerCase().includes(s) ||
        q.customerPhone.toLowerCase().includes(s) ||
        q.movingFromSummary.toLowerCase().includes(s) ||
        q.movingToSummary.toLowerCase().includes(s)
    );
  }
  if (filters?.movingType?.trim()) {
    list = list.filter((q) => q.movingType === filters.movingType);
  }
  if (filters?.dateFrom?.trim()) {
    list = list.filter((q) => q.quotationDate >= filters.dateFrom!);
  }
  if (filters?.dateTo?.trim()) {
    list = list.filter((q) => q.quotationDate <= filters.dateTo!);
  }

  return list.sort((a, b) => b.id - a.id);
}

export async function createQuotation(
  form: QuotationFormData
): Promise<{ success: boolean; message: string; quotation?: QuotationRecord }> {
  const res = await apiRequest<{ success: boolean; message: string; quotation?: QuotationRecord }>(
    '/api/admin/quotations',
    {
      method: 'POST',
      body: JSON.stringify(form),
    }
  );

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.quotation) {
      const db = loadFallbackDb();
      db.quotations = [res.data.quotation, ...db.quotations.filter((q) => q.id !== res.data!.quotation!.id)];
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
      quotation: res.data.quotation,
    };
  }

  const db = loadFallbackDb();
  const year = new Date().getFullYear();
  const exists = db.quotations.some((q) => q.quotationNumber === form.quotationNumber);
  const quotationNumber =
    !form.quotationNumber || exists ? allocateNextFallbackNumber(db, year) : form.quotationNumber;

  const parts = quotationNumber.split('/');
  const parsedYear = parseInt(parts[0] || String(year), 10);
  const parsedSeq = parseInt(parts[1] || '1', 10);
  if (!Number.isNaN(parsedYear) && !Number.isNaN(parsedSeq)) {
    db.counters[parsedYear] = Math.max(db.counters[parsedYear] || 0, parsedSeq);
  }

  const totals = calculateQuotationTotals(form.pricing, form.movingInfo);
  const nowIso = new Date().toISOString();
  const nextId = db.quotations.reduce((max, q) => Math.max(max, q.id), 0) + 1;

  const created: QuotationRecord = {
    ...form,
    id: nextId,
    quotationNumber,
    movingFromSummary: form.movingFromSummary.trim() || form.moveFrom.city.trim(),
    movingToSummary: form.movingToSummary.trim() || form.moveTo.city.trim(),
    subTotal: totals.subTotal,
    insuranceAmount: totals.insuranceAmount,
    totalAmount: totals.totalAmount,
    businessSnapshot: form.businessSnapshot ? { ...form.businessSnapshot } : { ...db.settings.businessInfo },
    bankSnapshot: form.bankSnapshot ? { ...form.bankSnapshot } : { ...db.settings.bankDetails },
    termsSnapshot: form.termsSnapshot
      ? form.termsSnapshot.map((t) => ({ ...t }))
      : db.settings.termsConditions.map((t) => ({ ...t })),
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.quotations.unshift(created);
  saveFallbackDb(db);

  return {
    success: true,
    message: `Quotation ${created.quotationNumber} created and saved.`,
    quotation: created,
  };
}

export async function updateQuotation(
  id: number,
  form: QuotationFormData
): Promise<{ success: boolean; message: string; quotation?: QuotationRecord }> {
  const res = await apiRequest<{ success: boolean; message: string; quotation?: QuotationRecord }>(
    `/api/admin/quotations/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(form),
    }
  );

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.quotation) {
      const db = loadFallbackDb();
      db.quotations = db.quotations.map((q) => (q.id === id ? res.data!.quotation! : q));
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
      quotation: res.data.quotation,
    };
  }

  const db = loadFallbackDb();
  const idx = db.quotations.findIndex((q) => q.id === id);
  if (idx === -1) {
    return { success: false, message: 'Quotation not found.' };
  }

  const existing = db.quotations[idx];
  const totals = calculateQuotationTotals(form.pricing, form.movingInfo);
  const updated: QuotationRecord = {
    ...existing,
    ...form,
    id: existing.id,
    quotationNumber: existing.quotationNumber,
    movingFromSummary: form.movingFromSummary.trim() || form.moveFrom.city.trim(),
    movingToSummary: form.movingToSummary.trim() || form.moveTo.city.trim(),
    subTotal: totals.subTotal,
    insuranceAmount: totals.insuranceAmount,
    totalAmount: totals.totalAmount,
    businessSnapshot: form.businessSnapshot ?? existing.businessSnapshot,
    bankSnapshot: form.bankSnapshot ?? existing.bankSnapshot,
    termsSnapshot: form.termsSnapshot ?? existing.termsSnapshot,
    updatedAt: new Date().toISOString(),
  };

  db.quotations[idx] = updated;
  saveFallbackDb(db);

  return {
    success: true,
    message: `Quotation ${updated.quotationNumber} updated.`,
    quotation: updated,
  };
}

export async function duplicateQuotation(
  id: number
): Promise<{ success: boolean; message: string; quotation?: QuotationRecord }> {
  const res = await apiRequest<{ success: boolean; message: string; quotation?: QuotationRecord }>(
    `/api/admin/quotations/${id}/duplicate`,
    {
      method: 'POST',
    }
  );

  if (res.status !== 0 && res.data) {
    if (res.ok && res.data.quotation) {
      const db = loadFallbackDb();
      db.quotations.unshift(res.data.quotation);
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
      quotation: res.data.quotation,
    };
  }

  const db = loadFallbackDb();
  const original = db.quotations.find((q) => q.id === id);
  if (!original) {
    return { success: false, message: 'Original quotation not found.' };
  }

  const newNumber = allocateNextFallbackNumber(db, new Date().getFullYear());
  const nextId = db.quotations.reduce((max, q) => Math.max(max, q.id), 0) + 1;
  const nowIso = new Date().toISOString();

  const duplicated: QuotationRecord = {
    ...JSON.parse(JSON.stringify(original)),
    id: nextId,
    quotationNumber: newNumber,
    quotationDate: nowIso.slice(0, 10),
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.quotations.unshift(duplicated);
  saveFallbackDb(db);

  return {
    success: true,
    message: `Duplicated as new Quotation ${duplicated.quotationNumber}.`,
    quotation: duplicated,
  };
}

export async function deleteQuotation(id: number): Promise<{ success: boolean; message: string }> {
  const res = await apiRequest<{ success: boolean; message: string }>(`/api/admin/quotations/${id}`, {
    method: 'DELETE',
  });

  if (res.status !== 0 && res.data) {
    if (res.ok) {
      const db = loadFallbackDb();
      db.quotations = db.quotations.filter((q) => q.id !== id);
      saveFallbackDb(db);
    }
    return {
      success: Boolean(res.ok && res.data.success),
      message: res.data.message,
    };
  }

  const db = loadFallbackDb();
  db.quotations = db.quotations.filter((q) => q.id !== id);
  saveFallbackDb(db);
  return {
    success: true,
    message: 'Quotation deleted successfully.',
  };
}

export function exportDatabaseBackupJson(): string {
  const db = loadFallbackDb();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      application: 'TOTER Packers & Movers Quotation System',
      ...db,
    },
    null,
    2
  );
}

