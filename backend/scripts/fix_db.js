const prisma = require('../dist/prisma').default;

async function main() {
  try {
    console.log('Connecting to database via dist/prisma...');
    const columns = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name = 'studio_settings';");
    console.log('Columns in studio_settings:');
    const colNames = columns.map(c => c.column_name);
    console.log(colNames);

    // List of columns in Prisma schema for studio_settings that might be missing in DB
    const expectedColumns = [
      { name: 'learningHubEnabled', type: 'BOOLEAN DEFAULT false' },
      { name: 'maintenanceMode', type: 'BOOLEAN DEFAULT false' },
      { name: 'allowFirstOrderCod', type: 'BOOLEAN DEFAULT true' },
      { name: 'requirePhoneVerification', type: 'BOOLEAN DEFAULT true' },
      { name: 'requireEmailVerification', type: 'BOOLEAN DEFAULT false' },
      { name: 'codOtpRequired', type: 'BOOLEAN DEFAULT true' },
    ];

    for (const col of expectedColumns) {
      if (!colNames.includes(col.name)) {
        console.log(`Adding missing column "${col.name}" to studio_settings table...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE studio_settings ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`);
        console.log(`✅ Column "${col.name}" added successfully!`);
      } else {
        console.log(`Column "${col.name}" already exists.`);
      }
    }

    console.log('\nAll studio_settings columns verified!');
  } catch (err) {
    console.error('Error checking/updating database:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
