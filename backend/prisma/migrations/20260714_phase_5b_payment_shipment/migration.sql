-- Phase 5B Migration: Payment, Fulfillment & Shipment
-- Extends Phase 5A Order Management Engine
-- Idempotent — safe to apply on any Phase 5A database state

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Update PaymentStatus enum: remove PAID, add AUTHORIZED, CAPTURED, CANCELLED
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- Only migrate if PAID exists in the enum
  IF EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'PaymentStatus' AND e.enumlabel = 'PAID'
  ) THEN
    -- Add new values (PostgreSQL allows adding to existing enum)
    ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'AUTHORIZED';
    ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CAPTURED';
    ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. New Enums (safe with DO blocks)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "ShipmentStatus" AS ENUM (
    'PENDING', 'PACKING', 'READY', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'COD', 'BANK_TRANSFER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AuditAction" AS ENUM (
    'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_CANCELLED', 'STATUS_CHANGED',
    'INVOICE_VIEWED', 'PAYMENT_CAPTURED', 'PAYMENT_FAILED',
    'REFUND_INITIATED', 'SHIPMENT_CREATED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AuditActorType" AS ENUM ('CUSTOMER', 'ADMIN', 'SYSTEM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED', 'FREE_SHIPPING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Alter Orders table
-- ─────────────────────────────────────────────────────────────────────────────

-- Migrate paymentMethod from text to enum (only if it's still TEXT type)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paymentMethod'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE "orders" DROP COLUMN "paymentMethod";
    ALTER TABLE "orders" ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'ONLINE';
  END IF;
END $$;

-- Add paymentMethod if it doesn't exist at all
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paymentMethod'
  ) THEN
    ALTER TABLE "orders" ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'ONLINE';
  END IF;
END $$;

-- Phase 5A coupon fields
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "couponDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "promotionId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "couponType" "CouponType";

-- Phase 5B payment reference fields
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paymentReference" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Create IdempotencyKey table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "idempotency_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responseStatus" INTEGER NOT NULL,
    "responseBody" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "idempotency_keys_key_key" ON "idempotency_keys"("key");

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Create OrderAuditLog table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "order_audit_logs" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actorType" "AuditActorType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "order_audit_logs_orderId_idx" ON "order_audit_logs"("orderId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'order_audit_logs_orderId_fkey'
  ) THEN
    ALTER TABLE "order_audit_logs"
      ADD CONSTRAINT "order_audit_logs_orderId_fkey"
      FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Create Payments table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "providerSignature" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "transactionFee" DECIMAL(10,2),
    "failureReason" TEXT,
    "failureCode" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payments_orderId_key" ON "payments"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "payments_providerPaymentId_key" ON "payments"("providerPaymentId");
CREATE INDEX IF NOT EXISTS "payments_orderId_idx" ON "payments"("orderId");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_providerOrderId_idx" ON "payments"("providerOrderId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_orderId_fkey'
  ) THEN
    ALTER TABLE "payments"
      ADD CONSTRAINT "payments_orderId_fkey"
      FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Create Shipments table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "shipments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'MOCK',
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "shippingMethod" TEXT DEFAULT 'STANDARD',
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "labelUrl" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "shipments_orderId_key" ON "shipments"("orderId");
CREATE INDEX IF NOT EXISTS "shipments_orderId_idx" ON "shipments"("orderId");
CREATE INDEX IF NOT EXISTS "shipments_status_idx" ON "shipments"("status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shipments_orderId_fkey'
  ) THEN
    ALTER TABLE "shipments"
      ADD CONSTRAINT "shipments_orderId_fkey"
      FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
