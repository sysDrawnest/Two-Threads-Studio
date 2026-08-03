import { Pool } from 'pg';

const testUrl = 'postgresql://postgres.fhacopfygmyqzqlnsvhk:IYhgBEAOs7A1r9FV@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

console.log('Testing connection to Supabase Pooler...');
const pool = new Pool({
  connectionString: testUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});

pool.query('SELECT current_database(), current_user, version()', (err, res) => {
  if (err) {
    console.error('❌ Connection Failed:', err.message);
  } else {
    console.log('✅ CONNECTED SUCCESSFULLY TO SUPABASE POOLER!');
    console.log('Data:', res.rows[0]);
  }
  pool.end();
});
