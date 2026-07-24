import prisma from './src/prisma';

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'Midnight Bloom Hand Embroidery Kit Test Demo' } },
    include: { images: true }
  });
  console.log("=== PRODUCT ===");
  console.log(JSON.stringify(product, null, 2));

  if (product) {
    const allImages = await prisma.productImage.findMany({
      where: { productId: product.id }
    });
    console.log("=== PRODUCT IMAGES ===");
    console.log(JSON.stringify(allImages, null, 2));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
