# Phase 6A — Admin Commerce Platform
## Component Tree & Screen Inventory

---

## Screen-by-Screen Breakdown

---

### 1. AdminDashboard `/admin`

**Purpose:** Command center. First thing operations see every morning.

**Layout:** 4-column grid on desktop, single column on mobile.

**Sections:**
```
┌─────────────────────────────────────────────────────────────┐
│  GOOD MORNING, [NAME]                          [date/time]  │
│  Two Threads Studio Operations                              │
├────────────┬────────────┬────────────┬─────────────────────┤
│ Revenue    │ Orders     │ Customers  │ Pending Review      │
│ (Today)    │ (Today)    │ (New)      │ (Risk Alerts)       │
├────────────┴────────────┴────────────┴─────────────────────┤
│  Revenue Trend (CSS bar chart, last 30 days)               │
│  ─────────────────────────────────────────────────────      │
│  Orders by Status (horizontal bar chart)                   │
├─────────────────────────────────────────┬───────────────────┤
│  Recent Orders (last 10)                │ Low Stock Alert   │
│  [OrderNumber] [Customer] [Amount] [•]  │ [Product] [Qty]   │
├─────────────────────────────────────────┴───────────────────┤
│  Risk Centre Preview                                        │
│  [Fraud Flags: N] [Review Queue: N] [Blocked: N]           │
└─────────────────────────────────────────────────────────────┘
```

**Data sources:**
- `useAdminDashboard()` → `GET /admin/dashboard`
- Stale time: 30s, auto-refetch on window focus

**Components:**
- `AdminStatCard` × 4
- `AdminChart` (revenue trend)
- `AdminTable` (recent orders, compact)
- `AdminBadge` (order status)
- `AdminEmptyState` (no orders state)

---

### 2. OrdersManagement `/admin/orders`

**Purpose:** Full order ledger. Filter, search, update status.

**Layout:** Filter bar → Table → Pagination. Side drawer on mobile.

```
┌──────────────────────────────────────────────────────────────┐
│  Orders                                  [Export ↓]         │
│  1,247 orders                                               │
├──────────────────────────────────────────────────────────────┤
│  [Search orders...]  [Status ▾]  [Payment ▾]  [Date ▾]     │
├───────┬───────────────┬──────────┬───────────┬──────────────┤
│  #    │  Customer     │  Amount  │  Status   │  Date    [→] │
├───────┼───────────────┼──────────┼───────────┼──────────────┤
│  row  │  row          │  row     │  badge    │  row         │
│  ...  │  ...          │  ...     │  ...      │  ...         │
├───────┴───────────────┴──────────┴───────────┴──────────────┤
│  [← Prev]  Page 1 of 62  [Next →]                          │
└──────────────────────────────────────────────────────────────┘
```

**OrderDetail Drawer (slide-over from right):**
```
┌────────────────────────────────────┐
│  ← Orders  |  TTS240717-000042    │
│                                   │
│  CUSTOMER                         │
│  Priya Sharma                     │
│  priya@email.com                  │
│                                   │
│  ORDER ITEMS                      │
│  [img] Botanical Meadow Kit  ×2   │
│         ₹6,800                    │
│                                   │
│  PRICING                          │
│  Subtotal  ₹6,800                 │
│  Discount  −₹500                  │
│  Shipping  ₹0                     │
│  ─────────────────                │
│  Total     ₹6,300                 │
│                                   │
│  PAYMENT                          │
│  [●] ONLINE  Razorpay Captured    │
│                                   │
│  STATUS TIMELINE                  │
│  ●── Confirmed → Processing       │
│                                   │
│  UPDATE STATUS  [CONFIRMED ▾]     │
│  [Update]  [Add Note]             │
│                                   │
│  INTERNAL NOTES                   │
│  [textarea]  [Save]               │
└────────────────────────────────────┘
```

**Components:**
- `AdminSearchBar`, `AdminFilterBar`
- `AdminTable` (sortable, paginated)
- `AdminBadge` (order status, payment status)
- `AdminDrawer` (order detail)
- `AdminTimeline` (status history)
- `AdminConfirmDialog` (status change)
- `AdminToast` (mutation feedback)

---

### 3. OrderDetail `/admin/orders/:id`

**Purpose:** Full-page detail view for complex orders.

**Data:** `useAdminOrder(id)` → `GET /admin/orders/:id`

**Sections:**
- Customer info + risk badge
- Items table
- Pricing breakdown
- Payment card (with refund button)
- Shipment card (track / create shipment)
- Status update panel
- Status history timeline
- Audit log
- Internal notes

---

### 4. CustomersManagement `/admin/customers`

**Purpose:** Customer directory with trust/risk signals.

```
┌──────────────────────────────────────────────────────┐
│  Customers                         [Export ↓]        │
│  3,041 registered customers                          │
├──────────────────────────────────────────────────────┤
│  [Search...]  [Status ▾]  [Trust Score ▾]           │
├──────────────┬────────────┬─────────┬────────────────┤
│  Customer    │  Joined    │  Orders │  Trust  [→]    │
├──────────────┼────────────┼─────────┼────────────────┤
│  Avatar Name │  Jan 2025  │  12     │  [score bar]   │
└──────────────┴────────────┴─────────┴────────────────┘
```

**Components:**
- `AdminTable` with trust score column
- Trust score visual: thin bar 0–100 with color (warm green = high, amber = medium, error = low)
- `AdminBadge` for blocked status
- `AdminDrawer` for customer quick-view

---

