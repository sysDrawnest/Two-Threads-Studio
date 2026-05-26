# TwoThreads Studio — Project Analysis & Overview

TwoThreads Studio is a premium, artisan-focused web application dedicated to handcrafted embroidery kits, patterns, and sustainable textile home decor. Designed with a warm, natural, and minimalist luxury aesthetic, the application combines a modern boutique e-commerce showcase with an interactive video learning studio for embroidery makers.

---

## 🎨 Visual Identity & Design System

### Color Palette
The color scheme is meticulously selected to reflect raw textiles, linen, wood, and organic elements. It uses warm, earthy neutrals combined with deep cocoa tones and gold-brown accents to evoke high-end, intentional craftsmanship.

| Color Name | Hex / Value | CSS Usage | Design Role |
| :--- | :--- | :--- | :--- |
| **Warm Off-White** | `#f5f0eb` | `background-color` / body | Base canvas of the application, representing raw linen. |
| **Warm Sand / Cream** | `#ede6de` | Section backgrounds | Secondary background for section alternating and cards. |
| **Deep Charcoal** | `#2d2520` | Primary text, headers | Warmer than pure black; gives a softer, luxurious contrast. |
| **Artisan Gold-Brown** | `#8b6f5c` | Accents, labels, badges | Used for micro-copy, borders, ratings, and subheaders. |
| **Dark Cocoa** | `#1e1812` | Footer background | Deep, rich background for the bottom closure of the page. |
| **Earthy Clay** | `#5a3d2b` | Hover state, button background | Darker contrast for hovered buttons and selected states. |
| **Pastel Green** | `#e8f4e8` | Beginner badge bg | Signifies easy/entry-level difficulty tutorials. |
| **Warm Gold** | `#fef3e8` | Intermediate badge bg | Signifies mid-level difficulty tutorials. |
| **Soft Red** | `#fde8e8` | Advanced badge bg | Signifies hard/complex difficulty tutorials. |

### Typography
The project adopts a classic and high-contrast typographic hierarchy to emphasize a sense of heritage and precision:
* **Headers & Brand Logo**: `'Cormorant Garamond'`, Georgia, serif (Weights: 300, 400, 500, 600). The serif face brings elegance, editorial quality, and organic curves.
* **Body Text, Buttons & Badges**: Georgia, serif and `'Lato'`, sans-serif. Used for long descriptions and structured UI elements to ensure clean readability.

### Layout & Spacing
* **Responsive Architecture**: Uses CSS clamp scaling (`clamp(1.5rem, 8vw, 6rem)`) for responsive padding and fluid font sizes.
* **Fluid Layouts**: The grid systems rely heavily on CSS Grid and Flexbox, wrapping components naturally on smaller devices.
* **Interactive Micro-Animations**:
  * **Card Elevate**: Smooth translation (`translateY(-4px)`) and deep shadow transition on hover.
  * **Interactive Nav**: Scrolled navigation dynamically transitions to a semi-transparent blurred backdrop (`backdrop-filter: blur(8px)`).
  * **Intro Animation**: Opacity and scale transition phases to reveal the content with elegance.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 (v19.2.4)
* **Language**: TypeScript (v4.9.5)
* **Styling Paradigm**: CSS-in-JS (Inline React Styles) coupled with inline CSS modules/styles for animations, hover styles, and global overrides.
* **Font Delivery**: Google Fonts API integrations (loaded directly in `public/index.html` and `src/App.tsx`).
* **Icons**: Inline SVGs for lightweight, crisp rendering without third-party icon dependencies.
* **Build System**: Create React App / `react-scripts` configuration.

---

## 🚀 Features Implemented So Far

The project is currently structured as a monolithic single-page experience in `src/App.tsx`. The following components and features have been fully developed:

### 1. Brand Intro Animation (`IntroAnimation`)
* A elegant full-screen overlay that greets the user on their first visit.
* Displays a minimal vector sewing needle icon, the brand title, and the tagline *"Handcrafted with love"*.
* Operates in three states: `enter` → `hold` → `exit` with CSS transitions.
* Uses React's `sessionStorage` (`tt_visited`) to ensure it only renders once per browser session.

### 2. Smart Navigation Bar (`Navbar`)
* Features responsive design: swaps desktop inline links for an animated mobile hamburger dropdown.
* Tracks viewport scroll state: transitions from transparent to a blur-tinted overlay once the user scrolls past `40px` to maintain header legibility.

### 3. Hero Section (`Hero`)
* Full-height split design displaying large luxury photography, brand tags, and action buttons.
* Right side features a desktop-only staggered floating card stack that hovers on mouse interaction.
* Gracefully handles broken images using custom React error handling (`onError` states).

### 4. Best Sellers Showcase (`BestSellers`)
* Displays the most popular kits in a responsive 4-column card grid.
* Interactive product cards feature floating labels (e.g., `"Best Seller"`, `"New"`) and hover elevation.

### 5. Explore by Room Grid (`ExploreByRoom`)
* An alternating, storytelling grid highlighting decor options by room context (Living Spaces, Bathrooms, Bedrooms).
* Sub-grids display color-coordinated abstract blocks representing premium fabrics.

### 6. Artisan Guild Banner (`Banner`)
* A full-width call-to-action showcasing promotional artisan events with dark warm gradients.

### 7. "Just for You" Masonry (`JustForYou`)
* Uses CSS Grid column-spanning to create a masonry-style collage of products.
* Staggered card sizing offers a modern, editorial aesthetic.

### 8. Sustainable Brand Story (`OurStory`)
* Explains the brand values, local partnerships, and commitment to biodegradable materials.
* Composed of a decorative offset outline framing a production visual.

### 9. Star Reviews & Testimonials (`Reviews`)
* Customer cards with gold star rating sequences, italicized feedback, and author credits.

### 10. Learning Studio (`Learning`)
* Curated video tutorial cards ranging from *French Knots for Beginners* to *Advanced 3D Textures*.
* Includes custom play icons, duration tags, difficulty badges (Beginner, Intermediate, Advanced), and instructor names.

### 11. Newsletter & Footer (`Newsletter`, `Footer`)
* Dark warm newsletter sign-up with styled borderless inputs.
* Extensive 4-column footer map outlining Shop, Learn, Studio, and Support categories alongside social link listings.

---

## 📂 Project Structure

```bash
Two-Threads-Studio/
├── public/
│   ├── favicon.ico
│   ├── index.html          # HTML Template & Google Font imports
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.css             # Base CSS styles
│   ├── App.test.tsx        # Basic rendering test
│   ├── App.tsx             # Entry point housing all layouts & pages
│   ├── index.css           # Global resets and palette variables
│   ├── index.tsx           # React bootstrap entry point
│   └── logo.svg
├── package.json            # Scripts & Dependency management
└── tsconfig.json           # TypeScript configuration
```

---

## 📈 What's Next / Potential Improvements

1. **Routing System**: Transition from a single-page hash navigation layout to dynamic routing using `react-router-dom` to support separate checkout and detailed product page routes.
2. **Component Separation**: Refactor the monolithic `src/App.tsx` file by separating the inline functional subcomponents (`Hero`, `Navbar`, `Learning`, etc.) into their own files under a `src/components/` directory.
3. **Cart & Checkout Logic**: Add state management (e.g., React Context API or Redux) to handle item additions, side-cart toggle, and pricing checkout flows.
4. **Media Asset Integration**: Swap out colored abstract placeholders with actual product image files or generated assets to make the UI look fully populated.
