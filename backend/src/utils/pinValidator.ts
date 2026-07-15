/**
 * PIN Code Validator — Phase 5C
 *
 * Validates Indian postal codes via api.postalpincode.in.
 * Best-effort: if the API is unavailable, returns null (graceful fallback).
 * Never blocks a checkout — only enriches/flags address data.
 */

import logger from '../lib/logger';

export interface PinCodeInfo {
  pinCode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  valid: boolean;
}

export interface PinValidationResult {
  valid: boolean;
  info: PinCodeInfo | null;
  /** True if the PIN lookup succeeded (even if PIN is invalid) */
  apiAvailable: boolean;
  /** True if city/state in the provided address matches the PIN data */
  addressMatch?: boolean;
}

const PIN_API_BASE = 'https://api.postalpincode.in/pincode';
const TIMEOUT_MS = 3000;

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function validatePinCode(
  pinCode: string,
  providedCity?: string,
  providedState?: string
): Promise<PinValidationResult> {
  // Basic format check: 6 digits
  if (!/^\d{6}$/.test(pinCode)) {
    return { valid: false, info: null, apiAvailable: true };
  }

  try {
    const res = await fetchWithTimeout(`${PIN_API_BASE}/${pinCode}`, TIMEOUT_MS);

    if (!res.ok) {
      logger.warn({ pinCode, status: res.status }, '[PinValidator] API returned non-200');
      return { valid: false, info: null, apiAvailable: false };
    }

    const data = await res.json();

    // API returns array — first element has Status and PostOffice array
    const result = Array.isArray(data) ? data[0] : null;

    if (!result || result.Status !== 'Success' || !result.PostOffice?.length) {
      return { valid: false, info: null, apiAvailable: true };
    }

    const po = result.PostOffice[0];

    const info: PinCodeInfo = {
      pinCode,
      city: po.Block || po.Name,
      district: po.District,
      state: po.State,
      country: po.Country,
      valid: true,
    };

    // Optional: check if provided city/state roughly matches
    let addressMatch: boolean | undefined;
    if (providedState) {
      addressMatch =
        info.state.toLowerCase().includes(providedState.toLowerCase()) ||
        providedState.toLowerCase().includes(info.state.toLowerCase());
    }

    return { valid: true, info, apiAvailable: true, addressMatch };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      logger.warn({ pinCode }, '[PinValidator] API timeout — falling back');
    } else {
      logger.warn({ pinCode, err: err.message }, '[PinValidator] API error — falling back');
    }
    return { valid: false, info: null, apiAvailable: false };
  }
}
