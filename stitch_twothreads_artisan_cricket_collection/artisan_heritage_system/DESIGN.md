---
name: Artisan Heritage System
colors:
  surface: '#fef8f3'
  surface-dim: '#ded9d4'
  surface-bright: '#fef8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ee'
  surface-container: '#f2ede8'
  surface-container-high: '#ece7e2'
  surface-container-highest: '#e6e2dd'
  on-surface: '#1d1b19'
  on-surface-variant: '#4e4540'
  inverse-surface: '#32302d'
  inverse-on-surface: '#f5f0eb'
  outline: '#7f756f'
  outline-variant: '#d1c4bd'
  surface-tint: '#675c56'
  primary: '#17110c'
  on-primary: '#ffffff'
  primary-container: '#2d2520'
  on-primary-container: '#988b84'
  inverse-primary: '#d2c4bc'
  secondary: '#735947'
  on-secondary: '#ffffff'
  secondary-container: '#fcd9c2'
  on-secondary-container: '#785d4b'
  tertiary: '#2f0000'
  on-tertiary: '#ffffff'
  tertiary-container: '#560001'
  on-tertiary-container: '#eb6151'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efe0d8'
  primary-fixed-dim: '#d2c4bc'
  on-primary-fixed: '#211a15'
  on-primary-fixed-variant: '#4e453f'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#e2c0aa'
  on-secondary-fixed: '#291709'
  on-secondary-fixed-variant: '#594231'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#8a1b13'
  background: '#fef8f3'
  on-background: '#1d1b19'
  surface-variant: '#e6e2dd'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: dmSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: dmSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: dmSans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  margin-desktop: 64px
  margin-mobile: 24px
  gutter: 24px
  section-gap: 120px
---

## Brand & Style

The design system is anchored in the intersection of traditional craftsmanship and modern luxury. It evokes the tactile quality of bespoke tailoring and the storied heritage of cricket culture—think weathered leather, hand-carved willow, and fine linen. 

The aesthetic style is **Warm Minimalist Luxury** with **Tactile/Skeuomorphic accents**. It avoids the sterility of modern digital interfaces by introducing organic textures, dashed "stitch" borders, and a palette inspired by natural materials. The goal is to make the user feel like they are leafing through a high-end editorial lookbook or visiting a quiet, sun-drenched atelier.

## Colors

The palette is derived from natural, untreated materials. The foundation is a pair of warm neutrals: **Off-White** for main canvases and **Warm Sand** for layered surfaces. 

**Deep Charcoal** and **Dark Cocoa** provide the necessary weight and authority for typography and structural elements. **Artisan Gold-Brown** acts as a sophisticated secondary color for icons and subtle highlights. **Cricket Leather Red** is used sparingly for primary actions or urgent notifications, while **Willow Green** serves as a soft success or sustainability indicator.

## Typography

This design system uses a classic serif/sans-serif pairing to balance heritage with readability. **ebGaramond** is the primary display face, set with a medium-to-bold weight to reflect editorial authority and the elegance of traditional typesetting.

**dmSans** provides a clean, modern contrast for body copy and UI labels. It is chosen for its understated character, ensuring that the primary focus remains on the product imagery and serif headlines. Use tight tracking for large display headings and generous leading for body text to maintain an airy, luxurious feel.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to create a stable, gallery-like experience. On desktop, content is contained within a 12-column grid with generous 64px outer margins. On mobile, this reflows to a single column with 24px margins.

Spacing is used intentionally to create "breathing room." Section gaps are intentionally large (120px+) to distinguish different narratives or product categories. Elements should feel intentionally placed rather than crowded, favoring asymmetrical white space to emphasize handcrafted uniqueness.

## Elevation & Depth

Depth is communicated through **Tonal Layers** and **Ambient Shadows** rather than high-contrast dropshadows. 

1. **Layers:** Use the `Warm Sand (#ede6de)` surface color to lift cards and containers off the `Off-White (#f5f0eb)` background.
2. **Shadows:** When used, shadows should be extremely soft, using a `Dark Cocoa` tint at very low opacity (5-8%) with a large blur radius to mimic natural, diffuse light.
3. **Tactile Borders:** Instead of shadows, prioritize the use of **1px dashed borders** (resembling stitch lines) in `Artisan Gold-Brown` to define component boundaries. This reinforces the "TwoThreads" craftsmanship narrative.

## Shapes

The shape language is **Soft**. UI elements utilize a subtle 0.25rem (4px) corner radius to take the edge off sharp digital boxes, echoing the natural softening of aged leather or woven fabric. 

Interactive elements like buttons or input fields should never be fully pill-shaped or perfectly sharp; the 4px radius maintains a structured, professional appearance while feeling approachable and organic.

## Components

### Buttons
Primary buttons use a solid `Deep Charcoal` background with `Off-White` text. Secondary buttons are outlined with a **1px dashed "stitch" border** in `Artisan Gold-Brown`. All buttons should have generous horizontal padding (24px+) to feel elegant.

### Input Fields
Inputs are minimalist: a single bottom border in `Deep Charcoal` or a very light `Warm Sand` fill. Focus states transition the border to `Artisan Gold-Brown`.

### Cards
Product cards use no visible border or a very faint `Warm Sand` stroke. The "Stitch" detail (a dashed line) can be used as a divider between the product image and the metadata (title/price).

### Chips & Tags
Used for material types (e.g., "English Willow," "Hand-stitched"). These should use `ebGaramond` in italics or `dmSans` in all-caps label style, with a background color of `Warm Sand`.

### Featured Lists
Lists of specifications should use custom icons that resemble artisan tools or cricket motifs, rendered in thin-stroke `Artisan Gold-Brown`.