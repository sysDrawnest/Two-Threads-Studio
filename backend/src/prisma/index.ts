import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import logger from '../lib/logger';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  logger.warn({ errorMsg: err.message }, '[PostgreSQL Pool] Idle connection reset handled by pool');
});

const adapter = new PrismaPg(pool);

const prismaConfig: any = { adapter };
if (env.NODE_ENV === 'development') {
  prismaConfig.log = [{ emit: 'event', level: 'query' }];
}

const prisma = new PrismaClient(prismaConfig);

if (env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    const duration = e.duration;
    if (duration > 400) {
      let severity = 'WARNING';
      if (duration > 2000) {
        severity = 'CRITICAL';
      } else if (duration > 1000) {
        severity = 'SEVERE';
      }
      logger.info({
        type: 'slow_query',
        severity,
        duration,
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
