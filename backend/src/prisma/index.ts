import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import logger from '../lib/logger';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaConfig: any = { adapter };
if (env.NODE_ENV === 'development') {
  prismaConfig.log = [{ emit: 'event', level: 'query' }];
}

const prisma = new PrismaClient(prismaConfig);

if (env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    const duration = e.duration;
    if (duration > 150) {
      logger.info({
        type: 'slow_query',
        duration,
        route: e.query,
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
      logger.info({
        type: 'database_query',
        query: querySummary,
        duration,
      });
    }
  });
}

export default prisma;
