import { Request, Response, NextFunction } from 'express';
import { returnService } from '../services/return.service';
import { paymentService } from '../services/payment.service';
import { HTTP_STATUS } from '../constants/httpStatus';

const successResponse = (res: Response, data: any, message = 'Success', status = HTTP_STATUS.OK) =>
  res.status(status).json({ success: true, message, ...data });

export const returnController = {
  adminListReturns: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, fraudFlagged, autoApproved, startDate, endDate, search, page, limit } = req.query;
      const result = await returnService.listReturnRequests({
        status: status as any,
        fraudFlagged: fraudFlagged === 'true' ? true : fraudFlagged === 'false' ? false : undefined,
        autoApproved: autoApproved === 'true' ? true : autoApproved === 'false' ? false : undefined,
        startDate: typeof startDate === 'string' ? startDate : undefined,
        endDate: typeof endDate === 'string' ? endDate : undefined,
        search: typeof search === 'string' ? search : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  adminGetReturn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const result = await returnService.getReturnRequest(returnId);
      return successResponse(res, { returnRequest: result });
    } catch (err) {
      next(err);
    }
  },

  adminReturnAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const result = await returnService.getReturnAnalytics(
        typeof startDate === 'string' ? startDate : undefined,
        typeof endDate === 'string' ? endDate : undefined
      );
      return successResponse(res, { analytics: result });
    } catch (err) {
      next(err);
    }
  },

  adminApproveReturn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const result = await returnService.approveReturn(
        returnId,
        req.user!.id,
        req.body
      );
      return successResponse(res, { returnRequest: result }, 'Return approved successfully');
    } catch (err) {
      next(err);
    }
  },

  adminRejectReturn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      await returnService.rejectReturn(returnId, req.user!.id, req.body.note);
      return successResponse(res, {}, 'Return rejected');
    } catch (err) {
      next(err);
    }
  },

  adminMarkPickedUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const result = await returnService.markPickedUp(returnId, req.user!.id);
      return successResponse(res, { returnRequest: result }, 'Marked as picked up');
    } catch (err) {
      next(err);
    }
  },

  adminMarkReceived: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const result = await returnService.markReceived(returnId, req.user!.id);
      return successResponse(res, { returnRequest: result }, 'Package received at warehouse');
    } catch (err) {
      next(err);
    }
  },

  adminRecordInspection: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const { passed, disposition, note, adjustedAmount } = req.body;
      await returnService.recordInspection(returnId, req.user!.id, {
        passed,
        disposition: disposition as any,
        note,
        adjustedAmount,
      });
      return successResponse(res, {}, passed ? 'Inspection passed — refund processing' : 'Inspection failed');
    } catch (err) {
      next(err);
    }
  },

  adminSchedulePickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const result = await returnService.scheduleReturnPickup(
        returnId,
        req.user!.id,
        req.body
      );
      return successResponse(res, { returnRequest: result }, 'Reverse pickup scheduled successfully');
    } catch (err) {
      next(err);
    }
  },

  adminUpdateTracking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnId = req.params['returnId'] as string;
      const result = await returnService.updateReturnTracking(returnId, req.body);
      return successResponse(res, { returnRequest: result }, 'Tracking status updated');
    } catch (err) {
      next(err);
    }
  },

  adminRetryRefund: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refundId = req.params['refundId'] as string;
      const result = await paymentService.retryRefund(refundId, req.user!.id);
      return successResponse(res, { refund: result }, 'Refund retry initiated successfully');
    } catch (err) {
      next(err);
    }
  },

  adminSyncRefund: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refundId = req.params['refundId'] as string;
      const result = await paymentService.syncRefundStatus(refundId);
      return successResponse(res, { refund: result }, 'Refund status synced successfully');
    } catch (err) {
      next(err);
    }
  },

  adminManualOverrideRefund: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refundId = req.params['refundId'] as string;
      const { reason } = req.body;
      const result = await paymentService.manualOverrideRefund(refundId, req.user!.id, reason);
      return successResponse(res, { refund: result }, 'Refund overridden successfully');
    } catch (err) {
      next(err);
    }
  },
};
