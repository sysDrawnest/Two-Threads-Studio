# 🧵 Two Threads Studio — Backend Tech Stack Recommendation

## Project Profile (TL;DR)

Two Threads Studio is a **premium artisan e-commerce + learning platform** built on React 19 + TypeScript with TailwindCSS and Zustand. The frontend is **85% complete** with zero backend. It needs:

- Real authentication (currently mocked)
- A product/order/user database
- Stripe payment processing
- Admin CRUD operations
- Email notifications
- Image & asset storage
- Tutorial video delivery

---

## ✅ Recommended Stack at a Glance

| Layer             | Technology                    | Why                                                |
| :---------------- | :---------------------------- | :------------------------------------------------- |
| **Runtime**       | Node.js (v20 LTS)             | Same language as your frontend (TypeScript)        |
| **Framework**     | **Express.js**                | Lightweight, flexible, ideal for indie/small teams |
| **Language**      | **TypeScript**                | Consistent with your existing frontend codebase    |
| **Database**      | **PostgreSQL** (via Supabase) | Relational, reliable, free-tier available          |
| **ORM**           | **Prisma**                    | Best-in-class TypeScript ORM, great DX             |
| **Auth**          | **Supabase Auth**             | Handles JWT, sessions, OAuth out of the box        |
| **Payments**      | **Razorpay**                  | India-first, INR payments, UPI/Cards/Netbanking    |
| **File Storage**  | **Supabase Storage**          | Product images, artwork assets                     |
| **Email**         | **Resend**                    | Modern, developer-friendly transactional email     |
| **Deployment**    | **Railway** or **Render**     | Simple Node.js deployment, free/cheap tiers        |
| **Frontend Host** | **Vercel**                    | Best for React SPAs (your existing setup)          |

---

## 🔍 Detailed Justification

### 1. 🟢 Runtime & Framework: Node.js + Express + TypeScript

**Why Node.js + Express over alternatives?**

You are already writing TypeScript in React. Using Node.js means:

- **One language** across the entire stack — no context switching.
- Huge npm ecosystem matches your existing dependencies (Zustand, Framer Motion).
- Express is **battle-tested**, minimal, and gives full control.

> **Alternative considered:** Next.js (full-stack) — **not recommended** here because you already have a mature CRA frontend. Migrating to Next.js would be a major rewrite.

---

### 2. 🗄️ Database: PostgreSQL via Supabase

**Why PostgreSQL (relational) over MongoDB?**

Your data is **highly relational**:

- **Products** have Categories, Variants, Stock, Images
- **Orders** have OrderItems → Products → Users
- **Tutorials** relate to Instructors → Videos → Reviews
- **Users** have Wishlists, Addresses, Order History

MongoDB's flexible schema brings no benefit here and adds join complexity. PostgreSQL handles all of this cleanly.

**Why Supabase over self-hosted Postgres?**

- Free tier includes **500MB storage, 50MB file storage, Auth, and Edge Functions**
- Built-in **Row Level Security (RLS)** for protecting user data
- Real-time subscriptions (useful for order status updates)
- Supabase Studio = visual DB admin panel (replaces early admin needs)
- Scales to production without migration

---

### 3. 🔌 ORM: Prisma

Prisma is the **gold standard** for TypeScript + PostgreSQL:

- Auto-generates fully typed database client from your schema
- Schema-first migrations (version-controlled)
- Extremely readable query syntax

```typescript
// Example: Fetch all products in a category
const products = await prisma.product.findMany({
  where: { categoryId: "embroidery-kits", inStock: true },
  include: { images: true, variants: true },
  orderBy: { createdAt: "desc" },
});
```

---

### 4. 🔐 Authentication: Supabase Auth

Your current `AuthContext` is 100% mocked and insecure. Supabase Auth provides:

- JWT-based sessions (access token + refresh token)
- Email/Password signup & login
- **Google OAuth** (great for your target audience — modern urban consumers)
- Row Level Security enforcement per-user
- Drop-in replacement for your existing `AuthContext`

You replace your mocked login with:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

---

### 5. 💳 Payments: Razorpay

> [!IMPORTANT]
> Since your business is India-based (₹ INR pricing), Razorpay is the definitive choice over Stripe.

**Razorpay advantages for Two Threads Studio:**

- Accepts **UPI, Net Banking, Credit/Debit Cards, Wallets, EMI** — all Indian payment methods
- Razorpay Dashboard has built-in order/payment reconciliation (reduces admin work)
- Easy integration with your existing multi-step Checkout.tsx flow
- Supports **COD (Cash on Delivery)** for premium offline customers
- Razorpay Thirdwatch for fraud detection (important for high-value artisan orders)

---

### 6. 🖼️ File Storage: Supabase Storage

For product images, artwork assets, and tutorial thumbnails:

- Store images in Supabase Storage buckets (public or private)
- Integrated with your existing Supabase project — no extra service
- Supports CDN delivery via URLs

For **tutorial videos**, since you have a Learning Studio:

- Use **Cloudflare Stream** or **Bunny.net** (affordable video CDN, not YouTube)

---

### 7. 📧 Email: Resend

For transactional emails (order confirmations, shipping updates, password reset):

