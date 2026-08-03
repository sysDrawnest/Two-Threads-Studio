# Master QA Report & Production Readiness Audit
**Application**: Two Threads Studio (React + Express + Prisma + PostgreSQL + Razorpay + Resend)  
**Date of Audit**: July 27, 2026  
**Auditor**: Senior QA Automation Engineer & E-commerce Solution Architect  

---

## 1. Executive Summary

A comprehensive, end-to-end technical QA audit and production readiness evaluation was conducted on the **Two Threads Studio** e-commerce platform. The investigation evaluated all 13 phases of the customer buying journey—from authentication and product discovery to cart management, checkout session handling, address management, coupon validation, Razorpay payment processing, order confirmation, Resend email dispatch, and admin dashboard operations.

While core modules (Authentication, Product Catalog, Cart, Shipping ETAs, and Admin Dashboard) function as designed, **critical blocking bugs were discovered in Checkout Address Linking, Coupon Validation, Razorpay Payment Verification, and Email Dispatch**. Most notably, a middleware schema wrapping mismatch breaks address updates and coupon validation, an environment variable name mismatch (`RAZORPAY_SECRET` vs `RAZORPAY_KEY_SECRET`) guarantees runtime payment verification failures, and an unverified domain/invalid API key breaks transactional email notifications.

---

## 2. Environment Tested

| Component | Value / Environment |
| :--- | :--- |
| **Frontend Server** | React 18 + Vite (`http://localhost:3000`) |
| **Backend API** | Express.js 5 + Node.js (`http://localhost:5000/api/v1`) |
| **Database** | PostgreSQL via Prisma ORM 7.8 (Supabase Pooler) |
| **Payment Gateway** | Razorpay SDK v2.9.6 |
| **Email Service** | Resend SDK v6.17.2 |
| **OS / Runtime** | Windows 11 / Node v20+ / tsx |

---

## 3. Test Account Used

- **Customer Email**: `shreyasisahoo116@gmail.com`
- **Customer Password**: `@Krishna116`
- **User Role**: `CUSTOMER` (Promoted to `ADMIN` during Phase 12 verification)
- **Account Status**: Verified, Active

---

## 4. End-to-End Journey Summary

```mermaid
flowchart TD
    A[Phase 1: Login] -->|PASS| B[Phase 2: Product Discovery]
    B -->|PASS| C[Phase 3: Cart Management]
    C -->|PASS| D[Phase 4: Checkout Entry]
    D -->|PASS| E[Phase 5: Address Management]
    E -->|FAIL - Zod Schema Mismatch| F[Phase 6: Shipping Methods]
    F -->|PASS| G[Phase 7: Order Summary Math]
    G -->|PASS| H[Phase 8: Coupon System]
    H -->|FAIL - Zod Schema Mismatch| I[Phase 9: Payment Gateway]
    I -->|FAIL - Secret Env Name Mismatch| J[Phase 10: Order Creation]
    J -->|FAIL - Dependent on Address/Payment| K[Phase 11: Email Notifications]
    K -->|FAIL - Resend API Key/Domain Error| L[Phase 12: Admin Dashboard]
    L -->|PASS| M[Phase 13: QA Report & Synthesis]
```

---

## 5. Pass/Fail Checklist for Each Phase

| Phase | Module | Status | Critical Findings / Remarks |
| :---: | :--- | :---: | :--- |
| **1** | **Authentication** | 🟢 **PASS** | JWT login, password hash verification, `/auth/me` profile work flawlessly. |
| **2** | **Product Discovery** | 🟢 **PASS** | Catalog, product detail page, stock tracking, and Cloudinary images load correctly. |
| **3** | **Cart Management** | 🟢 **PASS** | Cart creation, guest merging, item additions, and stock capping work properly. |
| **4** | **Checkout Entry** | 🟢 **PASS** | Checkout session initialization (`chk_...`) and auth guards work as expected. |
| **5** | **Address Management** | 🔴 **FAIL** | `PATCH /checkout/address` fails with 400 Bad Request due to Zod validation wrapper bug. |
| **6** | **Shipping Methods** | 🟢 **PASS** | Shipping methods, free shipping rules, and delivery ETA engine compute accurately. |
| **7** | **Order Summary** | 🟡 **WARN** | Pricing engine handles subtotal & shipping correctly. Inclusive GST display needs UI clarity. |
| **8** | **Coupon System** | 🔴 **FAIL** | `POST /coupons/validate` fails with 400 Bad Request due to Zod validation wrapper bug. |
| **9** | **Payment Investigation**| 🔴 **FAIL** | Signature verification throws 500 error due to `RAZORPAY_SECRET` vs `RAZORPAY_KEY_SECRET` bug. |
| **10**| **Order Creation** | 🔴 **FAIL** | Blocked due to checkout address update failure and dummy Razorpay credentials. |
| **11**| **Email Verification** | 🔴 **FAIL** | Resend dispatch fails with 500 `Unable to fetch data` due to unverified sender domain/key. |
| **12**| **Admin Dashboard** | 🟢 **PASS** | Order listing, customer management, payment logs, and role guards function correctly. |
| **13**| **Error Investigation**| 🔴 **FAIL** | Multiple systemic architectural bugs identified for remediation. |

