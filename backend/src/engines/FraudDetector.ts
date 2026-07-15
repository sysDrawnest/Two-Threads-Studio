/**
 * Fraud Detector — Phase 5C
 *
 * Scans a checkout attempt for suspicious signals.
 * Returns a list of fraud flags detected (may be empty).
 * Does NOT block orders — creates FraudFlag records and adjusts risk score.
 * Blocking decisions are made by RiskEngine based on accumulated flags.
 */

import { FraudFlagType } from '@prisma/client';
import logger from '../lib/logger';

export interface FraudCheckInput {
  userId: string;
  orderId?: string;
  phone?: string;
  email?: string;
  postalCode?: string;
  ipAddress?: string;

  // Counters from DB (can be queried before calling)
  failedPaymentsLast24h: number;
  ordersLast24h: number;
  accountsWithSamePhone: number;
  accountsWithSameAddress: number;
}

export interface FraudFlagDetected {
  type: FraudFlagType;
  details: Record<string, unknown>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

/** Disposable email domain list (top offenders) */
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'throwam.com',
  'yopmail.com',
  'fakeinbox.com',
  'trashmail.com',
  'sharklasers.com',
  'dispostable.com',
]);

export function runFraudDetection(input: FraudCheckInput): FraudFlagDetected[] {
  const flags: FraudFlagDetected[] = [];

  // Check 1: Multiple failed payments in last 24h
  if (input.failedPaymentsLast24h >= 3) {
    flags.push({
      type: FraudFlagType.MULTIPLE_FAILED_PAYMENTS,
      details: { count: input.failedPaymentsLast24h, window: '24h' },
      severity: input.failedPaymentsLast24h >= 5 ? 'HIGH' : 'MEDIUM',
    });
  }

  // Check 2: Too many orders in one day
  if (input.ordersLast24h >= 5) {
    flags.push({
      type: FraudFlagType.TOO_MANY_ORDERS_TODAY,
      details: { count: input.ordersLast24h, window: '24h' },
      severity: 'MEDIUM',
    });
  }

  // Check 3: Multiple accounts using same phone
  if (input.accountsWithSamePhone > 1) {
    flags.push({
      type: FraudFlagType.MULTIPLE_ACCOUNTS_SAME_PHONE,
      details: { accountCount: input.accountsWithSamePhone, phone: input.phone },
      severity: input.accountsWithSamePhone >= 3 ? 'HIGH' : 'MEDIUM',
    });
  }

  // Check 4: Multiple accounts using same address
  if (input.accountsWithSameAddress > 2) {
    flags.push({
      type: FraudFlagType.MULTIPLE_ACCOUNTS_SAME_ADDRESS,
      details: {
        accountCount: input.accountsWithSameAddress,
        postalCode: input.postalCode,
      },
      severity: 'MEDIUM',
    });
  }

  // Check 5: Disposable email domain
  if (input.email) {
    const domain = input.email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_DOMAINS.has(domain)) {
      flags.push({
        type: FraudFlagType.DISPOSABLE_EMAIL,
        details: { domain },
        severity: 'MEDIUM',
      });
    }
  }

  if (flags.length > 0) {
    logger.warn({ userId: input.userId, flags: flags.map((f) => f.type) }, '[FraudDetector] Signals detected');
  }

  return flags;
}
