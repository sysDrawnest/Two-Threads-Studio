# 🧵 Two Threads Studio — Backend Architecture & Tech Stack

> **Status:** Finalized  
> **Version:** 2.0  
> **Last Updated:** July 2026  
> **Overall Rating: 9.7 / 10**

---

## Project Context

Two Threads Studio is a **premium artisan e-commerce + learning platform** built on React 19 + TypeScript. The frontend is 85% complete with zero backend. Core backend requirements:

- Real authentication with custom roles (customer, admin, artisan, corporate)
- PostgreSQL database for relational product/order/user data
- Razorpay payment processing (UPI, cards, EMI — INR-native)
- Admin CRUD for inventory, orders, customers
- Transactional emails for orders and shipping
- Cloudinary-powered image delivery (WebP, CDN, transformations)
- Tutorial video delivery via Cloudflare Stream / Bunny.net

---

## ✅ Final Recommended Stack

| Layer | Technology | Rationale |
|:---|:---|:---|
| **Runtime** | Node.js 20 LTS | TypeScript consistency with frontend |
| **Framework** | Express.js | Lightweight, full control, no migration overhead |
| **Language** | TypeScript | Unified language across the entire stack |
| **Database** | PostgreSQL (via Supabase) | Relational model required for products/orders/users |
| **ORM** | Prisma | Industry-standard TypeScript ORM, typed migrations |
| **Authentication** | Custom JWT + Refresh Tokens + bcrypt | Full ownership, role flexibility, mobile-ready |
| **Validation** | Zod | Request validation + environment variable enforcement |
| **Images** | Cloudinary | Auto WebP/AVIF, CDN, resizing, watermarking |
| **Videos** | Cloudflare Stream or Bunny.net | Learning Studio tutorial delivery |
| **Payments** | Razorpay | UPI, NetBanking, Cards, EMI — India-first |
| **Email** | Resend + React Email | Transactional email with JSX templates |
| **Logging** | Pino | Structured JSON logging for production |
| **Security** | Helmet, CORS, Rate Limiting, Compression | Standard Express hardening |
| **API Docs** | Swagger / OpenAPI | Self-documenting API for long-term maintainability |
| **Deployment** | Railway | Fast CI/CD, clean env management, native Node.js support |
| **Frontend Host** | Vercel | Best-in-class for React SPAs |
| **Monitoring** | Sentry | Error tracking when approaching production |
| **Jobs (future)** | BullMQ + Redis | Async email, image processing, inventory updates |

---

## Architecture Diagram

```
┌──────────────────────┐       ┌────────────────────────────┐
│    Vercel (Frontend) │       │  Railway (Express + TS API) │
│    React 19 SPA      │◄─────►│  JWT Auth · Prisma · Zod   │
│    TailwindCSS       │       │  Pino · Helmet · Swagger    │
└──────────────────────┘       └──────────┬─────────────────┘
                                          │
              ┌───────────────────────────┼──────────────────────┐
              │                           │                      │
  ┌───────────▼────────┐    ┌─────────────▼──────┐   ┌──────────▼────────┐
  │  Supabase          │    │   Cloudinary        │   │  Razorpay         │
  │  PostgreSQL        │    │   Image Storage     │   │  Payment Gateway  │
  │  (via Prisma ORM)  │    │   CDN + Transform   │   │  UPI / Cards / EMI│
  └────────────────────┘    └────────────────────┘   └───────────────────┘
              │
  ┌───────────▼────────┐    ┌────────────────────┐
  │  Resend            │    │  Cloudflare Stream  │
  │  Transactional     │    │  Tutorial Videos    │
  │  Email             │    │  Learning Studio    │
  └────────────────────┘    └────────────────────┘
```

---

## Key Architecture Decisions Explained

### 1. Custom JWT Auth (NOT Supabase Auth)

The original recommendation of Supabase Auth was the convenient but wrong path for this project.

**Why custom JWT is correct here:**

Your frontend already has a custom `AuthContext` with distinct admin vs. customer flows. Your planned user roles include:

- Customer
- Admin
- Artisan
- Corporate Client

Supabase Auth restricts how deeply you can customize token payloads, middleware logic, and role enforcement. Custom JWT gives you:

- Complete control over access and refresh token lifecycles
- Flexible role-based middleware (`isAdmin`, `isArtisan`, `isVerified`)
- Clean migration path to a mobile app with no SDK dependency
- No vendor lock-in on authentication

**Implementation:**

```
PostgreSQL (Supabase)  →  Express  →  bcrypt hash  →  JWT Sign  →  Refresh Token Store
```

