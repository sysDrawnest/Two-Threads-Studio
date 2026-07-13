import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { cartService } from './cart.service';
import type { MoveToCartDto } from '../validators/wishlist.validator';

export const wishlistService = {
  /**
   * Retrieves wishlist items with primary product images.
   */
  listWishlist: async (userId: string) => {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              select: { id: true, url: true, altText: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format products nicely for UI consumption
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        comparePrice: item.product.comparePrice,
        status: item.product.status,
        type: item.product.type,
        badge: item.product.badge,
        primaryImage: item.product.images[0]?.url || null,
        primaryImageAlt: item.product.images[0]?.altText || null,
      },
    }));
  },

  /**
   * Adds an active product to the wishlist.
   */
  addToWishlist: async (userId: string, productId: string) => {
    // Validate product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'ACTIVE') {
      throw new AppError('Product not found or unavailable', HTTP_STATUS.NOT_FOUND);
    }

    // Check if already wishlisted
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return existing; // idempotent success
    }

    return prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
  },

  /**
   * Removes a product from the wishlist.
   */
  removeFromWishlist: async (userId: string, productId: string) => {
    // Delete record if it exists
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existing) {
      throw new AppError('Wishlist item not found', HTTP_STATUS.NOT_FOUND);
    }

    return prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  },

  /**
   * Clears the user's wishlist.
   */
  clearWishlist: async (userId: string) => {
    return prisma.wishlist.deleteMany({
      where: { userId },
    });
  },

  /**
   * Moves a wishlisted product to the cart.
   */
  moveToCart: async (userId: string, productId: string, options?: MoveToCartDto) => {
    // Check if product is in wishlist
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!wishlistItem) {
      throw new AppError('Product is not in your wishlist', HTTP_STATUS.NOT_FOUND);
    }

    // Perform atomic moving
    return prisma.$transaction(async (tx) => {
      // 1. Add item to the user's cart (passing user context)
      await cartService.addItemToCart({
        userId,
        productId,
        variantId: options?.variantId || null,
        quantity: options?.quantity ?? 1,
        customization: options?.customization || null,
        giftWrap: options?.giftWrap ?? false,
        engravingText: options?.engravingText || null,
      }, tx);

      // 2. Remove from wishlist
      await tx.wishlist.delete({
        where: {
          userId_productId: { userId, productId },
        },
      });
    });
  },
};
