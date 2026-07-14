# Homepage Render Flow

The homepage renders in the following top-to-bottom sequence of components:

1. `Hero` (Eagerly Loaded)
2. `TrustBar` (Eagerly Loaded)
3. `BestSellers` (Eagerly Loaded)
4. `VideoBanner` (Lazy Loaded - Exclusive Collection)
5. `ShopByCategory` (Lazy Loaded)
6. `ShopByOccasion` (Lazy Loaded)
7. `FeaturedCollections` (Lazy Loaded)
8. `Banner` (Lazy Loaded - Artisan Guild Collection)
9. `JustForYou` (Lazy Loaded - Curated Picks)
10. `SustainabilitySection` (Lazy Loaded - Conscious Crafting) -- **NEW**
11. `CustomCreations` (Lazy Loaded)
12. `OurStory` (Lazy Loaded - Brand Story)
13. `CraftingProcess` (Lazy Loaded)
14. `Reviews` (Lazy Loaded)
15. `CommunityGallery` (Lazy Loaded)
16. `Learning` (Lazy Loaded - Learning Studio)
17. `CorporateBulkOrders` (Lazy Loaded)
18. `Newsletter` (Lazy Loaded)

---

# Homepage Sections

## Hero

### Component

`Hero`

### File

`src/components/sections/Hero.tsx`

### Purpose

Creates a striking first impression for visitors, establishing the brand’s premium identity and driving immediate shopping action.

### Content

- **Overline Text**: "Indigo Embroidery Kits • Limited Batches • Mindful Craft"
- **Huge Background Title**: "TWO THREAD STUDIO" (split into "TWO THREAD" and "STUDIO" to animate separately).
- **Foreground Images**: `heroMobile` (`src/assets/hero section mobile.png`) and `heroPc` (`src/assets/hero section pc.png`) displaying raw finished artisan hoops overlaying a solid canvas.
- **CTA Button**: "Shop Collection"

### Layout

- **Desktop**: Full screen height (`100vh`) with a deep terracotta background. The huge text spans across the screen in the background. The foreground image (`heroPc`) is centered and absolute-positioned. Copy and button sit overlaying the bottom center of the image.
- **Mobile**: Collapses to render the mobile-optimized foreground image (`heroMobile`) with smaller text sizing and responsive padding.

### Styling

- **Colors**: Deep terracotta background (`#ab5a46`), cream/off-white text (`#f4ebd9`), and muted gold details (`#e3d5c8`).
- **Typography**: Display serif for the main title, clean tracking-wide sans-serif for secondary copy and buttons.

### Animations

- **Entrance Reveal**: The background text "TWO THREAD" slides from the left, while "STUDIO" slides from the right on initial render using custom CSS transitions.
- **Parallax Scroll Zoom**: The foreground image scales smoothly from `1` to `1.15` as the user scrolls, controlled by scroll listeners.
- **Fade Up**: Overline text and CTA button use the `ScrollReveal` component to slide/fade upward.

### User Interaction

- **CTA Button**: Hover state transitions the button background to solid white with an elevated box-shadow.

### Backend Integration Readiness

- **Static**: Fully static content. Not configured to fetch dynamic catalog details.

### Dependencies

- `heroMobile` & `heroPc` image assets.
- `ScrollReveal` UI component.

### Performance Notes

- This is the primary LCP (Largest Contentful Paint) asset. Background/foreground images should be preloaded/optimized.

---

## TrustBar

### Component

`TrustBar`

### File

`src/components/sections/TrustBar.tsx`

### Purpose

Establishes credibility, customer satisfaction, and outlines key service/shipping benefits at the start of the user session.

### Content

Displays six standard brand trust points with corresponding inline icons:
1. "Handmade in India" (Package icon)
2. "Free Shipping Above ₹2,999" (Truck icon)
3. "Sustainable Materials" (Leaf icon)
4. "Gift Ready" (Gift icon)
5. "Secure Checkout" (ShieldCheck icon)
6. "4.9★ Customer Rating" (Gold Star icon)

### Layout

- **Desktop**: Horizontal flexbox (`flex justify-between items-center`) centered inside a `max-w-7xl` container. Uses small bullet characters (`·`) to delimit items.
- **Mobile**: Dynamic auto-scrolling marquee containing duplicated items to construct an infinite loop.

### Styling

- **Colors**: Dark charcoal-brown background (`#2d2520`), muted cream text (`#d2c4bc`), and gold icons (`#c4973a`).
- **Borders**: Thin top (`#3d322c`) and bottom (`#1a1510`) borders to separate the bar from adjacent sections.

