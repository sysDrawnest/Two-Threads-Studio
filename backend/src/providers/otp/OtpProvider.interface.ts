/**
 * OTP Provider Interface — Phase 5C
 *
 * All OTP providers (Mock, MSG91, 2Factor, etc.) implement this interface.
 * Business logic depends ONLY on this interface — never on concrete providers.
 */

export interface OtpSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OtpProvider {
  /**
   * Send a 6-digit OTP to a phone number or email.
   * Returns the raw OTP string (for hashing and storage by the caller).
   */
  sendOtp(recipient: string, otp: string, purpose: string): Promise<OtpSendResult>;

  /** Provider name for logging */
  readonly name: string;
}
