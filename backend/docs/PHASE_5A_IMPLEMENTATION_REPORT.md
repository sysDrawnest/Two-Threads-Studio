# Phase 5A — Order Management Engine Implementation Report

## Overview
This report details the technical architecture, database models, APIs, and user interface features developed during **Phase 5A — Order Management Engine** for Two Threads Studio. This phase transforms a validated customer shopping cart into a persistent order, manages the order status lifecycle, generates custom A4 PDF invoices, and provides detailed dashboards for customers.

---

## 1. Database Schema Extensions (Prisma)
We extended the PostgreSQL schema with new models and enum structures to manage orders securely and immutably.

### Enums
*   `OrderStatus`: `PENDING`, `AWAITING_PAYMENT`, `CONFIRMED`, `PROCESSING`, `HANDCRAFTING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`
*   `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`

### Models
1.  **Order**
    *   `id`: String (UUID/CUID), Primary Key
    *   `orderNumber`: String (Unique, sequential format: `TTSYYMMDD-NNNNNN`)
    *   `userId`: String (Foreign Key to User)
    *   `shippingAddressId` & `billingAddressId`: String (Foreign Keys to Address)
    *   `subtotal`: Decimal (Total line cost before adjustments)
    *   `discount`: Decimal (Default ₹0)
    *   `shipping`: Decimal (Default ₹0)
    *   `tax`: Decimal (GST 0%)
    *   `grandTotal`: Decimal (Net customer cost)
    *   `currency`: String (Default `INR`)
    *   `paymentStatus`: `PaymentStatus` enum
    *   `orderStatus`: `OrderStatus` enum
    *   `paymentMethod`: String (Default `razorpay`)
    *   `notes`: String (Nullable customer instructions)
    *   `estimatedCompletionDate`: DateTime (Nullable, set by admin)
    *   `createdAt` & `updatedAt`: DateTime
2.  **OrderItem** (Immutable Snapshot of Products and Customizations)
    *   `id`: String, Primary Key
    *   `orderId`: String (Foreign Key to Order)
    *   `productId`: String (Foreign Key to Product, Nullable to preserve item history if product is deleted)
    *   `variantId`: String (Foreign Key to ProductVariant, Nullable)
    *   `productName`: String
    *   `productSlug`: String
    *   `productImage`: String (Nullable)
    *   `sku`: String (Nullable)
    *   `variantName`: String (Nullable)
    *   `unitPrice`: Decimal
    *   `quantity`: Integer
    *   `customization`: Json (Nullable)
    *   `engravingText`: String (Nullable)
    *   `giftWrap`: Boolean (Default false)
    *   `lineTotal`: Decimal
3.  **OrderStatusHistory** (Audit Trail of Transitions)
    *   `id`: String, Primary Key
    *   `orderId`: String (Foreign Key to Order)
    *   `previousStatus`: `OrderStatus` (Nullable)
    *   `newStatus`: `OrderStatus`
    *   `changedBy`: String (Identifier of actor: `SYSTEM`, `CUSTOMER`, or Admin ID)
    *   `note`: String (Nullable explanation for transition)
    *   `createdAt`: DateTime

---

## 2. Transactional Business Logic
All critical actions during checkout are handled within a **single Prisma transaction** (`prisma.$transaction`) to guarantee consistency and database integrity.

### Checkout Conversion (`POST /api/v1/orders`)
1.  **Address & Cart Verification**: Ensures shipping and billing addresses exist and belong to the user. Reads the customer's cart.
2.  **Stock Allocation**:
    *   If a product is configured to `trackInventory` and uses variants, stock is verified and decremented on the corresponding `ProductVariant`.
    *   If no variant exists, stock is decremented from the base `Product` model.
    *   Throws a validation error if quantity exceeds available stock.
3.  **Order Details & Sequential Number**:
    *   Generates a sequential order number: `TTSYYMMDD-NNNNNN` based on the current system date and daily order count.
4.  **Creation**: Inserts the `Order`, maps each cart item to an `OrderItem` record, records the initial `PENDING` state in `OrderStatusHistory`, and clears the customer's cart.

### Order Cancellation
*   **Customer Constraints**: Customers are permitted to cancel orders only when in `PENDING`, `AWAITING_PAYMENT`, or `CONFIRMED` states. Customer cancellation is strictly blocked once production begins (`PROCESSING`, `HANDCRAFTING`, etc.).
*   **Stock Restoration**: Cancelling an order automatically restores inventory levels on the database for all items that track stock.

---

## 3. PDF Invoice Generation (`pdf-lib`)
To bypass high memory overheads associated with headless browser engines (e.g. Puppeteer), we built a lightweight PDF generation service using `pdf-lib`.

*   **Format**: Standard A4 dimensions (`595.27 x 841.89` pt).
*   **Layout**: Displays Two Threads Studio brand header, order summary details, detailed shipping/billing addresses, structured tabular items breakdown, calculated subtotals/fees, and corporate parent attribution ("A Brand of SYS Pvt. Ltd.").
*   **Encoding compatibility**: Helvetica standard font is restricted to WinAnsi encoding. To prevent PDF encoding errors, currency representation is drawn as `Rs.` rather than the `₹` symbol.
*   **Response stream**: Streamed dynamically to clients using inline content disposal with correct HTTP headers (`Content-Type: application/pdf`).

---

## 4. API Endpoint Register

### Customer Endpoints
*   `POST /api/v1/orders`: Initiate checkout, convert cart to order.
*   `GET /api/v1/orders`: Paginated list of customer orders.
*   `GET /api/v1/orders/:id`: Detail view of a specific customer order.
*   `POST /api/v1/orders/:id/cancel`: Cancel order (requires cancellation validation constraints).
*   `GET /api/v1/orders/:id/invoice`: Retrieve compiled PDF invoice.

### Administrator Endpoints
*   `GET /api/v1/admin/orders`: Search/list all store orders with filters and pagination.
*   `GET /api/v1/admin/orders/:id`: Detailed view of any order.
*   `PATCH /api/v1/admin/orders/:id/status`: Update order status, record history, and restore inventory if cancelled.
*   `PATCH /api/v1/admin/orders/:id/note`: Update internal notes.

---

## 5. Front-End Dashboard UI
We built a premium, cohesive customer dashboard tab within `pages/Account/OrdersTab.tsx`:

*   **Order History List**: Summarizes orders showing serial numbers, status badges (with warm, elegant tones like amber and emerald), creation dates, and grand totals.
*   **Visual Step Timeline Tracker**: Tracks order fulfillment steps dynamically (`Placed` -> `Payment Pending` -> `Confirmed` -> `Preparing Materials` -> `Handcrafting` -> `Shipped` -> `Delivered`).
*   **Immutable Details**: Visualizes exactly what was ordered, customization tags (hoop colors, engraving messages, and gift wraps), and billing/shipping addresses.
*   **Invoice Download Integration**: A single click triggers a clean binary download of the PDF invoice dynamically.
*   **Cancellation flow**: Interactive confirmation modal for cancelling pending orders.

---

## 6. QA Verification & Testing
E2E integration test suites were created and executed successfully via `run_order_tests.js`.
*   All tests (login, cart add, checkout, customer listing, invoice download, admin status changes, cancel blocks, stock restoration) passed successfully.
*   Typescript build verification was run and is clean.
