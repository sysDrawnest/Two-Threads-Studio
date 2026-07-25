/**
 * diagnose-address.ts
 * Tests POST /api/v1/addresses with an admin JWT to see the exact HTTP response.
 * Run with: npx tsx diagnose-address.ts
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

async function main() {
  // 1. Find the admin user
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, role: true },
  });

  if (!admin) {
    console.error('❌ No ADMIN user found in database');
    return;
  }

  console.log(`\n✅ Found admin: ${admin.email} (id: ${admin.id})`);

  // 2. Create a test JWT for this admin (same logic as the backend)
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    secret,
    { expiresIn: '5m' }
  );

  console.log(`✅ Generated test admin JWT (first 40 chars): ${token.substring(0, 40)}...`);

  // 3. Test GET /addresses
  console.log('\n--- Testing GET /addresses ---');
  const getRes = await fetch(`${API_BASE}/addresses`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const getData = await getRes.json().catch(() => null);
  console.log(`  Status: ${getRes.status} ${getRes.statusText}`);
  console.log(`  Body:`, JSON.stringify(getData, null, 2));

  // 4. Test POST /addresses with valid payload
  console.log('\n--- Testing POST /addresses (admin creating address) ---');
  const payload = {
    fullName: 'Test Admin',
    phone: '9876543210',
    line1: '123 Admin Lane',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'IN',
    postalCode: '400001',
    type: 'HOME',
    isDefaultShipping: false,
    isDefaultBilling: false,
  };

  const postRes = await fetch(`${API_BASE}/addresses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const postData = await postRes.json().catch(() => null);
  console.log(`  Status: ${postRes.status} ${postRes.statusText}`);
  console.log(`  Body:`, JSON.stringify(postData, null, 2));

  // 5. Clean up test address if created
  if (postRes.status === 201 && postData?.address?.id) {
    await prisma.address.delete({ where: { id: postData.address.id } });
    console.log(`\n✅ Test address cleaned up`);
  }

  // 6. Also decode the admin's actual access token from localStorage simulation
  // (shows what a real browser would send)
  console.log('\n--- Admin User DB Record ---');
  const fullAdmin = await prisma.user.findUnique({
    where: { id: admin.id },
    select: { id: true, email: true, role: true, isActive: true, emailVerified: true },
  });
  console.log(JSON.stringify(fullAdmin, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => {
  console.error('Script error:', e.message);
  process.exit(1);
});
