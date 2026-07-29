Below is the recovered roadmap in the same level of detail as your Phase 4A/4B and Returns Management documents.

---

# Phase 8.0 — Product Import, Bulk Operations & Catalog Management Engine

## Overview

Phase 8.0 transforms the current admin catalog into an enterprise-grade product management system capable of handling hundreds or thousands of products efficiently.

Instead of manually creating products one at a time, administrators can import, export, validate, duplicate, archive, and bulk-edit products while maintaining complete audit history and data integrity.

The objective is to make the catalog management experience comparable to Shopify, WooCommerce Enterprise, and modern ERP systems.
Employee will download the excel tamplet or csv file and fill it with product data and upload it to the system.

---

# Problems Solved

| Current Issue                             | Severity    |
| ----------------------------------------- | ----------- |
| Products can only be created individually | 🔴 Critical |
| No CSV import                             | 🔴 Critical |
| No Excel import                           | 🔴 Critical |
| No export                                 | 🔴 Critical |
| No bulk edit                              | 🔴 Critical |
| No duplicate detection                    | 🔴 Critical |
| No import validation                      | 🔴 Critical |
| No progress tracking                      | 🟠 High     |
| No import history                         | 🟠 High     |
| No rollback on failure                    | 🟠 High     |
| No audit trail                            | 🟠 High     |

---

# Objectives

Build an enterprise catalog engine that supports:

* CSV Import
* Excel Import
* Product Export
* Bulk Operations
* Inventory Updates
* Pricing Updates
* Image Imports
* Import Preview
* Validation Engine
* Rollback
* Background Jobs
* Progress Tracking
* Import History
* Audit Logs

---

# Phase 8.1 — Database

---

## New ImportJob Model

Tracks every import.

```
ImportJob

id

userId

fileName

fileType

status

totalRows

processedRows

successRows

failedRows

startedAt

completedAt

errorLog

createdAt
```

Status

```
PENDING

PROCESSING

COMPLETED

FAILED

ROLLED_BACK
```

---

## ImportJobRow

Stores validation result per row.

```
ImportJobRow

importJobId

rowNumber

status

errors

productId

payload

createdAt
```

Status

```
SUCCESS

FAILED

SKIPPED
```

---

## ProductAuditLog

```
CREATE

UPDATE

DELETE

IMPORT

EXPORT

PRICE_CHANGE

STOCK_CHANGE

CATEGORY_CHANGE

PUBLISH

ARCHIVE
```

---

# Phase 8.2 — Backend Services

---

## Product Import Service

```
importProducts()

validateFile()

validateRows()

mapColumns()

createProducts()

updateExisting()

rollback()

finishJob()
```

---

## Export Service

```
exportProducts()

exportInventory()

exportPricing()

exportCategories()

exportCollections()
```

---

## Bulk Operation Service

```
bulkUpdatePrice()

bulkUpdateInventory()

bulkPublish()

bulkArchive()

bulkDelete()

bulkAssignCategory()

bulkAssignCollection()

bulkAssignTags()
```

---

## Duplicate Detection

Detect by

```
SKU

Slug

Product Name

Variant SKU
```

Admin chooses

```
Skip

Overwrite

Merge

Duplicate
```

---

# Phase 8.3 — Validation Engine

Every row validated before insertion.

Checks

Required fields

SKU uniqueness

Slug uniqueness

Price

Inventory

Category exists

Collection exists

Images valid

Status valid

Dimensions valid

Weight valid

SEO length

Return policy exists

Tax class exists

Variant consistency

If one row fails

```
Row rejected

Others continue
```

unless

```
Strict Mode

↓

Entire import rolls back
```

---

# Phase 8.4 — Supported Formats

Import

CSV

Excel (.xlsx)

Future

Google Sheets

ERP Export

Shopify CSV

WooCommerce CSV

---

# Phase 8.5 — Image Import

Supports

Single Image

Gallery Images

