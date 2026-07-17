# Phase 6A — Admin Commerce Platform
## Mobile-First Strategy

---

## Overview

The admin platform must be **fully operational on mobile**. Operations staff need to process orders, check inventory, and handle risk alerts from a phone while at a market, warehouse, or studio.

The design follows a **progressive enhancement** approach: mobile layout is the primary design, desktop is a comfortable extension.

---

## Breakpoints

```
Mobile:  ≤ 768px   → Bottom nav, full-screen sheets, swipe gestures
Tablet:  768–1024px → Collapsed sidebar (icon-only), drawer overlays
Desktop: ≥ 1024px  → Expanded sidebar, multi-column layouts, hover states
```

---

## Navigation

### Desktop
- Left sidebar: 260px expanded, 64px collapsed (icon-only)
- Persistent, sticky, full-height
- Collapse state stored in `localStorage`

### Mobile
- **Bottom navigation bar**: 5 primary items (Overview, Orders, Customers, Products, More)
- Fixed to bottom, 56px height
- "More" opens a bottom sheet with secondary nav items
- Top bar: Studio wordmark + hamburger (opens secondary sheet) + user avatar

### Tablet
- Collapsed sidebar (icon-only, 64px)
- Tooltip labels on hover
- Tap expands to full 260px overlay

---

## Touch Targets

All interactive elements must be **minimum 48×48px**:

| Element | Desktop Size | Mobile Size |
|---|---|---|
| Nav items | 40px height | 56px height |
| Table row actions | 32px button | 48px tap area |
| Status badges (actionable) | 28px | 40px |
| Form inputs | 40px height | 48px height |
| Pagination buttons | 36px | 48px |

---

## Mobile Layout Patterns

### List → Detail Pattern (Primary)

Instead of side drawers on mobile, use full-screen push navigation:

```
Orders List           →  (tap row)  →  Order Detail
/admin/orders                          /admin/orders/:id
[↑ Full page]                          [← Back button top-left]
```

### Swipe-to-Reveal Actions

For order/customer rows on mobile:
- Swipe left → reveals action buttons (View, Quick Status)
- Swipe right → marks as reviewed (if pending)

**Implementation:** CSS `overflow: hidden` + `transform: translateX` with touch event listeners.

### Bottom Sheet for Filters

On mobile, filter bar becomes a floating "Filter" button that opens a bottom sheet modal:

```
[Filter ▾]  →  (tap)  →  ┌──────────────────────┐
                           │  Filters             │
                           │                      │
                           │  Status              │
                           │  ○ All               │
                           │  ○ Pending           │
                           │  ○ Confirmed         │
                           │                      │
                           │  [Apply]  [Clear]    │
                           └──────────────────────┘
```

### Compact Table Cards (Mobile)

On mobile, data tables render as cards instead of rows:

```
┌─────────────────────────────────┐
│  TTS240717-000042         [→]  │
│  Priya Sharma                  │
│  ₹6,300  •  CONFIRMED         │
│  17 Jul 2025                   │
└─────────────────────────────────┘
```

### Stats in Scrollable Row

Dashboard KPI cards become a horizontal scroll row on mobile:

```
[← Revenue Today  |  Orders Today  |  Pending →]
```

---

## Responsive Component Rules

### AdminTable
- **Desktop:** Traditional HTML table with all columns
- **Tablet:** Hide 1–2 least important columns
- **Mobile:** Card list render (CSS transform, no layout change in JSX — driven by a `isMobile` prop or CSS)

Implementation: Single component, `variant` prop:
```tsx
<AdminTable
  data={orders}
  columns={columns}
  mobileCard={(row) => <OrderCard order={row} />}
/>
```

### AdminDrawer
- **Desktop:** Slides in from right (320px width, main content remains visible)
- **Mobile:** Full-screen slide-up sheet

### AdminStatCard
- **Desktop:** 4 cards per row
- **Tablet:** 2 per row
- **Mobile:** 2 per row (compact), horizontal scroll for overflow

### Forms (ProductForm, etc.)
- **Desktop:** 2-column grid
- **Mobile:** Single column, sticky "Save" button at bottom of viewport

---

## Performance on Mobile

| Concern | Solution |
|---|---|
| Large tables | Pagination (20 rows max, no virtual scroll needed at this scale) |
| Image-heavy (products) | `loading="lazy"` on all table thumbnails |
| Bundle size | All admin pages are already lazy-loaded via `React.lazy` |
| Network requests | React Query cache (stale-while-revalidate, 30s stale time) |
| Animations | `prefers-reduced-motion` media query check before Framer Motion |

---

## Offline & Error States

- **No connection:** Show persistent banner "You're offline — some data may be stale"
- **API error:** `AdminEmptyState` with error variant and retry button
- **Mutation failure:** Toast notification with error message
- **Slow network:** Skeleton loaders persist until data resolves (no timeout cutoff)

---

## Mobile-Specific UX Details

1. **No hover states** — all interactions must be tap-first
2. **Long press** — not used (unpredictable on mobile)
3. **Pull to refresh** — implemented on list pages via React Query `refetch`
4. **Keyboard** — forms push viewport up (native behavior, no JS override)
5. **Safe areas** — bottom nav respects `env(safe-area-inset-bottom)` for notch phones
6. **Orientation** — layout adapts to landscape (sidebar becomes top bar on very small landscape screens)

---

## Implementation Checklist

- [ ] Add `safe-area-inset-bottom` to bottom nav
- [ ] Implement `mobileCard` prop in `AdminTable`
- [ ] Build `AdminBottomNav` component (5 items)
- [ ] Build `AdminFilterSheet` bottom sheet
- [ ] Ensure all form inputs have `min-h-[48px]`
- [ ] Test on 375px viewport (iPhone SE) before marking any screen complete
- [ ] Test on 768px viewport (iPad) for tablet layout
- [ ] Verify no horizontal overflow on any mobile screen
