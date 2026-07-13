import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { AppError } from '../utils/AppError';

/**
 * Extracts userId or guestId context from the request.
 */
const getCartContext = (req: Request) => {
  const userId = req.user?.id;
  const guestId = (req.headers['x-guest-id'] as string) || (req.query.guestId as string);
  return { userId, guestId };
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = getCartContext(req);
    const cart = await cartService.getCart(ctx);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      cart,
    });
  } catch (error) {
    return next(error);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = getCartContext(req);
    const item = await cartService.addItemToCart({
      ...ctx,
      productId: req.body.productId,
      variantId: req.body.variantId,
      quantity: req.body.quantity,
      customization: req.body.customization,
      giftWrap: req.body.giftWrap,
      engravingText: req.body.engravingText,
    });
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      item,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = getCartContext(req);
    const id = req.params.id as string;
    const item = await cartService.updateCartItem({
      ...ctx,
      itemId: id,
      quantity: req.body.quantity,
      customization: req.body.customization,
      giftWrap: req.body.giftWrap,
      engravingText: req.body.engravingText,
    });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      item,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = getCartContext(req);
    const id = req.params.id as string;
    await cartService.removeCartItem({
      ...ctx,
      itemId: id,
    });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item removed from cart.',
    });
  } catch (error) {
    return next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = getCartContext(req);
    await cartService.clearCart(ctx);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart cleared successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const mergeCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { guestId } = req.body;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    await cartService.mergeCart(userId, guestId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Guest cart merged successfully.',
    });
  } catch (error) {
    return next(error);
  }
};
