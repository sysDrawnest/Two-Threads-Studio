import dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

import app from './app';
import { env } from './config/env';
import prisma from './prisma';
import logger from './lib/logger';

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

const startServer = async () => {
  try {
    // Attempt database connection
    await prisma.$connect();
    logger.info('✅ Successfully connected to Supabase PostgreSQL');

    // Start Express server
    const server = app.listen(env.PORT, () => {
      if (env.NODE_ENV === 'development') {
        const border = '-'.repeat(60);
        const dateStr = new Date().toLocaleString('en-IN', { hour12: false });
        console.log(`
\x1b[36m+${border}+
|                                                            |
|                 \x1b[1mTWO THREADS STUDIO API\x1b[0m\x1b[36m                     |
|                                                            |
|        Premium Commerce Backend v1.0.0                     |
|                                                            |
+${border}+\x1b[0m

\x1b[1mEnvironment\x1b[0m      : ${env.NODE_ENV}
\x1b[1mNode\x1b[0m             : ${process.version}
\x1b[1mPort\x1b[0m             : ${env.PORT}
\x1b[1mDatabase\x1b[0m         : Supabase PostgreSQL
\x1b[1mAuthentication\x1b[0m   : JWT
\x1b[1mPayments\x1b[0m         : Razorpay (Sandbox)
\x1b[1mNotifications\x1b[0m    : Resend
\x1b[1mRisk Engine\x1b[0m      : Enabled
\x1b[1mOrder Engine\x1b[0m     : Enabled
\x1b[1mStarted\x1b[0m          : ${dateStr}

\x1b[36m------------------------------------------------------------\x1b[0m

\x1b[32m[OK] Connected to PostgreSQL\x1b[0m
\x1b[32m[OK] Prisma Client Initialized\x1b[0m
\x1b[32m[OK] Event Listeners Registered\x1b[0m
\x1b[32m[OK] Routes Loaded\x1b[0m
\x1b[32m[OK] Server Ready\x1b[0m

\x1b[36m------------------------------------------------------------\x1b[0m
`);
      } else {
        logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.fatal({ err }, 'UNHANDLED REJECTION! 💥 Shutting down...');
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful Shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`🛑 Received ${signal}, shutting down gracefully...`);
      
      // Close idle and active HTTP connections immediately so server.close doesn't hang
      if (typeof server.closeIdleConnections === 'function') {
        server.closeIdleConnections();
      }
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }

      server.close(async () => {
        logger.info('💤 Closed out remaining HTTP connections');
        try {
          await prisma.$disconnect();
          logger.info('💤 Disconnected Prisma client');
        } catch (e) {
          logger.error({ err: e }, 'Error disconnecting Prisma');
        }
        if (signal === 'SIGUSR2') {
          process.kill(process.pid, 'SIGUSR2');
        } else {
          process.exit(0);
        }
      });

      // Force shutdown fallback after 3 seconds
      setTimeout(() => {
        logger.warn('⚠️ Forcefully shutting down server process');
        if (signal === 'SIGUSR2') {
          process.kill(process.pid, 'SIGUSR2');
        } else {
          process.exit(1);
        }
      }, 3000);
    };

    process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.once('SIGINT', () => gracefulShutdown('SIGINT'));
    process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

  } catch (error) {
    logger.error({ err: error }, '❌ Failed to start server or connect to database');
    process.exit(1);
  }
};

startServer();
