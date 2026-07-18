import { Role } from '@prisma/client';
import { hashPassword } from '../lib/crypto';
import prisma from '../prisma';

async function main() {
  const email = 'admin@twothreads.com';
  const password = 'password123';
  const passwordHash = await hashPassword(password);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`Updated existing admin user: ${email} with password: ${password}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        isActive: true,
        isVerified: true,
      },
    });
    console.log(`Created new admin user: ${email} with password: ${password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
