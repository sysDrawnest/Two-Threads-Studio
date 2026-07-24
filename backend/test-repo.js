const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { productRepository } = require('./src/repositories/product.repository');

async function test() {
  try {
    const category = await prisma.category.findFirst();
    if (!category) throw new Error("No category found");
    
    const dto = {
      name: "Direct Repo Test",
      description: "Testing repository",
      price: 150,
      stockQuantity: 10,
      trackInventory: true,
      categoryId: category.id,
      images: [
        { url: "http://example.com/repo1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "http://example.com/repo2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "http://example.com/repo3.jpg", isPrimary: false, sortOrder: 2 }
      ]
    };
    
    const result = await productRepository.create({
      slug: "direct-repo-test-unique-slug",
      dto: dto,
      categoryId: category.id
    });
    
    console.log("Created successfully!");
    
    // Check what was persisted
    const saved = await prisma.product.findUnique({
      where: { id: result.id },
      include: {
        images: true,
        media: true
      }
    });
    
    console.log("Images array:", saved.images);
    console.log("Media array:", saved.media);
    
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
