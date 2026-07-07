# Project Overview

*   **Purpose**: TwoThreads Studio is a high-end digital storefront and portfolio for an artisanal embroidery brand. It aims to sell handcrafted physical goods (kits, hoops, patterns) while showcasing the brand's heritage and craftsmanship.
*   **Target Audience**: Craft enthusiasts, interior design aficionados, and buyers of premium, slow-made home goods.
*   **Technology Stack**: React, TypeScript, Tailwind CSS, React Router.
*   **Architecture**: Single Page Application (SPA) with a mobile-first responsive design strategy. Styling is handled via utility classes mapped to a highly customized Tailwind configuration (design system tokens).

---

# Current Completion Status

| Module | Status | Progress |
| :--- | :--- | :--- |
| **Homepage** | Completed | 100% |
| **Authentication (Login/Signup)** | Completed | 100% |
| **Gallery** | Completed | 100% |
| **About Us** | Completed | 100% |
| **Admin Dashboard** | In Progress | 60% |
| **Mobile Responsiveness** | Completed | 100% |
| **Product Management** | Planned | 0% |
| **Cart & Checkout** | Completed | 100% |
| **User Accounts (Profile)** | Planned | 0% |
| **Backend / Database Integration**| Planned | 0% |

---

# Completed Features

## Homepage
*   Hero section with staggered reveal animations.
*   Best Sellers grid with hover effects.
*   Explore By Room masonry-style layout.
*   Promotional Banners, Our Story, and Newsletter capture.

## Authentication
*   **Desktop & Mobile Views**: Pixel-perfect implementation of distinct layouts for desktop and mobile devices.
*   **Sign Up**: Form validation, password visibility toggle, animated entrance, and demo credentials accordion.
*   **Login**: Remember me functionality, specific routing based on user role (Admin vs Customer).

## Pages
*   **Gallery**: Masonry layout image gallery showing craftsmanship.
*   **About Us**: Editorial layout describing the brand's story.
*   **Checkout**: Step-by-step state-managed checkout flow integrated with global cart.

## State Management (Zustand)
*   **Cart Store**: Global cart state with `localStorage` persistence and advanced customization features (gifting, engraving) natively embedded in `CartItem`.
*   **Checkout Store**: Decoupled store to manage the user's progression through checkout steps independently, preventing unnecessary navigation re-renders.

---

# Features In Progress

## Admin Dashboard
*   Basic analytics and layout structure exist (`AdminAnalytics`, `AdminCustomers`).
*   *Needs*: Real data integration, backend connection, and completion of the billing/invoicing sub-system.

---

# Planned Features

*   **Dynamic Data (CMS)**: Replacing hardcoded product arrays with fetched data from a backend.
*   **User Profiles**: Allowing users to see past orders, saved items, and manage addresses.
*   **Payment Gateway**: Connecting the state-managed checkout to a real payment processor (e.g. Stripe).

---

# Known Issues

*   **Technical Debt**: Large components (like `HomeSections.tsx`) contain multiple large sections and hardcoded data arrays. This file should be split into individual component files.
*   **Backend Integration**: The application currently relies on a mock `AuthContext` and hardcoded states. A real backend is required for full functionality.

---

# Performance Status

*   **Image Loading**: Some images are very large Unsplash/external URLs or heavy local PNGs. They need optimization (compression, WebP/AVIF format) and lazy loading implementation.
*   **Bundle Size**: Currently small as it's a frontend React app, but will grow as heavier libraries (like payment SDKs) are added.

---

# Security Status

*   **Authentication**: Mocked. No real JWT or session management yet.
*   **Authorization**: Basic route protection exists in React Router, but needs real backend validation.

---

# Database Status

*   **Status**: Not Implemented.
*   *Planned Collections*: Users, Products, Orders, Invoices.

---

# API Status

*   **Status**: Not Implemented. Currently using local state and context.

---

# Folder Structure Overview

```text
src/
├── assets/          # Static images, icons, and logos (local stitch assets)
├── components/      # Reusable UI components
│   ├── auth/        # Authentication layout wrappers
│   ├── cart/        # Atomic cart components (CartItem)
│   ├── layout/      # Navbar, Footer, PageContainer, CartDrawer
│   ├── sections/    # Homepage sections (Hero, BestSellers, etc.)
│   └── ui/          # Generic UI pieces (ScrollReveal, etc.)
├── context/         # React Context providers (AuthContext)
├── pages/           # Route-level components
│   ├── admin/       # Admin dashboard views
│   ├── auth/        # Login, Signup pages
│   ├── About.tsx
│   ├── Checkout.tsx
│   ├── Gallery.tsx
│   └── Home.tsx
├── store/           # Zustand global state (cartStore, checkoutStore)
├── App.tsx          # Main application router and shell
└── index.css        # Global styles and Tailwind imports
```

---

# Technical Debt

1.  **Component Bloat**: Extract the 10+ components inside `HomeSections.tsx` into their own dedicated files inside `src/components/sections/`.
2.  **Hardcoded Content**: Move product arrays, gallery images, and static text into a dedicated `data/` folder or CMS to separate logic from content.

---

# Next Recommended Priorities

1.  **Component Refactoring**: Split `HomeSections.tsx` to improve maintainability before adding more features.
2.  **Backend Architecture**: Plan and initialize the backend server (Node.js/Express or Firebase) to handle real user authentication and product data.
3.  **Payment Integration**: Finalize the API endpoints for the secure checkout initialization and payment processing.
