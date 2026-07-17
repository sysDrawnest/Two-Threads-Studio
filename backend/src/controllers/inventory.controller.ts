/**
 * Inventory Controller — Phase 6A
 * Stock overview and manual inventory adjustments
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const inventoryController = {
  // ── Inventory overview ────────────────────────────────────────────────────
  listInventory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
      const limit = Math.min(100, parseInt(req.query['limit'] as string) || 30);
      const search = (req.query['search'] as string) || '';
      const stockFilter = req.query['stock'] as string | undefined; // 'low' | 'out' | 'healthy'
      const categoryId = req.query['categoryId'] as string | undefined;

      const skip = (page - 1) * limit;

      const where: any = { trackInventory: true };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (categoryId) where.categoryId = categoryId;

      if (stockFilter === 'out') {
        where.stockQuantity = 0;
      } else if (stockFilter === 'low') {
        where.AND = [
          { stockQuantity: { gt: 0 } },
          { stockQuantity: { lte: prisma.product.fields.lowStockThreshold } },
        ];
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ stockQuantity: 'asc' }, { name: 'asc' }],
          select: {
            id: true,
            name: true,
            sku: true,
            stockQuantity: true,
            lowStockThreshold: true,
            status: true,
            trackInventory: true,
            category: { select: { id: true, name: true } },
            images: {
              where: { isPrimary: true },
              select: { url: true, altText: true },
              take: 1,
            },
            variants: {
              select: { id: true, name: true, value: true, stockQuantity: true, sku: true },
              where: { isActive: true },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      // Compute stock status for each product
      const enriched = products.map(p => ({
        ...p,
        primaryImage: p.images[0]?.url || null,
        images: undefined,
        stockStatus:
          p.stockQuantity === 0
            ? 'OUT_OF_STOCK'
            : p.stockQuantity <= p.lowStockThreshold
            ? 'LOW_STOCK'
            : 'IN_STOCK',
      }));

      // Summary counts
      const [outOfStockCount, lowStockCount] = await Promise.all([
        prisma.product.count({ where: { trackInventory: true, stockQuantity: 0 } }),
        prisma.product.count({
          where: {
            trackInventory: true,
            stockQuantity: { gt: 0 },
          },
        }),
      ]);

      return successResponse(res, {
        products: enriched,
        summary: {
          outOfStock: outOfStockCount,
          tracked: total,
        },
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  },

  // ── Adjust stock ──────────────────────────────────────────────────────────
  adjustStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params['productId'] as string;
      const { adjustment, reason, variantId } = req.body;

      if (typeof adjustment !== 'number' || !Number.isInteger(adjustment)) {
        throw new AppError('adjustment must be an integer', HTTP_STATUS.BAD_REQUEST);
      }

      if (variantId) {
        // Adjust variant stock
        const variant = await prisma.productVariant.findFirst({
          where: { id: variantId, productId },
        });
        if (!variant) throw new AppError('Variant not found', HTTP_STATUS.NOT_FOUND);

        const newQty = Math.max(0, variant.stockQuantity + adjustment);
        const updated = await prisma.productVariant.update({
          where: { id: variantId },
          data: { stockQuantity: newQty },
        });

        return successResponse(res, {
          variantId,
          previousQuantity: variant.stockQuantity,
          newQuantity: newQty,
          adjustment,
          reason,
        }, 'Variant stock adjusted');
      } else {
        // Adjust product stock
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { id: true, name: true, stockQuantity: true, trackInventory: true },
        });
        if (!product) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);

        if (!product.trackInventory) {
          throw new AppError('This product does not track inventory', HTTP_STATUS.BAD_REQUEST);
        }

        const newQty = Math.max(0, product.stockQuantity + adjustment);
        await prisma.product.update({
          where: { id: productId },
          data: {
            stockQuantity: newQty,
            status: newQty === 0 ? 'OUT_OF_STOCK' : 'ACTIVE',
          },
        });

        return successResponse(res, {
          productId,
          productName: product.name,
          previousQuantity: product.stockQuantity,
          newQuantity: newQty,
          adjustment,
          reason,
        }, 'Stock adjusted successfully');
      }
    } catch (err) {
      next(err);
    }
  },
};
