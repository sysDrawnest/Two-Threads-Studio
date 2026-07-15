/**
 * OTP Provider Factory
 *
 * Reads OTP_PROVIDER env var to select provider.
 * Valid values: 'mock' | 'msg91' | 'twofactor'
 * Default: 'mock'
 */

import { OtpProvider } from './OtpProvider.interface';
import { MockOtpProvider } from './MockOtpProvider';

function createOtpProvider(): OtpProvider {
  const provider = (process.env.OTP_PROVIDER || 'mock').toLowerCase();

  switch (provider) {
    case 'mock':
      return new MockOtpProvider();

    // Future providers — add when credentials available:
    // case 'msg91':
    //   return new Msg91Provider();
    // case 'twofactor':
    //   return new TwoFactorProvider();

    default:
      console.warn(`[OtpProvider] Unknown provider "${provider}", falling back to mock`);
      return new MockOtpProvider();
  }
}

export const otpProvider: OtpProvider = createOtpProvider();
