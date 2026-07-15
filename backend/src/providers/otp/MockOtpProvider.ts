/**
 * Mock OTP Provider — Development Only
 *
 * Logs OTP to the console instead of sending SMS.
 * Swap for MSG91Provider or TwoFactorProvider without touching business logic.
 */

import { OtpProvider, OtpSendResult } from './OtpProvider.interface';
import logger from '../../lib/logger';

export class MockOtpProvider implements OtpProvider {
  readonly name = 'MOCK';

  async sendOtp(recipient: string, otp: string, purpose: string): Promise<OtpSendResult> {
    logger.info(
      { recipient, purpose, otp },
      '[MockOtpProvider] 📱 OTP (dev only — never log in production)'
    );

    // Simulate tiny network delay
    await new Promise((r) => setTimeout(r, 50));

    return { success: true, messageId: `mock_${Date.now()}` };
  }
}
