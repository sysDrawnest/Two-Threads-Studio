import prisma from './src/prisma/index';

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories:', categories);

  const candleCategory = await prisma.category.findFirst({
    where: {
      name: {
        contains: 'Candle',
        mode: 'insensitive'
      }
    }
  });

  if (candleCategory) {
    console.log('Found Candle Category:', candleCategory);
    await prisma.category.update({
      where: { id: candleCategory.id },
      data: {
        name: 'Handkerchiefs',
        slug: 'handkerchiefs'
      }
    });
    console.log('Updated to Handkerchiefs!');
  } else {
    console.log('No Candle Category found.');
  }
}

main().finally(() => prisma.$disconnect());