### Animations

- **Mobile Marquee**: Uses Framer Motion's `motion.div` to animate `x` translation from `0%` to `-50%` continuously (`ease: "linear"`, `duration: 22`, infinite repeat).

### User Interaction

- None (static informational bar).

### Backend Integration Readiness

- **Static**: Items are configured as a static local array.

### Dependencies

- `framer-motion` for the mobile marquee.
- Lucide React icons (`Package`, `Truck`, `Leaf`, `Gift`, `ShieldCheck`, `Star`).

### Performance Notes

- Extremely lightweight. No network assets or heavy rendering. Eagerly loaded.

---

## Shop By Category

### Component

`ShopByCategory`

### File

`src/components/sections/ShopByCategory.tsx`

### Purpose

Drives navigation and discovery by categorizing catalog offerings into beautiful visual pathways.

### Content

- **Overline Text**: "Find Your Craft"
- **Section Title**: "Shop by Category"
- **Description**: "From embroidery kits to macramé — every craft, thoughtfully curated."
- **Category Tiles**: Displays the category image, name, product count, and a hover "Shop now" arrow.
- **Bottom CTA**: "View All Categories" link.

### Layout

- **Desktop**: Fixed-height grid (`640px`) utilizing 12 columns, nested inside a floating card container that overlaps the preceding `VideoBanner` section by `80px` to `112px` (`-mt-20 md:-mt-28`).
  - The first/featured category (e.g., Embroidery Kits) occupies a large left-hand tile (`col-span-5` spanning both rows).
  - The remaining 6 categories are partitioned into a top row (3 columns) and a bottom row (4 columns, including the last category filling the remaining space).
- **Mobile**: Fallback 2-column grid inside a floating card container that overlaps the banner by `80px` (`-mt-20`). The first card expands to full width (`col-span-2`), while others occupy single columns.

### Styling

- **Colors**: The section background is `#ede6de`, featuring a top dark cocoa (`#1e1812`) gradient overlay (`h-[140px]`) to blend with the `VideoBanner`'s bottom gradient. The category content sits inside a card panel with a warm off-white background (`#FBFBFA`), generous border radius (`rounded-[24px] md:rounded-[36px]`), and a soft double shadow (`shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.15),_0_20px_40px_-15px_rgba(0,0,0,0.1)]`).
- **Typography**: Muted cream sans-serif for product count (`#d2c4bc`), light serif for category names, and red-brown for overlines (`#A34A38`).

### Animations

- **Hover Effect**: Cards scale up the image (`scale-[1.07]`) and transition the "Shop now" indicator from `opacity-0` to `opacity-100` on hover.
- **Scroll Entrance**: Staggered slide-up via Framer Motion on mobile and `ScrollReveal` delays on desktop.

### User Interaction

- **Navigation**: Category tiles are wrapped in React Router `Link` components pointing to `/shop?category=[slug]`.

### Backend Integration Readiness

- **CMS-Ready**: Binds directly to `mockCategories` imported from `src/data/products.ts`. Fully prepared to render dynamic category titles, counts, and images from an API.

### Dependencies

- `mockCategories` data.
- `ScrollReveal` component.
- Lucide React icons.

### Performance Notes

- Below-fold section. Lazy-loaded in `Home.tsx`. Grid images utilize native `loading="lazy"`.

---

## Best Sellers

### Component

`BestSellers`

### File

`src/components/sections/BestSellers.tsx`

### Purpose

Increases sales conversion by highlighting the highest-rated and trending artisan products.

### Content

- **Overline Text**: "Most Loved"
- **Title**: "Best Sellers"
- **Description**: "The pieces our community keeps coming back for"
- **Filter Pills**: Filter list: "All Bestsellers", "Embroidery", "Crochet", "Macramé", "Lippan Art", "Candles", "Gift Sets".
- **Product Grid**: Rendered list of `ProductCard` components.
- **Bottom Link**: "View All Bestsellers" link with an arrow.

### Layout

- **Desktop**: 4-column product grid (`grid-cols-4`).
- **Tablet**: 2-column product grid (`sm:grid-cols-2`).
- **Mobile**: 2-column product grid (`grid-cols-2`).

### Styling

- **Colors**: Light off-white background (`#FBFBFA`).
- **Filter Pills**: Active button has a solid dark background (`#1C1C1B`) with off-white text. Inactive buttons have neutral borders and text.
- **Product Grid**: Spaced with a responsive gap (`gap-3` on mobile, `gap-4` or `gap-5` on larger viewports).

