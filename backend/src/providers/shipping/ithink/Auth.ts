/**
 * IThinkAuth
 *
 * Manages API credentials (access_token, secret_key) for the IThink Logistics REST API.
 */

import { env } from '../../../config/env';

export interface IThinkCredentials {
  accessToken: string;
  secretKey: string;
}

export class IThinkAuth {
  /**
   * Returns valid access token and secret key from environment configuration.
   */
  getCredentials(): IThinkCredentials {
    const accessToken = env.ITHINK_ACCESS_TOKEN || env.ITHINK_USERNAME || env.ITHINK_API_KEY;
    const secretKey = env.ITHINK_SECRET_KEY || env.ITHINK_PASSWORD || env.ITHINK_API_KEY;

    if (!accessToken || !secretKey) {
      throw new Error(
        '[IThinkAuth] ITHINK_ACCESS_TOKEN / ITHINK_SECRET_KEY or ITHINK_USERNAME / ITHINK_PASSWORD must be set in .env to use the IThink Logistics provider.'
      );
    }

    return {
      accessToken,
      secretKey,
    };
  }

  get isAuthenticated(): boolean {
    return Boolean(
      (env.ITHINK_ACCESS_TOKEN && env.ITHINK_SECRET_KEY) ||
      (env.ITHINK_USERNAME && env.ITHINK_PASSWORD) ||
      env.ITHINK_API_KEY
    );
  }
}

export const ithinkAuth = new IThinkAuth();
