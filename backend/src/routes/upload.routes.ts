import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { getUploadStatus, uploadSingleImage, uploadMultipleImages } from '../controllers/upload.controller';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ];
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          `Unsupported image format "${file.mimetype}". Allowed formats: JPEG, PNG, WEBP, GIF, SVG, AVIF.`,
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_FILE_TYPE'
        ) as any
      );
    }
  },
});

/**
 * Multer error handler middleware.
 * Converts multer's MulterError into structured JSON API errors.
 */
function handleMulterError(err: any, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(
          `File is too large. Maximum allowed size is 10 MB per image.`,
          HTTP_STATUS.BAD_REQUEST,
          'FILE_TOO_LARGE'
        )
      );
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(
        new AppError(
          `Too many files. You can upload a maximum of 10 images at once.`,
          HTTP_STATUS.BAD_REQUEST,
          'TOO_MANY_FILES'
        )
      );
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(
        new AppError(
          `Unexpected form field "${err.field}". Use "image" for single upload or "images" for multiple.`,
          HTTP_STATUS.BAD_REQUEST,
          'UNEXPECTED_FIELD'
        )
      );
    }
    return next(new AppError(err.message, HTTP_STATUS.BAD_REQUEST, 'UPLOAD_ERROR'));
  }
  // Pass through non-multer errors unchanged
  next(err);
}

const router = Router();

// ── Public status check — no auth required ──────────────────────────────────
router.get('/status', getUploadStatus);

// ── Protected admin upload routes ───────────────────────────────────────────
router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.post(
  '/single',
  upload.single('image'),
  handleMulterError,
  uploadSingleImage
);

router.post(
  '/multiple',
  upload.array('images', 10),
  handleMulterError,
  uploadMultipleImages
);

export default router;
