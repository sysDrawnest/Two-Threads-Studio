# Phase 6A — Admin Commerce Platform
## Frontend UI Architecture

---

## Guiding Philosophy

This is an **Enterprise Commerce Operating System**, not an admin panel.

Every screen must feel like it belongs in a premium SaaS product: Stripe Dashboard × Shopify Admin × Notion × Apple Settings. The Two Threads Studio design language dominates throughout — warm off-whites, dark editorial type, whisper-thin borders, and generous whitespace.

**Core axioms:**
- No Bootstrap, no Material UI templates, no AdminLTE
- No colorful stat cards, no rainbow charts  
- Monochrome palette with the existing brand tokens only
- Typography-first: information hierarchy through size and weight, not color
- Every state has a design: loading, empty, error, success, optimistic

---

## Design Language (inherited from brand)

| Token | Value | Usage |
|---|---|---|
| `background` | `#fef8f3` | Page background |
| `primary-container` | `#2d2520` | Primary text, headings |
| `on-secondary-container` | `#785d4b` | Secondary/muted text |
| `outline-variant` | `#d1c4bd` | Borders, dividers |
| `surface-container` | `#f2ede8` | Card backgrounds |
| `inverse-on-surface` | `#f5f0eb` | Sidebar active text |
| `error` | `#ba1a1a` | Destructive states |
| `font-serif` | Cormorant Garamond | Page titles |
| `font-sans` | Lato | Body, labels |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript |
| Routing | React Router v7 (existing) |
| Data Fetching | TanStack React Query v5 (existing) |
| HTTP Client | `apiClient.ts` (existing, extended) |
| State | React local state + React Query cache |
| Animations | Framer Motion (existing) |
| Icons | Lucide React (existing) |
| Styling | Tailwind CSS v3 with existing design tokens |
| Charts | CSS-based (no library) — bar charts, sparklines |

**No new packages** unless strictly required.

---

## Routing Architecture

The existing routing in `App.tsx` is preserved. New routes added to `AdminRoutes`:

```
/admin                    → AdminDashboard (rebuilt)
/admin/orders             → OrdersManagement (rebuilt)
/admin/orders/:id         → OrderDetail (new)
/admin/customers          → CustomersManagement (rebuilt)
/admin/customers/:id      → CustomerProfile (new)
/admin/products           → ProductsManagement (rebuilt)
/admin/products/new       → ProductForm (new)
/admin/products/:id/edit  → ProductForm (new)
/admin/inventory          → InventoryManagement (new)
/admin/reviews            → ReviewsManagement (rebuilt)
/admin/risk               → RiskCenter (new)
/admin/analytics          → AnalyticsDashboard (rebuilt)
/admin/settings           → AdminSettings (rebuilt)
```

---

## Layout Architecture

### AdminLayout (rebuilt)
```
┌─────────────────────────────────────────────────────┐
│  AdminSidebar (260px desktop, slide-over mobile)    │
├─────────┬───────────────────────────────────────────┤
│ Sidebar │ TopBar (64px, search, user, storefront)   │
│         ├───────────────────────────────────────────┤
│         │ Breadcrumbs                               │
│         ├───────────────────────────────────────────┤
│         │                                           │
│         │           <Outlet />                      │
│         │                                           │
└─────────┴───────────────────────────────────────────┘
```

### Mobile Layout (≤768px)
```
┌──────────────────────────┐
│ TopBar (hamburger, logo) │
├──────────────────────────┤
│                          │
│       <Outlet />         │
│                          │
├──────────────────────────┤
│  Bottom Nav (5 items)    │
└──────────────────────────┘
```

---

## Service Layer Architecture

All admin data fetching centralised in `src/services/adminService.ts`:

