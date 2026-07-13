import prisma from '../prisma';
import { Order, OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

export const orderRepository = {
  create: async (data: Prisma.OrderCreateInput, tx?: any) => {
    const client = tx || prisma;
    return client.order.create({
      data,
      include: {
        items: true,
        statusHistory: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });
  },

  findById: async (id: string, userId?: string) => {
    const where: Prisma.OrderWhereUniqueInput = userId ? { id, userId } : { id };
    return prisma.order.findUnique({
      where,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  },

  findByOrderNumber: async (orderNumber: string, userId?: string) => {
    const where: Prisma.OrderWhereInput = userId ? { orderNumber, userId } : { orderNumber };
    return prisma.order.findFirst({
      where,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  },

  findByUser: async (userId: string, skip = 0, take = 10) => {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        items: true,
        statusHistory: true,
      },
    });
  },

  countByUser: async (userId: string) => {
    return prisma.order.count({
      where: { userId },
    });
  },

  findAll: async (filters: { status?: OrderStatus; paymentStatus?: PaymentStatus }, skip = 0, take = 10) => {
    const where: Prisma.OrderWhereInput = {};
    if (filters.status) where.orderStatus = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;

    return prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  countAll: async (filters: { status?: OrderStatus; paymentStatus?: PaymentStatus }) => {
    const where: Prisma.OrderWhereInput = {};
    if (filters.status) where.orderStatus = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;

    return prisma.order.count({ where });
  },

  updateStatus: async (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus, tx?: any) => {
    const client = tx || prisma;
    const data: Prisma.OrderUpdateInput = { orderStatus: status };
    if (paymentStatus) {
      data.paymentStatus = paymentStatus;
    }
    return client.order.update({
      where: { id: orderId },
      data,
    });
  },

  updateNote: async (orderId: string, notes: string, tx?: any) => {
    const client = tx || prisma;
    return client.order.update({
      where: { id: orderId },
      data: { notes },
    });
  },

  addStatusHistory: async (
    orderId: string,
    previousStatus: OrderStatus | null,
    newStatus: OrderStatus,
    changedBy: string,
    note?: string,
    tx?: any
  ) => {
    const client = tx || prisma;
    return client.orderStatusHistory.create({
      data: {
        orderId,
        previousStatus,
        newStatus,
        changedBy,
        note,
      },
    });
  },
};
