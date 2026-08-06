import prisma from './src/prisma/index';

async function main() {
  const candleProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Candle', mode: 'insensitive' } },
        { description: { contains: 'Candle', mode: 'insensitive' } },
        { shortDescription: { contains: 'Candle', mode: 'insensitive' } }
      ]
    }
  });

  if (candleProducts.length > 0) {
    console.log(`Found ${candleProducts.length} Candle Products`);
    for (const p of candleProducts) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          name: p.name.replace(/candle/gi, 'Handkerchief'),
          slug: p.slug.replace(/candle/gi, 'handkerchief'),
          description: p.description?.replace(/candle/gi, 'handkerchief') || '',
          shortDescription: p.shortDescription?.replace(/candle/gi, 'handkerchief') || ''
        }
      });
      console.log(`Updated ${p.name} to Handkerchief variant.`);
    }
  } else {
    console.log('No Candle Products found.');
  }
}

main().finally(() => prisma.$disconnect());
