/**
 * import.controller.ts
 * Phase 10 — Enterprise PIM Bulk Import & Export Engine
 */

import { Request, Response } from 'express';
import multer from 'multer';
import prisma from '../prisma';
import { successResponse } from '../utils/response';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import {
  parseSpreadsheet,
  validateImportDryRun,
  processImportJob,
  cancelImportJob,
  generateFailedRowsCsv,
  exportCatalogCsv,
  generateSampleTemplate,
  ParsedProductRow,
} from '../services/import.service';
import { DuplicateStrategy, ImportJobStatus, ImportMode } from '@prisma/client';

// ─── Multer — memory storage, 20 MB limit ────────────────────────────────────

export const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.toLowerCase();
    if (
      file.mimetype.startsWith('text/') ||
      file.mimetype.includes('spreadsheet') ||
      file.mimetype.includes('excel') ||
      ext.endsWith('.csv') ||
      ext.endsWith('.xlsx')
    ) {
      cb(null, true);
    } else {
      cb(new AppError('Only .csv and .xlsx files are allowed', HTTP_STATUS.BAD_REQUEST) as any);
    }
  },
}).single('file');

// ─── 1. Upload + Dry-Run Validation ──────────────────────────────────────────

export const uploadImportFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('No file uploaded', HTTP_STATUS.BAD_REQUEST);

  const userId = (req as any).user?.id as string;
  if (!userId) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

  const importMode = (req.body.importMode as string) || 'CREATE_ONLY';
  const duplicateStrategy = (req.body.duplicateStrategy as string) || 'SKIP';
  const validationOnly = (req.body.validationOnly as string) !== 'false'; // defaults true

  const rows = parseSpreadsheet(req.file.buffer, req.file.mimetype);
  if (rows.length === 0) throw new AppError('File is empty or has no data rows', HTTP_STATUS.BAD_REQUEST);

  const job = await prisma.importJob.create({
    data: {
      userId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.originalname.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 'csv',
      status: ImportJobStatus.PENDING,
      importMode: importMode as ImportMode,
      duplicateStrategy: duplicateStrategy as DuplicateStrategy,
      validationOnly,
      totalRows: rows.length,
    },
  });

  const validationSummary = await validateImportDryRun(job.id, rows);

  if (validationOnly) {
    // Store parsed rows in memory temporarily via global map — they'll be passed in startImport body
    return successResponse(
      res,
      { job: { id: job.id }, validation: validationSummary },
      'Validation complete — review and confirm to start import'
    );
  }

  // Start immediately without dry-run confirmation
  setImmediate(() => {
    processImportJob(job.id, rows, {
      importMode: importMode as ImportMode,
      duplicateStrategy: duplicateStrategy as DuplicateStrategy,
    }).catch(() => {});
  });

  return successResponse(
    res,
    { jobId: job.id, validation: validationSummary },
    'Import job started',
    HTTP_STATUS.ACCEPTED
  );
});

// ─── 2. Confirm & Start Import ────────────────────────────────────────────────

export const startImport = catchAsync(async (req: Request, res: Response) => {
  const jobId = String(req.params.id);
  const importMode = req.body.importMode ? String(req.body.importMode) : undefined;
  const duplicateStrategy = req.body.duplicateStrategy ? String(req.body.duplicateStrategy) : undefined;
  const rows = req.body.rows as ParsedProductRow[] | undefined;

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    throw new AppError('No row data provided. Re-upload the file to import.', HTTP_STATUS.BAD_REQUEST);
  }

  const job = await prisma.importJob.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError('Import job not found', HTTP_STATUS.NOT_FOUND);
  if (job.status !== ImportJobStatus.VALIDATED && job.status !== ImportJobStatus.PENDING) {
    throw new AppError(`Job cannot be started from status: ${job.status}`, HTTP_STATUS.BAD_REQUEST);
  }

  const resolvedMode = (importMode ?? String(job.importMode)) as ImportMode;
  const resolvedStrategy = (duplicateStrategy ?? String(job.duplicateStrategy)) as DuplicateStrategy;

  await prisma.importJob.update({
    where: { id: jobId },
    data: { importMode: resolvedMode, duplicateStrategy: resolvedStrategy, validationOnly: false },
  });

  setImmediate(() => {
    processImportJob(jobId, rows, {
      importMode: resolvedMode,
      duplicateStrategy: resolvedStrategy,
    }).catch(() => {});
  });

  return successResponse(res, { jobId }, 'Import started', HTTP_STATUS.ACCEPTED);
});