- Modern REST API, extremely simple integration
- Free tier: 3,000 emails/month (sufficient for early stage)
- Works perfectly with React Email (you can design emails using JSX/TSX)

---

### 8. 🚀 Deployment Architecture

```
┌─────────────────────┐    ┌──────────────────────┐
│   Vercel (Frontend) │    │  Railway / Render     │
│   React SPA         │◄──►│  Node.js + Express    │
│   (your existing)   │    │  + TypeScript         │
└─────────────────────┘    └──────────┬───────────┘
                                      │
                           ┌──────────▼───────────┐
                           │     Supabase          │
                           │  PostgreSQL + Auth    │
                           │  + Storage            │
                           └───────────────────────┘
```

**Railway** (recommended over Render for Node.js):

- Native GitHub integration — auto-deploys on push
- Free $5 credit/month
- Simple environment variable management

---

## 📋 API Routes You'll Need to Build

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products & Catalog

- `GET /api/products` (with filters, pagination)
- `GET /api/products/:slug`
- `GET /api/categories`

### Orders & Checkout

- `POST /api/orders` (create order)
- `GET /api/orders/:id`
- `GET /api/orders/my-orders`
- `POST /api/payments/razorpay/create-order`
- `POST /api/payments/razorpay/verify`

### Admin (Protected)

- `POST /api/admin/products` (create)
- `PUT /api/admin/products/:id` (update)
- `DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`
- `GET /api/admin/customers`
- `GET /api/admin/analytics`

### Reviews, Wishlist, Tutorials

- Standard CRUD routes per resource

---

## 🗺️ Phased Implementation Roadmap

### Phase 1 — Foundation (Week 1-2)

- [ ] Initialize Express + TypeScript backend project
- [ ] Connect to Supabase (PostgreSQL + Auth)
- [ ] Define Prisma schema (Users, Products, Categories, Orders)
- [ ] Build Auth endpoints and replace frontend `AuthContext`

### Phase 2 — Catalog & Products (Week 3)

- [ ] Seed database with existing hardcoded product data
- [ ] Build `/api/products` REST endpoints
- [ ] Wire up `Shop.tsx` and `ProductDetail.tsx` to real API

### Phase 3 — Checkout & Payments (Week 4)

- [ ] Integrate Razorpay
- [ ] Build Order creation flow
- [ ] Wire up `Checkout.tsx` to real backend

### Phase 4 — Admin Panel (Week 5)

- [ ] Product CRUD endpoints
- [ ] Order management endpoints
- [ ] Wire up all `pages/admin/` screens to real data

### Phase 5 — Email & Polish (Week 6)

- [ ] Integrate Resend for order confirmations
- [ ] Add shipping status emails
- [ ] Image optimization + Supabase Storage migration

---

## 💰 Estimated Monthly Cost (Early Stage)

| Service   | Plan               | Cost            |
| :-------- | :----------------- | :-------------- |
| Supabase  | Free tier          | ₹0              |
| Railway   | Starter            | ~₹400/month     |
| Razorpay  | 2% per transaction | Pay-per-use     |
| Resend    | Free (3k emails)   | ₹0              |
| Vercel    | Free (Hobby)       | ₹0              |
| **Total** |                    | **~₹400/month** |

---

## ❌ What to Avoid

| Technology | Reason to Avoid                                                       |
| :--------- | :-------------------------------------------------------------------- |
| MongoDB    | Your data is relational; MongoDB adds unnecessary complexity          |
| Firebase   | Vendor lock-in, limited relational query power, costly at scale       |
| Stripe     | Doesn't support UPI/Indian payment methods natively                   |
| Heroku     | Discontinued free tier; Railway/Render are better modern alternatives |
| GraphQL    | Overkill for your API surface; REST is sufficient and faster to build |
| Next.js    | Would require rewriting your mature CRA frontend                      |

Let me explore your project structure first to give you a well-informed recommendation.

Listed directory Two%20Threads%20Studio
Listed directory src
Viewed package.json:1-54
Viewed PROJECT_DESCRIPTION.md:1-170
Listed directory pages
Listed directory components
Viewed PROJECT_STATUS_REPORT.md:1-255
Listed directory admin
Listed directory store
Viewed Product_Profitability_Report.md:1-95

I now have a thorough understanding of your project. Let me write up a comprehensive backend tech stack recommendation.

### 🔑 Key Decisions Explained

1. **Razorpay over Stripe** — Your entire catalog is priced in ₹INR and targets Indian consumers. Razorpay supports UPI, NetBanking, and EMI — Stripe doesn't handle these natively.

2. **Supabase over plain PostgreSQL** — It packages Auth (JWT), Row Level Security, Storage, and a visual DB admin panel in one free service. This dramatically reduces your Phase 1 effort.

3. **Express over Next.js** — Your CRA-based frontend is 85% complete. Migrating to Next.js would be a large rewrite with no material benefit.

4. **PostgreSQL over MongoDB** — Products have Variants, Orders have OrderItems, Tutorials relate to Instructors. Relational joins are natural here; MongoDB would fight you on this.

5. **Prisma over raw SQL** — Generates fully-typed DB client from your schema, consistent with your TypeScript-first approach.

---

### 💰 Monthly Cost at Early Stage

~**₹400/month** total (Railway hosting) — everything else has a free tier that'll last until you're processing real orders.
