# Razorpay Local Webhook Testing

This guide explains how to test Razorpay webhooks during local development without deploying to production.

---

## Why You Need This

Razorpay webhooks are server-to-server HTTP calls from Razorpay's infrastructure to your backend. In local development, your backend runs on `localhost`, which is not accessible from the internet.

**ngrok** creates a secure public tunnel to your local server, making Razorpay able to reach it.

---

## Prerequisites

- Node.js backend running on `http://localhost:5000`
- Razorpay Dashboard access
- ngrok installed

---

## Step 1: Install ngrok

```bash
# macOS (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# Or download from: https://ngrok.com/download
```

After installation, authenticate:

```bash
ngrok authtoken YOUR_NGROK_AUTH_TOKEN
```

Get your token at: https://dashboard.ngrok.com/auth/your-authtoken

---

## Step 2: Start Your Backend

```bash
cd backend
npm run dev
```

Backend should be running on `http://localhost:5000`.

---

## Step 3: Start ngrok Tunnel

In a **separate terminal**:

```bash
ngrok http 5000
```

You will see output like:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`).

---

## Step 4: Configure Razorpay Webhook

1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click **Add New Webhook**
3. Set **Webhook URL** to:
   ```
   https://abc123.ngrok.io/webhooks/razorpay
   ```
4. Set **Secret** — copy this value
5. Select events:
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
6. Click **Create Webhook**

---

## Step 5: Set Environment Variable

In your `backend/.env`:

```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_step_4
```

Restart your backend server after setting this.

---

## Step 6: Verify It Works

Make a test payment through your frontend checkout.

**In ngrok web UI** (`http://localhost:4040`), you should see:

```
POST /webhooks/razorpay   200 OK
```

**In your backend logs**, you should see:

```
[Webhook] Received Razorpay event { event: 'payment.captured' }
[Webhook] payment.captured processed
🔔 Notification: payment.captured
[EmailService] Email sent { id: 're_xxx', to: 'user@example.com', ... }
```

---

## Signature Verification

The webhook handler verifies Razorpay's signature automatically:

```typescript
// From webhook.routes.ts
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(rawBody)  // Raw Buffer — not parsed JSON
  .digest('hex');

crypto.timingSafeEqual(
  Buffer.from(expectedSignature, 'hex'),
  Buffer.from(signature, 'hex')
);
```

> **Critical:** The webhook route uses `express.raw()` body parser — not `express.json()`.  
> This preserves the raw Buffer needed for HMAC verification.  
> See `app.ts` line with `app.use('/webhooks', express.raw(...), webhookRoutes)`.

---

## Idempotency

The webhook handler is safe to retry:

- `payment.captured`: Checks if `paymentStatus === 'CAPTURED'` before processing
- `payment.failed`: Checks if `paymentStatus === 'FAILED'` before processing
- Razorpay retries webhooks on non-200 responses — our handler returns 200 immediately

---

## Common Issues

| Problem | Solution |
|---------|----------|
| `400 Invalid signature` | Ensure `RAZORPAY_WEBHOOK_SECRET` matches Dashboard |
| `400 Missing signature` | Verify webhook URL is set correctly in Dashboard |
| `raw body is string` | Check `express.raw()` is before `express.json()` in `app.ts` |
| ngrok tunnel expired | Free ngrok tunnels expire — restart ngrok for a new URL |
| Events not received | Check ngrok UI at `http://localhost:4040` for errors |

---

## Production Checklist

- [ ] Set `RAZORPAY_WEBHOOK_SECRET` in production environment
- [ ] Set webhook URL to your production domain: `https://api.twothreadsstudio.com/webhooks/razorpay`
- [ ] Verify HTTPS is enabled (Razorpay requires HTTPS in production)
- [ ] Remove ngrok — not needed in production