### Animations

- **Grid Entrance**: Staggered fade/reveal upward animation using `ScrollReveal` with index-based delays.

### User Interaction

- **Category Filtering**: Clicking filter pills immediately updates the product list via React local state without page reload.
- **Product Navigation**: Product cards link to their individual detail pages.

### Backend Integration Readiness

- **Product-Driven**: Filters and renders a slice of the `mockProducts` array in real-time, referencing `badge` and `productCategory` fields. Ready for backend API integration.

### Dependencies

- `ProductCard` shared component.
- `mockProducts` data array.
- `ScrollReveal` component.

### Performance Notes

- Lazy-loaded in `Home.tsx`. The grid is capped at 8 products maximum to control vertical page size and DOM weight.

---

## Shop By Occasion

### Component

`ShopByOccasion`

### File

`src/components/sections/ShopByOccasion.tsx`

### Purpose

Capitalizes on high-AOV gifting vectors by guiding customers to targeted collections based on events.

### Content

- **Overline Text**: "Find the Perfect Gift"
- **Title**: "Shop by Occasion"
- **Navigation Controls**: Left and right chevron button indicators.
- **Carousel Track**: Horizontal cards containing:
  - Visual theme image.
  - Floating emoji icon (e.g. 🏡, 💍, 🎂, ✨).
  - Occasion Name.
  - Occasion Description.
  - "Shop Gifts" CTA link.

### Layout

- **Carousel Track**: Flex container with horizontal overflow (`overflow-x-auto`) and mandatory snap scroll behavior (`snap-x snap-mandatory`). Uses Tailwind scrollbar utilities to hide browser scrollbars.
- **Cards**: Fixed-width sizing (`w-[260px]` on mobile, `w-[300px]` on desktop/tablet).

### Styling

- **Colors**: Creamy-taupe section background (`#ede6de`). Cards are built on a solid white background with thin border boundaries.
- **Occasion Icon**: Floating top-left, rendered inside a round, slightly translucent badge.

### Animations

- **Smooth Scroll**: Carousel buttons scroll the track horizontally using smooth scroll behavior (`scrollRef.current.scrollBy`).
- **Reveal**: Staggered scroll animation for card cards using Framer Motion's `whileInView` directive.
- **Hover**: Card image scales up smoothly, and heading text transitions color to red-brown (`#A34A38`).

### User Interaction

- **Navigation**: Clickable chevron buttons trigger scrolling left/right by `300px`. The carousel supports swipe and touch gesture navigation.
- **CTAs**: Links navigate directly to `/shop?occasion=[slug]`.

### Backend Integration Readiness

- **CMS-Ready**: Binds directly to `mockOccasions` imported from `src/data/products.ts`. Fully prepared to consume dynamic schemas.

### Dependencies

- `mockOccasions` data.
- `framer-motion` library.
- Lucide React icons.

---

## Featured Collections

### Component

`FeaturedCollections`

### File

`src/components/sections/FeaturedCollections.tsx`

### Purpose

Organizes the storefront around carefully curated editorial collections using an asymmetrical catalog layout.

### Content

- **Overline Text**: "Signature Collections"
- **Title**: "Featured Collections"
- **Description**: "Discover our signature collections, each thoughtfully curated around a unique story, crafted for modern makers and collectors."
- **Collection Cards**: Six data-driven collections (Botanical Collection, Heritage Collection, Modern Minimal, Personalized Portraits, Wedding Keepsakes, Seasonal Editions) featuring:
  - Large editorial image.
  - Optional badge (e.g. `NEW`, `LIMITED`, `BESTSELLER`, `EDITOR'S PICK`).
  - Collection title.
  - Dynamic product count computed from catalog.
  - Description copy.
  - Highlights summary ("Featuring: ...").
  - "View Collection" CTA with grow-underline transition.

### Layout

- **Desktop (`lg`)**: 3-column asymmetric grid. Spans are mixed: Card 1 (col-span-2), Card 2 (col-span-1), Card 3 (col-span-1), Card 4 (col-span-2), Card 5 (col-span-2), Card 6 (col-span-1). Aspect ratios are also mixed (wide aspect vs. tall aspect).
- **Tablet (`md`)**: 2-column asymmetric grid.
- **Mobile**: Vertical stacking. Single-column list.

### Styling

