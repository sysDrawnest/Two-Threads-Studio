/**
 * Checkout Service — Phase 7.1
 * Manages CheckoutSession lifecycle, address linking, shipping method selection,
 * delivery ETAs, and server-authoritative pricing.
 */

import prisma from '../prisma';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { pricingEngine } from '../engines/PricingEngine';
import { deliveryEtaEngine } from '../engines/DeliveryEtaEngine';
import {
  CreateCheckoutSessionDto,
  UpdateCheckoutCustomerDto,
  UpdateCheckoutAddressDto,
  UpdateCheckoutShippingDto,
} from '../validators/checkout.validator';


export const checkoutService = {
  /**
   * Initializes default shipping methods in database if none exist.
   */
  ensureDefaultShippingMethods: async () => {
    const count = await prisma.shippingMethod.count();
    if (count === 0) {
      await prisma.shippingMethod.createMany({
        data: [
          {
            name: 'Standard Courier',
            code: 'STANDARD',
            description: 'Standard insured delivery across India',
            basePrice: 60,
            minOrderForFree: 500,
            estDispatchDays: 1,
            estDeliveryDays: 4,
            priority: 10,
            isEnabled: true,
          },
          {
            name: 'Express Air Shipping',
            code: 'EXPRESS',
            description: 'Priority air express delivery with real-time tracking',
            basePrice: 150,
            minOrderForFree: 2500,
            estDispatchDays: 1,
            estDeliveryDays: 2,
            priority: 20,
            isEnabled: true,
          },
          {
            name: 'Studio Handpick (Bhubaneswar)',
            code: 'STORE_PICKUP',
            description: 'Pick up directly from our artisan studio workspace',
            basePrice: 0,
            minOrderForFree: 0,
            estDispatchDays: 0,
            estDeliveryDays: 1,
            priority: 5,
            isEnabled: true,
          },
        ],
      });
    }
  },

  /**
   * Creates or resumes an active CheckoutSession.
   */
  getOrCreateSession: async (
    userId: string,
    sessionTokenInput?: string
  ) => {
    await checkoutService.ensureDefaultShippingMethods();

    // 1. If existing active sessionToken passed, return active session
    if (sessionTokenInput) {
      const existing = await prisma.checkoutSession.findUnique({
        where: { sessionToken: sessionTokenInput },
        include: { shippingMethod: true },
      });

      if (existing && existing.status === 'ACTIVE' && existing.expiresAt > new Date()) {
        return existing;
      }
    }

    // 2. Fetch user's cart items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty. Add items before proceeding to checkout.', HTTP_STATUS.BAD_REQUEST);
    }

    // 3. Find default shipping method
    const defaultShipping = await prisma.shippingMethod.findFirst({
      where: { isEnabled: true },
      orderBy: { priority: 'desc' },
    });

    // 4. Calculate initial server pricing
    const pricing = await pricingEngine.calculateTotals({
      items: cart.items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      shippingMethodId: defaultShipping?.id,
    });

    // 5. Build session token and expiration (2 hours)
    const sessionToken = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: { where: { deletedAt: null } } },
    });

    if (!user) {
      throw new AppError('User account not found.', HTTP_STATUS.NOT_FOUND);
    }

    const userEmail = user.email;
    const userPhone = user.phone || undefined;
    const userName = `${user.firstName} ${user.lastName}`.trim();
    let defaultShippingAddressId: string | undefined;

    const defaultAddr = user.addresses.find((a) => a.isDefaultShipping) || user.addresses[0];
    if (defaultAddr) {
      defaultShippingAddressId = defaultAddr.id;
    }

    const session = await prisma.checkoutSession.create({
      data: {
        sessionToken,
        userId,
        isGuest: false,
        customerEmail: userEmail,
        customerPhone: userPhone || null,
        customerName: userName || null,
        shippingAddressId: defaultShippingAddressId || null,
        billingAddressId: defaultShippingAddressId || null,
        shippingMethodId: defaultShipping?.id || null,
        step: 'INFORMATION',
        pricingSnapshot: pricing as any,
        status: 'ACTIVE',
        expiresAt,
      },
      include: { shippingMethod: true },
    });

    return session;
  },

  /**
   * Updates customer contact information on checkout session.
   */
  updateCustomerInfo: async (sessionToken: string, dto: UpdateCheckoutCustomerDto) => {
    const session = await prisma.checkoutSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new AppError('Checkout session expired or invalid.', HTTP_STATUS.NOT_FOUND);
    }

    const updated = await prisma.checkoutSession.update({
      where: { sessionToken },
      data: {
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        customerName: dto.customerName,
        step: 'SHIPPING',
      },
      include: { shippingMethod: true },
    });

    return updated;
  },

  /**
   * Updates shipping and billing address selections on checkout session.
   */
  updateAddresses: async (sessionToken: string, dto: UpdateCheckoutAddressDto) => {
    const session = await prisma.checkoutSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new AppError('Checkout session expired or invalid.', HTTP_STATUS.NOT_FOUND);
    }

    // Verify shipping address exists
    const shippingAddr = await prisma.address.findUnique({
      where: { id: dto.shippingAddressId },
    });

    if (!shippingAddr) {
      throw new AppError('Shipping address not found.', HTTP_STATUS.NOT_FOUND);
    }

    const billingAddressId = dto.billingSameAsShipping
      ? dto.shippingAddressId
      : dto.billingAddressId || dto.shippingAddressId;

    const updated = await prisma.checkoutSession.update({
      where: { sessionToken },
      data: {
        shippingAddressId: dto.shippingAddressId,
        billingAddressId,
        step: 'SHIPPING',
      },
      include: { shippingMethod: true },
    });

    return updated;
  },

  /**
   * Updates shipping method on checkout session and recalculates server pricing & ETAs.
   */
  updateShippingMethod: async (sessionToken: string, dto: UpdateCheckoutShippingDto) => {
    const session = await prisma.checkoutSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new AppError('Checkout session expired or invalid.', HTTP_STATUS.NOT_FOUND);
    }

    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id: dto.shippingMethodId },
    });

    if (!shippingMethod || !shippingMethod.isEnabled) {
      throw new AppError('Invalid or disabled shipping method.', HTTP_STATUS.BAD_REQUEST);
    }

    // Recalculate server pricing with new shipping method
    const cart = session.userId
      ? await prisma.cart.findUnique({ where: { userId: session.userId }, include: { items: true } })
      : null;

    if (cart && cart.items.length > 0) {
      const pricing = await pricingEngine.calculateTotals({
        items: cart.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingMethodId: dto.shippingMethodId,
        paymentMethod: session.paymentMethod as any,
      });

      const updated = await prisma.checkoutSession.update({
        where: { sessionToken },
        data: {
          shippingMethodId: dto.shippingMethodId,
          step: 'PAYMENT',
          pricingSnapshot: pricing as any,
        },
        include: { shippingMethod: true },
      });

      return updated;
    }

    const updated = await prisma.checkoutSession.update({
      where: { sessionToken },
      data: {
        shippingMethodId: dto.shippingMethodId,
        step: 'PAYMENT',
      },
      include: { shippingMethod: true },
    });

    return updated;
  },

  /**
   * Applies coupon to active checkout session and updates server pricing snapshot.
   */
  applyCoupon: async (sessionToken: string, code: string) => {
    const session = await prisma.checkoutSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new AppError('Checkout session expired or invalid.', HTTP_STATUS.NOT_FOUND);
    }

    const cart = session.userId
      ? await prisma.cart.findUnique({ where: { userId: session.userId }, include: { items: true } })
      : null;

    const cartItems = cart?.items || [];
    if (cartItems.length === 0) {
      throw new AppError('Cart is empty. Add items before applying coupons.', HTTP_STATUS.BAD_REQUEST);
    }

    // Verify coupon validity and calculate new pricing
    const pricing = await pricingEngine.calculateTotals({
      items: cartItems.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      shippingMethodId: session.shippingMethodId,
      paymentMethod: session.paymentMethod as any,
      couponCode: code,
      userId: session.userId,
    });

    const updated = await prisma.checkoutSession.update({
      where: { sessionToken },
      data: {
        couponCode: code.trim().toUpperCase(),
        pricingSnapshot: pricing as any,
      },
      include: { shippingMethod: true },
    });

    return { session: updated, pricing };
  },

  /**
   * Removes applied coupon from checkout session.
   */
  removeCoupon: async (sessionToken: string) => {
    const session = await prisma.checkoutSession.findUnique({
      where: { sessionToken },
    });

    if (!session || session.status !== 'ACTIVE') {
      throw new AppError('Checkout session expired or invalid.', HTTP_STATUS.NOT_FOUND);
    }

    const cart = session.userId
      ? await prisma.cart.findUnique({ where: { userId: session.userId }, include: { items: true } })
      : null;

    const cartItems = cart?.items || [];
    const pricing = await pricingEngine.calculateTotals({
      items: cartItems.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      shippingMethodId: session.shippingMethodId,
      paymentMethod: session.paymentMethod as any,
      couponCode: null,
      userId: session.userId,
    });

    const updated = await prisma.checkoutSession.update({
      where: { sessionToken },
      data: {
        couponCode: null,
        pricingSnapshot: pricing as any,
      },
      include: { shippingMethod: true },
    });

    return { session: updated, pricing };
  },

  /**
   * Gets live server-authoritative checkout summary (items, prices, ETAs, shipping methods).
   */
  getCheckoutSummary: async (sessionToken: string, userId: string) => {
    const session = await checkoutService.getOrCreateSession(userId, sessionToken);

    // Fetch active cart items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const cartItems = cart?.items || [];

    // 1. Calculate live server pricing including coupon
    const pricing = await pricingEngine.calculateTotals({
      items: cartItems.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      shippingMethodId: session.shippingMethodId,
      paymentMethod: session.paymentMethod as any,
      couponCode: session.couponCode,
      userId: session.userId,
    });

    // 2. Calculate live delivery ETAs
    const eta = await deliveryEtaEngine.calculateEta(session.shippingMethodId);

    // 3. Fetch available shipping methods
    const availableShippingMethods = await prisma.shippingMethod.findMany({
      where: { isEnabled: true },
      orderBy: { priority: 'desc' },
    });

    // 4. Fetch selected shipping and billing address objects
    const [shippingAddress, billingAddress] = await Promise.all([
      session.shippingAddressId
        ? prisma.address.findUnique({ where: { id: session.shippingAddressId } })
        : null,
      session.billingAddressId
        ? prisma.address.findUnique({ where: { id: session.billingAddressId } })
        : null,
    ]);

    return {
      session: {
        id: session.id,
        sessionToken: session.sessionToken,
        step: session.step,
        isGuest: session.isGuest,
        customerEmail: session.customerEmail,
        customerPhone: session.customerPhone,
        customerName: session.customerName,
        shippingAddressId: session.shippingAddressId,
        billingAddressId: session.billingAddressId,
        shippingMethodId: session.shippingMethodId,
        couponCode: session.couponCode,
        paymentMethod: session.paymentMethod,
        expiresAt: session.expiresAt,
      },
      pricing,
      eta,
      availableShippingMethods,
      shippingAddress,
      billingAddress,
    };
  },
};

