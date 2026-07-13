import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { invoiceService } from '../services/invoice.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { AppError } from '../utils/AppError';
import { OrderStatus, PaymentStatus, AuditActorType } from '@prisma/client';
import { eventDispatcher, OrderEvents } from '../events';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const order = await orderService.createOrder(userId, req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await orderService.getCustomerOrders(userId, page, limit);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const order = await orderService.getCustomerOrderById(id, userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    const { reason } = req.body;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const order = await orderService.cancelOrder(id, userId, reason);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order cancelled successfully.',
      order,
    });
  } catch (error) {
    return next(error);
  }
};

export const downloadInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;
    if (!userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const order = await orderService.getCustomerOrderById(id, userId);
    const pdfBytes = await invoiceService.generateInvoicePdf(order);

    // Emit INVOICE_VIEWED event post-render
    eventDispatcher
      .emit(OrderEvents.INVOICE_VIEWED, {
        orderId: order.id,
        userId,
        actorType: req.user?.role === 'ADMIN' ? AuditActorType.ADMIN : AuditActorType.CUSTOMER,
        details: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      })
      .catch(() => {});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice_${order.orderNumber}.pdf"`);
    return res.status(HTTP_STATUS.OK).end(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
};

// --- Admin Controllers ---

export const adminListOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as OrderStatus | undefined;
    const paymentStatus = req.query.paymentStatus as PaymentStatus | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await orderService.adminListOrders({ status, paymentStatus }, page, limit);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};

export const adminGetOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const order = await orderService.adminGetOrderById(id);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(error);
  }
};

export const adminUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const adminId = req.user?.id;
    if (!adminId) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    const { status, note } = req.body;
    const order = await orderService.adminUpdateStatus(id, adminId, status as OrderStatus, note);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order status updated successfully.',
      order,
    });
  } catch (error) {
    return next(error);
  }
};

export const adminUpdateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { note } = req.body;
    const order = await orderService.adminUpdateNote(id, note);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order internal notes updated successfully.',
      order,
    });
  } catch (error) {
    return next(error);
  }
};