- **Colors**: Warm background (`#ede6de`). Card backgrounds are semi-translucent white (`bg-white/50`), transitioning to solid/elevated cream on hover.
- **Shape**: Sharp corners (`rounded-none`).
- **Borders**: Thin borders (`border border-[#c0b4a4]/40`).
- **Typography**: Display serif for headings, tracked sans-serif for numbers/CTAs.

### Animations

- **Staggered Entrance**: ScrollReveal slides up cards with layout delays.
- **Hover Zoom**: Images scale to `1.03` inside the container.
- **CTA Underline**: Thin underline grows from 0 to 100% width on hover.
- **Card Offset**: Subtle translation (`hover:-translate-y-1`) on hover.

### User Interaction

- **Navigation**: Clicking cards routes to `/shop?collection=[slug]`.

### Backend Integration Readiness

- **Dynamic Catalog**: Collection metadata is imported from `src/data/featuredCollections.ts`, and counts are computed dynamically from `src/data/products.ts`'s live data.

### Dependencies

- `featuredCollections` metadata array.
- `mockProducts` data array.
- `ScrollReveal` component.

---


## VideoBanner

### Component

`VideoBanner`

### File

`src/components/sections/ExclusiveCollection.tsx`

### Purpose

Delivers immersive visual branding, providing high-end editorial and cinematic movement between content sections.

### Content

- **Background Video**: Plays a loop of `An_artisanal_campaign_of_this.mp4` displaying hands threading needles, organic natural materials, and campaign styling.

### Layout

- **Sizing**: Full-width container. Responsive height ranges from `h-[55vh]` (mobile), `h-[65vh]` (tablet), to `h-[75vh]` (desktop).

### Styling

- **Video styling**: absolute layout, scaled to fill via `object-cover`.
- **Background**: primary container color fallback while loading.

### Animations

- **Auto Loop**: Silent video loops continuously (`autoPlay`, `loop`, `muted`, `playsInline`).

### User Interaction

- None (cinematic atmosphere section).

### Backend Integration Readiness

- **Static**: Embeds a single static campaign video asset.

### Dependencies

- Campaign video file (`src/assets/An_artisanal_campaign_of_this.mp4`).

### Performance Notes

- Lazy-loaded to avoid blocking initial critical assets. The video is muted and plays inline to ensure mobile device compatibility.

---

## Banner (Artisan Guild Collection)

### Component

`Banner`

### File

`src/components/sections/ArtisanGuildCollection.tsx`

### Purpose

An editorial campaign section highlighting the brand's heritage, curated materials, and core collection story.

### Content

- **Overline Text**: "An Exclusive Collection"
- **Title**: "Artisan Guild Collection"
- **Copy**: "Premium embroidery patterns and handcrafted pieces, curated for the modern artisan..."
- **CTA Button**: "Explore Collection"

### Layout

- **Desktop**: Height `540px` with a full-cover background image. Content card is left-aligned and floats over the left third of the screen.
- **Mobile**: Height collapses to `480px`. Floating card shifts to center/bottom position.

### Styling

- **Floating Content Card**: Off-white solid base (`#FAF9F7/95`), backdrop blur (`backdrop-blur-md`), drop shadow, and clean card borders.
- **Background Image**: Grayscale spool image layered with a multiplying overlay (`bg-[#1C1C1B]/10 mix-blend-multiply`).
- **Button**: Solid dark button, tracking-wide uppercase text.

### Animations

- **Card Slide**: Enters from the right on scroll using `ScrollReveal`.
- **Button hover**: Smooth transition of background to gold/red-brown (`#A34A38`).

### User Interaction

- **CTA Button**: Links to catalog collection.

### Backend Integration Readiness

- **Static**: Visual copy is fully static.

### Dependencies

- Spool background image.
- `ScrollReveal` component.

---

## Just For You

### Component

`CuratedPicks`

### File

`src/components/sections/CuratedPicks.tsx`

### Purpose

Encourages catalog discovery using an asymmetric layout that highlights individual product items in a premium, editorial grid.

### Content

- **Overline Text**: "Just For You"
- **Title**: "Curated Picks"
- **Product Tiles**: Up to five tiles showing product image, price, and title.

### Layout

- **Desktop**: 12-column grid layout with custom heights:
  - First tile: `col-span-8`, height `340px` (large hero tile).
  - Second tile: `col-span-4`, height `340px`.
  - Third, Fourth, Fifth tiles: `col-span-4`, height `260px` each.
- **Mobile/Tablet**: Grid collapses to typical 2-column or single column tracks with responsive tile heights.

