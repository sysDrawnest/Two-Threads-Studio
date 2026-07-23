import prisma from '../prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: {
      ogImageUrl: { not: null },
    },
    include: { images: true },
  });

  console.log(`Found ${products.length} products with ogImageUrl`);

  for (const p of products) {
    if (p.ogImageUrl && p.images.length === 0) {
      console.log(`Fixing product images relation for "${p.name}" (${p.id})...`);
      await prisma.productImage.create({
        data: {
          productId: p.id,
          url: p.ogImageUrl,
          isPrimary: true,
          sortOrder: 0,
        },
      });
      console.log(`Created primary ProductImage for "${p.name}" -> ${p.ogImageUrl}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
