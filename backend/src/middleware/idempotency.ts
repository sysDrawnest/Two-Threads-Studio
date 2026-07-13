import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../prisma';
import { HTTP_STATUS } from '../constants/httpStatus';
import logger from '../lib/logger';

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
    }

    // 1. Compute requestHash based on client-controlled body parameters and userId
    const fingerprintPayload = {
      userId,
      shippingAddressId: req.body.shippingAddressId,
      billingAddressId: req.body.billingAddressId,
      paymentMethod: req.body.paymentMethod || 'ONLINE',
      notes: req.body.notes || '',
      couponCode: req.body.couponCode || '',
      couponDiscount: req.body.couponDiscount || 0,
      promotionId: req.body.promotionId || '',
      couponType: req.body.couponType || '',
    };

    const requestHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprintPayload))
      .digest('hex');

    // 2. Extract key from headers, or fallback to auto-generated key from hash
    const rawKey = req.headers['x-idempotency-key'] as string | undefined;
    const key = rawKey || `auto-${requestHash}`;

    // 3. Lookup in DB
    const existing = await prisma.idempotencyKey.findUnique({
      where: { key },
    });

    if (existing) {
      // Clean up expired key
      if (new Date() > existing.expiresAt) {
        await prisma.idempotencyKey.delete({ where: { key } }).catch(() => {});
      } else {
        // If hash matches, return cached response
        if (existing.requestHash === requestHash) {
          logger.info({ key, userId }, 'Idempotency hit: Returning cached response');
          return res.status(existing.responseStatus).json(existing.responseBody);
        } else {
          // Conflict: Same key used with different payload
          logger.warn({ key, userId }, 'Idempotency conflict: Key used with different request hash');
          return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: 'Conflict: Idempotency key already exists with a different payload.',
          });
        }
      }
    }

    // 4. Intercept res.json to capture response body and store it in database
    const originalJson = res.json;
    res.json = function (body: any): Response {
      res.json = originalJson;

      if (res.statusCode >= 200 && res.statusCode < 300) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes cache
        prisma.idempotencyKey
          .create({
            data: {
              key,
              userId,
              requestHash,
              responseStatus: res.statusCode,
              responseBody: body,
              expiresAt,
            },
          })
          .then(() => {
            originalJson.call(res, body);
          })
          .catch((err) => {
            logger.error({ err, key }, 'Failed to save idempotency response');
            originalJson.call(res, body);
          });
        return res;
      }

      return originalJson.call(this, body);
    };

    next();
  } catch (error) {
    logger.error({ error }, 'Error in idempotency middleware');
    next(error);
  }
};
