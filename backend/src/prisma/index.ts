import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import logger from '../lib/logger';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// ─── Connection Pool ──────────────────────────────────────────────────────────
// Prisma 7 uses a TypeScript-based ("Rust-free") client engine that requires a
// driver adapter for database connectivity. We use the official @prisma/adapter-pg
// which wraps node-postgres (pg) under the hood.
//
// Pool sizing:
//   • Supabase free-tier pooler (PgBouncer) supports ~60 client connections.
//   • We keep max=4 so multiple nodemon restarts or concurrent dev server
//     instances don't exhaust the limit.
//   • connectionTimeoutMillis=5000 → fail-fast (not 30 second hangs) when
//     the pool is saturated.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 4,
  idleTimeoutMillis: 5000,       // Evict idle connections quickly before Supabase drops them
  connectionTimeoutMillis: 5000, // Fail-fast: 5 s instead of hanging for 30 s
  keepAlive: true,
  keepAliveInitialDelayMillis: 2000,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  logger.warn({ errorMsg: err.message }, '[PostgreSQL Pool] Idle client error — connection dropped');
});

const adapter = new PrismaPg(pool);
const prismaConfig: any = { adapter };
if (env.NODE_ENV === 'development') {
  prismaConfig.log = [{ emit: 'event', level: 'query' }];
}

const prisma = new PrismaClient(prismaConfig);

import { requestContext } from '../lib/requestContext';

if (env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    const duration = e.duration;
    if (duration > 1500) {
      let severity = 'WARNING';
      if (duration > 5000) {
        severity = 'CRITICAL';
      } else if (duration > 3000) {
        severity = 'SEVERE';
      }
      const store = requestContext.getStore();
      const routeStr = store ? `${store.method} ${store.route}` : 'System / Background';
      logger.info({
        type: 'slow_query',
        severity,
        duration,
        route: routeStr,
        query: e.query,
      });
    } else {
      let querySummary = e.query;
      const match = e.query.match(/^(SELECT|INSERT|UPDATE|DELETE)\s+.*FROM\s+"public"\."(\w+)"/i) 
                 || e.query.match(/^(INSERT INTO|UPDATE)\s+"public"\."(\w+)"/i);
      if (match) {
        querySummary = `${match[1]} ${match[2]}`;
      } else {
        querySummary = e.query.substring(0, 60) + (e.query.length > 60 ? '...' : '');
      }
      logger.debug({
        type: 'database_query',
        query: querySummary,
        duration,
      });
    }
  });
}

export default prisma;
