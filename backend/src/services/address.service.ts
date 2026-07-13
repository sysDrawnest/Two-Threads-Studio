import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import type { CreateAddressDto, UpdateAddressDto } from '../validators/address.validator';

export const addressService = {
  /**
   * Retrieves all non-deleted addresses for a user.
   */
  listAddresses: async (userId: string) => {
    return prisma.address.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [
        { isDefaultShipping: 'desc' },
        { isDefaultBilling: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  },

  /**
   * Creates a new address for a user.
   */
  createAddress: async (userId: string, dto: CreateAddressDto) => {
    // Check if user has other active addresses
    const count = await prisma.address.count({
      where: {
        userId,
        deletedAt: null,
      },
    });

    // If it is the user's first address, default both shipping and billing to true
    let isDefaultShipping = dto.isDefaultShipping ?? false;
    let isDefaultBilling = dto.isDefaultBilling ?? false;
    if (count === 0) {
      isDefaultShipping = true;
      isDefaultBilling = true;
    }

    return prisma.$transaction(async (tx) => {
      // Clear other default shipping if this one is default
      if (isDefaultShipping) {
        await tx.address.updateMany({
          where: { userId, isDefaultShipping: true },
          data: { isDefaultShipping: false },
        });
      }

      // Clear other default billing if this one is default
      if (isDefaultBilling) {
        await tx.address.updateMany({
          where: { userId, isDefaultBilling: true },
          data: { isDefaultBilling: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          fullName: dto.fullName,
          phone: dto.phone,
          company: dto.company || null,
          line1: dto.line1,
          line2: dto.line2 || null,
          city: dto.city,
          district: dto.district || null,
          state: dto.state,
          country: dto.country,
          postalCode: dto.postalCode,
          landmark: dto.landmark || null,
          type: dto.type,
          isDefaultShipping,
          isDefaultBilling,
        },
      });
    });
  },

  /**
   * Updates an existing address.
   */
  updateAddress: async (userId: string, addressId: string, dto: UpdateAddressDto) => {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
        deletedAt: null,
      },
    });

    if (!address) {
      throw new AppError('Address not found or unauthorized', HTTP_STATUS.NOT_FOUND);
    }

    const isDefaultShipping = dto.isDefaultShipping;
    const isDefaultBilling = dto.isDefaultBilling;

    return prisma.$transaction(async (tx) => {
      if (isDefaultShipping) {
        await tx.address.updateMany({
          where: { userId, isDefaultShipping: true },
          data: { isDefaultShipping: false },
        });
      }

      if (isDefaultBilling) {
        await tx.address.updateMany({
          where: { userId, isDefaultBilling: true },
          data: { isDefaultBilling: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          fullName: dto.fullName ?? undefined,
          phone: dto.phone ?? undefined,
          company: dto.company !== undefined ? (dto.company || null) : undefined,
          line1: dto.line1 ?? undefined,
          line2: dto.line2 !== undefined ? (dto.line2 || null) : undefined,
          city: dto.city ?? undefined,
          district: dto.district !== undefined ? (dto.district || null) : undefined,
          state: dto.state ?? undefined,
          country: dto.country ?? undefined,
          postalCode: dto.postalCode ?? undefined,
          landmark: dto.landmark !== undefined ? (dto.landmark || null) : undefined,
          type: dto.type ?? undefined,
          isDefaultShipping,
          isDefaultBilling,
        },
      });
    });
  },

  /**
   * Soft deletes an address.
   */
  deleteAddress: async (userId: string, addressId: string) => {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
        deletedAt: null,
      },
    });

    if (!address) {
      throw new AppError('Address not found or unauthorized', HTTP_STATUS.NOT_FOUND);
    }

    return prisma.$transaction(async (tx) => {
      // Soft delete
      const updated = await tx.address.update({
        where: { id: addressId },
        data: {
          deletedAt: new Date(),
          isDefaultShipping: false,
          isDefaultBilling: false,
        },
      });

      // If we deleted a default address, pick the next available active address to be default
      if (address.isDefaultShipping || address.isDefaultBilling) {
        const nextAddress = await tx.address.findFirst({
          where: {
            userId,
            deletedAt: null,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (nextAddress) {
          await tx.address.update({
            where: { id: nextAddress.id },
            data: {
              isDefaultShipping: address.isDefaultShipping ? true : undefined,
              isDefaultBilling: address.isDefaultBilling ? true : undefined,
            },
          });
        }
      }

      return updated;
    });
  },

  /**
   * Sets default status for an address.
   */
  setDefaultAddress: async (userId: string, addressId: string, type: 'shipping' | 'billing' | 'both') => {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
        deletedAt: null,
      },
    });

    if (!address) {
      throw new AppError('Address not found or unauthorized', HTTP_STATUS.NOT_FOUND);
    }

    const setShipping = type === 'shipping' || type === 'both';
    const setBilling = type === 'billing' || type === 'both';

    return prisma.$transaction(async (tx) => {
      if (setShipping) {
        await tx.address.updateMany({
          where: { userId, isDefaultShipping: true },
          data: { isDefaultShipping: false },
        });
      }

      if (setBilling) {
        await tx.address.updateMany({
          where: { userId, isDefaultBilling: true },
          data: { isDefaultBilling: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          isDefaultShipping: setShipping ? true : undefined,
          isDefaultBilling: setBilling ? true : undefined,
        },
      });
    });
  },
};
