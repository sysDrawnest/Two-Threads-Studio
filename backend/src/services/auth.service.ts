import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { userRepository, SafeUser } from '../repositories/user.repository';
import { tokenRepository } from '../repositories/token.repository';
import { hashPassword, comparePassword, hashToken } from '../lib/crypto';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../lib/jwt';
import type { RegisterDto, LoginDto, ChangePasswordDto } from '../validators/auth.validator';

// ─── Shared token pair helper ──────────────────────────────────────────────────
const issueTokenPair = (user: SafeUser) => {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload); // JWT signed with REFRESH_SECRET
  return { accessToken, rawRefreshToken: refreshToken };
};

// ─── Auth Service ──────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Register a new CUSTOMER user.
   * Throws 409 if email already exists.
   */
  register: async (dto: RegisterDto): Promise<SafeUser> => {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
    });

    return user;
  },

  /**
   * Login with email + password.
   * Returns user, accessToken, and rawRefreshToken.
   */
  login: async (
    dto: LoginDto,
    ipAddress?: string,
    deviceInfo?: string
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> => {
    // Always fetch with passwordHash for comparison
    const user = await userRepository.findByEmailWithPassword(dto.email);

    // Use consistent error to prevent user enumeration
    const invalidCredentials = new AppError(
      'Invalid email or password',
      HTTP_STATUS.UNAUTHORIZED
    );

    if (!user) throw invalidCredentials;
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', HTTP_STATUS.UNAUTHORIZED);
    }

    const passwordMatch = await comparePassword(dto.password, user.passwordHash);

    if (!passwordMatch) {
      console.log('--- PASSWORD MISMATCH ---');
      console.log('Provided Password:', dto.password);
      console.log('Stored Hash:', user.passwordHash);
      console.log('Length of provided password:', dto.password.length);
      console.log('Hex of provided password:', Buffer.from(dto.password).toString('hex'));
      console.log('-------------------------');
      throw invalidCredentials;
    }

    const { accessToken, rawRefreshToken } = issueTokenPair(user);

    // Store hashed refresh token
    await tokenRepository.create({
      tokenHash: hashToken(rawRefreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
      ipAddress,
      deviceInfo,
    });

    // Update lastLogin (fire and forget — don't block response)
    userRepository.updateLastLogin(user.id).catch(() => {});

    // Strip passwordHash before returning
    const { passwordHash: _pw, ...safeUser } = user;

    return { user: safeUser as SafeUser, accessToken, refreshToken: rawRefreshToken };
  },

  /**
   * Revoke a refresh token (logout).
   */
  logout: async (rawRefreshToken: string): Promise<void> => {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await tokenRepository.findByHash(tokenHash);

    if (stored && !stored.revokedAt) {
      await tokenRepository.revoke(stored.id);
    }
    // Silent success even if token not found — idempotent logout
  },

  /**
   * Rotate refresh tokens: revoke old, issue new pair.
   */
  refreshTokens: async (
    rawRefreshToken: string,
    ipAddress?: string,
    deviceInfo?: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    // Verify JWT signature first
    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify it exists and hasn't been revoked in DB
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await tokenRepository.findByHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      // Potential token reuse attack — revoke all tokens for this user
      await tokenRepository.revokeAllByUserId(payload.sub);
      throw new AppError('Refresh token has been revoked or expired', HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new AppError('User not found or deactivated', HTTP_STATUS.UNAUTHORIZED);
    }

    // Revoke the old token
    await tokenRepository.revoke(stored.id);

    // Issue new token pair
    const { accessToken, rawRefreshToken: newRawRefreshToken } = issueTokenPair(user);

    await tokenRepository.create({
      tokenHash: hashToken(newRawRefreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
      ipAddress,
      deviceInfo,
    });

    return { accessToken, refreshToken: newRawRefreshToken };
  },

  /**
   * Get the authenticated user's safe profile.
   */
  getMe: async (userId: string): Promise<SafeUser> => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  },

  /**
   * Change password: verify current, hash new, invalidate all refresh tokens.
   */
  changePassword: async (userId: string, dto: ChangePasswordDto): Promise<void> => {
    const user = await userRepository.findByEmailWithPassword(
      // We need to find by ID but include passwordHash
      await userRepository.findById(userId).then((u) => {
        if (!u) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
        return u.email;
      })
    );

    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

    const currentPasswordValid = await comparePassword(dto.currentPassword, user.passwordHash);
    if (!currentPasswordValid) {
      throw new AppError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
    }

    const newPasswordHash = await hashPassword(dto.newPassword);

    // Update password and revoke all sessions
    await Promise.all([
      userRepository.updatePassword(userId, newPasswordHash),
      tokenRepository.revokeAllByUserId(userId),
    ]);
  },

  /**
   * Revoke all refresh tokens for the user (Logout all devices).
   */
  logoutAll: async (userId: string): Promise<void> => {
    await tokenRepository.revokeAllByUserId(userId);
  },
};
