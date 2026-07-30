/**
 * importService.ts — Frontend API client for Phase 10 Bulk Import Engine
 */

import { apiClient } from './apiClient';

export interface ImportJob {
  id: string;
  fileName: string;
  fileType: string;
  status: 'PENDING' | 'VALIDATING' | 'VALIDATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  importMode: string;
  duplicateStrategy: string;
  validationOnly: boolean;
  totalRows: number;
  processedRows: number;
  createdProducts: number;
  updatedProducts: number;
  failedProducts: number;
  skippedProducts: number;
  categoriesCreated: number;
  imagesAdded: number;
  variantsCreated: number;
  durationMs: number | null;
  errorSummary: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  progressPct?: number;
}

export interface ValidationRowError {
  rowNumber: number;
  sku?: string;
  name?: string;
  errors: string[];
}

export interface ValidationSummary {
  jobId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateSkuRows: number;
  missingNameRows: number;
  invalidPriceRows: number;
  missingCategoryRows: number;
  rowErrors: ValidationRowError[];
}

export interface UploadResult {
  job?: { id: string };
  jobId?: string;
  validation: ValidationSummary;
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// ─── Upload file for dry-run validation ───────────────────────────────────────
export async function uploadForValidation(
  file: File,
  importMode: string,
  duplicateStrategy: string
): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('importMode', importMode);
  form.append('duplicateStrategy', duplicateStrategy);
  form.append('validationOnly', 'true');

  const res = await apiClient.post('/admin/import/upload', form);
  return res.data;
}

// ─── Upload and immediately start import (skip dry-run) ───────────────────────
export async function uploadAndImport(
  file: File,
  importMode: string,
  duplicateStrategy: string
): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('importMode', importMode);
  form.append('duplicateStrategy', duplicateStrategy);
  form.append('validationOnly', 'false');

  const res = await apiClient.post('/admin/import/upload', form);
  return res.data;
}

// ─── Start confirmed import after dry-run review ──────────────────────────────
export async function startImport(
  jobId: string,
  rows: unknown[],
  importMode: string,
  duplicateStrategy: string
): Promise<{ jobId: string }> {
  const res = await apiClient.post(`/admin/import/jobs/${jobId}/start`, {
    rows,
    importMode,
    duplicateStrategy,
  });
  return res.data;
}

// ─── Cancel running import ────────────────────────────────────────────────────
export async function cancelImport(jobId: string): Promise<void> {
  await apiClient.post(`/admin/import/jobs/${jobId}/cancel`);
}

// ─── Poll live progress ───────────────────────────────────────────────────────
export async function getJobStatus(jobId: string): Promise<ImportJob> {
  const res = await apiClient.get(`/admin/import/jobs/${jobId}`);
  return res.data;
}

// ─── List import history ──────────────────────────────────────────────────────
export async function listImportJobs(): Promise<ImportJob[]> {
  const res = await apiClient.get('/admin/import/jobs');
  return res.data;
}

// ─── Download failed rows CSV ─────────────────────────────────────────────────
export function getFailedRowsDownloadUrl(jobId: string): string {
  const token = localStorage.getItem('tt_access_token') || '';
  return `${BASE_URL}/admin/import/jobs/${jobId}/failed-rows?token=${token}`;
}

// ─── Download sample template (Excel .xlsx or CSV) ───────────────────────────
export function getTemplateDownloadUrl(
  type: 'basic' | 'variants' | 'images',
  format: 'xlsx' | 'csv' = 'xlsx'
): string {
  const token = localStorage.getItem('tt_access_token') || '';
  return `${BASE_URL}/admin/import/template?type=${type}&format=${format}&token=${token}`;
}

// ─── Catalog export ───────────────────────────────────────────────────────────
export function getCatalogExportUrl(filters?: {
  status?: string;
  categoryId?: string;
  collectionId?: string;
  search?: string;
}): string {
  const token = localStorage.getItem('tt_access_token') || '';
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.collectionId) params.set('collectionId', filters.collectionId);
  if (filters?.search) params.set('search', filters.search);
  if (token) params.set('token', token);
  const qs = params.toString();
  return `${BASE_URL}/admin/import/export${qs ? `?${qs}` : ''}`;
}