### 5. CustomerProfile `/admin/customers/:id`

**Purpose:** Full customer 360° view.

**Sections:**
- Header: avatar, name, email, phone, join date, status (active/blocked)
- KPI row: orders placed, delivered, RTO rate, total spend, trust score
- Risk profile: trust score engine breakdown, fraud flags, admin notes
- Order history (table)
- Addresses
- Actions: Block/Unblock, update notes

---

### 6. ProductsManagement `/admin/products`

**Purpose:** Product catalog management connected to live API.

**Layout:** Stat bar → Filter bar → Table

```
┌─────────────────────────────────────────────────────────┐
│  Products                          [+ Add Product]      │
│                                                         │
│  [ACTIVE: 42]  [DRAFT: 8]  [ARCHIVED: 3]  [OOS: 5]    │
├─────────────────────────────────────────────────────────┤
│  [Search...]  [Category ▾]  [Status ▾]  [Type ▾]       │
├───────────────┬──────────┬──────────┬────────┬──────────┤
│  Product      │  Price   │  Stock   │  Status│  Actions │
├───────────────┼──────────┼──────────┼────────┼──────────┤
│  [img] Name   │  ₹2,800  │  [bar]   │  badge │  Edit…  │
└───────────────┴──────────┴──────────┴────────┴──────────┘
```

**Stock bar:** thin visual indicator, red if below threshold.

**Components:**
- `AdminTable` connected to `GET /products`
- `AdminBadge` (ACTIVE/DRAFT/ARCHIVED/OUT_OF_STOCK)
- `ProductForm` in modal/drawer for create/edit
- Inventory inline edit (click qty → input)

---

### 7. ProductForm `/admin/products/new` & `/admin/products/:id/edit`

**Purpose:** Create and edit product form.

**Sections:**
- Basic info: name, slug (auto), description, short description
- Pricing: price, compare price, cost price
- Category/Collection
- Status, Type, Badge
- Inventory: stock qty, low stock threshold, track inventory
- Product attributes: handmade, sustainable, personalizable, COD allowed
- Materials, techniques, care instructions
- SEO: seo title, seo description
- Images (up to 8)

---

### 8. InventoryManagement `/admin/inventory`

**Purpose:** Stock level overview and quick adjustments.

```
┌────────────────────────────────────────────────────────┐
│  Inventory                        Total SKUs: 58       │
│  [LOW STOCK: 12]  [OUT OF STOCK: 5]                   │
├──────────────┬──────────┬────────────┬─────────────────┤
│  Product     │  SKU     │  Stock     │  Threshold  [→] │
├──────────────┼──────────┼────────────┼─────────────────┤
│  Name        │  TTS-001 │  [3] ●     │  5    [Adjust]  │
│  Name        │  TTS-002 │  [0] ●●    │  5    [Adjust]  │
└──────────────┴──────────┴────────────┴─────────────────┘
```

Stock indicators: green dot (healthy), amber dot (low), red dot (out).

---

### 9. ReviewsManagement `/admin/reviews`

**Purpose:** Moderate customer product reviews.

**Sections:**
- Filter by status: PENDING / APPROVED / REJECTED
- Table: reviewer, product, rating (star display), excerpt, date
- Approve/Reject actions inline

---

### 10. RiskCenter `/admin/risk`

**Purpose:** Operations security hub.

**Tabs:**
1. **Manual Review Queue** — orders requiring admin action
2. **Fraud Flags** — active signals per order/user
3. **Customer Risk** — trust score list
4. **Blocked Customers** — active blocks

**Key interactions:**
- Approve order (with note)
- Reject order (with note, required)
- Resolve fraud flag
- Block/unblock customer

---

### 11. AnalyticsDashboard `/admin/analytics`

**Purpose:** Business intelligence overview.

**Sections:**
- Date range picker (Today / 7d / 30d / 90d / Custom)
- Revenue chart (grouped bar, CSS-based)
- Orders by status donut (CSS-based)
- Top 10 products by revenue
- Average order value trend

---

### 12. AdminSettings `/admin/settings`

**Purpose:** Platform configuration.

**Sections:**
- Studio profile info
- Notification preferences
- Prepaid discount percentage (from env variable display)
- Risk thresholds (display-only)

---

## Shared Component Inventory

```
src/components/admin/
├── ui/
│   ├── AdminBadge.tsx           ← status/type pill
│   ├── AdminTable.tsx           ← enterprise data table
│   ├── AdminSkeleton.tsx        ← loading states
│   ├── AdminEmptyState.tsx      ← empty screens
│   ├── AdminToast.tsx           ← notification system
│   ├── AdminConfirmDialog.tsx   ← dangerous action modals
│   ├── AdminPagination.tsx      ← page controls
│   ├── AdminSearchBar.tsx       ← debounced search
│   ├── AdminFilterBar.tsx       ← filter chip row
│   ├── AdminStatCard.tsx        ← KPI metric tile
│   ├── AdminChart.tsx           ← CSS bar/sparkline charts
│   ├── AdminTimeline.tsx        ← status history
│   └── AdminDrawer.tsx          ← slide-over panel
├── forms/
│   ├── ProductForm.tsx
│   └── InventoryAdjustForm.tsx
└── layout/
    ├── AdminLayout.tsx          ← rebuilt
    ├── AdminSidebar.tsx         ← rebuilt with more nav items
    ├── AdminTopBar.tsx          ← new extracted component
    └── AdminBreadcrumbs.tsx     ← contextual breadcrumbs
```
