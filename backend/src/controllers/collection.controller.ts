import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { collectionService } from '../services/collection.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

// ─── Public ───────────────────────────────────────────────────────────────────

export const listCollections = catchAsync(async (_req: Request, res: Response) => {
  const collections = await collectionService.getAll();
  return successResponse(res, { collections }, MESSAGES.SUCCESS);
});

export const getCollectionBySlug = catchAsync(async (req: Request, res: Response) => {
  const collection = await collectionService.getBySlug(String(req.params.slug));
  return successResponse(res, { collection }, MESSAGES.SUCCESS);
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const createCollection = catchAsync(async (req: Request, res: Response) => {
  const collection = await collectionService.create(req.body);
  return successResponse(res, { collection }, MESSAGES.CREATED, HTTP_STATUS.CREATED);
});

export const updateCollection = catchAsync(async (req: Request, res: Response) => {
  const collection = await collectionService.update(String(req.params.id), req.body);
  return successResponse(res, { collection }, MESSAGES.UPDATED);
});

export const deleteCollection = catchAsync(async (req: Request, res: Response) => {
  await collectionService.delete(String(req.params.id));
  return successResponse(res, null, MESSAGES.DELETED);
});
