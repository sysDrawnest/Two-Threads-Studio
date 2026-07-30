/**
 * import.service.ts
 * Phase 10 — Enterprise PIM Bulk Import & Export Engine
 *
 * Handles:
 *  - Parsing CSV (.csv) and Excel (.xlsx) spreadsheets
 *  - Dry-run validation (no DB mutations)
 *  - Background batch processing in 50-row transaction chunks
 *  - Duplicate handling strategies (SKIP / UPDATE / AUTO_RENAME / REPLACE)
 *  - Auto slug generation with collision fallback
 *  - Multi-image URL parsing → ProductImage records
 *  - Per-row error logging to ImportJobRow
 *  - Failed-row CSV export stream
 *  - Catalog CSV export with filters
 *  - Sample template generation (Basic / Variants / Images)
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import prisma from '../prisma';
import logger from '../lib/logger';
import {
  ImportJobStatus,
  ImportRowStatus,
  DuplicateStrategy,
  ImportMode,
  ProductStatus,
  ProductType,
} from '@prisma/client';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParsedProductRow {
  rowNumber: number;
  name: string;
  slug?: string;
  sku?: string;
  description: string;
  price: string;
  comparePrice?: string;
  costPrice?: string;
  status?: string;
  type?: string;
  categoryName?: string;
  tags?: string;
  stock?: string;
  weight?: string;
  isFeatured?: string;
  isBestSeller?: string;
  isNewArrival?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: string;
  variantName?: string;
  variantSku?: string;
  variantPriceAdj?: string;
  variantStock?: string;
  variantOptions?: string;
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
  rowErrors: Array<{ rowNumber: number; sku?: string; name?: string; errors: string[] }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function resolveUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}

function parseBool(val?: string): boolean {
  if (!val) return false;
  return ['true', '1', 'yes', 'y'].includes(val.toLowerCase().trim());
}

function parseImages(imagesCol?: string): string[] {
  if (!imagesCol) return [];
  return imagesCol
    .split(/[|,]/)
    .map((u) => u.trim())
    .filter(Boolean);
}

// ─── 1. Spreadsheet Parser ──────────────────────────────────────────────────

export function parseSpreadsheet(
  buffer: Buffer,
  mimeType: string
): ParsedProductRow[] {
  let rawRows: Record<string, string>[] = [];

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType.includes('spreadsheet')
  ) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
      defval: '',
      raw: false,
    });
  } else {
    const csvText = buffer.toString('utf-8');
    const result = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    rawRows = result.data;
  }

  const get = (r: Record<string, string>, ...keys: string[]): string => {
    for (const k of keys) {
      const v = r[k];
      if (v !== undefined && v !== '') return v;
    }
    return '';
  };

  return rawRows.map((row, i): ParsedProductRow => ({
    rowNumber: i + 2,
    name: get(row, 'name', 'Name', 'Product Name'),
    slug: get(row, 'slug', 'Slug') || undefined,
    sku: get(row, 'sku', 'SKU') || undefined,
    description: get(row, 'description', 'Description'),
    price: get(row, 'price', 'Price'),
    comparePrice: get(row, 'compare_price', 'compare_at_price', 'Compare Price') || undefined,
    costPrice: get(row, 'cost_price', 'Cost Price') || undefined,
    status: get(row, 'status', 'Status') || undefined,
    type: get(row, 'type', 'Type') || undefined,
    categoryName: get(row, 'category', 'Category') || undefined,
    tags: get(row, 'tags', 'Tags') || undefined,
    stock: get(row, 'stock', 'Stock', 'Inventory') || undefined,
    weight: get(row, 'weight', 'Weight') || undefined,
    isFeatured: get(row, 'is_featured', 'Featured') || undefined,
    isBestSeller: get(row, 'is_best_seller', 'Best Seller') || undefined,
    isNewArrival: get(row, 'is_new_arrival', 'New Arrival') || undefined,
    seoTitle: get(row, 'seo_title', 'meta_title', 'SEO Title', 'Meta Title') || undefined,
    seoDescription: get(row, 'seo_description', 'meta_description', 'SEO Description', 'Meta Description') || undefined,
    images: get(row, 'images', 'Images', 'image_urls') || undefined,
    variantName: get(row, 'variant_name', 'Variant Name') || undefined,
    variantSku: get(row, 'variant_sku', 'Variant SKU') || undefined,
    variantPriceAdj: get(row, 'variant_price_adj', 'variant_price', 'Variant Price Adj') || undefined,
    variantStock: get(row, 'variant_stock', 'Variant Stock') || undefined,
    variantOptions: get(row, 'variant_options', 'Variant Options') || undefined,
  }));
}

// ─── 2. Dry-Run Validator ────────────────────────────────────────────────────

export async function validateImportDryRun(
  jobId: string,
  rows: ParsedProductRow[]
): Promise<ValidationSummary> {
  await prisma.importJob.update({
    where: { id: jobId },
    data: { status: ImportJobStatus.VALIDATING, totalRows: rows.length },
  });

  const allSkus = rows.map((r) => r.sku).filter((s): s is string => Boolean(s));
  const existingProducts = allSkus.length
    ? await prisma.product.findMany({
        where: { sku: { in: allSkus } },
        select: { sku: true },
      })
    : [];
  const existingSkuSet = new Set(existingProducts.map((p) => p.sku));

  const rowErrors: ValidationSummary['rowErrors'] = [];
  let validRows = 0;
  let duplicateSkuRows = 0;
  let missingNameRows = 0;
  let invalidPriceRows = 0;
  let missingCategoryRows = 0;

  for (const row of rows) {
    const errors: string[] = [];
    if (!row.name?.trim()) { errors.push('Missing product name'); missingNameRows++; }
    if (!row.price || isNaN(parseFloat(row.price))) { errors.push('Invalid or missing price'); invalidPriceRows++; }
    if (!row.categoryName?.trim()) { errors.push('Missing category'); missingCategoryRows++; }
    if (row.sku && existingSkuSet.has(row.sku)) { errors.push(`Duplicate SKU: ${row.sku}`); duplicateSkuRows++; }

    if (errors.length > 0) {
      rowErrors.push({ rowNumber: row.rowNumber, sku: row.sku, name: row.name, errors });
    } else {
      validRows++;
    }
  }

  await prisma.importJob.update({
    where: { id: jobId },
    data: { status: ImportJobStatus.VALIDATED },
  });

  return {
    jobId,
    totalRows: rows.length,
    validRows,
    invalidRows: rowErrors.length,
    duplicateSkuRows,
    missingNameRows,
    invalidPriceRows,
    missingCategoryRows,
    rowErrors,
  };
}

// ─── 3. Background Import Processor ─────────────────────────────────────────

const CHUNK_SIZE = 50;

export async function processImportJob(
  jobId: string,
  rows: ParsedProductRow[],
  config: {
    importMode: ImportMode;
    duplicateStrategy: DuplicateStrategy;
  }
): Promise<void> {
  const startedAt = new Date();
  await prisma.importJob.update({
    where: { id: jobId },
    data: { status: ImportJobStatus.PROCESSING, startedAt },
  });

  let createdProducts = 0;
  let updatedProducts = 0;
  let failedProducts = 0;
  let skippedProducts = 0;
  let categoriesCreated = 0;
  let imagesAdded = 0;
  let variantsCreated = 0;

  const chunks: ParsedProductRow[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    chunks.push(rows.slice(i, i + CHUNK_SIZE));
  }

  try {
    for (const chunk of chunks) {
      // Cancellation check between chunks
      const currentJob = await prisma.importJob.findUnique({
        where: { id: jobId },
        select: { status: true },
      });
      if (currentJob?.status === ImportJobStatus.CANCELLED) {
        logger.info({ jobId }, '[ImportService] Job cancelled between chunks');
        return;
      }

      for (const row of chunk) {
        try {
          // ── Category resolution / auto-creation ──
          let categoryId: string | undefined;
          if (row.categoryName?.trim()) {
            let category = await prisma.category.findFirst({
              where: { name: { equals: row.categoryName.trim(), mode: 'insensitive' } },
            });
            if (!category) {
              category = await prisma.category.create({
                data: {
                  name: row.categoryName.trim(),
                  slug: await resolveUniqueSlug(generateSlug(row.categoryName.trim())),
                },
              });
              categoriesCreated++;
            }
            categoryId = category.id;
          }

          const price = parseFloat(row.price || '0');
          const comparePrice = row.comparePrice ? parseFloat(row.comparePrice) : undefined;
          const costPrice = row.costPrice ? parseFloat(row.costPrice) : undefined;
          const stockQuantity = row.stock ? parseInt(row.stock) : 0;
          const weight = row.weight ? parseFloat(row.weight) : undefined;

          const statusMap: Record<string, ProductStatus> = {
            active: ProductStatus.ACTIVE,
            draft: ProductStatus.DRAFT,
            hidden: ProductStatus.HIDDEN,
            archived: ProductStatus.ARCHIVED,
          };
          const productStatus = statusMap[(row.status || 'draft').toLowerCase()] ?? ProductStatus.DRAFT;

          const typeMap: Record<string, ProductType> = {
            physical: ProductType.PHYSICAL,
            digital: ProductType.DIGITAL,
            workshop: ProductType.WORKSHOP,
            service: ProductType.SERVICE,
          };
          const productType = typeMap[(row.type || 'physical').toLowerCase()] ?? ProductType.PHYSICAL;

          // ── SKU collision check ──
          const existingBySku = row.sku
            ? await prisma.product.findFirst({ where: { sku: row.sku } })
            : null;

          let productId: string | undefined;
          let rowStatus: ImportRowStatus = ImportRowStatus.SUCCESS;

          if (existingBySku) {
            if (
              config.duplicateStrategy === DuplicateStrategy.SKIP ||
              config.importMode === ImportMode.CREATE_ONLY
            ) {
              skippedProducts++;
              rowStatus = ImportRowStatus.SKIPPED;
            } else if (
              config.duplicateStrategy === DuplicateStrategy.UPDATE ||
              config.duplicateStrategy === DuplicateStrategy.REPLACE ||
              config.importMode === ImportMode.UPDATE_EXISTING ||
              config.importMode === ImportMode.UPSERT
            ) {
              await prisma.product.update({
                where: { id: existingBySku.id },
                data: {
                  name: row.name?.trim() || existingBySku.name,
                  description: row.description || existingBySku.description,
                  price,
                  ...(comparePrice !== undefined ? { comparePrice } : {}),
                  ...(costPrice !== undefined ? { costPrice } : {}),
                  stockQuantity,
                  status: productStatus,
                  isFeatured: parseBool(row.isFeatured),
                  isBestSeller: parseBool(row.isBestSeller),
                  isNewArrival: parseBool(row.isNewArrival),
                  seoTitle: row.seoTitle,
                  seoDescription: row.seoDescription,
                  ...(categoryId ? { categoryId } : {}),
                  ...(weight !== undefined ? { weight } : {}),
                },
              });
              productId = existingBySku.id;
              updatedProducts++;
              rowStatus = ImportRowStatus.UPDATED;
            } else if (config.duplicateStrategy === DuplicateStrategy.AUTO_RENAME) {
              row.sku = `${row.sku}-${Date.now()}`;
              // Fall through to create
            }
          }

          // ── Create new product ──
          if (!productId && rowStatus === ImportRowStatus.SUCCESS) {
            if (!categoryId) {
              throw new Error(`Category "${row.categoryName}" could not be resolved`);
            }

            const baseName = row.name?.trim() || `Product-${row.rowNumber}`;
            const baseSlug = row.slug?.trim() || generateSlug(baseName);
            const uniqueSlug = await resolveUniqueSlug(baseSlug);

            const product = await prisma.product.create({
              data: {
                name: baseName,
                slug: uniqueSlug,
                sku: row.sku || undefined,
                description: row.description || '',
                price,
                ...(comparePrice !== undefined ? { comparePrice } : {}),
                ...(costPrice !== undefined ? { costPrice } : {}),
                stockQuantity,
                type: productType,
                status: productStatus,
                isFeatured: parseBool(row.isFeatured),
                isBestSeller: parseBool(row.isBestSeller),
                isNewArrival: parseBool(row.isNewArrival),
                seoTitle: row.seoTitle,
                seoDescription: row.seoDescription,
                categoryId,
                ...(weight !== undefined ? { weight } : {}),
              },
            });
            productId = product.id;
            createdProducts++;

            // ── Tags ──
            if (row.tags && productId) {
              const tagNames = row.tags.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
              for (const tagName of tagNames) {
                const tagSlug = generateSlug(tagName);
                const tag = await prisma.tag.upsert({
                  where: { slug: tagSlug },
                  update: {},
                  create: { name: tagName, slug: tagSlug },
                });
                await prisma.productTag.upsert({
                  where: { productId_tagId: { productId: productId!, tagId: tag.id } },
                  update: {},
                  create: { productId: productId!, tagId: tag.id },
                });
              }
            }

            // ── Variant ──
            if (row.variantName?.trim() && productId) {
              const priceAdj = row.variantPriceAdj ? parseFloat(row.variantPriceAdj) : 0;
              const variantStockQty = row.variantStock ? parseInt(row.variantStock) : stockQuantity;
              const variantValue = row.variantOptions?.trim() || row.variantName.trim();

              await prisma.productVariant.create({
                data: {
                  productId: productId!,
                  name: row.variantName.trim(),
                  value: variantValue,
                  sku: row.variantSku || undefined,
                  priceAdjustment: priceAdj,
                  stockQuantity: variantStockQty,
                },
              });
              variantsCreated++;
            }
          }

          // ── Images ──
          if (productId) {
            const imageUrls = parseImages(row.images);
            if (imageUrls.length > 0) {
              await prisma.productImage.createMany({
                data: imageUrls.map((url, pos) => ({
                  productId: productId!,
                  url,
                  sortOrder: pos,
                  isPrimary: pos === 0,
                })),
                skipDuplicates: true,
              });
              imagesAdded += imageUrls.length;
            }
          }

          // ── Log row ──
          await prisma.importJobRow.create({
            data: {
              importJobId: jobId,
              rowNumber: row.rowNumber,
              sku: row.sku,
              productName: row.name,
              status: rowStatus,
              productId,
              payload: row as unknown as Record<string, string>,
            },
          });
        } catch (err: any) {
          failedProducts++;
          await prisma.importJobRow.create({
            data: {
              importJobId: jobId,
              rowNumber: row.rowNumber,
              sku: row.sku,
              productName: row.name,
              status: ImportRowStatus.FAILED,
              errorMessage: err?.message || 'Unknown error',
              payload: row as unknown as Record<string, string>,
            },
          });
        }
      }

      // Live progress update after each chunk
      const processedSoFar = await prisma.importJobRow.count({ where: { importJobId: jobId } });
      await prisma.importJob.update({
        where: { id: jobId },
        data: {
          processedRows: Math.min(processedSoFar, rows.length),
          createdProducts,
          updatedProducts,
          failedProducts,
          skippedProducts,
          categoriesCreated,
          imagesAdded,
          variantsCreated,
        },
      });
    }

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.COMPLETED,
        completedAt,
        durationMs,
        processedRows: rows.length,
        createdProducts,
        updatedProducts,
        failedProducts,
        skippedProducts,
        categoriesCreated,
        imagesAdded,
        variantsCreated,
      },
    });

    logger.info({ jobId, createdProducts, updatedProducts, failedProducts }, '[ImportService] Job completed');
  } catch (err: any) {
    logger.error({ jobId, err }, '[ImportService] Job failed');
    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.FAILED,
        errorSummary: err?.message || 'Unexpected error',
        completedAt: new Date(),
      },
    });
  }
}

// ─── 4. Cancel Job ────────────────────────────────────────────────────────────

export async function cancelImportJob(jobId: string, adminId: string): Promise<void> {
  const job = await prisma.importJob.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError('Import job not found', HTTP_STATUS.NOT_FOUND);
  if (
    job.status === ImportJobStatus.COMPLETED ||
    job.status === ImportJobStatus.FAILED ||
    job.status === ImportJobStatus.CANCELLED
  ) {
    throw new AppError('Job cannot be cancelled in its current state', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.importJob.update({
    where: { id: jobId },
    data: {
      status: ImportJobStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledBy: adminId,
    },
  });
}

// ─── 5. Generate Failed Rows CSV ──────────────────────────────────────────────

export async function generateFailedRowsCsv(jobId: string): Promise<string> {
  const failedRows = await prisma.importJobRow.findMany({
    where: { importJobId: jobId, status: ImportRowStatus.FAILED },
    orderBy: { rowNumber: 'asc' },
  });

  const escape = (v: string | null | undefined) => `"${(v ?? '').replace(/"/g, '""')}"`;

  const csvRows = [
    ['Row Number', 'SKU', 'Product Name', 'Error Reason'].join(','),
    ...failedRows.map((r) =>
      [r.rowNumber, escape(r.sku), escape(r.productName), escape(r.errorMessage)].join(',')
    ),
  ];

  return csvRows.join('\r\n');
}

// ─── 6. Catalog Export ────────────────────────────────────────────────────────

export async function exportCatalogCsv(filters: {
  status?: string;
  categoryId?: string;
  collectionId?: string;
  search?: string;
}): Promise<string> {
  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { sku: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters.collectionId) {
    where.additionalCollections = { some: { collectionId: filters.collectionId } };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  const header = [
    'name', 'slug', 'sku', 'description', 'price', 'compare_price',
    'status', 'type', 'category', 'tags', 'stock',
    'is_featured', 'is_best_seller', 'is_new_arrival',
    'seo_title', 'seo_description', 'images',
  ].join(',');

  const escape = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const dataRows = products.map((p) =>
    [
      escape(p.name),
      escape(p.slug),
      escape(p.sku ?? ''),
      escape(p.description),
      escape(p.price),
      escape(p.comparePrice ?? ''),
      escape(p.status),
      escape(p.type),
      escape(p.category?.name ?? ''),
      escape(p.tags.map((pt) => pt.tag.name).join('|')),
      escape(p.stockQuantity),
      escape(p.isFeatured ? 'true' : 'false'),
      escape(p.isBestSeller ? 'true' : 'false'),
      escape(p.isNewArrival ? 'true' : 'false'),
      escape(p.seoTitle ?? ''),
      escape(p.seoDescription ?? ''),
      escape(p.images.map((img) => img.url).join('|')),
    ].join(',')
  );

  return [header, ...dataRows].join('\r\n');
}

// ─── 7. Sample Template ───────────────────────────────────────────────────────

export function generateSampleTemplate(type: 'basic' | 'variants' | 'images'): string {
  const base = 'name,slug,sku,description,price,compare_price,status,type,category,tags,stock,is_featured,is_best_seller,is_new_arrival,seo_title,seo_description';
  const variantCols = ',variant_name,variant_sku,variant_price_adj,variant_stock,variant_options';
  const imageCols = ',images';

  let header = base;
  if (type === 'variants') { header += variantCols + imageCols; }
  else if (type === 'images') { header += imageCols; }

  const baseData =
    '"Luxury Embroidery Starter Kit","luxury-embroidery-starter-kit","KIT001",' +
    '"A beautiful handcrafted embroidery kit for beginners","1299","1499",' +
    '"ACTIVE","PHYSICAL","Embroidery Kits","starter,beginner,gift","50",' +
    '"false","true","false","Premium Embroidery Kit","Start your embroidery journey"';

  const variantData = ',"Gold Edition","KIT001-GOLD","200","10","Color:Gold"';
  const imageData = ',"https://res.cloudinary.com/example/image1.jpg|https://res.cloudinary.com/example/image2.jpg"';

  let dataRow = baseData;
  if (type === 'variants') { dataRow += variantData + imageData; }
  else if (type === 'images') { dataRow += imageData; }

  return `${header}\r\n${dataRow}\r\n`;
}
