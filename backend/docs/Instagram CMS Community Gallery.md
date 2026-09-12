# Walkthrough — Shoppable CMS Community Gallery

We have implemented the full CMS-driven **Shoppable Community Gallery** ("Our Community / Styled by You") allowing store administrators to add, edit, reorder, delete, and link customer showcase photos directly from the Admin CMS Dashboard.

---

## 1. Backend Changes

### Schema Extension (`StudioSettings`)
- **File**: [`backend/prisma/schema.prisma`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/backend/prisma/schema.prisma)
- Added `homepageCommunityGallery Json?` and `instagramUrl String?` to the existing `StudioSettings` singleton model.
- Ran `npx prisma generate` to refresh Prisma Client types.
- **Zero migration overhead** — uses JSON persistence consistent with other homepage modules.

### Controller & Endpoints
- **File**: [`backend/src/controllers/cms.controller.ts`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/backend/src/controllers/cms.controller.ts)
- **File**: [`backend/src/routes/cms.routes.ts`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/backend/src/routes/cms.routes.ts)
- Added:
  - `GET /api/v1/cms/community-gallery` — Public storefront read (returns active items sorted by order + dynamic Instagram URL).
  - `GET /api/v1/admin/cms/community-gallery` — Admin read (returns all items + Instagram URL).
  - `POST /api/v1/admin/cms/community-gallery` — Admin upsert (adds new or updates existing photo item).
  - `DELETE /api/v1/admin/cms/community-gallery/:id` — Admin delete.
  - `PATCH /api/v1/admin/cms/community-gallery/reorder` — Admin reordering.
  - `PATCH /api/v1/admin/cms/instagram-url` — Admin configurable Instagram profile URL.

---

## 2. Frontend Services & Hooks

### CMS Service
- **File**: [`frontend/src/services/cmsService.ts`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/frontend/src/services/cmsService.ts)
- Defined `CommunityGalleryItem` & `CommunityGalleryResponse` interfaces.
- Added client methods: `getCommunityGallery`, `getAdminCommunityGallery`, `upsertCommunityGalleryItem`, `deleteCommunityGalleryItem`, `reorderCommunityGallery`, `updateInstagramUrl`.

### React Query Hooks
- **File**: [`frontend/src/hooks/useCms.ts`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/frontend/src/hooks/useCms.ts)
- Added:
  - `useCommunityGallery()` — Storefront hook with caching.
  - `useAdminCommunityGallery()` — Admin query hook.
  - `useUpsertCommunityGalleryItem()` — Mutation with automatic query invalidation and toast notifications.
  - `useDeleteCommunityGalleryItem()` — Mutation with automatic query invalidation.
  - `useReorderCommunityGallery()` — Mutation for drag/order updating.
  - `useUpdateInstagramUrl()` — Mutation to update studio Instagram URL.

---

## 3. Admin CMS Dashboard

- **File**: [`frontend/src/pages/admin/CMSDashboard.tsx`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/frontend/src/pages/admin/CMSDashboard.tsx)
- Added **"Community Gallery"** tab to the navigation tabs.
- **Studio Instagram Profile Link Card**: Configure and update studio Instagram URL.
- **Add / Edit Community Photo Form**:
  - Image URL input or direct file upload via `/upload/single`.
  - Live photo thumbnail preview.
  - Creator Instagram handle (e.g. `@maya.stitches`).
  - Catalog Product Link dropdown (auto-fills product name and slug).
  - Custom display product name.
  - "Tall Tile" toggle (controls 2-row span on desktop grid).
  - "Active" visibility toggle.
- **Showcase Items Grid**:
  - Cards showing photo thumbnail, tall badge, handle, product name, and link status.
  - Move Up / Move Down buttons for reordering.
  - Edit button to load into form.
  - Delete button with confirmation.

---

## 4. Storefront Community Gallery

- **File**: [`frontend/src/components/sections/CommunityGallery.tsx`](file:///d:/WEB%20Dev/Moti/Two%20Threads%20Studio/frontend/src/components/sections/CommunityGallery.tsx)
- Connected to `useCommunityGallery()` with seamless fallback to existing aesthetic tiles if loading.
- Substituted hardcoded Instagram link with live configured `instagramUrl`.
- Replaced non-functional "Shop this look" text with a real `react-router-dom` `<Link to="/product/:slug">` directing visitors straight to the shoppable product page.

---

## 5. Verification
- **Backend Typecheck**: `npx tsc --noEmit` in `backend` passed with code 0.
- **Frontend Typecheck**: `npx tsc --noEmit` in `frontend` passed with code 0.
- **Production Build**: `npm run build` in `frontend` completed cleanly in 10.20s.