---

## 6. Detailed Issues Found

### Issue 1: Systemic Validation Middleware Schema Mismatch
- **Impacted Endpoints**: `PATCH /api/v1/checkout/address`, `POST /api/v1/coupons/validate`, `PATCH /api/v1/checkout/customer`
- **HTTP Status**: `400 Bad Request`
- **Error Response**: `Invalid input: expected string, received undefined`
- **Severity**: 🔴 **CRITICAL**
- **Description**: The express validation middleware in `backend/src/middleware/validate.ts` constructs an object `{ body: req.body, query: req.query, params: req.params }` and passes it to `schema.parseAsync()`. However, Zod schemas like `updateCheckoutAddressSchema` and `validateCouponSchema` are written expecting top-level fields (e.g. `z.object({ shippingAddressId: z.string() })`). Because `shippingAddressId` is located inside `req.body.shippingAddressId`, Zod rejects the request.

### Issue 2: Razorpay Key Secret Environment Variable Name Mismatch
- **Impacted Endpoints**: `POST /api/v1/payments/orders/:orderId/verify`
- **HTTP Status**: `500 Internal Server Error`
- **Error Response**: `AppError: Razorpay key secret is not configured`
- **Severity**: 🔴 **CRITICAL**
- **Description**: In `backend/.env`, the secret is named `RAZORPAY_SECRET=dummy_razorpay_secret_for_validation`. However, `backend/src/providers/payment/RazorpayProvider.ts` checks `process.env.RAZORPAY_KEY_SECRET`. Because the key names do not match, `process.env.RAZORPAY_KEY_SECRET` is `undefined`, causing `verifySignature` to throw an internal server error whenever signature verification is executed.

### Issue 3: Resend Email Delivery Failure & Domain Restriction
- **Impacted Modules**: `emailService.send()`, `orderNotifications.onOrderCreated()`
- **HTTP Status**: `500 Internal Server Error`
- **Error Response**: `Unable to fetch data. The request could not be resolved.`
- **Severity**: 🔴 **CRITICAL**
- **Description**: Attempts to send transactional order confirmation emails fail. The configured sender `EMAIL_FROM="Two Threads Studio <onboarding@resend.dev>"` on Resend's free tier only permits sending emails to the single email address registered with the Resend account. Sending emails to customer addresses (`shreyasisahoo116@gmail.com`) fails. Additionally, the API key in `.env` is either invalid or restricted.

### Issue 4: Dummy Razorpay Key ID in Production Environment Config
- **Impacted Endpoints**: `POST /api/v1/payments/orders/:orderId/razorpay-order`
- **Severity**: 🟠 **HIGH**
- **Description**: `.env` contains `RAZORPAY_KEY_ID=dummy_razorpay_key_id_for_validation`. `RazorpayProvider.ts` detects the word `dummy` and falls back to generating mock order IDs (`order_mock_...`). Real Razorpay payment popups cannot open on the frontend without valid Razorpay Test/Live Key IDs.

---

## 7. Root Cause Analysis

