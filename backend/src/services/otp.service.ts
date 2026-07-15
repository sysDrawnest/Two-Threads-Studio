/**
 * OTP Service — Phase 5C
 *
 * Orchestrates: OTP generation → hashed storage → provider delivery → verification.
 * Business logic never touches the raw OTP after handing it to the provider.
 */

import { OtpPurpose } from '@prisma/client';
import { otpRepository } from '../repositories/otp.repository';
import { otpProvider } from '../providers/otp';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import logger from '../lib/logger';
import prisma from '../prisma';

/** Purpose-to-human-readable message map */
const PURPOSE_MESSAGES: Record<OtpPurpose, string> = {
  FIRST_ORDER_VERIFICATION: 'Verify your phone to place your first order',
  COD_VERIFICATION: 'Verify your phone to use Cash on Delivery',
  HIGH_VALUE_ORDER: 'Verify your phone for this high-value order',
  PHONE_CHANGE: 'Verify your new phone number',
  PHONE_REGISTRATION: 'Verify your phone number',
};

export const otpService = {
  /**
   * Send OTP to a recipient (phone or email).
   * Invalidates previous unexpired OTPs for the same recipient+purpose.
   */
  send: async (
    userId: string,
    recipient: string,
    purpose: OtpPurpose
  ): Promise<{ sent: boolean; provider: string }> => {
    // Generate + store hashed OTP
    const rawOtp = await otpRepository.create(userId, recipient, purpose);

    // Send via provider (mock in dev, real SMS in production)
    const result = await otpProvider.sendOtp(recipient, rawOtp, PURPOSE_MESSAGES[purpose]);

    if (!result.success) {
      logger.error({ userId, recipient, purpose, error: result.error }, '[OtpService] Failed to send OTP');
      throw new AppError(
        'Failed to send OTP. Please try again.',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    logger.info({ userId, recipient, purpose, provider: otpProvider.name }, '[OtpService] OTP sent');
    return { sent: true, provider: otpProvider.name };
  },

  /**
   * Verify an OTP. Marks phone as verified if purpose is phone-related.
   */
  verify: async (
    userId: string,
    recipient: string,
    purpose: OtpPurpose,
    rawOtp: string,
    prismaClient?: any
  ): Promise<{ verified: boolean; reason?: string }> => {
    const result = await otpRepository.verify(userId, recipient, purpose, rawOtp);

    if (!result.valid) {
      return { verified: false, reason: result.reason };
    }

    // If verifying phone number, mark it as verified in the user record
    if (
      purpose === OtpPurpose.PHONE_REGISTRATION ||
      purpose === OtpPurpose.PHONE_CHANGE
    ) {
      const client = prismaClient || prisma;
      await client.user.update({
        where: { id: userId },
        data: { phone: recipient, phoneVerified: true },
      });
      logger.info({ userId, phone: recipient }, '[OtpService] Phone verified and updated');
    }

    logger.info({ userId, recipient, purpose }, '[OtpService] OTP verified successfully');
    return { verified: true };
  },

  /**
   * Check if a user's phone was recently verified (within 30 min).
   * Used to skip OTP requirement if user already verified recently.
   */
  isRecentlyVerified: async (
    userId: string,
    phone: string,
    purpose: OtpPurpose
  ): Promise<boolean> => {
    return otpRepository.isRecentlyVerified(userId, phone, purpose);
  },
};