Use Supabase only for: **PostgreSQL** and **nothing else from Supabase's auth system.**

---

### 2. Cloudinary (NOT Supabase Storage)

Supabase Storage is a reliable object store, but it has no media intelligence.

For a handcrafted product brand, **the image is the product.** Poor image delivery directly harms conversion.

Cloudinary provides:

- Automatic WebP / AVIF conversion on delivery
- On-the-fly responsive resizing (`w_400,h_400,c_fill`)
- CDN delivery worldwide
- Lazy image delivery
- Watermarking for artisan content protection
- Compression without quality loss

This is not optional for a premium artisan storefront.

---

### 3. Zod for Validation + Environment Enforcement

Never trust frontend input.

Every request body, query param, and route param must be validated before reaching business logic.

```typescript
// Example: Create Order validator
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1),
  shippingAddress: z.object({
    line1: z.string().min(5),
    city: z.string(),
    pincode: z.string().regex(/^\d{6}$/),
    state: z.string(),
  }),
  couponCode: z.string().optional(),
});
```

Also use Zod for **environment validation at startup** — the server should refuse to start if `JWT_SECRET`, `DATABASE_URL`, or `RAZORPAY_KEY_SECRET` are missing:

```typescript
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
  CLOUDINARY_URL: z.string(),
  RESEND_API_KEY: z.string(),
});

export const env = EnvSchema.parse(process.env); // Fails fast if invalid
```

---

### 4. Security Middleware Stack

Every Express production app requires this baseline:

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan'; // or pino-http

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
```

---

## Folder Structure

```text
backend/
├── src/
│   ├── config/          # Database connection, Cloudinary, Razorpay, env
│   ├── middleware/      # Auth guard, role check, error handler, rate limiter
│   ├── routes/          # Express routers by domain
│   ├── controllers/     # Request handlers (thin layer)
│   ├── services/        # Business logic (orders, payments, auth)
│   ├── repositories/    # Prisma query layer (database abstraction)
│   ├── prisma/          # schema.prisma + migrations
│   ├── validators/      # Zod schemas per route
│   ├── utils/           # Helpers (token utils, slug gen, pagination)
│   ├── lib/             # Third-party wrappers (cloudinary.ts, resend.ts)
│   ├── types/           # Shared TypeScript interfaces and enums
│   ├── constants/       # App-wide constants (roles, status enums)
│   ├── emails/          # React Email templates
│   ├── storage/         # Cloudinary upload helpers
│   ├── jobs/            # BullMQ job definitions (future)
│   ├── cron/            # Scheduled tasks (future)
│   └── tests/           # Jest unit + integration tests
├── app.ts               # Express app setup, middleware registration
└── server.ts            # Entry point, env validation, DB connect, listen
```

---

## API Routes Reference

### Authentication
| Method | Route | Description |
|:---|:---|:---|
| `POST` | `/api/auth/register` | Create new customer account |
| `POST` | `/api/auth/login` | Login → access + refresh token |
| `POST` | `/api/auth/refresh` | Rotate refresh token |
| `POST` | `/api/auth/logout` | Invalidate refresh token |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/auth/forgot-password` | Send reset email |
| `POST` | `/api/auth/reset-password` | Reset with token |

### Catalog
| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/products` | List with filters, pagination, search |
| `GET` | `/api/products/:slug` | Single product with variants + images |
| `GET` | `/api/categories` | Category tree |
| `GET` | `/api/collections` | Curated collections |

### Commerce
| Method | Route | Description |
|:---|:---|:---|
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/my-orders` | Customer order history |
| `GET` | `/api/orders/:id` | Single order detail |
| `POST` | `/api/payments/razorpay/create-order` | Initiate Razorpay order |
| `POST` | `/api/payments/razorpay/verify` | Verify payment signature |
| `POST` | `/api/coupons/validate` | Validate coupon code |

