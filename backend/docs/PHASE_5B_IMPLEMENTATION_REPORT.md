# Phase 5B — Implementation Report

**Phase**: 5B — Payment, Fulfillment & Notifications  
**Built on top of**: Phase 5A — Order Management Engine  
**Date**: 2026-07-14  
**Status**: ✅ Complete

---

## Objective

Transform the Phase 5A Order Management Engine into a production-ready commerce workflow by adding:

- Razorpay payment processing (online + COD)
- Webhook-driven payment verification
- Automated customer notification emails (Resend)
- Shipment lifecycle management
- Provider abstraction layers for future extensibility

---

## Architecture Decisions

### 1. Provider Abstraction Pattern

All external services are hidden behind interfaces:

```
PaymentProvider (interface)
  └── RazorpayProvider (implementation)
  └── StripeProvider (future)

ShippingProvider (interface)
  └── MockShippingProvider (Phase 5B dev)
  └── ShiprocketProvider (future)
  └── DelhiveryProvider (future)
```

**Benefit**: Switching payment or shipping providers requires only changing the factory (`providers/payment/index.ts`, `providers/shipping/index.ts`) — zero business logic changes.

### 2. Event-Driven Notifications

Business logic never calls email templates directly. Instead:

```
paymentService.verifyPayment()
  → emits PaymentEvents.CAPTURED
    → payment.listeners.ts intercepts
      → orderNotifications.onPaymentCaptured()
        → emailService.send()
          → Resend SDK
```

**Benefit**: Adding Slack, SMS, or queue-based notifications later requires only adding new listeners — existing code is untouched.

### 3. Configurable Email Sender

The `from:` address is set via `EMAIL_FROM` environment variable:

```env
EMAIL_FROM="Two Threads Studio <onboarding@resend.dev>"
```

No code changes are needed when switching from sandbox to a verified domain.

### 4. Webhook Security

- Raw body preserved via `express.raw()` mounted **before** `express.json()`
- HMAC-SHA256 signature verified using `crypto.timingSafeEqual()` (timing-safe)
- 200 response sent immediately; processing happens asynchronously
- Full idempotency: duplicate webhooks are detected and ignored

### 5. Idempotency on Payment Capture

- `providerPaymentId` has `@unique` constraint in the database
- `verifyPayment()` checks `payment.status === CAPTURED` before processing
- Duplicate verification requests return early with success (no re-processing)

---

## Files Created / Modified

### Backend — New Files

| File | Purpose |
|------|---------|
| `src/providers/payment/PaymentProvider.interface.ts` | Payment provider contract |
| `src/providers/payment/RazorpayProvider.ts` | Razorpay implementation |
| `src/providers/payment/index.ts` | Factory (selects provider by config) |
| `src/providers/shipping/ShippingProvider.interface.ts` | Shipping provider contract |
| `src/providers/shipping/MockShippingProvider.ts` | Mock implementation for dev |
| `src/providers/shipping/index.ts` | Factory |
| `src/repositories/payment.repository.ts` | Payment DB access |
| `src/repositories/shipment.repository.ts` | Shipment DB access |
| `src/services/payment.service.ts` | Payment lifecycle orchestration |
| `src/services/shipment.service.ts` | Shipment lifecycle orchestration |
| `src/email/email.service.ts` | Resend email wrapper |
| `src/email/templates/_base.ts` | Shared email layout + helpers |
| `src/email/templates/order-confirmation.ts` | Order created email |
| `src/email/templates/payment-success.ts` | Payment captured email |
| `src/email/templates/payment-failed.ts` | Payment failed email |
| `src/email/templates/shipment-created.ts` | Shipment packing email |
| `src/email/templates/order-shipped.ts` | Order dispatched email |
| `src/email/templates/delivered.ts` | Delivered + review CTA email |
| `src/email/templates/refund-initiated.ts` | Refund email |
| `src/controllers/payment.controller.ts` | Payment HTTP handlers |
| `src/controllers/shipment.controller.ts` | Shipment HTTP handlers |
| `src/validators/payment.validator.ts` | Zod schemas for payment routes |
| `src/routes/payment.routes.ts` | Customer payment routes |
| `src/routes/admin-payment.routes.ts` | Admin payment + shipment routes |
| `src/routes/webhook.routes.ts` | Razorpay webhook handler |
| `src/events/listeners/payment.listeners.ts` | Payment event listeners |
| `src/events/listeners/shipment.listeners.ts` | Shipment event listeners |
| `docs/RAZORPAY_LOCAL_WEBHOOK_SETUP.md` | Local dev webhook guide |
| `docs/PHASE_5B_API_REFERENCE.md` | Full API reference |
| `docs/PHASE_5B_QA_REPORT.md` | QA checklist |

