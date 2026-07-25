/**
 * diagnose-checkout-flow.ts
 * Tests every API call made during checkout with an admin JWT.
 * Run with: npx tsx diagnose-checkout-flow.ts
 */
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const API_BASE = `http://localhost:${process.env.PORT || 5000}/api/v1`;

async function test(label: string, fn: () => Promise<any>) {
  process.stdout.write(`\n--- ${label} ---\n`);
  try {
    const result = await fn();
    process.stdout.write(`  ✅ Status: ${result.status}\n`);
    process.stdout.write(`  Body: ${JSON.stringify(result.body, null, 2)}\n`);
    return result;
  } catch (e: any) {
    process.stdout.write(`  ❌ Error: ${e.message}\n`);
    return null;
  }
}

async function httpGet(url: string, token: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

async function httpPost(url: string, token: string, payload: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

async function main() {
  // 1. Find admin
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, role: true },
  });
  if (!admin) { console.error('No ADMIN found'); return; }

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    secret,
    { expiresIn: '5m' }
  );

  console.log(`\n🔑 Admin: ${admin.email}`);

  // 2. Test GET /cart
  await test('GET /cart (admin)', () => httpGet(`${API_BASE}/cart`, token));

  // 3. Test GET /addresses
  await test('GET /addresses (admin)', () => httpGet(`${API_BASE}/addresses`, token));

  // 4. Test POST /addresses
  const addrRes = await test('POST /addresses (admin)', () =>
    httpPost(`${API_BASE}/addresses`, token, {
      fullName: 'Test Admin',
      phone: '9876543210',
      line1: '123 Admin Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'IN',
      postalCode: '400001',
      type: 'HOME',
    })
  );

  const addressId = addrRes?.body?.address?.id;
  console.log(`\n  Created addressId: ${addressId}`);

  // 5. Test GET /risk/cod-eligibility (this is called when going to payment step)
  await test('GET /risk/cod-eligibility (admin)', () =>
    httpGet(`${API_BASE}/risk/cod-eligibility?orderTotal=999&productIds=`, token)
  );

  // 6. Test POST /orders (order creation — the real checkout call)
  if (addressId) {
    await test('POST /orders (admin creating order — should this work?)', () =>
      httpPost(`${API_BASE}/orders`, token, {
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'ONLINE',
        notes: 'diagnostic test',
      })
    );

    // Clean up test address
    await prisma.address.delete({ where: { id: addressId } }).catch(() => {});
    console.log('\n  ✅ Test address cleaned up');
  }

  // 7. Test GET /auth/me (verifies the token decodes correctly)
  await test('GET /auth/me (verify token still valid)', () =>
    httpGet(`${API_BASE}/auth/me`, token)
  );

  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => {
  console.error('Script error:', e.message);
  process.exit(1);
});
