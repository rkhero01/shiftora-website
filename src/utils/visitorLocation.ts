export const VISITOR_CITY_STORAGE_KEY = 'toter_visitor_city';
export const FALLBACK_CITY = 'India';

export interface GeolocationProvider {
  name: string;
  url: string;
  extractCity: (data: unknown) => string | null;
}

/**
 * Trusted keyless HTTPS IP geolocation providers with CORS support.
 * IP-based geolocation is approximate and reflects the visitor's network/ISP location.
 */
export const GEOLOCATION_PROVIDERS: GeolocationProvider[] = [
  {
    name: 'ipwho.is',
    url: 'https://ipwho.is/',
    extractCity: (data: unknown): string | null => {
      if (!data || typeof data !== 'object') return null;
      const record = data as Record<string, unknown>;
      if (record.success === false) return null;
      return typeof record.city === 'string' ? record.city : null;
    },
  },
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    extractCity: (data: unknown): string | null => {
      if (!data || typeof data !== 'object') return null;
      const record = data as Record<string, unknown>;
      if (record.error) return null;
      return typeof record.city === 'string' ? record.city : null;
    },
  },
];

/**
 * Sanitizes and normalizes raw city names returned by IP geolocation APIs.
 */
export function normalizeDetectedCity(rawCity: string | null | undefined): string | null {
  if (!rawCity || typeof rawCity !== 'string') return null;

  const cleaned = rawCity
    .replace(/[^\p{L}\p{N}\s.-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || cleaned.length < 2 || cleaned.length > 48) {
    return null;
  }

  const lower = cleaned.toLowerCase();
  if (lower === 'unknown' || lower === 'null' || lower === 'undefined' || lower === 'n/a') {
    return null;
  }

  if (lower === 'delhi' || lower === 'new delhi') {
    return 'Delhi NCR';
  }

  return cleaned;
}

export function getCachedVisitorCity(storage?: Storage | null): string | null {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined' && window.sessionStorage
          ? window.sessionStorage
          : null;
    if (!targetStorage) return null;
    const cached = targetStorage.getItem(VISITOR_CITY_STORAGE_KEY);
    return normalizeDetectedCity(cached);
  } catch {
    return null;
  }
}

export function setCachedVisitorCity(city: string, storage?: Storage | null): void {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined' && window.sessionStorage
          ? window.sessionStorage
          : null;
    if (!targetStorage) return;
    const normalized = normalizeDetectedCity(city);
    if (normalized) {
      targetStorage.setItem(VISITOR_CITY_STORAGE_KEY, normalized);
    }
  } catch {
    // Ignore sessionStorage quota or privacy-mode restrictions
  }
}

export interface DetectCityOptions {
  fetchImpl?: typeof fetch;
  storage?: Storage | null;
  timeoutMs?: number;
}

/**
 * Detects the visitor's approximate city using IP-based geolocation without
 * requesting browser GPS or location permissions.
 * Caches successful lookups in sessionStorage for the current browsing session.
 */
export async function detectVisitorCity(options: DetectCityOptions = {}): Promise<string> {
  const {
    fetchImpl = typeof fetch !== 'undefined' ? fetch : undefined,
    storage,
    timeoutMs = 3500,
  } = options;

  const cachedCity = getCachedVisitorCity(storage);
  if (cachedCity) {
    return cachedCity;
  }

  if (!fetchImpl) {
    return FALLBACK_CITY;
  }

  for (const provider of GEOLOCATION_PROVIDERS) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      const response = await fetchImpl(provider.url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller?.signal,
      });

      if (!response.ok) {
        continue;
      }

      const data: unknown = await response.json();
      const extracted = provider.extractCity(data);
      const normalized = normalizeDetectedCity(extracted);

      if (normalized) {
        setCachedVisitorCity(normalized, storage);
        return normalized;
      }
    } catch {
      // Try next provider or fall back to FALLBACK_CITY
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  return FALLBACK_CITY;
}

export function formatLocationLabel(city: string | null | undefined): string {
  const validCity = normalizeDetectedCity(city) ?? FALLBACK_CITY;
  return `${validCity} & Worldwide`;
}

