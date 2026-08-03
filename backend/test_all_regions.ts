import { Pool } from 'pg';

const regions = [
  'aws-0-ap-south-1',
  'aws-0-ap-southeast-1',
  'aws-0-ap-southeast-2',
  'aws-0-ap-northeast-1',
  'aws-0-ap-northeast-2',
  'aws-0-eu-central-1',
  'aws-0-eu-west-1',
  'aws-0-eu-west-2',
  'aws-0-eu-west-3',
  'aws-0-eu-north-1',
  'aws-0-us-east-1',
  'aws-0-us-east-2',
  'aws-0-us-west-1',
  'aws-0-us-west-2',
  'aws-0-sa-east-1',
  'aws-0-ca-central-1'
];

const projectRef = 'fhacopfygmyqzqlnsvhk';
const pass = 'IYhgBEAOs7A1r9FV';

async function testAll() {
  for (const r of regions) {
    const host = `${r}.pooler.supabase.com`;
    const url = `postgresql://postgres.${projectRef}:${pass}@${host}:6543/postgres`;
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 2000 });
    try {
      const res = await pool.query('SELECT 1');
      console.log(`\n🎉 FOUND IT! Working URL:\nDATABASE_URL=postgresql://postgres.${projectRef}:${pass}@${host}:6543/postgres\n`);
      await pool.end();
      return;
    } catch (err: any) {
      if (!err.message.includes('tenant/user')) {
        console.log(`Region ${r} returned: ${err.message}`);
      }
      await pool.end().catch(() => {});
    }
  }
  console.log('Done searching regions.');
}

testAll().then(() => process.exit(0));
