import { Request, Response, NextFunction } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { AppError } from '../utils/AppError';

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const wishlist = await wishlistService.listWishlist(userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return next(error);
  }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const wishlist = await wishlistService.addToWishlist(userId, productId);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId as string;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    await wishlistService.removeFromWishlist(userId, productId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product removed from wishlist.',
    });
  } catch (error) {
    return next(error);
  }
};

export const clearWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    await wishlistService.clearWishlist(userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Wishlist cleared successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const moveToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId as string;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    await wishlistService.moveToCart(userId, productId, req.body);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product moved to cart successfully.',
    });
  } catch (error) {
    return next(error);
  }
};
