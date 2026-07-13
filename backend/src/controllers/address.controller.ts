import { Request, Response, NextFunction } from 'express';
import { addressService } from '../services/address.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { AppError } from '../utils/AppError';

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const addresses = await addressService.listAddresses(userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      addresses,
    });
  } catch (error) {
    return next(error);
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const address = await addressService.createAddress(userId, req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      address,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const address = await addressService.updateAddress(userId, id, req.body);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      address,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    await addressService.deleteAddress(userId, id);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Address removed successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    const { type } = req.body;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const address = await addressService.setDefaultAddress(userId, id, type);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      address,
    });
  } catch (error) {
    return next(error);
  }
};