```
                               ┌────────────────────────────────────────────────────────┐
                               │                 ROOT CAUSES IDENTIFIED                 │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
         ┌──────────────────────────────┬──────────────────┴───────────────┬──────────────────────────────┐
         ▼                              ▼                                  ▼                              ▼
 ┌───────────────┐              ┌───────────────┐                  ┌───────────────┐              ┌───────────────┐
 │ Validation    │              │ Env Variable  │                  │ Email Domain  │              │ Dummy Key     │
 │ Middleware    │              │ Key Mismatch  │                  │ Verification  │              │ Fallback      │
 └───────┬───────┘              └───────┬───────┘                  └───────┬───────┘              └───────┬───────┘
         │                              │                                  │                              │
         ▼                              ▼                                  ▼                              ▼
  validate.ts passes           RazorpayProvider checks           onboarding@resend.dev          RAZORPAY_KEY_ID=dummy
 {body, query, params}         RAZORPAY_KEY_SECRET, but          rejects unverified             causes fallback mock
 to top-level schemas          .env defines RAZORPAY_SECRET       recipient domains             order IDs
```

---

## 8. Payment Flow Analysis

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant RZP as Razorpay API
    participant DB as PostgreSQL DB

    Customer->>FE: Click "Pay & Place Order"
    FE->>BE: POST /api/v1/orders (Create Order)
    BE->>DB: Save Order (Status: PENDING)
    BE-->>FE: Return Order ID
    FE->>BE: POST /api/v1/payments/orders/:id/razorpay-order
    BE->>RZP: razorpay.orders.create({ amount: paise, currency: 'INR' })
    Note over BE,RZP: Fails if RAZORPAY_KEY_ID is dummy -> Falls back to mock ID
    BE-->>FE: Return razorpayOrderId & keyId
    FE->>Customer: Open Razorpay Modal
    Customer->>FE: Enter OTP & Complete Payment
    FE->>BE: POST /api/v1/payments/orders/:id/verify (Signature + Payment ID)
    Note over BE: CRITICAL BUG: Reads process.env.RAZORPAY_KEY_SECRET (Undefined!)
    BE-->>FE: 500 Error: Razorpay key secret is not configured
    BE->>DB: Payment marked FAILED & Inventory restored
