#  Phase 7.3: Admin Promotions Platform

## Overview
Phase 7.3 implements the **Admin Promotions Platform**, creating a dedicated, production-grade workspace for the marketing and operations teams to manage coupons, automatic campaigns, and rules.

### Key Capabilities
1. **Coupon & Promotion PIM Dashboard**: Search, filter, paginated lists, bulk activation/deactivation, and cloning of campaigns.
2. **Interactive Rule Builder**: Setting eligible categories, collections, specific products, customer tiers, usage caps, per-user limits, and stackability settings.
3. **Analytics Integration**: Tracking real-time redemptions, total discount spend, average checkout savings, and campaign ROI.
4. **Zod API Schema Validation**: Hardened validation for coupon creation, schedules, and discount calculations.

---

## Technical Architecture & Database Models

```
                   ┌─────────────────────────────────────────┐
                   │    Admin Promotion Controller (CRUD)    │
                   └───────────────────┬─────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
  ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
  │    Coupon CRUD    │      │  Promotion CRUD   │      │Promo Analytics API│
  │ (List/Create/Edit)│      │  (Auto Rules)     │      │ (ROI/Redemption)  │
  └───────────────────┘      └───────────────────┘      └───────────────────┘
```

---

## Proposed Changes

### Backend Components

#### 1. Zod Validation Schemas (`backend/src/validators/admin-promotion.validator.ts`)
- Schema `createCouponAdminSchema` and `updateCouponAdminSchema` enforcing constraints:
  - `code`: Alphanumeric, uppercase, min 3 characters.
  - `type`: Enum `PERCENTAGE`, `FIXED`, `FREE_SHIPPING`, `CATEGORY_DISCOUNT`, `COLLECTION_DISCOUNT`, `PRODUCT_DISCOUNT`, `FIRST_ORDER`, `VIP`, `FLASH_SALE`.
  - `discountValue`: Positive decimal value.
  - `maxDiscountAmount`: Optional positive decimal.
  - `minCartSubtotal`: Decimal >= 0.
  - `usageLimit`: Optional positive integer.
  - `perUserLimit`: Positive integer (default 1).
  - `startDate`, `endDate`: Valid schedule ranges.
  - `eligibleCategories`, `eligibleCollections`, `eligibleProducts`, `eligibleCustomerTiers`: Optional arrays of strings.

#### 2. Admin Promotion Controller (`backend/src/controllers/admin-promotion.controller.ts`)
- Controller actions:
  - `listCoupons`: Paginated search & filter by status, type, and dates.
  - `getCoupon`: Retrieve detailed coupon view + total discount generated + redemption lists.
  - `createCoupon`: Create new coupon with validation.
  - `updateCoupon`: Edit existing coupon configuration.
  - `deleteCoupon`: Permanently delete coupon.
  - `cloneCoupon`: Quick-clone coupon parameters into a new draft.
  - `toggleCouponActive`: Quick active status switch.
  - `getPromotionAnalytics`: Summary metrics (Total coupons active, total discounts applied, unique users reached, revenue influenced).

#### 3. Mount Admin Routes (`backend/src/routes/admin.routes.ts`)
- Mount the promotion controller endpoints under `/admin/coupons` and `/admin/promotions` with authentication & admin role protection.

---

### Frontend Components

#### 1. Admin Service API Wrapper (`frontend/src/services/adminService.ts`)
- Add methods for admin coupons CRUD:
  - `listCouponsAdmin`, `getCouponAdmin`, `createCouponAdmin`, `updateCouponAdmin`, `deleteCouponAdmin`, `cloneCouponAdmin`, `toggleCouponActiveAdmin`, `getCouponAnalyticsAdmin`.

#### 2. React Query Hooks (`frontend/src/hooks/useAdminPromotions.ts` or `frontend/src/hooks/useAdminData.ts`)
- Add hooks `useAdminCoupons`, `useAdminCouponDetail`, `useCreateCoupon`, `useUpdateCoupon`, `useDeleteCoupon`, `useCloneCoupon`, `useToggleCouponActive`, `useCouponAnalytics`.

#### 3. Coupons Management View (`frontend/src/pages/admin/CouponsManagement.tsx`)
- Beautiful admin list view using Two Threads Studio dark-mode aesthetic.
- Includes quick-toggle switches, code search, status filtering, redemption rate progress bars, and cloning buttons.

#### 4. Coupon Form & Rule Builder (`frontend/src/pages/admin/CouponForm.tsx`)
- Comprehensive builder form supporting:
  - Base configuration (Code, Title, Type, Discount Value).
  - Limits & Thresholds (Min Cart Subtotal, Max Cap, Usage Limits).
  - Dynamic Rule Targeting (Category lists, Collection lists, Product lists).
  - Date & Schedule selectors.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` in backend to ensure type-safety.
- Run `npm run build` in frontend to ensure zero compilation or bundler errors.
- Write diagnostic script `backend/src/scripts/test_admin_promotions_73.ts` verifying all CRUD endpoints, clone mechanics, validation rejections, and analytics calculations.

### Manual Verification
- Log in as Admin and navigate to the new **Promotions / Coupons** management workspace.
- Create a new percentage coupon targeting specific categories.
- Edit, toggle active status, and clone it.
- Verify the cloned coupon appears instantly in the list.
- Apply the newly created coupon at storefront checkout; verify it reduces cart totals correctly on the server.
