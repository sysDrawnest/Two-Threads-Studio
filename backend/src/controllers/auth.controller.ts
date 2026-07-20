import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import logger from '../lib/logger';

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  logger.info({
    type: 'customer_registered',
    email: user.email,
    userId: user.id
  });
  return successResponse(res, { user }, 'Account created successfully', HTTP_STATUS.CREATED);
});

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = catchAsync(async (req: Request, res: Response) => {
  console.log('--- LOGIN DEBUG ---');
  console.log('Email received:', req.body.email);
  console.log('Password length:', req.body.password?.length);
  console.log('Password value:', req.body.password);
  console.log('-------------------');
  
  const ipAddress = req.ip;
  const deviceInfo = req.headers['user-agent'];

  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
      ipAddress,
      deviceInfo
    );
    logger.info({
      type: 'login_success',
      role: user.role,
      email: user.email,
      ip: ipAddress || '::1'
    });
    return successResponse(res, { user, accessToken, refreshToken }, 'Login successful');
  } catch (err: any) {
    logger.info({
      type: 'login_failed',
      email: req.body.email,
      reason: err.message || 'Invalid credentials'
    });
    throw err;
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  // Silently succeed even if no token provided — idempotent
  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  return successResponse(res, null, 'Logged out successfully');
});

// ─── Refresh Tokens ───────────────────────────────────────────────────────────
export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const ipAddress = req.ip;
  const deviceInfo = req.headers['user-agent'];

  const tokens = await authService.refreshTokens(refreshToken, ipAddress, deviceInfo);

  return successResponse(res, tokens, 'Tokens refreshed successfully');
});

// ─── Get Me ───────────────────────────────────────────────────────────────────
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);

  return successResponse(res, { user }, MESSAGES.SUCCESS);
});

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = catchAsync(async (req: Request, res: Response) => {
  await authService.changePassword(req.user!.id, req.body);

  return successResponse(res, null, 'Password changed successfully. Please login again.');
});

// ─── Logout All Devices ────────────────────────────────────────────────────────
export const logoutAll = catchAsync(async (req: Request, res: Response) => {
  await authService.logoutAll(req.user!.id);

  return successResponse(res, null, 'Logged out from all devices successfully.');
});