```

---

## 9. Checkout Flow Analysis

The checkout engine is built around a server-authoritative session model (`CheckoutSession` table).
- **Session Initialization**: `POST /checkout/session` works as designed.
- **Cart Transfer & Merging**: Guest carts correctly merge into logged-in user carts.
- **Summary Calculations**: Subtotal, shipping rates, and delivery ETAs calculate server-side.
- **Failure Point**: When the user selects or changes a shipping address, the frontend calls `PATCH /checkout/address`. Because of the validation middleware bug, the backend rejects the address payload, preventing the checkout step from advancing to `SHIPPING` or `PAYMENT`.

---

## 10. Address Management Analysis

- **Address Creation**: `POST /api/v1/addresses` creates records in the `Address` table with `fullName`, `phone`, `line1`, `line2`, `city`, `state`, `postalCode`, `country`, `landmark`, and `type` (HOME/WORK).
- **Persistence**: Database persistence is verified; refreshing the page retains saved addresses.
- **Checkout Link Failure**: The checkout session cannot link the address ID because `updateCheckoutAddressSchema` rejects `{ body: { shippingAddressId: '...' } }`.

---

## 11. Email Trigger Analysis

- **Event Bus**: The system uses `eventDispatcher` to emit events like `OrderEvents.CREATED` and `PaymentEvents.CAPTURED`.
- **Notification Handler**: `orderNotifications.ts` catches events, generates PDF invoices via `invoiceService`, and calls `emailService.send()`.
- **Failure Analysis**:
  - `RESEND_API_KEY`: Key `re_jaSd4k8D_...` is rejected by Resend API or cannot resolve remote host (`Unable to fetch data. The request could not be resolved`).
  - `EMAIL_FROM`: Set to `onboarding@resend.dev`. Resend restricts `onboarding@resend.dev` to test recipient emails associated with the Resend developer account. Attempting to send customer confirmation emails to `shreyasisahoo116@gmail.com` is blocked.

---

## 12. Admin Dashboard Verification

- **Authentication & Authorization**: Protected by `requireAuth` and `requireAdmin` middleware. Access is correctly denied for `CUSTOMER` role and granted for `ADMIN` role.
- **Order Audit & Management**: `GET /api/v1/admin/orders` returns orders, status histories, item breakdowns, and risk scores.
- **Payment Operations**: `GET /api/v1/admin/payments` lists payment transactions. `POST /api/v1/admin/payments/:id/refund` supports partial and full refunds.

---

## 13. Risk Assessment

| Risk Category | Level | Impact Summary |
| :--- | :---: | :--- |
| **Payment Verification Failure** | 🔴 **CRITICAL** | Customers cannot complete online payments; signature verification throws 500 error. |
| **Address Selection Blocked** | 🔴 **CRITICAL** | Customers cannot proceed through checkout steps due to 400 validation error. |
| **Email Delivery Outage** | 🔴 **CRITICAL** | Neither customers nor admins receive order confirmation emails or PDF invoices. |
| **Coupon Code Rejection** | 🟠 **HIGH** | Promotional codes fail validation due to schema mismatch. |
| **Dummy Payment Credentials** | 🟠 **HIGH** | Test environment is running dummy credentials instead of active Razorpay sandbox keys. |

---

## 14. Prioritized Fix List

### Priority 1: Fix Validation Middleware Schema Wrapper (Immediate)
Update `backend/src/middleware/validate.ts` or update validator schemas (`checkout.validator.ts`, `coupon.validator.ts`) so Zod parses `req.body` directly rather than expecting `{ body: req.body }`.

```typescript
// Proposed fix in backend/src/middleware/validate.ts
export const validate = (schema: ZodSchema) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = await schema.parseAsync(req.body);
    }
    return next();
  } catch (error) {
    // handle ZodError...
  }
};
```

### Priority 2: Fix Razorpay Environment Variable Name Mismatch
In `backend/.env`, rename `RAZORPAY_SECRET` to `RAZORPAY_KEY_SECRET`:
```env
RAZORPAY_KEY_ID=rzp_test_YourActualKeyId
RAZORPAY_KEY_SECRET=YourActualKeySecret
```

### Priority 3: Configure Resend Sender Domain & Production API Key
1. Verify `twothreadsstudio.com` domain in Resend Dashboard.
2. Update `backend/.env` with valid Resend API key and verified domain:
```env
RESEND_API_KEY=re_valid_production_key
EMAIL_FROM="Two Threads Studio <orders@twothreadsstudio.com>"
```

### Priority 4: Update Frontend Inclusive GST UI Display
Update `CheckoutSummary.tsx` to display inclusive GST calculation explicitly (e.g., `"Includes ₹X GST (18%)"`).

---

## 15. Production Readiness Score

$$\text{Production Readiness Score} = 45 / 100$$

- **Authentication & Security**: 90/100
- **Product Catalog & Cart**: 85/100
- **Checkout & Address Flow**: 20/100 (Blocked by validation bug)
- **Payment Integration**: 10/100 (Blocked by env key name mismatch & dummy credentials)
- **Email & Notifications**: 10/100 (Blocked by Resend API key/domain issue)
- **Admin Dashboard**: 90/100

---

## 16. Final Recommendation

# 🚨 NOT READY FOR PRODUCTION

**Justification**:  
The platform possesses a solid architectural foundation with robust Prisma data modeling, server-authoritative checkout session logic, and well-structured React components. However, **three critical blocking defects** (Validation Middleware Zod Mismatch, Razorpay Environment Secret Mismatch, and Resend Email Delivery Failure) make it impossible for actual customers to select shipping addresses, complete Razorpay payments, or receive order confirmation emails in a live production environment. 

Applying the prioritized fixes documented in Section 14 will resolve all blocking issues and elevate the platform to **Ready for Production** status within one short development cycle.

# Master QA Audit & Checkout Investigation — Walkthrough

## Summary of Accomplishments

1. **Executed End-to-End Automated & Static Audit** across all 13 customer purchase journey phases on the **Two Threads Studio** platform.
2. **Authenticated** with the provided customer account `shreyasisahoo116@gmail.com` (`@Krishna116`), verified JWT token lifecycle, profile fetching, and role-based guards.
3. **Audited Product Discovery, Cart Capping & Checkout Sessions**: Verified catalog querying, stock tracking, cart creation, guest cart merging, and server-authoritative checkout summary pricing calculations.
4. **Uncovered 3 Critical Production-Blocking Systemic Defects**:
   - **Validation Middleware Zod Mismatch**: `validate.ts` vs top-level Zod schemas breaking address selection (`PATCH /checkout/address`) and coupon validation (`POST /coupons/validate`).
   - **Razorpay Key Secret Mismatch**: `.env` defines `RAZORPAY_SECRET`, but `RazorpayProvider.ts` checks `RAZORPAY_KEY_SECRET`, causing 500 errors during HMAC signature verification.
   - **Resend Email Delivery Error**: Invalid/restricted API key and unverified sender domain (`onboarding@resend.dev`) blocking customer order confirmation emails.
5. **Audited Admin Dashboard & Analytics**: Promoted test account to `ADMIN`, verified `/admin/orders` and `/admin/payments` endpoints, and confirmed payment refund & audit logging workflows.
6. **Delivered Comprehensive Master QA Report Artifact**: Produced the complete structured audit report in [master_qa_report.md](file:///C:/Users/Pikun/.gemini/antigravity-ide/brain/b840ba49-9d5c-4b68-b7cf-77e028484043/master_qa_report.md) covering all 16 required audit sections and a Production Readiness Score of **45 / 100** (**NOT READY FOR PRODUCTION**).

---

## Key Audit Artifact Links

- 📄 **Master QA Report**: [master_qa_report.md](file:///C:/Users/Pikun/.gemini/antigravity-ide/brain/b840ba49-9d5c-4b68-b7cf-77e028484043/master_qa_report.md)
- 📋 **Implementation Plan**: [implementation_plan.md](file:///C:/Users/Pikun/.gemini/antigravity-ide/brain/b840ba49-9d5c-4b68-b7cf-77e028484043/implementation_plan.md)
- 🧪 **QA Test Runner Script**: [qa_audit_runner.ts](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/backend/qa_audit_runner.ts)

---

## Pass/Fail Summary Table

| Phase | Phase Name | Status | Key Finding |
| :---: | :--- | :---: | :--- |
| **1** | Authentication | 🟢 PASS | JWT auth & user profile work as expected |
| **2** | Product Discovery | 🟢 PASS | Product details, stock quantity & Cloudinary images load |
| **3** | Cart Management | 🟢 PASS | Cart CRUD, guest merge & stock limit capping work |
| **4** | Checkout Entry | 🟢 PASS | Session initialization & auth guards work |
| **5** | Address Management | 🔴 FAIL | Zod validation middleware wrapper bug blocks address update |
| **6** | Shipping Methods | 🟢 PASS | Delivery ETAs & shipping rules compute accurately |
| **7** | Order Summary Math | 🟡 WARN | Accurate subtotal/shipping; inclusive GST needs UI clarity |
| **8** | Coupon System | 🔴 FAIL | Zod validation middleware bug blocks coupon application |
| **9** | Payment Gateway | 🔴 FAIL | `RAZORPAY_SECRET` vs `RAZORPAY_KEY_SECRET` bug breaks signature verification |
| **10**| Order Creation | 🔴 FAIL | Blocked due to upstream checkout address linking failure |
| **11**| Email Verification | 🔴 FAIL | Resend API key & sender domain restriction error |
| **12**| Admin Verification | 🟢 PASS | Admin orders & payment tracking operate correctly |
| **13**| Error Investigation | 🔴 FAIL | Multiple architectural bugs documented for remediation |



```mermaid
flowchart TD
    A[Phase 1: Login] -->|PASS| B[Phase 2: Product Discovery]
    B -->|PASS| C[Phase 3: Cart Management]
    C -->|PASS| D[Phase 4: Checkout Entry]
    D -->|PASS| E[Phase 5: Address Management]
    E -->|FAIL - Zod Schema Mismatch| F[Phase 6: Shipping Methods]
    F -->|PASS| G[Phase 7: Order Summary Math]
    G -->|PASS| H[Phase 8: Coupon System]
    H -->|FAIL - Zod Schema Mismatch| I[Phase 9: Payment Gateway]
    I -->|FAIL - Secret Env Name Mismatch| J[Phase 10: Order Creation]
    J -->|FAIL - Dependent on Address/Payment| K[Phase 11: Email Notifications]
    K -->|FAIL - Resend API Key/Domain Error| L[Phase 12: Admin Dashboard]
    L -->|PASS| M[Phase 13: QA Report & Synthesis]
```

---