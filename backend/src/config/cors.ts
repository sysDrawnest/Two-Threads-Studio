import { env } from './env';

/**
 * Returns array of allowed frontend origin URLs configured in environment.
 * Supports comma-separated strings (e.g., "https://twothreads.vercel.app,http://localhost:3000").
 */
const getAllowedOrigins = (): string[] => {
  if (!env.FRONTEND_URL) return ['http://localhost:3000', 'http://localhost:5173'];
  return env.FRONTEND_URL.split(',').map((url) => url.trim()).filter(Boolean);
};

export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // 1. Allow non-browser requests (mobile apps, curl, server-to-server, webhooks)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = getAllowedOrigins();

    // 2. Check exact matches configured in FRONTEND_URL
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. Allow local development origins
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    // 4. Allow Vercel preview & production deployments (*.vercel.app)
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch {
      // Invalid URL format
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'x-guest-id'],
};
