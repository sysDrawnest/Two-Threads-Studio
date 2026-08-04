/**
 * ShiprocketAuth
 *
 * Manages Bearer token lifecycle for the Shiprocket REST API.
 * Token is cached in-memory for 55 minutes (Shiprocket tokens expire after 60 min).
 *
 * Usage:
 *   const auth = new ShiprocketAuth();
 *   const token = await auth.getAccessToken();
 *
 * The rest of the Shiprocket adapter always calls getAccessToken() —
 * it never handles login or token caching directly.
 */

import axios from 'axios';
import logger from '../../../lib/logger';
import { env } from '../../../config/env';

const SHIPROCKET_AUTH_URL = 'https://apiv2.shiprocket.in/v1/external/auth/login';
/** 55 minutes — Shiprocket tokens expire after 60 min. 5-min buffer prevents mid-request expiry. */
const TOKEN_TTL_MS = 55 * 60 * 1000;

export class ShiprocketAuth {
  private token: string | null = null;
  private expiresAt: Date | null = null;

  /**
   * Returns a valid Bearer token.
   * If the cached token is still valid, returns it immediately.
   * Otherwise performs a login request to refresh.
   */
  async getAccessToken(): Promise<string> {
    if (this.token && this.expiresAt && new Date() < this.expiresAt) {
      return this.token;
    }
    await this.login();
    return this.token!;
  }

  /** ISO timestamp when the current token expires. null if not yet authenticated. */
  get tokenExpiresAt(): string | null {
    return this.expiresAt?.toISOString() ?? null;
  }

  /** True if the current token is valid and not expired. */
  get isAuthenticated(): boolean {
    return !!this.token && !!this.expiresAt && new Date() < this.expiresAt;
  }

  private async login(): Promise<void> {
    const email = env.SHIPROCKET_EMAIL;
    const password = env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      throw new Error(
        '[ShiprocketAuth] SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD must be set in .env to use the Shiprocket provider.'
      );
    }

    logger.info('[ShiprocketAuth] Requesting new access token...');

    const response = await axios.post<{ token: string }>(
      SHIPROCKET_AUTH_URL,
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10_000,
      }
    );

    const token = response.data?.token;
    if (!token) {
      throw new Error('[ShiprocketAuth] Login succeeded but no token returned in response.');
    }

    this.token = token;
    this.expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    logger.info(
      { expiresAt: this.expiresAt.toISOString() },
      '[ShiprocketAuth] Token refreshed successfully.'
    );
  }
}

/** Singleton auth instance for the Shiprocket provider */
export const shiprocketAuth = new ShiprocketAuth();
