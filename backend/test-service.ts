import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();

async function testApi() {
  try {
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) throw new Error("No admin user found");
    
    // We need to generate a valid token. Or just use a bypass.
    // Instead of doing HTTP request, let's just use the productService directly!
    // This is backend code!
    
    const { productService } = require('./src/services/product.service');
    
    const dto = {
      name: "Service Test Mul Images",
      description: "Test Description",
      categoryId: "cm02v893x0000test",
      price: 150,
      stockQuantity: 10,
      trackInventory: true,
      images: [
        { url: "http://example.com/api1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "http://example.com/api2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "http://example.com/api3.jpg", isPrimary: false, sortOrder: 2 }
      ]
    };
    
    // Fake category since cm02v893x0000test might not exist
    const category = await prisma.category.findFirst();
    dto.categoryId = category.id;
    
    const result = await productService.createProduct(dto);
    console.log("Created product with ID:", result.id);
    
    // Re-fetch to check images
    const saved = await prisma.product.findUnique({
      where: { id: result.id },
      include: { images: true, media: true }
    });
    
    console.log("Saved ProductImages count:", saved.images.length);
    console.log(saved.images);
    console.log("Saved ProductMedia count:", saved.media.length);
    console.log(saved.media);
    
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testApi();
