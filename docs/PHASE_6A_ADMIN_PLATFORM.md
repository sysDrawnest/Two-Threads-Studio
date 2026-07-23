# Phase 6A: Admin Commerce Platform Documentation

## Overview
The **Two Threads Studio Admin Commerce Platform** is an enterprise-grade administrative OS built on top of **React 19 + Vite + TypeScript**, **Tailwind CSS**, **Zustand**, **TanStack React Query**, and a **Prisma + PostgreSQL** backend.

---

## Architecture & Subsystems

```
Two Threads Studio Admin Platform
 ├── Phase 6A.1 — Admin Foundation & Catalog Management
 │    ├── Layout & Navigation (Sidebar, TopBar, Breadcrumbs, Mobile Bottom Nav)
 │    ├── Dashboard & Overview (KPIs, Recent Activity, Quick Actions)
 │    ├── Product Information Management (PIM) (CRUD, Bulk Actions, Media, Variants)
 │    ├── Category Management (CRUD, Sorting, Visibility)
 │    └── Collection Management (CRUD, Banner Media, Sorting)
 │
 └── Phase 6A.2 — Commerce Operations
      ├── Order Operations (Status Transitions, Invoices, Packing Slips, Refund Engine)
      ├── Customer CRM (Profiles, LTV Tracking, Address Book, Risk Blocking)
      ├── Review Moderation (Approve/Reject, Verification, Rating Filters)
      └── Inventory Control (Stock Adjustments, Low Stock Tracking, Threshold Alerts)
```

---

## Phase 6A.1: Admin Foundation & Catalog Management

### 1. Protected Admin Layout & Navigation
- **Security & Authorization**: Protected by `<ProtectedRoute requireAdmin />` which verifies JWT token payload and `ADMIN` role.
- **Sidebar & TopBar**: Responsive drawer layout with theme switcher (Light/Dark mode) and quick search.
- **Breadcrumb Navigation**: Dynamic path breadcrumbs for multi-level admin flows.

### 2. Product Information Management (PIM)
- **Catalog Management**: Full CRUD operations for physical & digital goods.
- **Variants & Media**: Multi-image support, primary image sorting, variant SKU & stock mapping.
- **Metadata**: Support for handmade flags, eco-friendly badges, GST/tax classes, HSN codes, and homepage section assignments.

### 3. Category & Collection Management
- **Categories (`/admin/categories`)**: Manage main & secondary categories, sort ordering, and storefront visibility.
- **Collections (`/admin/collections`)**: Manage curated and seasonal collections, hero banner images, and product assignments.

---

## Phase 6A.2: Commerce Operations

### 1. Order Operations (`/admin/orders`)
- **Order Lifecycle Management**: Status transitions across `PENDING` → `PROCESSING` → `HANDCRAFTING` → `SHIPPED` → `DELIVERED`.
- **Fulfillment Timeline**: Visual timeline component (`AdminTimeline`) rendering real-time order progress.
- **Invoices & Packing Slips**: Printable invoice and packing slip view with native window print styling.
- **Refund Engine**: Integrated refund modal triggering Razorpay refund execution (`POST /api/v1/admin/payments/:paymentId/refund`).

### 2. Customer CRM (`/admin/customers`)
- **Customer Profiles**: Aggregated customer details including total orders and calculated Lifetime Value (LTV).
- **Address Book**: Full record of billing & shipping addresses.
- **Account Control**: Account activation/deactivation and customer blocking with reason logging.

### 3. Review Moderation (`/admin/reviews`)
- **Moderation Queue**: Review verification workflow approving user-submitted reviews for public display (`isVerified: true`) or hiding inappropriate reviews.
- **Filters**: Filter reviews by rating threshold and verification status.

### 4. Inventory Control (`/admin/inventory`)
- **Stock Tracking**: Real-time stock quantity monitoring and low-stock threshold triggers.
- **Manual Stock Adjustments**: Modal for stock adjustments (+ / -) with audit log reason selection (e.g., New Shipment, Damaged Goods, Audit Correction).

---

## Database Schemas & API Reference

### Key Endpoints
| Resource | Route | Method | Access |
|---|---|---|---|
| Dashboard | `/api/v1/admin/dashboard` | `GET` | Admin |
| Products List | `/api/v1/products/admin` | `GET` | Admin |
| Category CRUD | `/api/v1/categories` | `GET/POST/PUT/DELETE` | Public / Admin |
| Collection CRUD | `/api/v1/collections` | `GET/POST/PUT/DELETE` | Public / Admin |
| Order Status Update | `/api/v1/admin/orders/:id/status` | `PATCH` | Admin |
| Refund Process | `/api/v1/admin/payments/:paymentId/refund` | `POST` | Admin |
| Stock Adjustment | `/api/v1/admin/inventory/:productId` | `PATCH` | Admin |
| Review Moderation | `/api/v1/admin/reviews/:id/approve` | `PATCH` | Admin |

---

## Summary
The Admin Commerce Platform is fully operational, hardened, and ready for production store operations.
