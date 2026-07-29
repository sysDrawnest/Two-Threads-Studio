#  Phase 7.2: Promotions & Coupon Engine

## Overview
Phase 7.2 builds a flexible, enterprise-grade **Promotions & Coupon Engine** for Two Threads Studio. It decouples promotion rules, strategy evaluation, conflict resolution, and usage tracking into a dedicated subsystem.

### Key Capabilities
1. **15+ Coupon Strategies**: Percentage, Fixed Amount, Free Shipping, Buy X Get Y (BXGY), Category Discount, Collection Discount, Product Discount, First Order, Birthday, VIP, Referral, Flash Sale.
2. **Flexible Rule Builder Data Models**:
   - `Coupon`, `Promotion`, `PromotionRule`, `PromotionCondition`, `PromotionAction`, `CouponUsage`.
   - Constraints: Expiry, Start Date, Min Cart Value, Max Discount Cap, Customer Tiers, Category/Collection/Product Eligibility, Usage Limit, Per-User Limit, Stackable vs Exclusive, Priority.
3. **Dedicated Promotions Engine (`backend/src/engines/PromotionsEngine.ts`)**:
   - Central evaluator for validating coupons and automatic promotions against cart/checkout items.
   - Priority sorting, conflict resolution (Exclusive vs Stackable), and line-item discount allocation.
4. **Integration with Central Pricing Engine**:
   - Integrates seamlessly into `PricingEngine.calculateTotals()` so server totals automatically reflect verified coupon and automatic promotion discounts.
5. **Public & Internal Coupon REST Endpoints**:
   - Apply Coupon (`POST /api/v1/coupons/apply`)
   - Remove Coupon (`POST /api/v1/coupons/remove`)
   - Validate Coupon (`POST /api/v1/coupons/validate`)
   - Available Promotions for Cart (`GET /api/v1/coupons/available`)

---

## Technical Architecture & Database Models (`backend/prisma/schema.prisma`)

```
                         ┌──────────────────────────────────┐
                         │       Public Coupon Endpoints    │
                         │      (apply, remove, validate)   │
                         └────────────────┬─────────────────┘
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │        Promotions Engine         │
                         │ (Strategy, Priority, Stacking)   │
                         └────────────────┬─────────────────┘
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │      Central Pricing Engine      │
                         │ (Subtotal, Promo, Ship, GST, COD)│
                         └──────────────────────────────────┘
```

### Database Models Additions

1. **`PromotionType` Enum**:
   `PERCENTAGE`, `FIXED`, `FREE_SHIPPING`, `BUY_X_GET_Y`, `CATEGORY_DISCOUNT`, `COLLECTION_DISCOUNT`, `PRODUCT_DISCOUNT`, `FIRST_ORDER`, `VIP`, `FLASH_SALE`

2. **`Coupon`**:
   - `id`, `code` (unique, uppercase), `title`, `description`, `type` (`PromotionType`)
   - `discountValue` (Decimal), `maxDiscountAmount` (Decimal?), `minCartSubtotal` (Decimal @default(0))
   - `usageLimit` (Int?), `perUserLimit` (Int @default(1)), `usedCount` (Int @default(0))
   - `startDate` (DateTime), `endDate` (DateTime?)
   - `isStackable` (Boolean @default(false)), `isExclusive` (Boolean @default(false)), `isActive` (Boolean @default(true))
   - `eligibleCategories` (String[]), `eligibleCollections` (String[]), `eligibleProducts` (String[]), `eligibleCustomerTiers` (String[])
   - Audit: `createdAt`, `updatedAt`, `deletedAt`

3. **`Promotion`**:
   - `id`, `name`, `description`, `type` (`PromotionType`), `priority` (Int @default(0))
   - `isActive` (Boolean @default(true)), `isAutomatic` (Boolean @default(true))
   - `startDate` (DateTime), `endDate` (DateTime?)

4. **`PromotionRule`**:
   - `id`, `promotionId`, `ruleName`, `conditions` (Json), `actions` (Json)

5. **`CouponUsage`**:
   - `id`, `couponId`, `userId` (optional), `orderId` (optional), `cartId` (optional)
   - `discountAmount` (Decimal), `usedAt` (DateTime @default(now()))

---

## Proposed Changes

### Backend Components

#### 1. Schema & Prisma Migration
- Add `PromotionType`, `Coupon`, `Promotion`, `PromotionRule`, and `CouponUsage` to `schema.prisma`.
- Run `npx prisma db push` and `npx prisma generate`.

#### 2. Promotions Engine (`backend/src/engines/PromotionsEngine.ts`)
- Implements:
  - `validateCoupon(code, userId, cartItems, subtotal)`
  - `calculateDiscount(coupon, cartItems, subtotal)`
  - Handles Percentage, Fixed, Free Shipping, Category/Collection/Product, and First Order rules.
  - Enforces Min Cart Subtotal, Max Discount Cap, Expiry, Usage Limit, and Per-User Limit.

#### 3. Central Pricing Engine Integration (`backend/src/engines/PricingEngine.ts`)
- Updates `PricingEngine.calculateTotals()` to accept `couponCode` and integrate `PromotionsEngine` discount calculation into the grand total breakdown:
  - `Subtotal` -> `- Coupon Discount` -> `+ Shipping` -> `+ GST` -> `+ COD` -> `Grand Total`

#### 4. Checkout Session & Service Update (`backend/src/services/checkout.service.ts`)
- Extends `CheckoutSession` to persist `couponCode` and update server pricing snapshots dynamically when coupons are applied or removed.

#### 5. Public Coupon Controller & Routes (`backend/src/controllers/coupon.controller.ts` & `backend/src/routes/coupon.routes.ts`)
- REST APIs:
  - `POST /api/v1/coupons/apply`: Validate and apply coupon to active checkout session.
  - `POST /api/v1/coupons/remove`: Remove applied coupon from checkout session.
  - `POST /api/v1/coupons/validate`: Real-time coupon validity check.
  - `GET /api/v1/coupons/available`: List applicable promotions for current cart.

---

### Frontend Components

#### 1. Coupon Hooks (`frontend/src/hooks/useCoupons.ts`)
- React Query mutations for applying and removing coupons with optimistic updates to checkout summaries.

#### 2. Storefront Coupon Component & Checkout UI (`frontend/src/components/commerce/CouponInput.tsx`)
- Interactive Coupon widget with real-time feedback, active coupon tags, discount badges, and instant order summary recalculation.

---

## Verification Plan

### Automated Tests
- Typecheck backend (`npx tsc --noEmit`).
- Build frontend (`npm run build`).
- Create `backend/src/scripts/test_promotions_engine_72.ts` to verify:
  1. Percentage coupon discount calculation with Max Discount Cap.
  2. Fixed amount coupon discount calculation with Min Cart Subtotal validation.
  3. Free shipping coupon logic.
  4. Expiry, usage limit, and per-user limit enforcement.
  5. Applying and removing coupons on active Checkout Sessions.

### Manual Verification
- Test applying valid coupon (`WELCOME10`, `ARTISAN500`, `FREESHIP`).
- Test applying expired or invalid coupon; verify clean error feedback.
- Verify sticky Order Summary updates in real-time.