### Styling

- **Tile styling**: Soft cream background fallback (`#f4ebd9`).
- **Product Tag Labels**: Rounded card container floating bottom-left inside each tile, built with off-white translucent glass (`#FAF9F7/95` and `backdrop-blur-sm`).

### Animations

- **Entrance**: Staggered scroll animation via `StaggerContainer`.
- **Tile Hover**: Tiles scale up slightly (`scale-[1.02]`), background images zoom (`scale-105`), and tag labels translate upward with enhanced box-shadows.

### User Interaction

- **Navigation**: Tiles link directly to product pages.

### Backend Integration Readiness

- **Product-Driven**: Renders a slice of the `mockProducts` array. Ready for API endpoint bindings.

### Dependencies

- `mockProducts` data array.
- `ScrollReveal` and `StaggerContainer` components.

---

## Sustainability Section

### Component

`SustainabilitySection`

### File

`src/components/sections/SustainabilitySection.tsx`

### Purpose

Educates visitors on the brand's commitment to earth-first materials, building trust and justifying premium pricing through transparent eco-conscious practices.

### Content

- **Overline Text**: "Conscious Crafting"
- **Title**: "Earth-first materials, stitched with intent."
- **Description**: "We believe crafting should leave a mark on your soul, not on the planet..."
- **Highlight Cards**: Three primary cards:
  1. "Unbleached Belgian Linen" - Woven in a carbon-neutral mill, avoiding watershed chemical leaks.
  2. "FSC-Certified Beechwood" - Hand-sanded hoops, free of synthetic varnishes, fully biodegradable.
  3. "100% Plastic-Free" - Kraft boxes, recycled thread cards, and vegetable inks.
- **CTA Button**: "Our Impact Standards" (pointing to `/sustainability`).

### Layout

- **Desktop**: 2-column layout. Left column has a constrained text block and button, right column stacks the three highlight cards vertically.
- **Mobile**: Single column layout. Highlight cards stack sequentially.

### Styling

- **Colors**: Very soft warm grey-beige background (`#F8F7F5`), white highlight cards with soft borders (`border-neutral-200/60`), and forest green icon accents (`#606f5c`).
- **Typography**: Display serif for titles, clean sans-serif for description copy.

### Animations

- **Scroll Entrance**: Staggered scroll reveals for highlight cards, slide-in reveal for the description.
- **Hover Effects**: Highlight cards translate upward slightly (`-translate-y-[3px]`) and deepen drop shadow on hover.

### User Interaction

- **CTA Button**: Navigates to `/sustainability`.

### Backend Integration Readiness

- **Static**: Highlights and copy are static, easily migrated to a CMS settings block.

### Dependencies

- `ScrollReveal` component.
- Lucide React icons (`Leaf`, `Award`, `Recycle`, `ArrowRight`).

---

## Custom Creations

### Component

`CustomCreations`

### File

`src/components/sections/CustomCreations.tsx`

### Purpose

Bespoke conversion funnel. Promotes personalized products (e.g. portraits, name hoops) to drive higher margins and AOV.

### Content

- **Overline Text**: "Custom Creations"
- **Title**: "Made *Just* for You"
- **Description**: "Turn your most treasured memories into handcrafted art..."
- **Custom tags**: "Portrait Embroidery 🎨", "Pet Portraits 🐾", "Wedding Gifts 💍", "Family Embroidery 🌸", "Name Hoops ✍️".
- **CTA Buttons**: "Start Your Custom Order" and "See Examples" buttons.
- **Decorative Vertical Accent**: "Bespoke · Handcrafted · Yours" string.

### Layout

- **Desktop**: Content is left-aligned within a `max-w-xl` width constraint. Vertical decorative accent text sits absolute-positioned on the far-right edge.
- **Mobile**: Vertical column layout. Side accent text is hidden.

### Styling

- **Colors**: Full cover background image with gradient overlay (`from-[#1C1C1B]/90 via-[#1C1C1B]/65 to-[#1C1C1B]/20`).
- **Custom tags**: Translucent base (`bg-white/10`), backdrop blur, border `border-white/20`.
- **Buttons**: Primary has a solid cream background (`#f4ebd9`), secondary has a white outline.

### Animations

- **Scroll Reveal**: Left-aligned copy reveals from the right with staggered delays.
- **Vertical Accent**: Fades in smoothly on scroll with Framer Motion.

### User Interaction

- **CTAs**: Both buttons navigate to `/shop?type=custom`.

