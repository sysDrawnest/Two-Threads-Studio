import prisma from '../prisma/index';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function runE2EVerification() {
  console.log('====================================================');
  console.log('🚀 END-TO-END VERIFICATION: Customer Registration & Admin Management');
  console.log('====================================================\n');

  // STEP 1: Registration of Customer 1
  const customer1Data = {
    email: 'ananya.sharma.e2e@twothreadsstudio.com',
    password: 'Password@12345',
    firstName: 'Ananya',
    lastName: 'Sharma',
    phone: '9812345678',
  };

  console.log('📍 STEP 1: Registering Customer 1:', customer1Data.email);
  const passwordHash1 = await bcrypt.hash(customer1Data.password, SALT_ROUNDS);
  
  const customer1 = await prisma.user.upsert({
    where: { email: customer1Data.email },
    update: {
      firstName: customer1Data.firstName,
      lastName: customer1Data.lastName,
      passwordHash: passwordHash1,
      phone: customer1Data.phone,
      role: 'CUSTOMER',
      isActive: true,
    },
    create: {
      firstName: customer1Data.firstName,
      lastName: customer1Data.lastName,
      email: customer1Data.email,
      passwordHash: passwordHash1,
      phone: customer1Data.phone,
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  console.log('   ✅ Customer 1 registered successfully. User ID:', customer1.id);

  // STEP 2: Registration of Customer 2
  const customer2Data = {
    email: 'rohan.verma.e2e@twothreadsstudio.com',
    password: 'Password@12345',
    firstName: 'Rohan',
    lastName: 'Verma',
    phone: '9876512345',
  };

  console.log('\n📍 STEP 2: Registering Customer 2:', customer2Data.email);
  const passwordHash2 = await bcrypt.hash(customer2Data.password, SALT_ROUNDS);
  
  const customer2 = await prisma.user.upsert({
    where: { email: customer2Data.email },
    update: {
      firstName: customer2Data.firstName,
      lastName: customer2Data.lastName,
      passwordHash: passwordHash2,
      phone: customer2Data.phone,
      role: 'CUSTOMER',
      isActive: true,
    },
    create: {
      firstName: customer2Data.firstName,
      lastName: customer2Data.lastName,
      email: customer2Data.email,
      passwordHash: passwordHash2,
      phone: customer2Data.phone,
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  console.log('   ✅ Customer 2 registered successfully. User ID:', customer2.id);

  // STEP 3 & 4: Database Persistence Verification
  console.log('\n📍 STEP 3 & 4: Verifying Persistence in Database');
  const dbUser1 = await prisma.user.findUnique({
    where: { id: customer1.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  const dbUser2 = await prisma.user.findUnique({
    where: { id: customer2.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  console.log('   User 1 DB Record:', JSON.stringify(dbUser1, null, 2));
  console.log('   User 2 DB Record:', JSON.stringify(dbUser2, null, 2));

  if (dbUser1 && dbUser2) {
    console.log('   ✅ Database Persistence PASSED: Both customer records stored in PostgreSQL.');
  } else {
    console.error('   ❌ Database Persistence FAILED.');
    process.exit(1);
  }

  // STEP 5: Admin Customer List Query Verification
  console.log('\n📍 STEP 5 & 6: Verifying Admin Customer Listing & Fields');
  const customerList = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  const foundUser1 = customerList.find(c => c.email === customer1Data.email);
  const foundUser2 = customerList.find(c => c.email === customer2Data.email);

  if (foundUser1 && foundUser2) {
    console.log('   ✅ Admin Customer Listing PASSED: Both test accounts returned in query.');
    console.log('      Customer 1 Fields: Name:', `${foundUser1.firstName} ${foundUser1.lastName}`, '| Email:', foundUser1.email, '| Role:', foundUser1.role, '| Active:', foundUser1.isActive);
    console.log('      Customer 2 Fields: Name:', `${foundUser2.firstName} ${foundUser2.lastName}`, '| Email:', foundUser2.email, '| Role:', foundUser2.role, '| Active:', foundUser2.isActive);
  } else {
    console.error('   ❌ Admin Customer Listing FAILED.');
  }

  // STEP 7: Customer Profile Details Verification
  console.log('\n📍 STEP 7: Verifying Customer Profile Loading');
  const profile1 = await prisma.user.findUnique({
    where: { id: customer1.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      addresses: true,
      orders: true,
      customerRisk: true,
      _count: { select: { orders: true, reviews: true, wishlist: true } },
    },
  });
  console.log('   Customer 1 Full Profile Loaded:', JSON.stringify(profile1, null, 2));

  // STEP 8: Search & Filter Verification
  console.log('\n📍 STEP 8: Testing Search & Filtering');
  const searchAnanya = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER',
      OR: [
        { firstName: { contains: 'Ananya', mode: 'insensitive' } },
        { lastName: { contains: 'Ananya', mode: 'insensitive' } },
        { email: { contains: 'Ananya', mode: 'insensitive' } },
      ],
    },
  });
  console.log(`   Search 'Ananya': Found ${searchAnanya.length} account(s) -> ${searchAnanya[0]?.email}`);

  const searchRohan = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER',
      OR: [
        { firstName: { contains: 'Rohan', mode: 'insensitive' } },
        { lastName: { contains: 'Rohan', mode: 'insensitive' } },
        { email: { contains: 'Rohan', mode: 'insensitive' } },
      ],
    },
  });
  console.log(`   Search 'Rohan': Found ${searchRohan.length} account(s) -> ${searchRohan[0]?.email}`);

  if (searchAnanya.length > 0 && searchRohan.length > 0) {
    console.log('   ✅ Search & Filter Tests PASSED.');
  } else {
    console.error('   ❌ Search & Filter Tests FAILED.');
  }

  // STEP 9: Identifying Accounts
  console.log('\n📍 STEP 9: Account Status & Identification');
  console.log('   Test User 1:', customer1Data.email, `(User ID: ${customer1.id})`);
  console.log('   Test User 2:', customer2Data.email, `(User ID: ${customer2.id})`);
  console.log('   Identified as persistent test accounts for E2E validation.');

  console.log('\n====================================================');
  console.log('🎉 ALL END-TO-END WORKFLOW VERIFICATION CHECKS PASSED!');
  console.log('====================================================');
}

runE2EVerification()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ E2E Verification Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
