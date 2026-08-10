const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const columns = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name = 'studio_settings';");
    console.log('Columns in studio_settings:');
    console.log(columns.map(c => c.column_name));

    // Try adding the missing column if it doesn't exist
    const hasLearningHub = columns.some(c => c.column_name === 'learningHubEnabled');
    if (!hasLearningHub) {
      console.log('Adding learningHubEnabled column to studio_settings table...');
      await prisma.$executeRawUnsafe('ALTER TABLE studio_settings ADD COLUMN IF NOT EXISTS "learningHubEnabled" BOOLEAN DEFAULT false;');
      console.log('✅ Column learningHubEnabled added successfully!');
    } else {
      console.log('learningHubEnabled column already exists.');
    }
  } catch (err) {
    console.error('Error checking/modifying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
