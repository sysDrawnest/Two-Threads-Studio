import app, { logger } from './app';
import { env } from './config/env';
import prisma from './prisma';

const startServer = async () => {
  try {
    // Attempt database connection
    await prisma.$connect();
    logger.info('✅ Successfully connected to Supabase PostgreSQL');

    // Start Express server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
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
