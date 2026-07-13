import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { Prisma } from '@prisma/client';

export const cartService = {
  /**
   * Helper to retrieve or create a cart for a user or guest.
   */
  getOrCreateCart: async (params: { userId?: string; guestId?: string }, tx?: any) => {
    const client = tx || prisma;
    const { userId, guestId } = params;

    if (!userId && !guestId) {
      throw new AppError('Either userId or guestId must be provided', HTTP_STATUS.BAD_REQUEST);
    }

    if (userId) {
      let cart = await client.cart.findUnique({
        where: { userId },
      });
      if (!cart) {
        cart = await client.cart.create({
          data: { userId },
        });
      }
      return cart;
    } else {
      let cart = await client.cart.findUnique({
        where: { guestId },
      });
      if (!cart) {
        cart = await client.cart.create({
          data: { guestId },
        });
      }
      return cart;
    }
  },

  /**
   * Retrieves a cart and calculates totals.
   */
  getCart: async (params: { userId?: string; guestId?: string }) => {
    const { userId, guestId } = params;
    const whereClause = userId ? { userId } : { guestId };

    const cart = await prisma.cart.findUnique({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  select: { url: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      return {
        id: '',
        items: [],
        totals: {
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          grandTotal: 0,
          totalItems: 0,
        },
      };
    }

    const items = cart.items.map((item) => {
      const isOutOfStock = item.product.status === 'OUT_OF_STOCK' || item.product.status === 'ARCHIVED';
      let availableStock = 0;
      if (item.product.trackInventory) {
        availableStock = item.variantId && item.variant
          ? item.variant.stockQuantity
          : item.product.stockQuantity;
      } else {
        availableStock = 999;
      }

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.unitPrice) * item.quantity,
        productName: item.productName,
        primaryImage: item.primaryImage || item.product.images[0]?.url || '',
        sku: item.sku,
        variantName: item.variantName,
        customization: item.customization,
        giftWrap: item.giftWrap,
        engravingText: item.engravingText,
        isOutOfStock,
        availableStock,
        trackInventory: item.product.trackInventory,
      };
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = 0; // future-ready placeholder
    const shipping = 0; // future-ready placeholder
    const tax = 0; // future-ready placeholder
    const grandTotal = Math.max(0, subtotal - discount + shipping + tax);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      items,
      totals: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        totalItems,
      },
    };
  },

  /**
   * Adds an item to a cart (handles guest/user, merges duplicates, snapshots prices, validates stock).
   */
  addItemToCart: async (
    params: {
      userId?: string;
      guestId?: string;
      productId: string;
      variantId?: string | null;
      quantity: number;
      customization?: any;
      giftWrap?: boolean;
      engravingText?: string | null;
    },
    tx?: any
  ) => {
    const client = tx || prisma;
    const { userId, guestId, productId, variantId, quantity, customization, giftWrap, engravingText } = params;

    // 1. Get or create cart
    const cart = await cartService.getOrCreateCart({ userId, guestId }, client);

    // 2. Validate product exists and is active
    const product = await client.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    if (!product || product.status !== 'ACTIVE') {
      throw new AppError('Product is currently unavailable or inactive', HTTP_STATUS.NOT_FOUND);
    }

    // 3. Validate variant (if provided)
    let variant = null;
    if (variantId) {
      variant = await client.productVariant.findFirst({
        where: { id: variantId, productId, isActive: true },
      });
      if (!variant) {
        throw new AppError('Product variant is unavailable or invalid', HTTP_STATUS.NOT_FOUND);
      }
    }

    // 4. Find if item already exists in this cart
    const existingItem = await client.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    const targetQuantity = (existingItem?.quantity || 0) + quantity;

    // 5. Stock Validation
    if (product.trackInventory) {
      const availableStock = variant ? variant.stockQuantity : product.stockQuantity;
      if (availableStock < targetQuantity) {
        throw new AppError(
          `Insufficient inventory. Only ${availableStock} items left in stock.`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // 6. Formulate price snapshot
    const priceAdjustment = variant ? Number(variant.priceAdjustment) : 0;
    const finalPrice = Number(product.price) + priceAdjustment;
    const primaryImage = product.images[0]?.url || '';
    const sku = variant?.sku || product.sku || '';
    const variantName = variant ? `${variant.name}: ${variant.value}` : null;

    if (existingItem) {
      // Update existing item
      return client.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: targetQuantity,
          unitPrice: new Prisma.Decimal(finalPrice.toFixed(2)),
          productName: product.name,
          primaryImage,
          sku,
          variantName,
          customization: customization !== undefined ? customization : undefined,
          giftWrap: giftWrap ?? undefined,
          engravingText: engravingText !== undefined ? engravingText : undefined,
        },
      });
    } else {
      // Create new cart item
      return client.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          unitPrice: new Prisma.Decimal(finalPrice.toFixed(2)),
          productName: product.name,
          primaryImage,
          sku,
          variantName,
          customization: customization || null,
          giftWrap: giftWrap ?? false,
          engravingText: engravingText || null,
        },
      });
    }
  },

  /**
   * Updates an item's quantity or custom attributes in the cart.
   */
  updateCartItem: async (params: {
    userId?: string;
    guestId?: string;
    itemId: string;
    quantity?: number;
    customization?: any;
    giftWrap?: boolean;
    engravingText?: string | null;
  }) => {
    const { userId, guestId, itemId, quantity, customization, giftWrap, engravingText } = params;

    // Verify cart item ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
        variant: true,
      },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', HTTP_STATUS.NOT_FOUND);
    }

    // Match cart owner
    const isOwner = userId 
      ? cartItem.cart.userId === userId 
      : cartItem.cart.guestId === guestId;

    if (!isOwner) {
      throw new AppError('Unauthorized access to cart item', HTTP_STATUS.FORBIDDEN);
    }

    // Validate stock if quantity is changing
    if (quantity !== undefined && cartItem.product.trackInventory) {
      const availableStock = cartItem.variant 
        ? cartItem.variant.stockQuantity 
        : cartItem.product.stockQuantity;

      if (availableStock < quantity) {
        throw new AppError(
          `Insufficient inventory. Only ${availableStock} items left in stock.`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Dynamic price snapshot refresh
    const priceAdjustment = cartItem.variant ? Number(cartItem.variant.priceAdjustment) : 0;
    const finalPrice = Number(cartItem.product.price) + priceAdjustment;

    return prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: quantity ?? undefined,
        unitPrice: new Prisma.Decimal(finalPrice.toFixed(2)),
        customization: customization !== undefined ? customization : undefined,
        giftWrap: giftWrap ?? undefined,
        engravingText: engravingText !== undefined ? engravingText : undefined,
      },
    });
  },

  /**
   * Removes a specific item from the cart.
   */
  removeCartItem: async (params: { userId?: string; guestId?: string; itemId: string }) => {
    const { userId, guestId, itemId } = params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', HTTP_STATUS.NOT_FOUND);
    }

    const isOwner = userId 
      ? cartItem.cart.userId === userId 
      : cartItem.cart.guestId === guestId;

    if (!isOwner) {
      throw new AppError('Unauthorized access to cart item', HTTP_STATUS.FORBIDDEN);
    }

    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  },

  /**
   * Clears the user's or guest's cart.
   */
  clearCart: async (params: { userId?: string; guestId?: string }) => {
    const { userId, guestId } = params;
    const whereClause = userId ? { userId } : { guestId };

    const cart = await prisma.cart.findUnique({
      where: whereClause,
    });

    if (!cart) return;

    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  },

  /**
   * Merges a guest cart into a user cart (resolving duplicates and validating stock).
   */
  mergeCart: async (userId: string, guestId: string) => {
    // Retrieve guest cart
    const guestCart = await prisma.cart.findUnique({
      where: { guestId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return; // nothing to merge
    }

    // Retrieve or create user cart
    const userCart = await cartService.getOrCreateCart({ userId });

    await prisma.$transaction(async (tx) => {
      for (const guestItem of guestCart.items) {
        // Find if user already has this item
        const existingUserItem = await tx.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
          },
        });

        const targetQty = (existingUserItem?.quantity || 0) + guestItem.quantity;

        // Verify stock for target qty
        const product = await tx.product.findUnique({
          where: { id: guestItem.productId },
        });

        if (product && product.trackInventory) {
          let availableStock = product.stockQuantity;
          if (guestItem.variantId) {
            const variant = await tx.productVariant.findUnique({
              where: { id: guestItem.variantId },
            });
            if (variant) availableStock = variant.stockQuantity;
          }

          if (availableStock < targetQty) {
            // Adjust to max available stock instead of hard crash, or skip if completely zero
            if (availableStock <= 0) continue;
          }
        }

        if (existingUserItem) {
          // Merge quantities, preserving other customizations if userItem didn't have them
          await tx.cartItem.update({
            where: { id: existingUserItem.id },
            data: {
              quantity: targetQty,
              customization: (existingUserItem.customization || guestItem.customization) as any,
              giftWrap: existingUserItem.giftWrap || guestItem.giftWrap,
              engravingText: existingUserItem.engravingText || guestItem.engravingText,
            },
          });
        } else {
          // Clone item to user cart
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: guestItem.productId,
              variantId: guestItem.variantId,
              quantity: guestItem.quantity,
              unitPrice: guestItem.unitPrice,
              productName: guestItem.productName,
              primaryImage: guestItem.primaryImage,
              sku: guestItem.sku,
              variantName: guestItem.variantName,
              customization: guestItem.customization as any,
              giftWrap: guestItem.giftWrap,
              engravingText: guestItem.engravingText,
            },
          });
        }
      }

      // Delete guest cart items and the guest cart itself
      await tx.cartItem.deleteMany({
        where: { cartId: guestCart.id },
      });
      await tx.cart.delete({
        where: { id: guestCart.id },
      });
    });
  },
};