### Backend — Modified Files

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added Payment, Shipment models; updated PaymentStatus enum; added ShipmentStatus enum |
| `src/events/OrderEvents.ts` | Added PaymentEvents, ShipmentEvents |
| `src/events/index.ts` | Registered new listeners |
| `src/notifications/order.notifications.ts` | Replaced all stubs with real email calls |
| `src/app.ts` | Added webhook route with raw body parser |
| `src/routes/index.ts` | Mounted payment + admin-payment routes |
| `.env.example` | Added EMAIL_FROM, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, SHIPPING_PROVIDER |

### Frontend — New Files

| File | Purpose |
|------|---------|
| `src/services/paymentService.ts` | Payment API client + Razorpay helpers |
| `src/pages/checkout/CheckoutSuccess.tsx` | Post-payment success page |
| `src/pages/checkout/CheckoutFailed.tsx` | Post-payment failure page |

### Frontend — Modified Files

| File | Change |
|------|--------|
| `src/pages/Checkout.tsx` | Replaced localStorage simulation with real Razorpay flow |
| `src/App.tsx` | Added /checkout/success and /checkout/failed routes |

---

## Database Changes

New migration: `20260714_phase_5b_payment_shipment`

### New Tables
- `payments` — tracks Razorpay order/payment IDs, status, amount, method
- `shipments` — tracks tracking number, carrier, status, delivery dates

### New Enums
- `ShipmentStatus` — PENDING, PACKING, READY, SHIPPED, IN_TRANSIT, DELIVERED, RETURNED
- `PaymentMethod` — ONLINE, COD, BANK_TRANSFER (replaces text column)
- `AuditAction` — extended with PAYMENT_CAPTURED, PAYMENT_FAILED, REFUND_INITIATED, SHIPMENT_CREATED
- `AuditActorType` — CUSTOMER, ADMIN, SYSTEM

### Updated Enums
- `PaymentStatus` — Removed: PAID. Added: AUTHORIZED, CAPTURED, CANCELLED

### Updated Tables
- `orders` — Added: paymentMethod (enum), couponCode, couponDiscount, couponType, promotionId, paymentReference, paidAt

---

## Environment Variables Required

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="Two Threads Studio <onboarding@resend.dev>"

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx

# Shipping
SHIPPING_PROVIDER=mock
```

---

## Payment Flow

```
Customer clicks "Place Order"
  → POST /api/v1/orders (creates order)
  → POST /api/v1/payments/orders/:id/razorpay-order (creates Razorpay order)
  → Razorpay popup opens in browser
  → Customer completes payment
  → Razorpay calls handler(response) with payment IDs + signature
  → POST /api/v1/payments/orders/:id/verify (HMAC verification)
  → Payment status: CAPTURED
  → Order status: CONFIRMED
  → Events emitted → Emails sent
  → Navigate to /checkout/success
```

---

## Security Hardening

| Threat | Mitigation |
|--------|-----------|
| Signature tampering | `crypto.timingSafeEqual()` prevents timing attacks |
| Duplicate payment capture | `providerPaymentId @unique` DB constraint |
| Webhook spoofing | HMAC-SHA256 verification with raw body |
| Frontend payment decision | Backend always decides status via verified signature |
| Inventory manipulation | Stock is only decremented/restored by backend transactions |
