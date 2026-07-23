import prisma from '../prisma';

async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
      media: true,
    },
  });

  console.log('Total products found:', products.length);
  for (const p of products) {
    console.log('====================================================');
    console.log('ID:', p.id);
    console.log('Name:', p.name);
    console.log('Slug:', p.slug);
    console.log('ogImageUrl:', p.ogImageUrl);
    console.log('Images count (ProductImage relation):', p.images.length);
    console.log('Images array:', JSON.stringify(p.images, null, 2));
    console.log('Media count (ProductMedia relation):', p.media.length);
    console.log('Media array:', JSON.stringify(p.media, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
