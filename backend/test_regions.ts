import { Pool } from 'pg';

const regions = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com'
];

const projectRef = 'fhacopfygmyqzqlnsvhk';
const pass = 'IYhgBEAOs7A1r9FV';

async function testAll() {
  for (const region of regions) {
    for (const port of [6543, 5432]) {
      const url = `postgresql://postgres.${projectRef}:${pass}@${region}:${port}/postgres`;
      const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 3000 });
      try {
        const res = await pool.query('SELECT 1');
        console.log(`✅ SUCCESS! Working URL: postgresql://postgres.${projectRef}:[PASSWORD]@${region}:${port}/postgres`);
        await pool.end();
        return url;
      } catch (err: any) {
        console.log(`Failed ${region}:${port} -> ${err.message}`);
        await pool.end().catch(() => {});
      }
    }
  }
}

testAll().then(() => process.exit(0));
