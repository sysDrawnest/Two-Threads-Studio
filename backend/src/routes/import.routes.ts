/**
 * import.routes.ts
 * Phase 10 — Enterprise PIM Bulk Import & Export Engine
 *
 * All routes protected by requireAuth + requireRole('ADMIN')
 */

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  importUpload,
  uploadImportFile,
  startImport,
  cancelImport,
  getJobStatus,
  getJobDetail,
  listImportJobs,
  downloadFailedRows,
  downloadSampleTemplate,
  exportCatalog,
} from '../controllers/import.controller';

const router = Router();

// All import routes require admin auth
router.use(requireAuth, requireRole('ADMIN'));

// ─── File Upload & Validation ─────────────────────────────────────────────
// POST /api/v1/admin/import/upload
// Accept multipart/form-data with file, importMode, duplicateStrategy, validationOnly
router.post('/upload', importUpload, uploadImportFile);

// ─── Start Confirmed Import (post dry-run) ────────────────────────────────
// POST /api/v1/admin/import/jobs/:id/start
router.post('/jobs/:id/start', startImport);

// ─── Cancel Running Import ────────────────────────────────────────────────
// POST /api/v1/admin/import/jobs/:id/cancel
router.post('/jobs/:id/cancel', cancelImport);

// ─── Live Progress Polling ────────────────────────────────────────────────
// GET /api/v1/admin/import/jobs/:id
router.get('/jobs/:id', getJobStatus);

// ─── Job Detail + Row Errors ──────────────────────────────────────────────
// GET /api/v1/admin/import/jobs/:id/detail
router.get('/jobs/:id/detail', getJobDetail);

// ─── Job History ──────────────────────────────────────────────────────────
// GET /api/v1/admin/import/jobs
router.get('/jobs', listImportJobs);

// ─── Download Failed Rows CSV ─────────────────────────────────────────────
// GET /api/v1/admin/import/jobs/:id/failed-rows
router.get('/jobs/:id/failed-rows', downloadFailedRows);

// ─── Sample Template Download ─────────────────────────────────────────────
// GET /api/v1/admin/import/template?type=basic|variants|images
router.get('/template', downloadSampleTemplate);

// ─── Catalog Export ───────────────────────────────────────────────────────
// GET /api/v1/admin/import/export?status=ACTIVE&categoryId=...&search=...
router.get('/export', exportCatalog);

export default router;
