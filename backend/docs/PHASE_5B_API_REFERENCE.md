# Phase 5B — API Reference

**Base URL**: `http://localhost:5000/api/v1`  
**Authentication**: Bearer token in `Authorization` header

---

## Customer Payment Endpoints

### POST `/payments/orders/:orderId/razorpay-order`

Creates a Razorpay order on the backend. Call this before opening the payment popup.

**Auth**: Required (customer)

**Response**:
```json
{
  "status": "success",
  "data": {
    "razorpayOrderId": "order_xxx",
    "amount": 99900,
    "currency": "INR",
    "keyId": "rzp_test_xxx",
    "order": {
      "id": "cm...",
      "orderNumber": "TTS260714-000001",
      "grandTotal": "999.00"
    }
  }
}
```

---

### POST `/payments/orders/:orderId/verify`

Verifies the Razorpay HMAC signature after popup success. This is the security gate.

**Auth**: Required (customer)

**Body**:
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "abc123..."
}
```

**Response**: `200 OK` with updated order and payment.

**Error**: `400 Bad Request` if signature is invalid.

---

### POST `/payments/orders/:orderId/cod`

Confirms a COD order. No Razorpay involved.

**Auth**: Required (customer)

---

### GET `/payments/orders/:orderId`

Get payment status for an order.

**Auth**: Required (customer, owns the order)

---

### GET `/payments/orders/:orderId/shipment`

Get shipment details for a customer's order.

**Auth**: Required (customer)

---

### GET `/payments/orders/:orderId/shipment/tracking`

Get live tracking events from the shipping provider.

**Auth**: Required (customer)

---

## Admin Endpoints

### GET `/admin/payments?status=CAPTURED&page=1&limit=10`

List all payments with optional status filter.

**Auth**: Required (ADMIN role)

**Query Params**: `status`, `page`, `limit`

---

### POST `/admin/payments/:paymentId/refund`

Process a full or partial refund via Razorpay.

**Auth**: Required (ADMIN role)

**Body**:
```json
{
  "amount": 500.00,
  "reason": "Product damaged"
}
```

Omit `amount` for a full refund.

---

### POST `/admin/payments/orders/:orderId/ship`

Create a shipment for a confirmed order. Calls the shipping provider and saves tracking info.

**Auth**: Required (ADMIN role)

---

### PATCH `/admin/payments/orders/:orderId/ship/mark-shipped`

Mark a shipment as shipped (handed to courier). Sends shipping notification email.

**Auth**: Required (ADMIN role)

---

### PATCH `/admin/payments/orders/:orderId/ship/mark-delivered`

Mark a shipment as delivered. Sends delivery notification + review request email.

**Auth**: Required (ADMIN role)

---

## Webhook Endpoint

### POST `/webhooks/razorpay`

Receives Razorpay webhook events. **Not authenticated by JWT** — secured by HMAC signature.

**Headers**:
- `X-Razorpay-Signature`: HMAC-SHA256 signature

**Content-Type**: `application/json` (raw body)

**Supported Events**:
- `payment.captured` → marks order CONFIRMED, sends confirmation email
- `payment.failed` → marks payment failed, restores inventory, sends failure email

**Response**: Always `200 OK` immediately (processing is async).

---

## Payment Status Flow

```
PENDING → AUTHORIZED → CAPTURED
       ↘ FAILED
CAPTURED → REFUNDED
CAPTURED → PARTIALLY_REFUNDED
```

## Order Status Flow (after payment)

```
PENDING → AWAITING_PAYMENT → CONFIRMED → PROCESSING
       → HANDCRAFTING → QUALITY_CHECK → READY_TO_SHIP
       → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
       → CANCELLED
       → REFUNDED
```

## Shipment Status Flow

```
PENDING → PACKING → READY → SHIPPED → IN_TRANSIT → DELIVERED
                                                 → RETURNED
```