```typescript
export const adminService = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/dashboard'),
  
  // Orders
  listOrders: (params) => apiClient.get(`/admin/orders?${qs}`),
  getOrder: (id) => apiClient.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status, note) => apiClient.patch(`/admin/orders/${id}/status`, { status, note }),
  updateOrderNote: (id, note) => apiClient.patch(`/admin/orders/${id}/note`, { note }),
  
  // Customers
  listCustomers: (params) => apiClient.get(`/admin/customers?${qs}`),
  getCustomer: (id) => apiClient.get(`/admin/customers/${id}`),
  updateCustomerStatus: (id, isActive) => apiClient.patch(`/admin/customers/${id}/status`, { isActive }),
  
  // Products (extends existing productService)
  listAllProducts: (params) => apiClient.get(`/products?${qs}`),
  createProduct: (data) => apiClient.post('/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
  updateProductStatus: (id, status) => apiClient.patch(`/products/${id}/status`, { status }),
  updateInventory: (id, data) => apiClient.patch(`/products/${id}/inventory`, data),
  
  // Reviews
  listReviews: (params) => apiClient.get(`/admin/reviews?${qs}`),
  updateReview: (id, data) => apiClient.patch(`/admin/reviews/${id}`, data),
  
  // Risk
  getRiskDashboard: () => apiClient.get('/admin/risk/dashboard'),
  listCustomerRisk: (params) => apiClient.get(`/admin/risk/customers?${qs}`),
  blockCustomer: (userId, data) => apiClient.patch(`/admin/risk/customers/${userId}/block`, data),
  listReviewQueue: (params) => apiClient.get(`/admin/risk/review-queue?${qs}`),
  approveOrder: (orderId, note) => apiClient.post(`/admin/risk/review-queue/${orderId}/approve`, { note }),
  rejectOrder: (orderId, note) => apiClient.post(`/admin/risk/review-queue/${orderId}/reject`, { note }),
  listFraudFlags: (params) => apiClient.get(`/admin/risk/fraud-flags?${qs}`),
  resolveFraudFlag: (flagId) => apiClient.patch(`/admin/risk/fraud-flags/${flagId}/resolve`),
  
  // Payments
  listPayments: (params) => apiClient.get(`/admin/payments?${qs}`),
  processRefund: (paymentId, data) => apiClient.post(`/admin/payments/${paymentId}/refund`, data),
  
  // Analytics
  getAnalytics: (params) => apiClient.get(`/admin/analytics/revenue?${qs}`),
  getOrderAnalytics: (params) => apiClient.get(`/admin/analytics/orders?${qs}`),
  getTopProducts: () => apiClient.get('/admin/analytics/products'),
  
  // Inventory
  listInventory: (params) => apiClient.get(`/admin/inventory?${qs}`),
}
```

### React Query Hooks in `src/hooks/useAdminData.ts`
Each service call gets a corresponding hook:
- `useAdminDashboard()`
- `useAdminOrders(params)` + `useAdminOrder(id)`
- `useAdminCustomers(params)` + `useAdminCustomer(id)`
- `useAdminProducts(params)`
- `useAdminReviews(params)`
- `useAdminRiskDashboard()` + `useAdminReviewQueue(params)`
- `useAdminAnalytics(params)`
- `useAdminInventory(params)`

---

## Component Library (new admin-specific)

### Location: `src/components/admin/`

```
src/components/admin/
  ui/
    AdminBadge.tsx          — status pill (PENDING/CONFIRMED/etc.)
    AdminTable.tsx          — professional data table with sort/filter
    AdminSkeleton.tsx       — loading skeleton variants
    AdminEmptyState.tsx     — empty state with illustration/message
    AdminToast.tsx          — toast notification system
    AdminConfirmDialog.tsx  — confirmation modal
    AdminPagination.tsx     — pagination controls
    AdminSearchBar.tsx      — search input with debounce
    AdminFilterBar.tsx      — filter chips
    AdminStatCard.tsx       — KPI metric card (rebuilt)
    AdminChart.tsx          — CSS bar/line chart
    AdminTimeline.tsx       — status/audit timeline
    AdminDrawer.tsx         — slide-over panel for mobile detail views
  forms/
    ProductForm.tsx         — create/edit product form
    InventoryAdjustForm.tsx — stock adjustment form
```

---

## State Management Strategy

| Data | Strategy |
|---|---|
| Server data | React Query (stale-while-revalidate) |
| Form state | React `useState` (local, not global) |
| Filter/pagination | URL search params via `useSearchParams` |
| Optimistic updates | React Query `onMutate` + rollback |
| Toasts | Local context via `AdminToastContext` |
| Sidebar state | `localStorage` persistence |

---

## Performance Strategy

| Technique | Implementation |
|---|---|
| Code splitting | All admin pages lazy loaded (existing pattern) |
| Table virtualization | CSS `overflow-y: auto` + pagination (20 rows default) |
| Memoization | `useMemo` for computed table data, `React.memo` for row cells |
| Query deduplication | React Query automatic |
| Skeleton loading | All queries show skeletons while loading |
| Stale time | 30s for lists, 60s for detail views |
