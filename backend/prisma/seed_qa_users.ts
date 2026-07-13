import prisma from '../src/prisma/index';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Checking / Seeding QA Test Users...');

  // 1. QA Customer
  const customerEmail = 'qa.customer@test.twothreadsstudio.com';
  const customerPassword = 'Test@12345';
  const customerPasswordHash = await bcrypt.hash(customerPassword, SALT_ROUNDS);

  const existingCustomer = await prisma.user.findUnique({
    where: { email: customerEmail },
  });

  if (!existingCustomer) {
    const customer = await prisma.user.create({
      data: {
        firstName: 'QA Test',
        lastName: 'User',
        email: customerEmail,
        passwordHash: customerPasswordHash,
        phone: '9876543210',
        role: Role.CUSTOMER,
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`✅ Created QA Customer User: ${customer.email}`);
  } else {
    // Update password to be sure it is correct
    await prisma.user.update({
      where: { id: existingCustomer.id },
      data: {
        passwordHash: customerPasswordHash,
        firstName: 'QA Test',
        lastName: 'User',
        phone: '9876543210',
        role: Role.CUSTOMER,
        isActive: true,
      },
    });
    console.log(`ℹ️ QA Customer User already exists. Reset password and details.`);
  }

  // 2. QA Admin
  const adminEmail = 'admin@twothreads.com';
  const adminPassword = 'Admin@12345';
  const adminPasswordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'Account',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: Role.ADMIN,
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`✅ Created QA Admin User: ${admin.email}`);
  } else {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        passwordHash: adminPasswordHash,
        firstName: 'Admin',
        lastName: 'Account',
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`ℹ️ QA Admin User already exists. Reset password.`);
  }

  console.log('🎉 Seeding QA Test Users Complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Failed to seed QA users:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
