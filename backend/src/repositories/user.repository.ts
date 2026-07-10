import prisma from '../prisma';
import { Prisma, Role } from '@prisma/client';

export type SafeUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Fields to always exclude from returned user objects
const safeUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  avatarUrl: true,
  role: true,
  isVerified: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
  findByEmail: async (email: string): Promise<SafeUser | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: safeUserSelect,
    });
  },

  findByEmailWithPassword: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      select: { ...safeUserSelect, passwordHash: true },
    });
  },

  findById: async (id: string): Promise<SafeUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  },

  create: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }): Promise<SafeUser> => {
    return prisma.user.create({
      data,
      select: safeUserSelect,
    });
  },

  updateLastLogin: async (id: string): Promise<void> => {
    await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  },

  updatePassword: async (id: string, passwordHash: string): Promise<void> => {
    await prisma.user.update({
      where: { id },
      data: { passwordHash, updatedAt: new Date() },
    });
  },
};
