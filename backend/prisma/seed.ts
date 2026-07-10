import { PrismaClient } from '@prisma/client';
import { env } from '../src/config/env';

// We must manually pass the URL or adapter if using seed, 
// or simply rely on standard Prisma JS Client behavior in scripts.
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  // await prisma.user.create({ ... })
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed successfully');
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