// ─── 3. Cancel Import ────────────────────────────────────────────────────────

export const cancelImport = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const adminId = (req as any).user?.id as string;
  await cancelImportJob(id, adminId);
  return successResponse(res, { jobId: id }, 'Import job cancelled');
});

// ─── 4. Live Progress ────────────────────────────────────────────────────────

export const getJobStatus = catchAsync(async (req: Request, res: Response) => {
  const job = await prisma.importJob.findUnique({ where: { id: String(req.params.id) } });
  if (!job) throw new AppError('Import job not found', HTTP_STATUS.NOT_FOUND);

  const progressPct = job.totalRows > 0
    ? Math.round((job.processedRows / job.totalRows) * 100)
    : 0;

  return successResponse(res, { ...job, progressPct });
});

// ─── 5. Job Detail + Row Errors ──────────────────────────────────────────────

export const getJobDetail = catchAsync(async (req: Request, res: Response) => {
  const job = await prisma.importJob.findUnique({
    where: { id: String(req.params.id) },
    include: {
      rows: {
        where: { status: 'FAILED' },
        orderBy: { rowNumber: 'asc' },
        take: 200,
      },
    },
  });
  if (!job) throw new AppError('Import job not found', HTTP_STATUS.NOT_FOUND);
  return successResponse(res, job);
});

// ─── 6. List Jobs ─────────────────────────────────────────────────────────────

export const listImportJobs = catchAsync(async (_req: Request, res: Response) => {
  const jobs = await prisma.importJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      fileName: true,
      fileType: true,
      status: true,
      totalRows: true,
      processedRows: true,
      createdProducts: true,
      updatedProducts: true,
      failedProducts: true,
      skippedProducts: true,
      durationMs: true,
      createdAt: true,
      completedAt: true,
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });
  return successResponse(res, jobs);
});

// ─── 7. Download Failed Rows CSV ─────────────────────────────────────────────

export const downloadFailedRows = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const csv = await generateFailedRowsCsv(id);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="failed_rows_${id}.csv"`);
  res.send(csv);
});

// ─── 8. Sample Template Download ─────────────────────────────────────────────

export const downloadSampleTemplate = catchAsync(async (req: Request, res: Response) => {
  const rawType = String(req.query.type ?? 'basic');
  const type = (['basic', 'variants', 'images'].includes(rawType) ? rawType : 'basic') as 'basic' | 'variants' | 'images';
  const csv = generateSampleTemplate(type);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="twothreads_import_template_${type}.csv"`);
  res.send(csv);
});

// ─── 9. Export Catalog ────────────────────────────────────────────────────────

export const exportCatalog = catchAsync(async (req: Request, res: Response) => {
  const status = Array.isArray(req.query.status) ? String(req.query.status[0]) : req.query.status as string | undefined;
  const categoryId = Array.isArray(req.query.categoryId) ? String(req.query.categoryId[0]) : req.query.categoryId as string | undefined;
  const collectionId = Array.isArray(req.query.collectionId) ? String(req.query.collectionId[0]) : req.query.collectionId as string | undefined;
  const search = Array.isArray(req.query.search) ? String(req.query.search[0]) : req.query.search as string | undefined;

  const csv = await exportCatalogCsv({ status, categoryId, collectionId, search });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="twothreads_catalog_export_${Date.now()}.csv"`);
  res.send(csv);
});