### User Account
| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/wishlist` | Get wishlist |
| `POST` | `/api/wishlist/:productId` | Add to wishlist |
| `DELETE` | `/api/wishlist/:productId` | Remove from wishlist |
| `GET` | `/api/reviews` | Get reviews for product |
| `POST` | `/api/reviews` | Submit review |

### Admin (Role-Protected)
| Method | Route | Description |
|:---|:---|:---|
| `GET/POST` | `/api/admin/products` | List / Create product |
| `PUT/DELETE` | `/api/admin/products/:id` | Update / Delete product |
| `GET/PUT` | `/api/admin/orders` | List / Update order status |
| `GET` | `/api/admin/customers` | Customer management |
| `GET` | `/api/admin/analytics` | Dashboard metrics |
| `GET/POST` | `/api/admin/tutorials` | Manage learning content |

---

## Database Schema (Key Models — Prisma)

Design now for features you'll need later. This avoids painful migrations.

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  role          Role     @default(CUSTOMER)
  firstName     String?
  lastName      String?
  phone         String?
  isVerified    Boolean  @default(false)
  orders        Order[]
  wishlist      WishlistItem[]
  reviews       Review[]
  addresses     Address[]
  refreshTokens RefreshToken[]
  createdAt     DateTime @default(now())
}

enum Role {
  CUSTOMER
  ARTISAN
  CORPORATE
  ADMIN
  SUPER_ADMIN
}

model Product {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  basePrice   Decimal
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  variants    ProductVariant[]
  images      ProductImage[]
  reviews     Review[]
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Order {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  items           OrderItem[]
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal
  shippingAddress Json
  paymentId       String?
  razorpayOrderId String?
  couponId        String?
  giftMessage     String?
  createdAt       DateTime @default(now())
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

---

## Implementation Milestones

### Milestone 1 — Foundation
- [ ] Express + TypeScript project setup
- [ ] Prisma + Supabase PostgreSQL connection
- [ ] Zod environment validation at startup
- [ ] Global error handler
- [ ] Pino structured logging
- [ ] Security middleware (Helmet, CORS, Rate Limit)
- [ ] Swagger/OpenAPI setup

### Milestone 2 — Authentication
- [ ] bcrypt password hashing
- [ ] JWT access tokens (15 min expiry)
- [ ] Refresh token rotation (7 day expiry, stored in DB)
- [ ] Role-based middleware (`requireAuth`, `requireAdmin`)
- [ ] Email verification flow (Resend)
- [ ] Password reset flow (Resend)
- [ ] Replace frontend `AuthContext` mock with real API

### Milestone 3 — Catalog
- [ ] Product schema + Prisma migrations
- [ ] Category, Variant, Image models
- [ ] `/api/products` with filtering, pagination, search
- [ ] Cloudinary upload endpoint for product images
- [ ] Seed script to migrate hardcoded frontend data to DB
- [ ] Wire `Shop.tsx` and `ProductDetail.tsx` to real API

### Milestone 4 — Commerce
- [ ] Order creation endpoint
- [ ] Razorpay order initiation + signature verification
- [ ] Inventory decrement on order confirm
- [ ] Order confirmation email (Resend + React Email template)
- [ ] Coupon validation engine
- [ ] Wire `Checkout.tsx` to real backend

### Milestone 5 — Admin Panel
- [ ] Product CRUD API
- [ ] Order status management API
- [ ] Customer management API
- [ ] Tutorial/video management API
- [ ] Analytics endpoints (revenue, top products, recent orders)
- [ ] Wire all `pages/admin/` screens to real data

### Milestone 6 — Production Hardening
- [ ] Sentry error tracking integration
- [ ] Image optimization audit (Cloudinary transformations)
- [ ] React.lazy code splitting on Admin + heavy routes
- [ ] Performance testing
- [ ] Security review (JWT, SQL injection via Prisma, XSS)
- [ ] Railway deployment pipeline with GitHub Actions
- [ ] Environment variable audit

---

## Monthly Cost Estimate (Early Stage)

| Service | Plan | Cost |
|:---|:---|:---|
| Supabase | Free tier (500MB DB) | ₹0 |
| Railway | Starter | ~₹400/month |
| Cloudinary | Free (25 credits/month) | ₹0 |
| Razorpay | 2% per transaction | Pay-per-use |
| Resend | Free (3,000 emails/month) | ₹0 |
| Vercel | Hobby (free) | ₹0 |
| Sentry | Free (5k errors/month) | ₹0 |
| **Total** | | **~₹400/month** |

---

## What NOT to Use

| Technology | Why Avoided |
|:---|:---|
| Supabase Auth | Limits role customization; not suited for multi-role, mobile-ready auth |
| Supabase Storage (for images) | No media transformations; Cloudinary is strictly superior for artisan products |
| MongoDB | Data is highly relational; MongoDB adds join complexity with no benefit |
| Firebase | Vendor lock-in, weak relational querying, expensive at scale |
| Stripe | Doesn't natively support UPI — wrong for an India-focused business |
| Next.js (backend) | Frontend is 85% complete in CRA; rewriting to Next.js is unnecessary risk |
| GraphQL | Overkill for this API surface; adds complexity with no material gain |
| Heroku | Discontinued free tier; Railway is the superior modern replacement |
