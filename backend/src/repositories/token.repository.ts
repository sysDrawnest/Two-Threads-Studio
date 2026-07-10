import prisma from '../prisma';

export const tokenRepository = {
  create: async (data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
  }) => {
    return prisma.refreshToken.create({ data });
  },

  findByHash: async (tokenHash: string) => {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  },

  revoke: async (id: string): Promise<void> => {
    await prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllByUserId: async (userId: string): Promise<void> => {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  deleteExpired: async (): Promise<void> => {
    await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },
};
