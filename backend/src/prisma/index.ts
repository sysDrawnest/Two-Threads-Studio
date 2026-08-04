import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import logger from '../lib/logger';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 5000, // Evict idle connections in 5s before Supabase PgBouncer drops them
  connectionTimeoutMillis: 30000, // 30s timeout for new connections to handle pooler latency spikes
  keepAlive: true,
  keepAliveInitialDelayMillis: 2000,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  logger.warn({ errorMsg: err.message }, '[PostgreSQL Pool] Connection error handled cleanly');
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