### Backend Integration Readiness

- **Static**: Copy, custom tags, and buttons are static.

### Dependencies

- Hoop image asset (`hoopImg`).
- `ScrollReveal` component.
- Lucide React icons.

---

## Our Story

### Component

`OurStory`

### File

`src/components/sections/OurStory.tsx`

### Purpose

Builds brand intimacy and trust by presenting the brand story and social empowerment model.

### Content

- **Overline Text**: "Our Story"
- **Title**: "TwoThreads celebrates the art of making."
- **Description**: "We partner with women artisans across India to bring heritage craft into modern homes..."
- **Statistics Block**: Displays three brand stats:
  - "500+ Happy Makers"
  - "100% Handmade"
  - "4.9★ Avg. Rating"
- **CTA Link**: "Read Our Full Story →"
- **Artisan Image**: Large lifestyle photography of an artisan working.

### Layout

- **Desktop**: 2-column grid. Left side renders the image with a double border offset. Right side holds the story, stats, and link.
- **Mobile**: Collapses to single column with the image on top.

### Styling

- **Colors**: Dark primary container background (`bg-primary-container`), with off-white text (`text-inverse-on-surface`).
- **Stats block**: Bounded by low-opacity white horizontal lines (`border-white/10`).

### Animations

- **Scroll Reveal**: Staggered entrance. The image enters from the left, while the text elements slide/fade from the right.

### User Interaction

- **Story Link**: Navigates to `/our-story`.

### Backend Integration Readiness

- **Static**: Copy and stats are static.

### Dependencies

- Unsplash image.
- `ScrollReveal` component.

---

## Crafting Process

### Component

`CraftingProcess`

### File

`src/components/sections/CraftingProcess.tsx`

### Purpose

Reinforces craftsmanship quality, validating premium price points by illustrating the step-by-step handmade journey.

### Content

- **Overline Text**: "Our Process"
- **Title**: "Crafted with Intention"
- **Description**: "From the first sketch to your doorstep — every step is handled with care."
- **Steps timeline**: 5 stages:
  1. "Design" (Pencil icon)
  2. "Handcrafted" (Scissors icon)
  3. "Quality Check" (CheckCircle2 icon)
  4. "Packaging" (Package icon)
  5. "Delivered" (MapPin icon)

### Layout

- **Desktop**: Horizontal timeline grid. Five columns separated by a thin horizontal progress line behind the icon badges.
- **Mobile**: Vertical timeline grid. Step elements stack vertically, joined by a vertical line running down the left-hand column.

### Styling

- **Colors**: Soft peach background (`#fef8f3`). Icon badges are white with brown outlines and icons.
- **Timeline numbers**: Gold-tinted numbers (`#A34A38`) positioned on the top-right of each icon container.

### Animations

- **Staggered reveal**: Grid items reveal upward sequentially on scroll.
- **Icon Hover**: Badges scale up (`scale-105`) and transition border colors to `#A34A38`.

### User Interaction

- Hover states on individual process steps.

### Backend Integration Readiness

- **Static**: Steps and descriptions are hardcoded.

### Dependencies

- Lucide React icons (`Pencil`, `Scissors`, `CheckCircle2`, `Package`, `MapPin`).
- `ScrollReveal` component.

---

## Reviews

### Component

`Reviews`

### File

`src/components/sections/Reviews.tsx`

### Purpose

Boosts conversion using verified customer social proof and product-specific testimonials.

### Content

- **Overline Text**: "Community Love"
- **Title**: "What Our Makers Say"
- **Review Cards**: Displays customer rating (stars), review text, customer-uploaded photo (optional), and author details (name, initials avatar, purchased product, and green "Verified" badge).

### Layout

- **Grid**: 3-column grid layout (`grid-cols-1 md:grid-cols-3`) with consistent gap spacing. Flexbox layout within cards to align review content.

### Styling

- **Colors**: Section background uses `bg-inverse-on-surface`. Review cards are white with thin borders. Initials avatar features a warm cream background (`#f4ebd9`) and red-brown text (`#A34A38`).
- **Verified badge**: Small green label (`#2d5a27`) with check icon.

### Animations

- **Reveal**: Staggered card fade-up on scroll.
- **Hover**: Cards gain depth via a box-shadow transition.

### User Interaction

- Hover states.

### Backend Integration Readiness

- **Static/CMS-Ready**: Testimonials are loaded from a mock reviews list in the file. Ready to bind to a reviews API database.

### Dependencies

