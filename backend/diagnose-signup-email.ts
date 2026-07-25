/**
 * diagnose-signup-email.ts
 * Simulates a real signup request and logs the exact email dispatch result.
 */
import { authService } from './src/services/auth.service';
import prisma from './src/prisma';
import logger from './src/lib/logger';
import * as dotenv from 'dotenv';

dotenv.config();

async function run() {
  const testEmail = `shreyasisahoo116@gmail.com`;

  console.log(`\n--- SIMULATING SIGNUP FOR ${testEmail} ---`);

  // 1. Clean up existing account if present so signup doesn't fail with 409
  const existing = await prisma.user.findUnique({ where: { email: testEmail } });
  if (existing) {
    console.log(`Cleaning up existing user ${existing.id}...`);
    await prisma.address.deleteMany({ where: { userId: existing.id } });
    await prisma.cart.deleteMany({ where: { userId: existing.id } });
    await prisma.refreshToken.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
    console.log('User deleted cleanly.');
  }

  // 2. Perform registration call (same call made by POST /api/v1/auth/register)
  console.log('Calling authService.register()...');
  const user = await authService.register({
    firstName: 'Shreyasi',
    lastName: 'Sahoo',
    email: testEmail,
    password: 'TestPassword123!',
  });

  console.log('User created:', user.id, user.email);
  console.log('Waiting 3 seconds for async email dispatch to finish...');
  await new Promise((r) => setTimeout(r, 3000));
  console.log('Done!');

  await prisma.$disconnect();
}

run().catch((err) => {
  console.error('Error during signup simulation:', err);
  process.exit(1);
});
