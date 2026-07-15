/**
 * Shipment Repository
 *
 * All database access for the Shipment model.
 */

import prisma from '../prisma';
import { Shipment, ShipmentStatus, Prisma } from '@prisma/client';

export const shipmentRepository = {
  create: async (data: Prisma.ShipmentCreateInput): Promise<Shipment> => {
    return prisma.shipment.create({ data });
  },

  findByOrderId: async (orderId: string): Promise<Shipment | null> => {
    return prisma.shipment.findUnique({ where: { orderId } });
  },

  findById: async (id: string): Promise<Shipment | null> => {
    return prisma.shipment.findUnique({ where: { id } });
  },

  updateStatus: async (
    id: string,
    status: ShipmentStatus,
    extra?: Partial<{
      trackingNumber: string;
      carrier: string;
      labelUrl: string;
      estimatedDelivery: Date;
      shippedAt: Date;
      deliveredAt: Date;
    }>,
    tx?: Prisma.TransactionClient
  ): Promise<Shipment> => {
    const client = tx || prisma;
    return client.shipment.update({
      where: { id },
      data: { status, ...(extra || {}) },
    });
  },

  findAll: async (
    filters: { status?: ShipmentStatus },
    skip = 0,
    take = 10
  ): Promise<Shipment[]> => {
    const where: Prisma.ShipmentWhereInput = {};
    if (filters.status) where.status = filters.status;
    return prisma.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            shippingAddress: true,
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });
  },

  countAll: async (filters: { status?: ShipmentStatus }): Promise<number> => {
    const where: Prisma.ShipmentWhereInput = {};
    if (filters.status) where.status = filters.status;
    return prisma.shipment.count({ where });
  },
};
