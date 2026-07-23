import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import logger from '../lib/logger';

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
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'two-threads-studio/products',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error || !result) {
              logger.error({ error }, '[UploadService] Cloudinary upload failed');
              return reject(error || new Error('Cloudinary upload returned null result'));
            }
            resolve({
              url: result.secure_url,
              filename: result.public_id,
              provider: 'cloudinary',
            });
          }
        );
        stream.end(file.buffer);
      });
    }

    // Local storage fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/${filename}`,
      filename,
      provider: 'local',
    };
  },
};
