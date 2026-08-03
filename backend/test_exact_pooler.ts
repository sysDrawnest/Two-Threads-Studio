import { Pool } from 'pg';

const poolerUrl = 'postgresql://postgres.fhacopfygmyqzqlnsvhk:IYhgBEAOs7A1r9FV@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';

console.log('Testing connection to discovered pooler URL...');
const pool = new Pool({
  connectionString: poolerUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});

pool.query('SELECT current_database(), current_user, version()', (err, res) => {
  if (err) {
    console.error('❌ Connection Failed:', err.message);
  } else {
    console.log('🎉 SUCCESS! Connected to Supabase Pooler instantly!');
    console.log('Database details:', res.rows[0]);
  }
  pool.end();
});
