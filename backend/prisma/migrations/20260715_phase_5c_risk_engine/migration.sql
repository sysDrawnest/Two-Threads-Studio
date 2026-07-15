-- Phase 5C: Trust & Risk Management Engine
-- Idempotent migration using DO blocks

-- ── New Enums ─────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "RiskDecision" AS ENUM (
    'APPROVED', 'REQUIRES_OTP', 'MANUAL_REVIEW', 'PREPAID_ONLY', 'BLOCKED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "FraudFlagType" AS ENUM (
    'MULTIPLE_FAILED_PAYMENTS',
    'MULTIPLE_ACCOUNTS_SAME_PHONE',
    'MULTIPLE_ACCOUNTS_SAME_ADDRESS',
    'DISPOSABLE_EMAIL',
    'TOO_MANY_ORDERS_TODAY',
    'ADDRESS_MISMATCH',
    'CHARGEBACK_HISTORY',
    'REPEATED_CANCELLATIONS',
    'SUSPICIOUS_PATTERN'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "OtpPurpose" AS ENUM (
    'FIRST_ORDER_VERIFICATION',
    'COD_VERIFICATION',
    'HIGH_VALUE_ORDER',
    'PHONE_CHANGE',
    'PHONE_REGISTRATION'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ReturnEligibility" AS ENUM ('FULL_RETURN', 'EXCHANGE_ONLY', 'NO_RETURN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Extend AuditAction enum ──────────────────────────────────────────────────

DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'RISK_EVALUATED';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'TRUST_SCORE_UPDATED';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'ORDER_FLAGGED';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'ORDER_REVIEWED';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'OTP_SENT';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'OTP_VERIFIED';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'COD_BLOCKED';
EXCEPTION WHEN others THEN NULL; END $$;

-- ── Extend User table ─────────────────────────────────────────────────────────

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phoneVerified" BOOLEAN NOT NULL DEFAULT FALSE;

-- ── Extend Product table ──────────────────────────────────────────────────────

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "allowCod" BOOLEAN NOT NULL DEFAULT TRUE;

-- ── Extend Order table ────────────────────────────────────────────────────────

DO $$ BEGIN
  ALTER TABLE "orders" ADD COLUMN "riskDecision" "RiskDecision";
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "riskScore"          INTEGER;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "requiresReview"     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "otpVerified"        BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "prepaidDiscountPct" DECIMAL(5,2);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "prepaidDiscount"    DECIMAL(10,2) NOT NULL DEFAULT 0;

-- ── CustomerRisk table ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "customer_risk" (
  "id"                  TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"              TEXT NOT NULL,
  "ordersPlaced"        INTEGER NOT NULL DEFAULT 0,
  "ordersDelivered"     INTEGER NOT NULL DEFAULT 0,
  "rtoCount"            INTEGER NOT NULL DEFAULT 0,
  "cancelledOrders"     INTEGER NOT NULL DEFAULT 0,
  "prepaidOrders"       INTEGER NOT NULL DEFAULT 0,
  "codOrders"           INTEGER NOT NULL DEFAULT 0,
  "chargebackCount"     INTEGER NOT NULL DEFAULT 0,
  "failedPayments"      INTEGER NOT NULL DEFAULT 0,
  "trustScore"          INTEGER NOT NULL DEFAULT 50,
  "isBlocked"           BOOLEAN NOT NULL DEFAULT FALSE,
  "blockReason"         TEXT,
  "maxOrderValue"       DECIMAL(10,2),
  "lastRiskEvaluation"  TIMESTAMP(3),
  "lastOrderAt"         TIMESTAMP(3),
  "adminNotes"          TEXT,
  CONSTRAINT "customer_risk_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "customer_risk" ADD CONSTRAINT "customer_risk_userId_key" UNIQUE ("userId");
EXCEPTION WHEN duplicate_table THEN NULL;
WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "customer_risk"
    ADD CONSTRAINT "customer_risk_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "customer_risk_trustScore_idx" ON "customer_risk"("trustScore");
CREATE INDEX IF NOT EXISTS "customer_risk_isBlocked_idx"  ON "customer_risk"("isBlocked");

-- ── OtpVerification table ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "otp_verifications" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "purpose"   "OtpPurpose" NOT NULL,
  "otpHash"   TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "verified"  BOOLEAN NOT NULL DEFAULT FALSE,
  "attempts"  INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "otp_verifications"
    ADD CONSTRAINT "otp_verifications_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "otp_verifications_userId_idx"           ON "otp_verifications"("userId");
CREATE INDEX IF NOT EXISTS "otp_verifications_recipient_purpose_idx" ON "otp_verifications"("recipient","purpose");

-- ── FraudFlag table ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "fraud_flags" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"     TEXT,
  "orderId"    TEXT,
  "type"       "FraudFlagType" NOT NULL,
  "details"    JSONB,
  "resolved"   BOOLEAN NOT NULL DEFAULT FALSE,
  "resolvedBy" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fraud_flags_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "fraud_flags"
    ADD CONSTRAINT "fraud_flags_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "fraud_flags_userId_idx"   ON "fraud_flags"("userId");
CREATE INDEX IF NOT EXISTS "fraud_flags_orderId_idx"  ON "fraud_flags"("orderId");
CREATE INDEX IF NOT EXISTS "fraud_flags_type_idx"     ON "fraud_flags"("type");
CREATE INDEX IF NOT EXISTS "fraud_flags_resolved_idx" ON "fraud_flags"("resolved");

-- ── ManualReviewQueue table ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "manual_review_queue" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"    TEXT NOT NULL,
  "reason"     TEXT NOT NULL,
  "riskScore"  INTEGER NOT NULL,
  "status"     "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "manual_review_queue_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "manual_review_queue" ADD CONSTRAINT "manual_review_queue_orderId_key" UNIQUE ("orderId");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "manual_review_queue"
    ADD CONSTRAINT "manual_review_queue_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "manual_review_queue_status_idx"    ON "manual_review_queue"("status");
CREATE INDEX IF NOT EXISTS "manual_review_queue_createdAt_idx" ON "manual_review_queue"("createdAt" DESC);

-- ── Order indexes for Phase 5C ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "orders_riskDecision_idx"  ON "orders"("riskDecision");
CREATE INDEX IF NOT EXISTS "orders_requiresReview_idx" ON "orders"("requiresReview");

-- ── ReturnPolicy table ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "return_policies" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "productId"   TEXT NOT NULL,
  "eligibility" "ReturnEligibility" NOT NULL,
  "windowDays"  INTEGER NOT NULL DEFAULT 0,
  "reason"      TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "return_policies_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "return_policies" ADD CONSTRAINT "return_policies_productId_key" UNIQUE ("productId");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "return_policies"
    ADD CONSTRAINT "return_policies_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
