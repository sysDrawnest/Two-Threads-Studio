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
    const accessToken = env.ITHINK_ACCESS_TOKEN;
    const secretKey = env.ITHINK_SECRET_KEY;

    if (!accessToken || !secretKey) {
      throw new Error(
        '[IThinkAuth] ITHINK_ACCESS_TOKEN and ITHINK_SECRET_KEY must be set in .env to use the IThink Logistics provider.'
      );
    }

    return {
      accessToken,
      secretKey,
    };
  }

  get isAuthenticated(): boolean {
    return Boolean(env.ITHINK_ACCESS_TOKEN && env.ITHINK_SECRET_KEY);
  }
}

export const ithinkAuth = new IThinkAuth();
