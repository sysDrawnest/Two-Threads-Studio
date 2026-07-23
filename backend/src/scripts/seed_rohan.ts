import prisma from '../prisma/index';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function main() {
  const customerEmail = 'rohan.verma.e2e@twothreadsstudio.com';
  const customerPassword = 'Password@12345';
  const customerPasswordHash = await bcrypt.hash(customerPassword, SALT_ROUNDS);

  const existingCustomer = await prisma.user.findUnique({
    where: { email: customerEmail },
  });

  if (!existingCustomer) {
    const customer = await prisma.user.create({
      data: {
        firstName: 'Rohan',
        lastName: 'Verma',
        email: customerEmail,
        passwordHash: customerPasswordHash,
        phone: '9876512345',
        role: 'CUSTOMER',
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`✅ Created Rohan Verma Customer User: ${customer.email}`);
  } else {
    // Update password to be sure it is correct
    await prisma.user.update({
      where: { id: existingCustomer.id },
      data: {
        passwordHash: customerPasswordHash,
        firstName: 'Rohan',
        lastName: 'Verma',
        phone: '9876512345',
        role: 'CUSTOMER',
        isActive: true,
        isVerified: true,
      },
    });
    console.log(`ℹ️ Rohan Verma Customer User already exists. Reset password and details.`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Failed to seed Rohan Verma user:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
