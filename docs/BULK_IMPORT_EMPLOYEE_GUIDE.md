# Two Threads Studio — Bulk Product Import & Export SOP (Employee Operating Guide)

**Document Version:** 2.0  
**Effective Date:** July 30, 2026  
**Audience:** E-commerce Operations Team, Catalog Managers, Inventory Staff  
**System:** Two Threads Studio Admin OS (`/admin/products`)  

---

## 1. Overview & Capability Summary

The **Enterprise Bulk Product Import & Export Engine** enables Two Threads Studio staff to manage catalog inventory at scale using standard Excel (`.xlsx`) or CSV (`.csv`) spreadsheets.

### Key Capabilities
* **Excel & CSV Native Support**: Upload `.xlsx` spreadsheets directly from Microsoft Excel or `.csv` files.
* **Dry-Run Pre-Validation**: Run dry-runs to inspect row validation (SKU duplicates, missing categories, price errors) before making any database changes.
* **Background Chunk Processing**: Large catalogs are processed in background batches of 50 rows without timing out or freezing your browser.
* **Duplicate SKU Strategies**: Flexible policies (`SKIP`, `UPDATE`, `REPLACE`, `AUTO_RENAME`).
* **Failed-Row Recovery Stream**: Download a dedicated CSV file containing only the failed rows alongside exact error reasons.
* **Downloadable Sample Templates**: Download pre-formatted `.xlsx` and `.csv` templates for Basic products, Product Variants, or Multi-Image galleries.

---

## 2. Supported Spreadsheet Column Schema

When preparing your Excel spreadsheet (`.xlsx`) or CSV file (`.csv`), ensure the top header row matches the standard column headers:

| Header Name | Required? | Example Value | Description / Options |
| :--- | :---: | :--- | :--- |
| `name` | **YES** | `Luxury Embroidery Starter Kit` | Product title. Auto-generates unique web URL slug. |
| `price` | **YES** | `1299` | Base selling price in INR (numbers only). |
| `category` | **YES** | `Embroidery Kits` | Primary category. Auto-created if it doesn't exist yet. |
| `sku` | Optional | `KIT-001` | Unique Stock Keeping Unit identifier. |
| `compare_price` | Optional | `1499` | Original MRP / Strikethrough price for discounts. |
| `description` | Optional | `Handcrafted kit with premium linen` | Product description / story. |
| `stock` | Optional | `50` | Initial stock quantity (default `0`). |
| `status` | Optional | `ACTIVE` | Options: `ACTIVE`, `DRAFT`, `HIDDEN`, `ARCHIVED`. |
| `type` | Optional | `PHYSICAL` | Options: `PHYSICAL`, `DIGITAL`, `WORKSHOP`, `SERVICE`. |
| `tags` | Optional | `starter,beginner,gift` | Comma or pipe-separated tag names. |
| `is_featured` | Optional | `true` | Show product on homepage featured grid (`true`/`false`). |
| `is_best_seller`| Optional | `true` | Display Best Seller badge (`true`/`false`). |
| `is_new_arrival`| Optional | `false` | Display New Arrival badge (`true`/`false`). |
| `seo_title` | Optional | `Premium Embroidery Kit | Studio` | Custom meta title for Google SEO. |
| `seo_description`| Optional | `Start embroidery with our kit.` | Custom meta description. |
| `images` | Optional | `https://cdn.../1.jpg\|https://cdn.../2.jpg` | Pipe (`\|`) separated image URLs. First URL becomes primary image. |
| `variant_name` | Optional | `Gold Edition` | Option title if product has variant options. |
| `variant_sku` | Optional | `KIT-001-GOLD` | Specific SKU for this variant option. |
| `variant_price_adj`| Optional | `200` | Price adjustment relative to base price (`+200`). |
| `variant_stock` | Optional | `10` | Variant-specific stock level. |
| `variant_options`| Optional | `Color:Gold,Size:M` | Option key-value pairs. |

---

## 3. Step-by-Step Operating Workflow for Employees

### Step 1 — Download a Sample Template
1. Log into **Two Threads Studio Admin** and navigate to **Products** (`/admin/products`).
2. Click the **Import** button in the top header.
3. In the **Step 1: Upload** panel, click **Download Sample Spreadsheets**.
4. Select your preferred template type:
   - **Basic (Excel .xlsx)**: Standard single-product catalog template.
   - **Variants (Excel .xlsx)**: Multi-variant product catalog template.
   - **Images (Excel .xlsx)**: Multi-image gallery upload template.
5. Open the downloaded `.xlsx` template in Microsoft Excel or Google Sheets.

### Step 2 — Fill in Your Catalog Data
1. Enter your product details following the header rules in Section 2.
2. Save your file as `.xlsx` (Excel Workbook) or `.csv`.

### Step 3 — Upload & Run Dry-Run Validation
1. Drag and drop your `.xlsx` or `.csv` file into the upload zone in the modal.
2. Select your **Import Mode**:
   - `Create Only (skip existing)`: Only add brand new products.
   - `Update Existing`: Update existing products matching SKUs.
   - `Upsert`: Create new products and update existing ones.
3. Select your **Duplicate SKU Strategy**:
   - `Skip duplicates`: Ignore rows with duplicate SKUs.
   - `Update existing product`: Overwrite product details.
   - `Auto-rename SKU`: Append unique timestamps to duplicate SKUs (`KIT-001-178368`).
4. Click **Validate File →**.
5. The system performs a **Dry-Run Validation** (no database changes). Inspect the summary:
   - **Valid Rows**: Ready for import.
   - **Invalid Rows / Row Issues**: Fix missing names, invalid prices, or missing categories.

### Step 4 — Execute Import & Monitor Progress
1. Review the validation summary and click **Import Valid Rows →**.
2. A live progress bar displays percentage completion, products created, updated, skipped, and failed in real-time.
3. You can click **Cancel Import** at any time to pause background execution.

### Step 5 — Inspect Summary & Handle Error Rows
1. Once complete, a green summary banner displays final counts.
2. If any rows failed validation, click **Download Failed Rows CSV**.
3. Open the downloaded failed-rows file, read the exact `Error Reason` column, correct the rows in Excel, and re-upload!

---

## 4. Admin Review Moderation Sorting SOP

To moderate customer reviews effectively:
1. Navigate to **Reviews Moderation** (`/admin/reviews`).
2. Use the **Sort by** dropdown filter:
   - **Highest Rating (5★ → 1★)**: Prioritize top-rated positive customer reviews for featuring or pinning.
   - **Lowest Rating (1★ → 5★)**: Instantly locate dissatisfied customers or low-star reviews requiring immediate customer support follow-up.
   - **Newest First**: View incoming un-moderated reviews.
   - **Most Helpful**: Identify reviews with the highest customer upvotes.

---

## 5. Security & Maintenance

* All bulk operations require an active Admin session with a valid JWT token (`requireAuth` & `requireRole('ADMIN')`).
* All imported image URLs must point to valid HTTP/HTTPS image CDN hosts (e.g. Cloudinary, AWS S3).
