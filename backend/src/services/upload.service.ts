import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import logger from '../lib/logger';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

// Configure Cloudinary if env vars are present
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // Set a reasonable upload timeout (30 seconds)
    timeout: 30000,
  });
  logger.info('[UploadService] Cloudinary storage configured successfully.');
} else {
  logger.info('[UploadService] Cloudinary env vars missing — using local storage provider fallback.');
}

export interface UploadResult {
  url: string;
  filename: string;
  provider: 'cloudinary' | 'local';
}

/**
 * Saves a file to local storage (public/uploads/).
 * Used as primary storage when Cloudinary is not configured, or as a fallback when it fails.
 */
async function saveToLocalStorage(file: Express.Multer.File): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, file.buffer);

  // Build absolute URL so the frontend can render the image correctly
  const backendPort = process.env.PORT || '5000';
  const backendBase = process.env.BACKEND_URL || `http://localhost:${backendPort}`;

  return {
    url: `${backendBase}/uploads/${filename}`,
    filename,
    provider: 'local',
  };
}

export const uploadService = {
  isConfigured: (): { configured: boolean; provider: 'cloudinary' | 'local'; message: string } => {
    if (isCloudinaryConfigured) {
      return {
        configured: true,
        provider: 'cloudinary',
        message: 'Cloudinary cloud storage is configured and active.',
      };
    }
    return {
      configured: true, // Local storage fallback active
      provider: 'local',
      message: 'Local server storage is active. Configure CLOUDINARY_* environment variables for cloud CDN hosting.',
    };
  },

  uploadFile: async (file: Express.Multer.File): Promise<UploadResult> => {
    if (isCloudinaryConfigured) {
      try {
        const result = await new Promise<UploadResult>((resolve, reject) => {
          // Wrap in a manual timeout in case the cloudinary SDK timeout doesn't fire
          const timeoutId = setTimeout(() => {
            reject(new AppError(
              'Image upload timed out. Please try again or use a smaller image.',
              HTTP_STATUS.GATEWAY_TIMEOUT,
              'UPLOAD_TIMEOUT'
            ));
          }, 30000);

          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'two-threads-studio/products',
              resource_type: 'auto',
            },
            (error, cloudResult) => {
              clearTimeout(timeoutId);
              if (error || !cloudResult) {
                // ── Log the RAW Cloudinary error object in full ──────────────
                // This captures http_code, name, message, and any extra fields
                // so we can diagnose the real failure from server logs.
                logger.error({
                  cloudinaryError: error,
                  errorType: error ? typeof error : 'null result',
                  httpCode: (error as any)?.http_code,
                  errorName: (error as any)?.name,
                  errorMessage: (error as any)?.message,
                }, '[UploadService] Cloudinary upload_stream callback received error');

                // Normalise Cloudinary plain-object error into a proper AppError
                const message = (error as any)?.message || 'Cloudinary upload failed';
                const httpCode = (error as any)?.http_code;

                if (httpCode === 499 || message.toLowerCase().includes('timeout')) {
                  return reject(new AppError(
                    'Image upload timed out. Falling back to local storage.',
                    HTTP_STATUS.GATEWAY_TIMEOUT,
                    'UPLOAD_TIMEOUT'
                  ));
                }
                if (httpCode === 401 || httpCode === 403) {
                  return reject(new AppError(
                    `Cloudinary authentication failed (HTTP ${httpCode}). Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.`,
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    'CLOUDINARY_AUTH_ERROR'
                  ));
                }
                return reject(new AppError(
                  `${message} (Cloudinary HTTP ${httpCode ?? 'unknown'})`,
                  HTTP_STATUS.INTERNAL_SERVER_ERROR,
                  'CLOUDINARY_ERROR'
                ));
              }
              resolve({
                url: cloudResult.secure_url,
                filename: cloudResult.public_id,
                provider: 'cloudinary',
              });
            }
          );
          stream.end(file.buffer);
        });

        return result;
      } catch (err: any) {
        // If it's a timeout/connectivity error, fall back gracefully to local storage
        if (err instanceof AppError && (err.code === 'UPLOAD_TIMEOUT' || err.statusCode === 504)) {
          logger.warn('[UploadService] Cloudinary timed out — falling back to local storage');
          return saveToLocalStorage(file);
        }
        // Re-throw other AppErrors directly
        if (err instanceof AppError) throw err;
        // Wrap unknown errors
        throw new AppError(
          err?.message || 'Unexpected upload error',
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'UPLOAD_ERROR'
        );
      }
    }

    // Local storage (no Cloudinary configured)
    return saveToLocalStorage(file);
  },
};
