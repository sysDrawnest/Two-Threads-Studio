/**
 * Payment Repository
 *
 * All database access for the Payment model.
 * Services call this — never access Prisma directly from controllers.
 */

import prisma from '../prisma';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';

export const paymentRepository = {
  create: async (data: Prisma.PaymentCreateInput): Promise<Payment> => {
    return prisma.payment.create({ data });
  },

  findByOrderId: async (orderId: string): Promise<Payment | null> => {
    return prisma.payment.findUnique({ where: { orderId } });
  },

  findByProviderOrderId: async (providerOrderId: string): Promise<Payment | null> => {
    return prisma.payment.findFirst({ where: { providerOrderId } });
  },

  findByProviderPaymentId: async (providerPaymentId: string): Promise<Payment | null> => {
    return prisma.payment.findUnique({ where: { providerPaymentId } });
  },

  findById: async (id: string): Promise<Payment | null> => {
    return prisma.payment.findUnique({ where: { id } });
  },

  updateStatus: async (
    id: string,
    status: PaymentStatus,
    extra?: Partial<{
      providerPaymentId: string;
      providerSignature: string;
      method: string;
      failureReason: string;
      failureCode: string;
      paidAt: Date;
    }>,
    tx?: Prisma.TransactionClient
  ): Promise<Payment> => {
    const client = tx || prisma;
    return client.payment.update({
      where: { id },
      data: { status, ...(extra || {}) },
    });
  },

  /**
   * Paginated list for admin dashboard
   */
  findAll: async (
    filters: { status?: PaymentStatus },
    skip = 0,
    take = 10
  ): Promise<Payment[]> => {
    const where: Prisma.PaymentWhereInput = {};
    if (filters.status) where.status = filters.status;
    return prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            grandTotal: true,
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });
  },

  countAll: async (filters: { status?: PaymentStatus }): Promise<number> => {
    const where: Prisma.PaymentWhereInput = {};
    if (filters.status) where.status = filters.status;
    return prisma.payment.count({ where });
  },
};
