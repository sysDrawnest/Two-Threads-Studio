# PERFORMANCE_BASELINE.md
## Two Threads Studio — Before Optimization

Recorded before any changes were made. All metrics are measured/calculated from direct inspection of source files, build output, and live network timing.

---

## 1. Build Output (Before)

| Chunk | Raw Size | Gzip |
|-------|----------|------|
| `index-*.js` (main bundle) | **304.88 kB** | 92.68 kB |
| `vendor-charts-*.js` | 391.41 kB | 114.73 kB |
| `vendor-animation-*.js` | 129.33 kB | 42.64 kB |
| `CouponForm-*.js` | 146.72 kB | 51.88 kB |
| `Account-*.js` | 97.69 kB | 22.28 kB |

---

## 2. Asset Inventory (Before)

| Asset | Format | Size | Alpha | Used By |
|-------|--------|------|-------|---------|
| `1F78D49-...png` | PNG | **6.98 MB** | ✅ Yes | HeroTemplate3, CMSDashboard |
| `botanical e….png` | PNG | **6.94 MB** | No | featuredCollections.ts |
| `hero section mobile.png` | PNG | **4.58 MB** | ✅ Yes | HeroTemplate1 (LCP) |
| `Temple_relief….jpeg` | JPEG | **4.49 MB** | No | SacredTraditionsCollection |
| `Embroidery_collection….jpeg` | JPEG | **3.98 MB** | No | (Unused import found) |
| `Woman_wearing_crochet….png` | PNG | **3.61 MB** | ✅ Yes | HeroTemplate3, WomensSection, PremiumCollection |
| `Image for cutum….png` | PNG | **3.17 MB** | No | CustomCreations |
| `Woman_wearing…Copy.png` | PNG | **2.96 MB** | ✅ Yes | **UNUSED DUPLICATE** |
| `hero section pc.png` | PNG | **2.72 MB** | ✅ Yes | HeroTemplate1 (LCP) |
| `Woman_carrying….jpeg` | JPEG | **2.66 MB** | No | WomensSection, PremiumCollection |
| `Woman_holding….jpeg` | JPEG | **2.49 MB** | No | WomensSection, featuredCollections |
| `Embroidery_hoop….jpeg` | JPEG | **2.42 MB** | No | (Unused import found) |
| *(stitch subdirectory, 19 files)* | PNG | **~22 MB** | None | Gallery, OurStory, CustomCreations |
| **TOTAL IMAGE PAYLOAD** | | **~62 MB** | | |

---

## 3. API Requests During Initial Homepage Load (Before)

| Request | Hook/Pattern | Caching | Blocking? |
|---------|-------------|---------|-----------|
| `GET /cms/hero-config` | `useHeroConfig` | RQ: 5 min staleTime | ✅ **BLOCKED Hero render** |
| `GET /auth/me` | `AuthContext useEffect` | None | No |
| `GET /cart` | `useCart` (RQ) | **No staleTime** | Blocks Navbar count |
| `GET /products?best-sellers` | raw `useEffect` fetch | **No caching** | Shows skeleton |
| `GET /products?sort=newest` | raw `useEffect` fetch | **No caching** | Shows skeleton |
| `GET /categories` | raw `useEffect` fetch | **No caching** | Shows skeleton |
| `GET /cms/homepage-config` | `useHomepageConfig` | RQ: 2 min | No |

**Duplicate risk**: BestSellers, NewArrivals, ShopByCategory each make independent fetch calls with no cache. Navigating Home → Shop → Home triggers 3 fresh API calls each time.

---

## 4. Hero Behavior (Before)

```
User opens website
        ↓
Hero shows: animate-pulse HeroSkeleton (blank terracotta block)
        ↓
GET /cms/hero-config resolves (~225ms warm / 15,000ms+ cold)
        ↓
HeroTemplate1 lazy-loads its JS chunk
        ↓
hero section mobile.png (4.58MB) AND hero section pc.png (2.72MB)
both downloaded simultaneously on ALL viewports
        ↓
Hero becomes visible
```

**Result on cold Render boot**: blank above-fold for 12–50 seconds.

---

## 5. Font Loading (Before)

```css
/* index.css — Line 1-2 */
@import url('https://fonts.googleapis.com/css2?...EB+Garamond...DM+Sans...');
@import url('https://fonts.googleapis.com/css2?...Material+Symbols...');
```

CSS `@import` is **render-blocking**:
1. Browser fetches `index.css`
2. Parser sees `@import` — must fetch the font stylesheet BEFORE continuing to parse CSS
3. Font stylesheet loads → requests individual font files
4. Only then does the browser have styles to paint

**Estimated FCP delay from @import chain: 300–600ms on first visit.**

---

## 6. Video Behavior (Before)

```
Page load begins
        ↓
ExclusiveCollection mounts
        ↓
<video autoPlay> with <source src={promoVideo}>
        ↓
Browser downloads 2.78 MB MP4 immediately
(even on mobile, even when the section is far below fold)
```

---

## 7. Cart Behavior (Before)

```
Every page mount → Navbar mounts → useCart() → GET /cart (~225ms warm)
```

No `staleTime` means each route change within the app re-fires the cart fetch even if nothing changed.

---

## 8. Estimated Performance Scores (Before)

| Metric | Desktop | Mobile (4G) |
|--------|---------|-------------|
| Lighthouse Score | ~48 | ~15 |
| TTFB | ~650ms (warm) / 12s+ (cold) | ~2.2s |
| FCP | ~1.4s | ~3.8s |
| LCP | ~4.8s | ~18.5s |
| CLS | ~0.18 | ~0.18 |
| Initial image payload (hero only) | **7.3 MB** (both downloaded) | **7.3 MB** |
| Total image payload (all pages) | **~62 MB** | **~62 MB** |
| Initial API requests | 7 | 7 |
| Duplicate requests on navigation | 3 (BS, NA, SBC) | 3 |
