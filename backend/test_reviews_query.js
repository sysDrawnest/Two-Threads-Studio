const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const where = {
    productId: 'prod-p1',
    status: 'APPROVED',
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip: 0,
      take: 6,
      orderBy: [
        { isPinned: 'desc' },
        { helpfulCount: 'desc' }
      ],
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        media: true,
      },
    }),
    prisma.review.count({ where }),
  ]);

  console.log('REVIEWS:', JSON.stringify(reviews, null, 2));
  console.log('TOTAL:', total);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
