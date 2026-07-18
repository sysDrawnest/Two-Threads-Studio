import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { productService } from '../services/product.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

// ─── Public Endpoints ─────────────────────────────────────────────────────────

export const listProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.listProducts(req.query as any);
  return successResponse(res, result, MESSAGES.SUCCESS);
});

export const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(String(req.params.slug));
  return successResponse(res, { product }, MESSAGES.SUCCESS);
});

export const getFeaturedProducts = catchAsync(async (_req: Request, res: Response) => {
  const products = await productService.getFeaturedProducts();
  return successResponse(res, { products }, MESSAGES.SUCCESS);
});

export const getNewArrivals = catchAsync(async (_req: Request, res: Response) => {
  const products = await productService.getNewArrivals();
  return successResponse(res, { products }, MESSAGES.SUCCESS);
});

export const getBestSellers = catchAsync(async (_req: Request, res: Response) => {
  const products = await productService.getBestSellers();
  return successResponse(res, { products }, MESSAGES.SUCCESS);
});

export const getHomepageData = catchAsync(async (_req: Request, res: Response) => {
  const result = await productService.getHomepageData();
  return successResponse(res, result, MESSAGES.SUCCESS);
});

// ─── Admin Endpoints ──────────────────────────────────────────────────────────

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(String(req.params.id));
  return successResponse(res, { product }, MESSAGES.SUCCESS);
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  return successResponse(res, { product }, MESSAGES.CREATED, HTTP_STATUS.CREATED);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(String(req.params.id), req.body);
  return successResponse(res, { product }, MESSAGES.UPDATED);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(String(req.params.id));
  return successResponse(res, null, MESSAGES.DELETED);
});

export const patchProductStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.patchStatus(String(req.params.id), req.body);
  return successResponse(res, result, 'Product status updated');
});

export const patchProductInventory = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.patchInventory(String(req.params.id), req.body);
  return successResponse(res, result, 'Inventory updated');
});
