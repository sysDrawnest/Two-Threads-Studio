import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { getUploadStatus, uploadSingleImage, uploadMultipleImages } from '../controllers/upload.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed'));
    }
  },
});

const router = Router();

// Public / auth status check
router.get('/status', getUploadStatus);

// Protected admin upload routes
router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.post('/single', upload.single('image'), uploadSingleImage);
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

export default router;
