import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function runShippingDDL() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Connecting to database...');

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('Connected! Applying DDL column migrations...');

    const sql = `
      -- 1. Extend shipments table
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "externalShipmentId" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "externalOrderId" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "externalAwbNumber" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "courierName" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "courierCode" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "trackingUrl" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "manifestUrl" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "pickupId" TEXT;
      ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "invoiceUrl" TEXT;

      CREATE UNIQUE INDEX IF NOT EXISTS "shipments_externalAwbNumber_key" ON "shipments"("externalAwbNumber");

      -- 2. Create shipment_timelines table
      CREATE TABLE IF NOT EXISTS "shipment_timelines" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
        "shipmentId" TEXT NOT NULL REFERENCES "shipments"("id") ON DELETE CASCADE,
        "status" TEXT NOT NULL,
        "location" TEXT,
        "description" TEXT NOT NULL,
        "source" TEXT NOT NULL,
        "raw" JSONB,
        "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- 3. Create shipping_settings table
      CREATE TABLE IF NOT EXISTS "shipping_settings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "provider" TEXT NOT NULL DEFAULT 'MOCK',
        "selectionStrategy" TEXT NOT NULL DEFAULT 'CHEAPEST',
        "autoAssignCourier" BOOLEAN NOT NULL DEFAULT true,
        "autoSchedulePickup" BOOLEAN NOT NULL DEFAULT true,
        "codEnabled" BOOLEAN NOT NULL DEFAULT true,
        "defaultWeightGrams" INTEGER NOT NULL DEFAULT 500,
        "defaultLength" DOUBLE PRECISION NOT NULL DEFAULT 20,
        "defaultBreadth" DOUBLE PRECISION NOT NULL DEFAULT 15,
        "defaultHeight" DOUBLE PRECISION NOT NULL DEFAULT 10,
        "packagingExtraGrams" INTEGER NOT NULL DEFAULT 50,
        "defaultLocationId" TEXT,
        "fragileHandlingNote" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- 4. Create package_profiles table
      CREATE TABLE IF NOT EXISTS "package_profiles" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "length" DOUBLE PRECISION NOT NULL,
        "breadth" DOUBLE PRECISION NOT NULL,
        "height" DOUBLE PRECISION NOT NULL,
        "maxWeightGrams" INTEGER NOT NULL,
        "isDefault" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- 5. Create fulfillment_locations table
      CREATE TABLE IF NOT EXISTS "fulfillment_locations" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "providerCode" TEXT NOT NULL,
        "contactName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "line1" TEXT NOT NULL,
        "line2" TEXT,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "pincode" TEXT NOT NULL,
        "country" TEXT NOT NULL DEFAULT 'India',
        "isDefault" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(sql);
    console.log('✅ DDL Migration applied successfully! All shipping columns & tables exist.');
    client.release();
  } catch (err: any) {
    console.error('❌ DDL Migration error:', err.message);
  } finally {
    await pool.end();
  }
}

runShippingDDL();
