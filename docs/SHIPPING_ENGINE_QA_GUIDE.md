# Enterprise Shipping Engine — Developer & QA Testing Guide

This guide explains how to develop, test, and validate the **Two Threads Studio Enterprise Shipping Engine** in local, staging, and production environments.

The shipping architecture is **100% provider-agnostic**. Business logic, APIs, database models, and React UI components **never** reference Shiprocket or any courier aggregator directly.

---

## 🔀 1. Environment-Based Provider Switching

The active shipping provider is controlled exclusively via the `.env` configuration.

### Development Mode (Mock Provider — Default)
No API keys, credentials, or network connections required.

```env
# backend/.env
SHIPPING_PROVIDER=mock
```

### Production Mode (IThink Logistics Provider)
Requires valid IThink Logistics account credentials.

```env
# backend/.env
SHIPPING_PROVIDER=ithink
ITHINK_ACCESS_TOKEN=your-access-token
ITHINK_SECRET_KEY=your-secret-key
ITHINK_PICKUP_LOCATION=Primary
ITHINK_WEBHOOK_SECRET=your-webhook-hmac-secret
ITHINK_SANDBOX=false
```

> **Zero Code Changes**: Switching `SHIPPING_PROVIDER` between `mock`, `ithink`, and `shiprocket` requires zero modifications to services, controllers, database schema, or React components.

---

## 🧪 2. Mock Provider & Lifecycle Capabilities

When `SHIPPING_PROVIDER=mock`, the system uses `MockShippingProvider` (`src/providers/shipping/mock/MockShippingProvider.ts`).

### Simulated Lifecycle Operations:
- **Create Shipment**: Generates realistic AWB number (`TTS...`), courier assignment (`BlueDart Express`), estimated delivery ETA, and mock tracking URL.
- **Courier Assignment**: Auto-selects courier from simulated rates.
- **Pickup Scheduling**: Returns instant mock pickup confirmation token.
- **Label Generation**: Generates mock PDF label URL (`https://mock-labels.example.com/...pdf`).
- **Invoice Generation**: Generates mock invoice PDF URL.
- **Manifest Generation**: Generates bulk pickup manifest PDF.
- **Tracking & History**: Returns real-time simulated tracking events and location hubs.
- **Reverse Logistics**: Simulates return shipment creation (`RTTS...`).

---

## 🛠️ 3. Developer Testing Utilities (Dev APIs)

Developer endpoints are mounted at `/api/v1/dev/shipping` and are **automatically disabled in production** (`NODE_ENV === 'production'`).

| Endpoint | Method | Description | Payload Example |
|---|---|---|---|
| `/api/v1/dev/shipping/advance` | `POST` | Advances shipment by 1 step in lifecycle (`PACKING` → `PICKED_UP` → `IN_TRANSIT` → `OUT_FOR_DELIVERY` → `DELIVERED`) | `{ "orderId": "ORD-123" }` |
| `/api/v1/dev/shipping/webhook` | `POST` | Emits a simulated webhook through the **exact production webhook processing pipeline** | `{ "orderId": "ORD-123", "event": "DELIVERED", "location": "Mumbai Hub" }` |
| `/api/v1/dev/shipping/simulate-full-history` | `POST` | Generates a complete 4-step event history instantly | `{ "orderId": "ORD-123" }` |
| `/api/v1/dev/shipping/simulate-rto` | `POST` | Triggers complete RTO (Return to Origin) lifecycle (`FAILED_DELIVERY` → `RTO_INITIATED` → `RTO_IN_TRANSIT` → `RTO_DELIVERED`) | `{ "orderId": "ORD-123" }` |
| `/api/v1/dev/shipping/reset` | `POST` | Resets shipment status back to `PACKING` | `{ "orderId": "ORD-123" }` |
| `/api/v1/dev/shipping/active-provider` | `GET` | Queries active provider health status & capabilities | None |

---

## 📡 4. Testing Webhook Events

Mock webhook events use the **exact same processing pipeline** as production Shiprocket webhooks:

1. Inbound webhook payload received.
2. Status string mapped using `ShipmentStatusMapper` (`SHIPROCKET_STATUS_MAP`).
3. `ShipmentTimeline` appended with event timestamp, location, and description.
4. `Shipment.status` and timestamps (`shippedAt`, `deliveredAt`) updated in DB.
5. Order status updated accordingly.

### Example cURL — Simulate Out For Delivery
```bash
curl -X POST http://localhost:5000/api/v1/dev/shipping/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "YOUR_ORDER_ID",
    "event": "OUT_FOR_DELIVERY",
    "location": "South Delhi Hub"
  }'
```

### Example cURL — Simulate Full RTO Sequence
```bash
curl -X POST http://localhost:5000/api/v1/dev/shipping/simulate-rto \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "YOUR_ORDER_ID"
  }'
```

---

## 🖥️ 5. Testing the Admin & Customer UI

### Admin Shipping Management Panel
1. Log in to the Admin Dashboard (`admin@twothreads.com`).
2. Navigate to **Orders** → Select any order.
3. Locate the **Enterprise Shipping Management** card in the right sidebar:
   - Check **Provider Status Indicator** (`Connected` for Shiprocket, `Mock Mode` for Mock).
   - Click **Create Shipment** (if unfulfilled).
   - Click **Schedule Pickup** to select a pickup date.
   - Click **Shipping Label** or **Invoice PDF** to view generated documents in a new tab.
   - View real-time **Provider Event History** timeline.

### Customer Live Tracking
1. Log in as a customer.
2. Go to **My Account** → **Orders**.
3. Expand an order and click **Track Shipment**.
4. View AWB number, Courier Partner name, current status badge, and **Live Tracking Link**.

---

## 🔄 6. Provider Migration Checklist (Adding Delhivery / NimbusPost)

To add a new shipping aggregator in the future (e.g. Delhivery):

1. **Create Adapter Folder**: `src/providers/shipping/delhivery/`
2. **Implement Classes**:
   - `Auth.ts` — Auth token manager.
   - `Api.ts` — Raw HTTP client for Delhivery API.
   - `Mapper.ts` — Maps Delhivery JSON → internal DTOs (`CreateShipmentResponse`, `TrackingResponse`).
   - `DelhiveryProvider.ts` — Implements `ShippingProvider` interface.
3. **Register in Factory**: Add `case 'delhivery': return delhiveryProvider;` in `src/providers/shipping/index.ts`.
4. **Update Status Map**: Add `DELHIVERY_STATUS_MAP` in `ShipmentStatusMapper.ts`.

> **Result**: Zero changes required to `shipment.service.ts`, `shipment.controller.ts`, React components, or database schema.
