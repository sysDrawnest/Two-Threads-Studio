---
name: TwoThreads Studio
colors:
  surface: '#fef8f3'
  surface-dim: '#ded9d4'
  surface-bright: '#fef8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ee'
  surface-container: '#f3ede8'
  surface-container-high: '#ede7e2'
  surface-container-highest: '#e7e1dd'
  on-surface: '#1d1b19'
  on-surface-variant: '#4e4540'
  inverse-surface: '#32302d'
  inverse-on-surface: '#f6f0eb'
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
  tertiary: '#17110c'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d2520'
  on-tertiary-container: '#978b84'
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
  tertiary-fixed: '#efe0d7'
  tertiary-fixed-dim: '#d2c4bc'
  on-tertiary-fixed: '#211a15'
  on-tertiary-fixed-variant: '#4e453f'
  background: '#fef8f3'
  on-background: '#1d1b19'
  surface-variant: '#e7e1dd'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: ebGaramond
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: dmSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: dmSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: dmSans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.2em
  button-text:
    fontFamily: dmSans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
---

## Brand & Style

The design system is anchored in the concept of "Digital Craftsmanship." It targets a discerning audience that values slow fashion, artisanal quality, and the tactile nature of textiles. The aesthetic is **Minimalist and Editorial**, mimicking the layout of high-end independent magazines. 

The emotional response should be one of calm, exclusivity, and intentionality. By utilizing generous negative space and a restrained color palette, the UI steps back to let the photography of handcrafted goods take center stage. The style avoids trendy UI gimmicks, favoring timeless typographic hierarchy and architectural structural lines.

## Colors

The palette is derived from natural fibers and raw materials. 
- **Linen (#fef8f3)**: This warm off-white serves as the primary canvas for all screens, reducing the harshness of pure white to create a more organic feel.
- **Charcoal (#2d2520)**: Used for primary actions, high-contrast typography, and grounding elements.
- **Earth Brown (#735947)**: Reserved for secondary accents, specific call-to-actions, and semantic differentiation.
- **Soft Beige (#d2c4bc)**: Used for subtle backgrounds, secondary containers, and disabled states to maintain a low-contrast, sophisticated hierarchy.

## Typography

Typography is the cornerstone of this design system. It uses a high-contrast pairing between a classical serif and a modern geometric sans-serif.

**Headlines**: Use `ebGaramond` in light or regular weights. Maintain tight tracking for large display text to emphasize the elegant ligatures and serifs. Large headlines should feel authoritative but light, never heavy.

**UI Elements**: Use `dmSans` for all functional elements, labels, and small body text. To achieve the "editorial" look, apply wide letter spacing (tracking) to uppercase labels and buttons. This creates an airy, breathable quality even in dense information areas.

## Elevation & Depth

This design system avoids traditional drop shadows to maintain a flat, printed-paper aesthetic. Depth is achieved through:

1.  **Color Blocking**: Stacking elements of Linen on Beige, or Charcoal on Linen.
2.  **Fine Lines**: Using 1px solid or dotted lines to define boundaries without adding visual weight.
3.  **Layering**: Minimalist overlapping of image containers and text boxes to create a sense of physical arrangement.
4.  **No Blurs**: Do not use backdrop blurs or glassmorphism. Surfaces should feel opaque and substantial like heavy cardstock.

## Shapes

The shape language is strictly **Sharp (0px)**. All containers, buttons, and image frames must use 90-degree corners. This reinforces the architectural and editorial nature of the brand. Softness is introduced through imagery and the warmth of the color palette, rather than the geometry of the UI.

## Components

### Buttons
Primary buttons are full-width charcoal blocks with centered, white or linen text using `button-text` styling. Hover states should involve a subtle shift to the Earth Brown color. Secondary buttons use a 1px charcoal border with no fill.

### Input Fields
Inputs are radically minimal. They consist of a single 1px solid charcoal bottom border. The label sits above the line in `label-caps` typography. Focus states change the bottom border to 2px or shift the color to Earth Brown.

### Dividers
Section breaks are indicated by delicate dotted lines (1px height) using the Earth Brown or Soft Beige colors. These should never span the full width of the container unless they are separating major functional areas.

### Cards
Cards do not have borders or shadows. They are defined by their content and occasionally a background color fill of Soft Beige. Images within cards should have a 1:1 or 4:5 aspect ratio to feel like professional portrait photography.

### Chips/Tags
Small text tags use the `label-caps` style, wrapped in a 1px border or a light beige background fill, always with sharp corners.