/**
 * Maintenance Mode Protection Middleware
 *
 * Intercepts customer API requests when maintenanceMode is ON in PostgreSQL.
 * Allows:
 *  - All /auth/*, /maintenance/status, /features, /health, /admin/* routes
 *  - Any request from an authenticated ADMIN user (req.user?.role === 'ADMIN')
 * Returns HTTP 503 for non-admin customer data API requests when maintenanceMode is ON.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { verifyAccessToken } from '../lib/jwt';

const EXEMPT_PATH_PREFIXES = [
  '/api/v1/auth',
  '/api/v1/maintenance',
  '/api/v1/features',
  '/api/v1/admin',
  '/api/v1/health',
];

export const checkMaintenanceMode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Check if request path is exempt from maintenance blocking
    const path = req.originalUrl || req.url;
    const isExemptPath = EXEMPT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

    if (isExemptPath) {
      return next();
    }

    // 2. Optional token decoding to attach admin user if present
    if (!req.user && req.headers.authorization?.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = verifyAccessToken(token);
        if (decoded && (decoded.role === 'ADMIN' || decoded.role === 'admin')) {
          req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: 'ADMIN' as any,
          };
        }
      } catch {
        // Token invalid or expired — proceed with check
      }
    }

    // 3. Admin bypass check
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === ('admin' as any))) {
      return next();
    }

    // 4. Query PostgreSQL for maintenanceMode state
    const settings = await prisma.studioSettings.findUnique({
      where: { singleton: true },
      select: { maintenanceMode: true },
    });

    if (settings?.maintenanceMode) {
      return res.status(503).json({
        error: 'MAINTENANCE_MODE',
        message: 'Two Threads Studio is currently undergoing scheduled maintenance.',
        maintenanceMode: true,
      });
    }

    return next();
  } catch (err) {
    // Fail Open Strategy: DB error should not accidentally block API requests
    return next();
  }
};