- Lucide React icons (`Star`, `BadgeCheck`).
- `ScrollReveal` and `StaggerContainer` components.

---

## Community Gallery

### Component

`CommunityGallery`

### File

`src/components/sections/CommunityGallery.tsx`

### Purpose

Validates brand style, displays User-Generated Content (UGC), and links the site to social media platforms.

### Content

- **Overline Text**: "Our Community"
- **Title**: "Styled by You"
- **Description**: "Tag your creations with #TwoThreadsStudio to be featured here."
- **Instagram Link**: "@TwoThreadsStudio" handle with inline icon.
- **UGC Grid**: Six image tiles featuring customer handles, product names, and "Shop this look" buttons.
- **Bottom link**: "View Instagram Feed" link.

### Layout

- **Desktop**: Masonry-style grid of 3 columns. Two specific items are marked `tall` and span two rows (`row-span-2`), creating an editorial layout.
- **Mobile**: Grid defaults to a 2-column layout with fixed-height tiles (tall flag is ignored).

### Styling

- **Colors**: Section background is `#FBFBFA`.
- **Hover Overlay**: Dark overlay (`#1C1C1B/65`), with text details in gold (`#d2c4bc`) and white, and button with thin border.

### Animations

- **Scroll Reveal**: Grid tiles fade/slide up with index-based delays.
- **Hover Effects**: Images scale up slightly (`scale-[1.06]`), overlay opacity fades in to `100%`, and the Instagram icon appears in the top-right corner.

### User Interaction

- **Hover States**: Exposes product labels, creator handles, and shop links.
- **Links**: Navigation links open external social channels.

### Backend Integration Readiness

- **Static**: Loaded from a static mock array in the file.

### Dependencies

- Custom inline Instagram SVG icon.
- `framer-motion` library.

---

## Learning

### Component

`Learning`

### File

`src/components/sections/Learning.tsx`

### Purpose

Engages the craft maker community, promoting high-margin DIY embroidery kits through video tutorials.

### Content

- **Overline Text**: "Learning Studio"
- **Title**: "Embroidery Design Tutorials"
- **Description**: "Learn at your own pace with our curated video tutorials — from first stitches to advanced techniques."
- **Tutorial Cards**: Display thumbnail background, overlay play button, video duration, difficulty level tag (e.g. "Beginner"), Title, and Instructor.

### Layout

- **Grid**: 3-column layout on desktop, collapsing to 1 column on mobile.

### Styling

- **Colors**: Section background `#ede6de`. Cards are white. Play button is white with low opacity and shadow. Difficulty pill uses light green (`#e8f4e8`) with dark green text (`#3a6b3a`).

### Animations

- **Hover state**: Cards translate upward slightly (`-translate-y-1.5`) and increase shadow depth.

### User Interaction

- Hover states.

### Backend Integration Readiness

- **Static**: Tutorials are loaded from a mock array inside the file.

### Dependencies

- `ScrollReveal` and `StaggerContainer` components.

---

## Corporate Bulk Orders

### Component

`CorporateBulkOrders`

### File

`src/components/sections/CorporateOrders.tsx`

### Purpose

B2B funnel acquisition. Drives wholesale and high-margin bulk volumes for corporate gifting, hospitality, events, and interior designers.

### Content

- **Overline Text**: "Crafted at Scale"
- **Title**: "For Every Vision, Every Occasion"
- **Grid Tiles**: Six targeted sectors:
  1. "Hotels & Resorts" (Building2 icon)
  2. "Interior Designers" (Palette icon)
  3. "Wedding Planners" (Heart icon)
  4. "Corporate Gifting" (Briefcase icon)
  5. "Cafés & Boutiques" (Coffee icon)
  6. "Retail & Boutiques" (ShoppingBag icon)
- **Top CTA Button**: "Get a Custom Quote"
- **Bottom strip**: "Minimum order from 10 pieces · Custom packaging available · Pan-India delivery"
- **Bottom link**: "Learn More"

### Layout

- **Desktop**: Grid with 3 columns. Title and CTA button align in a flex row at the top.
- **Tablet**: Grid collapses to 2 columns.
- **Mobile**: Grid collapses to 1 column.

### Styling

- **Colors**: Dark charcoal-brown background (`#2d2520`). Grid tiles have thin borders (`border-white/10`), gold icons (`#c4973a`), and white text.
- **Top CTA Button**: Cream background (`#f4ebd9`), dark text, transitioning to white on hover.

### Animations

