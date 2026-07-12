import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { profileService } from '../services/profile.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.user!.id);
  return successResponse(res, { profile }, MESSAGES.SUCCESS);
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await profileService.updateProfile(req.user!.id, req.body);
  return successResponse(res, { profile }, 'Profile updated successfully');
});

export const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const summary = await profileService.getDashboardSummary(req.user!.id);
  return successResponse(res, { summary }, MESSAGES.SUCCESS);
});
