import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { categoryService } from '../services/category.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

// ─── Public ───────────────────────────────────────────────────────────────────

export const listCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAll();
  return successResponse(res, { categories }, MESSAGES.SUCCESS);
});

export const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getBySlug(String(req.params.slug));
  return successResponse(res, { category }, MESSAGES.SUCCESS);
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body);
  return successResponse(res, { category }, MESSAGES.CREATED, HTTP_STATUS.CREATED);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.update(String(req.params.id), req.body);
  return successResponse(res, { category }, MESSAGES.UPDATED);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.delete(String(req.params.id));
  return successResponse(res, null, MESSAGES.DELETED);
});
