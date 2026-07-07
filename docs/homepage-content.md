# Homepage Render Flow

The homepage renders in the following top-to-bottom order:

1. `Hero`
2. `BestSellers`
3. `ExploreByRoom`
4. `Banner`
5. `JustForYou`
6. `CricketKeychains`
7. `OurStory`
8. `Reviews`
9. `Learning`
10. `Newsletter`

---

## Hero

### Component
`Hero` (inside `src/components/sections/HomeSections.tsx`)

### Purpose
To create a stunning first impression, establish the brand's premium identity, and drive immediate exploration or shopping.

### Content
*   **Headings**: "Handmade with Intention" (overline), "Naturally Made for Living" (H1).
*   **Descriptions**: "Thoughtfully made stitches that bring warmth, texture, and story into every room."
*   **CTAs**: "Shop Now", "Explore".
*   **Cards**: Floating product cards (e.g., Floral Hoop Kit, Botanical Set).
*   **Images**: Background image of embroidery supplies.

### Layout
*   **Desktop**: Full-height viewport (`100vh`) with text heavily weighted to the left/center and floating product cards absolute positioned on the right.
*   **Tablet**: Similar to desktop, but floating cards may be hidden or adjusted.
*   **Mobile**: Floating cards are hidden. Text is centered or left-aligned within standard padding.

### Styling
*   **Colors**: Gradients (`from-[#f0e8de] via-[#e8ddd3] to-[#d4c4b5]`), text-on-secondary-container (`#785d4b`), primary-container (`#2d2520`).
*   **Typography**: H1 uses `Cormorant Garamond` (Light, 5xl-7xl). Body uses `Lato` (italic).
*   **Overlays**: Dark/Gradient overlays on the background image to ensure text readability.

### Animations
*   **Transitions**: Uses `ScrollReveal` for staggered upward fade-in of text elements and leftward fade-in of floating cards.

### User Interaction
*   **Buttons**: Hover effects on "Shop Now" and "Explore". Floating cards slightly lift on hover.

### Dependencies
*   No external data dependencies (currently hardcoded state). Relies on `ScrollReveal` UI component.

### Performance Notes
*   Hero background image is a large Unsplash asset; should be preloaded. Has an `onError` fallback to hide the image if it fails.

---

## BestSellers

### Component
`BestSellers` (inside `src/components/sections/HomeSections.tsx`)

### Purpose
Highlight the most popular products to drive quick conversions.

### Content
*   **Headings**: "Best Sellers", "Most Loved Designs".
*   **Cards**: Four product cards (Meadow Hoop Kit, Garden Botanicals, Linen Starter Set, Forest Creatures).

### Layout
*   **Desktop**: 4-column CSS grid (`grid-cols-4`).
*   **Tablet**: 2-column grid (`sm:grid-cols-2`).
*   **Mobile**: 1-column layout (`grid-cols-1`).

### Styling
*   **Colors**: Background is `inverse-on-surface` (`#f5f0eb`).
*   **Spacing**: Heavy vertical padding (`py-24`).

### Animations
*   **Scroll**: Staggered upward fade-in using `StaggerContainer` and `ScrollReveal`.
*   **Hover**: Cards lift (`hover:-translate-y-1.5`) and gain shadow.

### User Interaction
*   **Navigation**: Cards are clickable (currently static placeholders).

---

## ExploreByRoom

### Component
`ExploreByRoom` (inside `src/components/sections/HomeSections.tsx`)

### Purpose
Categorize products by the physical space they are meant for, encouraging lifestyle-based purchasing.

### Content
*   **Headings**: "Explore By Room".
*   **Images**: High-end editorial photos for Living, Bath, and Bed.

### Layout
*   **Desktop**: Asymmetric/Responsive grid or flex layout displaying distinct room categories.
*   **Mobile**: Single column layout.

### Styling
*   **Typography**: Editorial serif typography.
*   **Images**: Uses local assets imported from `src/assets/stitch/`.

### Animations
*   **Scroll**: Standard reveal animations.

---

## Banner, JustForYou, CricketKeychains, OurStory, Reviews, Learning, Newsletter

### Component
Various components inside `HomeSections.tsx` and `CricketKeychains.tsx`.

### Purpose
*   **Banner**: Promotional break or lifestyle imagery.
*   **JustForYou**: Personalized or recommended product carousel/grid.
*   **CricketKeychains**: Specific highlighted product collection.
*   **OurStory**: Brand heritage and artisanal process.
*   **Reviews**: Social proof and testimonials.
*   **Learning**: Educational content (e.g., embroidery tutorials).
*   **Newsletter**: Lead generation for marketing.

*(Note: These sections follow the same architectural pattern as Hero and BestSellers regarding styling, layout, and scroll animations).*

---

# Homepage Loading Strategy

*   **Critical Rendering Path**: The `Hero` section and the primary navigation are prioritized.
*   **Lazy Loading**: Images below the fold (e.g., in `OurStory`, `Reviews`, `ExploreByRoom`) should utilize native `loading="lazy"`.
*   **Deferred Components**: Non-critical sections could potentially be code-split, though currently bundled together in `HomeSections.tsx`.

---

# Homepage Future Improvements

*   **Performance**: Implement Next/Image or a similar optimized image component to automatically serve WebP/AVIF formats instead of large PNGs/JPEGs.
*   **SEO**: Ensure all images have descriptive `alt` tags (some currently do, but need auditing). Add semantic schema markup for products.
*   **UX**: Add a "Quick Add" to cart button directly on the `BestSellers` and `JustForYou` cards to reduce friction.
*   **Dynamic Data**: Replace hardcoded product arrays with API calls to a CMS or backend.
