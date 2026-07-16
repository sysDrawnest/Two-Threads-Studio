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
    const gracefulShutdown = async () => {
      logger.info('🛑 Received kill signal, shutting down gracefully...');
      server.close(async () => {
        logger.info('💤 Closed out remaining connections');
        await prisma.$disconnect();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error({ err: error }, '❌ Failed to start server or connect to database');
    process.exit(1);
  }
};

startServer();