Primary Image

Image URL

CDN URL

ZIP Package (future)

Validation

Image exists

Valid URL

Correct format

Reachable

---

# Phase 8.6 — Bulk Operations

Admin selects

```
1

10

100

1000

5000

Products
```

Available actions

Change price

Increase %

Decrease %

Replace price

Update inventory

Publish

Unpublish

Archive

Delete

Move category

Move collection

Assign tags

Remove tags

Update shipping class

Update tax class

Update return policy

Update visibility

---

# Phase 8.7 — Export System

Export

CSV

Excel

JSON

Filters

Category

Collection

Status

Brand

Inventory

Date

Search

Exports

Catalog

Inventory

Pricing

Variants

Images

SEO

---

# Phase 8.8 — Admin UI

## Import Center

Upload Area

Drag & Drop

Browse File

Recent Imports

Progress

Validation

Errors

Import Button

---

## Import Preview

Shows

Spreadsheet preview

Mapped columns

Detected errors

Warnings

Products to create

Products to update

Duplicates

---

## Mapping Screen

Example

CSV

```
Product Name
```

↓

Database

```
name
```

Admin can remap every column.

---

## Import Progress

Progress bar

```
Rows

Percentage

ETA

Success

Failed

Skipped
```

Live updates

---

## Error Viewer

Shows

```
Row 18

SKU duplicated

Fix

Retry
```

Download

CSV

Excel

---

## Bulk Action Toolbar

Appears when products selected

Contains

```
Edit

Inventory

Price

Category

Collection

Tags

Archive

Delete

Export
```

---

# Phase 8.9 — Performance

Imports run in background.

Batch size

```
100

250

500
```

Transactions

Chunk processing

Retry failed chunks

Memory-safe imports

Supports

10,000+

products

---

# Phase 8.10 — Security

Only

```
SUPER_ADMIN

ADMIN

CATALOG_MANAGER
```

can import.

Every import logged.

Every export logged.

Every bulk operation logged.

Confirmation required

Delete

Archive

Overwrite

Rollback

---

# Phase 8.11 — API

```
POST

/admin/import/products
```

```
GET

/admin/import/jobs
```

```
GET

/admin/import/jobs/:id
```

```
POST

/admin/import/jobs/:id/retry
```

```
POST

/admin/import/jobs/:id/rollback
```

```
GET

/admin/export/products
```

```
POST

/admin/products/bulk
```

---

# Phase 8.12 — Verification

Automated

```
TypeScript

0 errors
```

```
Prisma

Migration passes
```

```
Validation

Passes
```

Manual

Import

10

100

1000

products

Duplicate SKU

Rollback

Bulk price update

Bulk inventory update

Export CSV

Export Excel

Delete

Archive

Audit logs

Recovery

---

# Future (Phase 8.5+)

* AI-assisted product generation from a single image.
* Automatic SEO title and meta description generation.
* AI-generated product descriptions in your brand voice.
* Background image removal and optimization.
* OCR import from supplier catalogs and PDFs.
* Barcode/QR code generation.
* Scheduled imports from supplier feeds.
* Shopify, WooCommerce, and Amazon catalog synchronization.
* Multi-language catalog import/export.
* Digital asset management (DAM) integration.
* Version history with one-click product rollback.

---

## Priority

**Must-have (Launch):**

* CSV/Excel import with preview
* Validation engine
* Duplicate detection
* Bulk edit (price, inventory, publish/archive)
* Export (CSV/Excel)
* Import history
* Audit logging

**Should-have (Post-launch):**

* Background job queue
* Rollback support
* Retry failed rows
* Progress tracking
* Column mapping

**Future Enterprise:**

* AI catalog creation
* Supplier feed synchronization
* ERP integrations
* DAM integration
* Automated catalog enrichment

This roadmap scales well from your initial catalog to thousands of products while staying aligned with the premium, production-grade architecture you've been building for Two Threads Studio.
