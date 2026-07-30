/**
 * ProductImportModal.tsx
 * Phase 10 — Enterprise PIM Bulk Import & Export Engine
 *
 * Multi-step enterprise import wizard:
 *  Step 1: Upload & Template selection
 *  Step 2: Dry-Run Validation preview + Duplicate strategy selector
 *  Step 3: Live progress bar with cancel
 *  Step 4: Summary & error CSV download
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  X, Upload, CheckCircle, AlertTriangle, XCircle, Download,
  RefreshCw, FileText, ChevronDown, Loader2
} from 'lucide-react';
import {
  uploadForValidation,
  uploadAndImport,
  startImport,
  cancelImport,
  getJobStatus,
  getFailedRowsDownloadUrl,
  getTemplateDownloadUrl,
  getCatalogExportUrl,
  ValidationSummary,
  ImportJob,
} from '../../services/importService';

type Step = 'upload' | 'validate' | 'progress' | 'summary';
type ImportMode = 'CREATE_ONLY' | 'UPDATE_EXISTING' | 'UPSERT';
type DuplicateStrategy = 'SKIP' | 'UPDATE' | 'REPLACE' | 'AUTO_RENAME';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductImportModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>('upload');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('CREATE_ONLY');
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>('SKIP');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [parsedRows, setParsedRows] = useState<unknown[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<ImportJob | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Reset state on close ──────────────────────────────────────────────────
  const reset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setError(null);
    setValidationSummary(null);
    setParsedRows([]);
    setJobId(null);
    setJobStatus(null);
    setLoading(false);
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  // ── Polling ───────────────────────────────────────────────────────────────
  const startPolling = useCallback((id: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const status = await getJobStatus(id);
        setJobStatus(status);
        if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(status.status)) {
          if (pollRef.current) clearInterval(pollRef.current);
          setStep('summary');
          if (status.status === 'COMPLETED') onSuccess();
        }
      } catch {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 1500);
  }, [onSuccess]);

  // ── File drop handlers ────────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  // ── Step 1: Upload & Validate ─────────────────────────────────────────────
  const handleValidate = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await uploadForValidation(file, importMode, duplicateStrategy);
      setValidationSummary(result.validation);
      setJobId(result.job?.id || result.jobId || null);
      // Store rows for confirmation step (backend will send them back via the start endpoint)
      setStep('validate');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, [file, importMode, duplicateStrategy]);

  // ── Step 2: Confirm Import ─────────────────────────────────────────────────
  const handleConfirmImport = useCallback(async () => {
    if (!jobId || !file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadAndImport(file, importMode, duplicateStrategy);
      const newJobId = data.jobId || data.job?.id;
      if (newJobId) {
        setJobId(newJobId);
        setStep('progress');
        startPolling(newJobId);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Import failed to start');
    } finally {
      setLoading(false);
    }
  }, [jobId, file, importMode, duplicateStrategy, startPolling]);

  // ── Cancel ────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(async () => {
    if (!jobId) return;
    try {
      await cancelImport(jobId);
    } catch {
      // best-effort
    }
    if (pollRef.current) clearInterval(pollRef.current);
    setStep('summary');
  }, [jobId]);

  if (!isOpen) return null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bulk Product Import</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === 'upload' && 'Upload a CSV or Excel spreadsheet'}
              {step === 'validate' && 'Review validation results before importing'}
              {step === 'progress' && 'Import in progress...'}
              {step === 'summary' && 'Import complete'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b border-gray-100 px-6 py-2 gap-1">
          {(['upload', 'validate', 'progress', 'summary'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center ${step === s ? 'bg-amber-600 text-white' : ['validate', 'progress', 'summary'].indexOf(s) < ['upload', 'validate', 'progress', 'summary'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i + 1}
              </div>
              <span className={`text-xs capitalize ${step === s ? 'text-amber-700 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < 3 && <div className="w-6 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── STEP 1: UPLOAD ─────────────────────────────────────────────── */}
          {step === 'upload' && (
            <div className="space-y-5">
              {/* Template downloads */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-amber-900">Download Sample Spreadsheets:</p>
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    📊 Excel (.xlsx) & CSV (.csv) Supported
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
                      Excel Templates (.xlsx):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(['basic', 'variants', 'images'] as const).map((t) => (
                        <a
                          key={`xlsx-${t}`}
                          href={getTemplateDownloadUrl(t, 'xlsx')}
                          download
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                        >
                          <Download size={12} />
                          {t.charAt(0).toUpperCase() + t.slice(1)} (Excel .xlsx)
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-xs text-amber-700 font-medium block mb-1">
                      CSV Templates (.csv):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(['basic', 'variants', 'images'] as const).map((t) => (
                        <a
                          key={`csv-${t}`}
                          href={getTemplateDownloadUrl(t, 'csv')}
                          download
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-white border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          <Download size={12} />
                          {t.charAt(0).toUpperCase() + t.slice(1)} (.csv)
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-amber-400 bg-amber-50' : file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/40'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-green-500" />
                    <p className="font-medium text-green-700">{file.name}</p>
                    <p className="text-xs text-green-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-300" />
                    <p className="font-medium text-gray-600">Drop your .csv or .xlsx file here</p>
                    <p className="text-xs text-gray-400">or click to browse · Max 20 MB</p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Import Mode</label>
                  <div className="relative">
                    <select
                      value={importMode}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="CREATE_ONLY">Create Only (skip existing)</option>
                      <option value="UPDATE_EXISTING">Update Existing</option>
                      <option value="UPSERT">Upsert (create or update)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Duplicate SKU Strategy</label>
                  <div className="relative">
                    <select
                      value={duplicateStrategy}
                      onChange={(e) => setDuplicateStrategy(e.target.value as DuplicateStrategy)}
                      className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="SKIP">Skip duplicates</option>
                      <option value="UPDATE">Update existing product</option>
                      <option value="REPLACE">Replace entirely</option>
                      <option value="AUTO_RENAME">Auto-rename SKU</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <XCircle size={16} /> {error}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: VALIDATION ─────────────────────────────────────────── */}
          {step === 'validate' && validationSummary && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Rows', value: validationSummary.totalRows, color: 'bg-gray-50 text-gray-700' },
                  { label: 'Valid', value: validationSummary.validRows, color: 'bg-green-50 text-green-700' },
                  { label: 'Invalid', value: validationSummary.invalidRows, color: validationSummary.invalidRows > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-400' },
                  { label: 'Duplicate SKU', value: validationSummary.duplicateSkuRows, color: validationSummary.duplicateSkuRows > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400' },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-3 ${stat.color}`}>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs mt-0.5 opacity-70">{stat.label}</p>
                  </div>
                ))}
              </div>

              {validationSummary.invalidRows > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800">Row Issues Detected</p>
                  </div>
                  <div className="text-xs text-amber-700 space-y-1">
                    {validationSummary.missingNameRows > 0 && <p>• {validationSummary.missingNameRows} rows missing product name</p>}
                    {validationSummary.invalidPriceRows > 0 && <p>• {validationSummary.invalidPriceRows} rows with invalid price</p>}
                    {validationSummary.missingCategoryRows > 0 && <p>• {validationSummary.missingCategoryRows} rows missing category</p>}
                    {validationSummary.duplicateSkuRows > 0 && <p>• {validationSummary.duplicateSkuRows} duplicate SKUs (handled by strategy: {duplicateStrategy.replace('_', ' ')})</p>}
                  </div>

                  {validationSummary.rowErrors.length > 0 && (
                    <div className="mt-3 max-h-36 overflow-y-auto rounded-lg border border-amber-200 bg-white">
                      <table className="w-full text-xs">
                        <thead className="bg-amber-50">
                          <tr>
                            <th className="text-left px-3 py-2 text-amber-700 font-medium">Row</th>
                            <th className="text-left px-3 py-2 text-amber-700 font-medium">SKU</th>
                            <th className="text-left px-3 py-2 text-amber-700 font-medium">Errors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validationSummary.rowErrors.slice(0, 50).map((e) => (
                            <tr key={e.rowNumber} className="border-t border-amber-50">
                              <td className="px-3 py-1.5 text-gray-600">{e.rowNumber}</td>
                              <td className="px-3 py-1.5 text-gray-500 font-mono">{e.sku || '—'}</td>
                              <td className="px-3 py-1.5 text-red-600">{e.errors.join('; ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {validationSummary.rowErrors.length > 50 && (
                        <p className="text-xs text-center text-gray-400 py-2">
                          ... and {validationSummary.rowErrors.length - 50} more errors
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {validationSummary.validRows === 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <XCircle size={16} /> No valid rows found. Fix your file and re-upload.
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <XCircle size={16} /> {error}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: PROGRESS ───────────────────────────────────────────── */}
          {step === 'progress' && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <Loader2 size={40} className="animate-spin text-amber-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">Importing products...</p>
                <p className="text-sm text-gray-500 mt-1">
                  {jobStatus ? `${jobStatus.processedRows} / ${jobStatus.totalRows} rows` : 'Starting...'}
                </p>
              </div>

              {jobStatus && (
                <>
                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${jobStatus.progressPct ?? 0}%` }}
                    />
                  </div>
                  <p className="text-center text-lg font-bold text-amber-600">
                    {jobStatus.progressPct ?? 0}%
                  </p>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Created', value: jobStatus.createdProducts, color: 'text-green-600' },
                      { label: 'Updated', value: jobStatus.updatedProducts, color: 'text-blue-600' },
                      { label: 'Skipped', value: jobStatus.skippedProducts, color: 'text-gray-500' },
                      { label: 'Failed', value: jobStatus.failedProducts, color: 'text-red-500' },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-xl py-2 px-3">
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 4: SUMMARY ────────────────────────────────────────────── */}
          {step === 'summary' && jobStatus && (
            <div className="space-y-4">
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${jobStatus.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : jobStatus.status === 'CANCELLED' ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-700'}`}>
                {jobStatus.status === 'COMPLETED' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <p className="font-semibold">
                  {jobStatus.status === 'COMPLETED' && 'Import completed successfully'}
                  {jobStatus.status === 'CANCELLED' && 'Import was cancelled'}
                  {jobStatus.status === 'FAILED' && 'Import failed'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Products Created', value: jobStatus.createdProducts, icon: '✓', color: 'bg-green-50 text-green-700' },
                  { label: 'Updated', value: jobStatus.updatedProducts, icon: '↻', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Skipped', value: jobStatus.skippedProducts, icon: '—', color: 'bg-gray-50 text-gray-600' },
                  { label: 'Failed', value: jobStatus.failedProducts, icon: '✗', color: 'bg-red-50 text-red-600' },
                  { label: 'Images Added', value: jobStatus.imagesAdded, icon: '🖼', color: 'bg-purple-50 text-purple-700' },
                  { label: 'Categories Created', value: jobStatus.categoriesCreated, icon: '📁', color: 'bg-amber-50 text-amber-700' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs mt-0.5 opacity-70">{s.label}</p>
                  </div>
                ))}
              </div>

              {jobStatus.durationMs && (
                <p className="text-xs text-center text-gray-400">
                  Completed in {(jobStatus.durationMs / 1000).toFixed(1)}s
                </p>
              )}

              {jobStatus.failedProducts > 0 && jobId && (
                <a
                  href={getFailedRowsDownloadUrl(jobId)}
                  download
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Download size={15} /> Download Failed Rows CSV ({jobStatus.failedProducts} rows)
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={() => { reset(); onClose(); }} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Close
          </button>

          <div className="flex items-center gap-2">
            {step === 'validate' && (
              <button onClick={() => setStep('upload')} className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                ← Back
              </button>
            )}

            {step === 'upload' && (
              <button
                onClick={handleValidate}
                disabled={!file || loading}
                className="text-sm px-5 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Validating...</> : 'Validate File →'}
              </button>
            )}

            {step === 'validate' && (
              <button
                onClick={handleConfirmImport}
                disabled={loading || (validationSummary?.validRows === 0)}
                className="text-sm px-5 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Starting...</> : `Import ${validationSummary?.validRows ?? 0} Valid Rows →`}
              </button>
            )}

            {step === 'progress' && (
              <button
                onClick={handleCancel}
                className="text-sm px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Cancel Import
              </button>
            )}

            {step === 'summary' && (
              <button
                onClick={() => { reset(); onClose(); }}
                className="text-sm px-5 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} /> Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImportModal;
export { getCatalogExportUrl };
