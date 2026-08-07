# Two Threads Studio — Staging Deployment Guide

**Target Architecture:**
- **Frontend Storefront & Admin Platform:** Vercel
- **Backend API & Commerce Engine:** Render Web Service (Node.js)
- **Database:** Supabase PostgreSQL
- **Image Storage & CDN:** Cloudinary (with local storage fallback)
- **Transactional Emails:** Resend
- **Payment Gateway:** Razorpay (Sandbox Mode)
- **Logistics & Shipping:** Mock / iThink (Development Mode)

---

## 1. Frontend Deployment (Vercel)

### Project Configuration
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
2. Connect your Git repository and select the repository root.
3. Set **Root Directory**: `frontend`
4. **Framework Preset**: Vite
5. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Required Frontend Environment Variables
Add the following key in Vercel **Environment Variables**:

| Variable Name | Value Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Absolute URL of the deployed Render backend API | `https://twothreads-backend.onrender.com/api/v1` |

> **Note:** Vercel will automatically parse `frontend/vercel.json` for SPA routing rewrites so deep client-side routes (`/shop`, `/account`, `/admin`) do not return 404 on page refresh.

---

## 2. Backend Deployment (Render)

### Service Configuration
1. Log in to [Render Dashboard](https://dashboard.render.com/) and select **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure settings:
   - **Name**: `twothreads-backend-staging`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Singapore (or region closest to Supabase PostgreSQL instance)
   - **Branch**: `main` (or active development branch)
   - **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
   - **Start Command**: `npm start` (executes `node dist/server.js`)

### Required Backend Environment Variables

| Variable Name | Description | Staging Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Web server port | `5000` (Render handles external SSL routing to port 5000) |
| `DATABASE_URL` | Supabase PostgreSQL Connection String | `postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require` |
| `SUPABASE_URL` | Supabase Project URL | `https://[ref].supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Public Anon Key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `eyJhbGci...` |
| `JWT_SECRET` | 64+ char secret for JWT access tokens | `min_32_char_secure_random_string_here` |
| `JWT_REFRESH_SECRET` | 64+ char secret for JWT refresh tokens | `min_32_char_secure_random_string_here` |
| `FRONTEND_URL` | Vercel frontend URL(s) for CORS validation | `https://two-threads-studio.vercel.app` *(or comma-separated URLs)* |
| `BACKEND_URL` | Render backend URL | `https://twothreads-backend.onrender.com` |
| `RESEND_API_KEY` | Transactional email API key | `re_...` |
| `EMAIL_FROM` | Sender display & email | `Two Threads Studio <onboarding@resend.dev>` |
| `RAZORPAY_KEY_ID` | Razorpay Sandbox Key ID | `rzp_test_...` |
| `RAZORPAY_SECRET` | Razorpay Sandbox Secret Key | `test_secret_key...` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook HMAC secret | `whsec_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (Optional) | `twothreads` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key (Optional) | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret (Optional) | `abcdef...` |
| `SHIPPING_PROVIDER` | Shipping engine mode | `mock` |

---

## 3. Supabase PostgreSQL Configuration

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> Database.
2. Under **Connection String**, use the **Transaction Pooler** URL (Port `6543`) or Direct URL with `?sslmode=require`.
3. Verify connection pooler is active. The backend is configured with resilient pool limits (`max: 10`, `connectionTimeoutMillis: 15000`, `idleTimeoutMillis: 30000`).

---

## 4. Post-Deployment Verification Checklist

Once Vercel and Render deployments complete:

- [ ] **Health Endpoint**: Open `https://twothreads-backend.onrender.com/api/v1/health` — verify HTTP 200 JSON status.
- [ ] **Storefront Loading**: Open Vercel live URL — verify home hero, bestsellers, and collections load cleanly.
- [ ] **Authentication**: Register a test account, log in, refresh browser — verify JWT token refresh & persistence work seamlessly over CORS.
- [ ] **Product Gallery & Search**: Browse `/shop`, search items, verify product details load without CORS errors.
- [ ] **Cart & Checkout**: Add item to cart, proceed to checkout, verify address selection and COD Policy 2.0.
- [ ] **Razorpay Sandbox Payment**: Create a test order via Razorpay Sandbox popup — verify HMAC signature verification and order creation.
- [ ] **Image Upload**: Log into `/admin`, upload a new product image — verify Cloudinary CDN URL generation.
- [ ] **Email Delivery**: Place a test order — verify Resend sends order confirmation email.
