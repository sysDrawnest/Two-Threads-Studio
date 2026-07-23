# Phase 6A — Admin Commerce Platform
## Backend Implementation Plan

---

## Overview

This document covers all backend work required to support the Phase 6A Admin Commerce Platform. The existing backend is well-architected with a clean layered architecture (Routes → Controllers → Services → Repositories → Prisma). Phase 6A requires **no Prisma schema changes** and **no JWT or auth changes**. It requires extending existing admin endpoints and adding new analytics, inventory management, and user management endpoints.

---

## Current Backend State

### Existing Admin APIs (Phase 5A–5C)
| Endpoint | Status |
|---|---|
| `GET /api/v1/admin/orders` | ✅ Exists |
| `GET /api/v1/admin/orders/:id` | ✅ Exists |
| `PATCH /api/v1/admin/orders/:id/status` | ✅ Exists |
| `PATCH /api/v1/admin/orders/:id/note` | ✅ Exists |
| `GET /api/v1/admin/payments` | ✅ Exists |
| `POST /api/v1/admin/payments/:paymentId/refund` | ✅ Exists |
| `POST /api/v1/admin/payments/orders/:orderId/ship` | ✅ Exists |
| `PATCH /api/v1/admin/payments/orders/:orderId/ship/mark-shipped` | ✅ Exists |
| `PATCH /api/v1/admin/payments/orders/:orderId/ship/mark-delivered` | ✅ Exists |
| `GET /api/v1/admin/risk/dashboard` | ✅ Exists |
| `GET /api/v1/admin/risk/customers` | ✅ Exists |
| `PATCH /api/v1/admin/risk/customers/:userId/block` | ✅ Exists |
| `PATCH /api/v1/admin/risk/customers/:userId/notes` | ✅ Exists |
| `GET /api/v1/admin/risk/review-queue` | ✅ Exists |
| `POST /api/v1/admin/risk/review-queue/:orderId/approve` | ✅ Exists |
| `POST /api/v1/admin/risk/review-queue/:orderId/reject` | ✅ Exists |
| `GET /api/v1/admin/risk/fraud-flags` | ✅ Exists |
| `PATCH /api/v1/admin/risk/fraud-flags/:flagId/resolve` | ✅ Exists |
| `PUT /api/v1/admin/risk/return-policies/:productId` | ✅ Exists |
| `GET /api/v1/products` (admin-aware) | ✅ Exists |
| `POST /api/v1/products` | ✅ Exists |
| `PUT /api/v1/products/:id` | ✅ Exists |
| `DELETE /api/v1/products/:id` | ✅ Exists |
| `PATCH /api/v1/products/:id/status` | ✅ Exists |
| `PATCH /api/v1/products/:id/inventory` | ✅ Exists |

### Missing APIs (Need to Build)
| Endpoint | Purpose |
|---|---|
| `GET /api/v1/admin/dashboard` | Main dashboard KPIs |
| `GET /api/v1/admin/customers` | Paginated customer list |
| `GET /api/v1/admin/customers/:id` | Customer detail with full history |
| `PATCH /api/v1/admin/customers/:id/status` | Activate/deactivate customer |
| `GET /api/v1/admin/analytics/revenue` | Revenue chart data |
| `GET /api/v1/admin/analytics/orders` | Orders analytics |
| `GET /api/v1/admin/analytics/products` | Top products |
| `GET /api/v1/admin/inventory` | Inventory overview |
| `GET /api/v1/admin/reviews` | Review moderation queue |
| `PATCH /api/v1/admin/reviews/:id` | Approve/reject review |

---

## New Endpoints to Build

### 1. Admin Dashboard Controller
**File:** `backend/src/controllers/admin.controller.ts`

```typescript
// GET /api/v1/admin/dashboard
// Returns:
{
  revenue: { today, thisWeek, thisMonth, allTime },
  orders: { today, pending, confirmed, processing, shipped, delivered, cancelled },
  customers: { total, newToday, newThisWeek },
  inventory: { lowStock: Product[], outOfStock: Product[] },
  riskAlerts: { manualReview, fraudFlags, blocked },
  recentOrders: Order[],
  recentCustomers: User[],
}
```

### 2. Admin Customers Controller
**File:** `backend/src/controllers/admin.controller.ts` (extend)

```typescript
// GET /api/v1/admin/customers?page=1&limit=20&search=&isBlocked=
// Returns: paginated user list with risk profile

// GET /api/v1/admin/customers/:id
// Returns: full user profile with orders, risk, addresses

// PATCH /api/v1/admin/customers/:id/status
// Body: { isActive: boolean }
```

### 3. Analytics Controller
**File:** `backend/src/controllers/analytics.controller.ts`

```typescript
// GET /api/v1/admin/analytics/revenue?startDate=&endDate=&groupBy=day|week|month
// GET /api/v1/admin/analytics/orders?startDate=&endDate=
// GET /api/v1/admin/analytics/products?limit=10
```

### 4. Inventory Controller
**File:** `backend/src/controllers/inventory.controller.ts`

```typescript
// GET /api/v1/admin/inventory
// Returns: products with stock status, reserved, low stock flags

// PATCH /api/v1/admin/inventory/:productId
// Body: { adjustment: number, reason: string }
```

### 5. Reviews Controller
**File:** `backend/src/controllers/review.controller.ts`

```typescript
// GET /api/v1/admin/reviews?status=PENDING|APPROVED|REJECTED&page=1
// PATCH /api/v1/admin/reviews/:id
// Body: { status: 'APPROVED' | 'REJECTED', isVerified?: boolean }
```

---

## New Routes

```
backend/src/routes/admin.routes.ts  (new consolidated admin router)
```

The route file will mount all admin controllers under `/admin/*` with `requireAuth + requireRole(ADMIN)` middleware applied at the router level.

---

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `src/controllers/admin.controller.ts` | CREATE | Dashboard + Customer management |
| `src/controllers/analytics.controller.ts` | CREATE | Revenue/order analytics |
| `src/controllers/inventory.controller.ts` | CREATE | Inventory management |
| `src/controllers/review.controller.ts` | CREATE | Review moderation |
| `src/routes/admin.routes.ts` | CREATE | Consolidated admin router |
| `src/routes/index.ts` | MODIFY | Mount new admin routes |

---

## Security
- All new admin routes use existing `requireAuth + requireRole(Role.ADMIN)` middleware
- No changes to JWT configuration
- All mutations get Zod validation via existing `validate()` middleware

---

## Data Strategy
- **Dashboard**: Aggregate queries via `prisma.$transaction` for atomicity
- **Analytics**: Date-range grouping via raw Prisma queries
- **No caching** in Phase 6A — add Redis caching in Phase 7 if needed

---

## Verification
- `npm run build` must pass with 0 TypeScript errors
- All endpoints tested via curl/test scripts before frontend integration