- **Staggered Reveal**: ScrollReveal slides items up in sequence.
- **Hover States**: Tile background darkens slightly (`bg-white/5`), border transitions to gold (`#c4973a/50`), and icons scale up (`scale-110`).

### User Interaction

- **CTAs**: Navigate to contact routes (`/contact`).
- Hover states on grid tiles.

### Backend Integration Readiness

- **Static**: Visual sectors list is static.

### Dependencies

- Lucide React icons (`Building2`, `Palette`, `Heart`, `Briefcase`, `Coffee`, `ShoppingBag`, `ArrowRight`).
- `ScrollReveal` and `StaggerContainer` components.

---

## Newsletter

### Component

`Newsletter`

### File

`src/components/sections/Newsletter.tsx`

### Purpose

Lead capture. Builds a marketing list by incentivizing users with invites, early access, and discounts.

### Content

- **Benefits Pills**: "Early Access" (Zap icon), "Workshop Invites" (BookOpen icon), "Exclusive Collections" (Layers icon).
- **Overline Text**: "Stay Connected"
- **Title**: "Join 5,000+ Makers & Collectors"
- **Description**: "Get early access to new collections, invitations to live workshops, and exclusive member discounts — delivered with care."
- **Form**: Email input field and "Subscribe" button.
- **Post-Submission message**: "Welcome to the community ✦ / You'll receive your first letter soon."

### Layout

- **Layout**: Centered flexbox. Form has a constrained max-width (`max-w-md`).

### Styling

- **Colors**: Dark primary container background (`bg-primary-container`). Input field has a semi-transparent background with thin border. Subscribe button uses a contrasting gold/white background.
- **Benefit Pills**: Low opacity white background (`bg-white/10`), thin border, white text, and gold icons.

### Animations

- **Scroll Reveal**: Component fades/slides up on scroll.

### User Interaction

- **Form Submission**: Triggers a local state swap. Renders a welcome message upon valid form submission.

### Backend Integration Readiness

- **Static**: Submissions are handled via local component state. Requires integration with an API marketing service (e.g. Mailchimp, SendGrid).

### Dependencies

- Lucide React icons (`Zap`, `BookOpen`, `Layers`).
- `ScrollReveal` component.

---

# Homepage Architecture Summary

## Component Hierarchy

```
Home (Page)
└── PageContainer (Layout Wrapper)
    ├── Hero
    ├── TrustBar
    ├── BestSellers
    ├── VideoBanner (ExclusiveCollection)
    ├── ShopByCategory
    ├── ShopByOccasion
    ├── ExploreByRoom
    ├── Banner (ArtisanGuildCollection)
    ├── JustForYou (CuratedPicks)
    ├── SustainabilitySection
    ├── CustomCreations
    ├── OurStory
    ├── CraftingProcess
    ├── Reviews
    ├── CommunityGallery
    ├── Learning
    ├── CorporateBulkOrders (CorporateOrders)
    └── Newsletter
```

## Current Homepage Philosophy

- **Brand Positioning**: Presents Two Threads Studio as an accessible premium artisan label, emphasizing hand-loomed texture, slow intentional crafting, and Indian heritage.
- **Editorial Approach**: Inspired by luxury catalogs (Aesop, Anthropologie, Loewe). Uses expansive vertical spacing, light serif headings, wide letter-spaced overlines, translucent glass containers, and alternating/asymmetric grid lines.
- **Commerce Strategy**: Prioritizes product discovery by showcasing category groupings, gifting occasion lines, and target rooms first, backed by instant trust indicators and customer reviews.
- **Conversion Flow**: Seamlessly leads visitors from visual landing copy into targeted conversion funnels:
  - Catalog-wide: Hero CTA, category grids, room categories.
  - High-Margin Gifting: Occasion carousel.
  - High-Margin Customization: Custom creations card.
  - High-Margin Bulk Volume: Corporate gifting grid.

## Future Backend Readiness

- **Product-Driven Sections**: `BestSellers` and `JustForYou` are configured to query and slice the global TypeScript product schema (`products.ts`), meaning they are ready for backend API integrations.
- **Category-Driven Sections**: `ShopByCategory` and `ShopByOccasion` pull from structured mock lists, making them ready to connect to CMS collections.
- **Content/Static Sections**: Remaining sections (`Hero`, `ExploreByRoom`, `VideoBanner`, `CustomCreations`, etc.) utilize hardcoded assets or strings, ready to receive dynamic configuration props if backed by a headless CMS database in the future.
