/**
 * OTP Repository — Phase 5C
 *
 * Stores hashed OTPs. Raw OTP never persisted.
 * Max 3 attempts enforced. 10-minute TTL default.
 */

import { OtpVerification, OtpPurpose } from '@prisma/client';
import prisma from '../prisma';
import bcrypt from 'bcrypt';


const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const MAX_OTP_ATTEMPTS = 3;

export const otpRepository = {
  /**
   * Create a new OTP record.
   * Invalidates any existing unexpired OTP for the same recipient+purpose.
   * Returns the raw OTP string (send this to the user, never store it).
   */
  create: async (
    userId: string,
    recipient: string,
    purpose: OtpPurpose
  ): Promise<string> => {
    // Expire previous OTPs for this recipient+purpose
    await prisma.otpVerification.updateMany({
      where: { userId, recipient, purpose, verified: false },
      data: { expiresAt: new Date() }, // expire immediately
    });

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otpVerification.create({
      data: { userId, recipient, purpose, otpHash, expiresAt },
    });

    return otp;
  },

  /**
   * Verify an OTP. Returns true if valid, false if invalid or expired.
   * Increments attempt counter. Expires OTP after MAX_OTP_ATTEMPTS.
   */
  verify: async (
    userId: string,
    recipient: string,
    purpose: OtpPurpose,
    rawOtp: string
  ): Promise<{ valid: boolean; reason?: string }> => {
    const record = await prisma.otpVerification.findFirst({
      where: {
        userId,
        recipient,
        purpose,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return { valid: false, reason: 'OTP not found or expired. Please request a new OTP.' };
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      return { valid: false, reason: 'Too many attempts. Please request a new OTP.' };
    }

    const isMatch = await bcrypt.compare(rawOtp, record.otpHash);

    if (!isMatch) {
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = MAX_OTP_ATTEMPTS - record.attempts - 1;
      return {
        valid: false,
        reason: remaining > 0
          ? `Incorrect OTP. ${remaining} attempt(s) remaining.`
          : 'Too many attempts. Please request a new OTP.',
      };
    }

    // Mark as verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return { valid: true };
  },

  /** Check if a user+recipient+purpose was recently verified (within last 30 min) */
  isRecentlyVerified: async (
    userId: string,
    recipient: string,
    purpose: OtpPurpose
  ): Promise<boolean> => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const record = await prisma.otpVerification.findFirst({
      where: {
        userId,
        recipient,
        purpose,
        verified: true,
        createdAt: { gte: thirtyMinutesAgo },
      },
    });
    return !!record;
  },
};
