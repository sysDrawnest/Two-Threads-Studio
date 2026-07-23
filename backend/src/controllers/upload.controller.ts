import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { uploadService } from '../services/upload.service';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const getUploadStatus = catchAsync(async (_req: Request, res: Response) => {
  const status = uploadService.isConfigured();
  return successResponse(res, status, 'Upload status fetched successfully');
});

export const uploadSingleImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No image file provided in request', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await uploadService.uploadFile(req.file);
  return successResponse(res, result, 'Image uploaded successfully', HTTP_STATUS.CREATED);
});

export const uploadMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new AppError('No image files provided in request', HTTP_STATUS.BAD_REQUEST);
  }

  const uploadPromises = files.map((file) => uploadService.uploadFile(file));
  const results = await Promise.all(uploadPromises);

  return successResponse(res, { images: results }, 'Images uploaded successfully', HTTP_STATUS.CREATED);
});
