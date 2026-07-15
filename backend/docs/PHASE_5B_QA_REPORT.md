# Phase 5B — QA Report

**Phase**: 5B — Payment, Fulfillment & Notifications  
**Date**: 2026-07-14

---

## Pre-Testing Checklist

### Environment Setup
- [ ] `RAZORPAY_KEY_ID` set to test key (starts with `rzp_test_`)
- [ ] `RAZORPAY_KEY_SECRET` set
- [ ] `RAZORPAY_WEBHOOK_SECRET` set and matches Razorpay Dashboard
- [ ] `RESEND_API_KEY` set (sandbox key for testing)
- [ ] `EMAIL_FROM` set to `Two Threads Studio <onboarding@resend.dev>`
- [ ] Backend is running: `npm run dev`
- [ ] Frontend is running: `npm start`
- [ ] ngrok tunnel is active and webhook URL updated in Razorpay Dashboard

---

## Test Cases

### TC-01: Online Payment — Happy Path

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add products to cart | Cart shows items |
| 2 | Proceed to checkout | Checkout page loads |
| 3 | Select address | Address is selected |
| 4 | Select "Online" payment | Razorpay option shown |
| 5 | Click "Place Order" | Razorpay popup opens |
| 6 | Complete payment (test card: 4111 1111 1111 1111) | Popup closes |
| 7 | Backend verifies signature | 200 OK |
| 8 | Navigate to `/checkout/success` | Success page shown with order number |
| 9 | Check email | Confirmation email received |
| 10 | Check DB `payments` table | Status = CAPTURED |
| 11 | Check DB `orders` table | Status = CONFIRMED |

---

### TC-02: Online Payment — Failure

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open checkout, select Online | — |
| 2 | Use declining test card | Razorpay shows error |
| 3 | Dismiss popup | Navigate to `/checkout/failed` |
| 4 | Check DB `payments` | Status = FAILED |
| 5 | Check DB `orders` | paymentStatus = FAILED |
| 6 | Check DB `products` | stockQuantity restored |
| 7 | Check email | Payment failed email received |

---

### TC-03: COD Order

| Step | Action | Expected |
|------|--------|----------|
| 1 | Select "Cash on Delivery" | COD option highlighted |
| 2 | Click "Place Order" | No Razorpay popup |
| 3 | Navigate to `/checkout/success` | Success page shown |
| 4 | Check DB `payments` | Status = PENDING, method = cod |
| 5 | Check DB `orders` | Status = CONFIRMED |
| 6 | Check email | Order confirmation received |

---

### TC-04: Webhook — Payment Captured

| Step | Action | Expected |
|------|--------|----------|
| 1 | Trigger test webhook from Razorpay Dashboard | — |
| 2 | Check ngrok logs | 200 OK |
| 3 | Check backend logs | `[Webhook] payment.captured processed` |
| 4 | Check DB `payments` | Status = CAPTURED |
| 5 | Trigger same webhook again (idempotency) | No duplicate processing |

---

### TC-05: Signature Tampering

| Step | Action | Expected |
|------|--------|----------|
| 1 | Send POST to `/payments/orders/:id/verify` | — |
| 2 | Use invalid `razorpay_signature` | 400 Bad Request |
| 3 | Check DB `payments` | Status = FAILED |
| 4 | Verify stock was NOT decremented | Stock unchanged |

---

### TC-06: Admin Shipment

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as ADMIN | — |
| 2 | POST `/admin/payments/orders/:id/ship` | Shipment created, status = PACKING |
| 3 | Check email | "Being Packed" email sent |
| 4 | PATCH `/admin/payments/orders/:id/ship/mark-shipped` | Status = SHIPPED |
| 5 | Check email | Shipping email with tracking |
| 6 | PATCH `/admin/payments/orders/:id/ship/mark-delivered` | Status = DELIVERED |
| 7 | Check email | Delivered + review request |

---

### TC-07: Admin Refund

| Step | Action | Expected |
|------|--------|----------|
| 1 | Find a CAPTURED payment ID | — |
| 2 | POST `/admin/payments/:id/refund` with amount | Razorpay refund triggered |
| 3 | Check DB `payments` | Status = REFUNDED or PARTIALLY_REFUNDED |
| 4 | Check email | Refund initiated email sent |

---

### TC-08: Idempotency Tests

| Test | Action | Expected |
|------|--------|----------|
| Duplicate verify | Same verify payload sent twice | Second returns success without re-processing |
| Duplicate shipment | POST ship on same orderId twice | Returns existing shipment, no duplicate |
| Duplicate COD confirm | Confirm same COD order twice | Error: not in confirmable state |

---

## Razorpay Test Cards

| Card | Scenario |
|------|----------|
| 4111 1111 1111 1111 | Successful payment |
| 5267 3181 8797 5449 | Successful payment (Mastercard) |
| 4000 0000 0000 0002 | Declined |

**Test CVV**: Any 3 digits  
**Test Expiry**: Any future date

---

## Known Limitations (Phase 5B)

1. **Shipping provider is MOCK** — No real courier integration. Will be replaced by ShiprocketProvider when credentials are available.
2. **Email from sandbox** — Resend sandbox (`onboarding@resend.dev`) only delivers to verified emails. Set `EMAIL_FROM` to production address after domain verification.
3. **No retry queue** — Failed emails are logged but not retried. Add BullMQ in a future phase.
4. **Razorpay test mode** — Switch to `rzp_live_` keys for production.
