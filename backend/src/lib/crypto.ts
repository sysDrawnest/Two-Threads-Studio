import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password with bcrypt (12 rounds).
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Timing-safe comparison of plain password against bcrypt hash.
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a cryptographically random token string (48 bytes = 96 hex chars).
 */
export const generateToken = (): string => {
  return crypto.randomBytes(48).toString('hex');
};

/**
 * SHA-256 hashes a refresh token before storing in the DB.
 * Never store refresh tokens in plaintext.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
