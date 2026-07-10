import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  sub: string;   // user id
  email: string;
  role: string;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Signs a short-lived access token (15 minutes).
 */
export const signAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Signs a long-lived refresh token (7 days).
 */
export const signRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

/**
 * Verifies and decodes an access token. Throws on invalid/expired.
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

/**
 * Verifies and decodes a refresh token. Throws on invalid/expired.
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

/**
 * Returns the expiry date for a refresh token (7 days from now).
 */
export const getRefreshTokenExpiry = (): Date => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
};
