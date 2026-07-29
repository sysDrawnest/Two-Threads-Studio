
# Universal Artwork Extraction Prompt

## Objective

Extract **only the primary artwork or design** from the provided reference image while preserving its exact composition, proportions, geometry, layout, colors, line work, textures, handcrafted details, and overall visual identity.

Remove every surrounding object, background element, photographic artifact, shadow, lighting effect, surface, frame, packaging, environment, and decorative object, leaving **only the isolated artwork**.

This is **an extraction task, not a generation task.** The goal is to faithfully preserve the original design exactly as it appears without reinterpretation or creative modification.

The final output should resemble a premium production-ready design asset suitable for printing, branding, manufacturing, engraving, embroidery, textile production, packaging, digital publishing, vector tracing, or archival use.

---

# Preservation Requirements

Preserve exactly:

* Overall composition
* Layout
* Scale relationships
* Proportions
* Shapes
* Curves
* Line quality
* Stroke thickness
* Colors
* Gradients (if present)
* Texture
* Surface detail
* Material appearance
* Brush strokes
* Pencil marks
* Ink details
* Embroidery stitches
* Fabric weave
* Wood grain
* Engraving marks
* Layering
* Decorative elements
* Negative space
* Balance
* Visual hierarchy

Maintain every original detail exactly.

Do **not** redesign, reinterpret, stylize, modernize, simplify, enhance, repair, or invent missing elements.

---

# Cleanup Requirements

Completely remove:

* Background
* Shadows
* Reflections
* Lighting gradients
* Perspective distortion
* Camera distortion
* Frames
* Borders
* Packaging
* Table surfaces
* Walls
* Furniture
* Hands
* People
* Objects
* Props
* Environmental elements
* Fabric outside the artwork
* Mounting hardware
* Display stands
* Watermarks
* Logos (unless they are part of the artwork)
* Labels
* Price tags
* Text outside the artwork

The final artwork should appear perfectly isolated.

---

# Output Style

Present the extracted artwork as a clean production-ready graphic.

Maintain:

* Original texture
* Original materials
* Authentic handcrafted qualities
* Crisp edges
* Fine detail
* Accurate colors
* Natural imperfections
* Surface realism
* Professional presentation

The artwork should feel suitable for:

* Print production
* Vector tracing
* SVG recreation
* Laser engraving
* CNC carving
* Embroidery digitization
* Textile printing
* Packaging
* Branding
* Product manufacturing
* Digital asset libraries
* Museum-quality archival documentation

---

# Background

Preferred:

Transparent background (PNG)

Alternative:

Pure white background (#FFFFFF)

No shadows.

No reflections.

No gradients.

No environment.

No photography.

No decorative styling.

Only the artwork.

---

# Quality Requirements

Ultra-clean extraction.

Pixel-perfect edges.

Extremely sharp.

High-resolution.

Production-ready.

Vector-friendly.

Museum-quality precision.

Preserve every fine detail.

Maintain original texture.

No compression artifacts.

Suitable for 8K output.

Perfect orthographic front view.

---

# MASTER EXTRACTION PROMPT ⭐

> **This is an extraction task, not a generation task. Preserve the original artwork exactly as it appears in the reference image.**
>
> Extract only the primary artwork or design from the provided reference image while preserving its exact composition, proportions, geometry, layout, colors, textures, materials, handcrafted details, line work, decorative elements, and overall visual identity. Remove every surrounding object including backgrounds, frames, packaging, surfaces, shadows, reflections, lighting effects, perspective distortion, environmental elements, props, people, hands, furniture, labels, and all photographic artifacts. Isolate the artwork on a transparent background (preferred) or a pure white background while maintaining perfectly crisp edges and complete visual fidelity. Preserve every visible texture including fabric weave, embroidery stitches, brush strokes, engraved details, wood grain, ink lines, paper texture, printed details, handcrafted imperfections, and material realism exactly as shown. Do not redesign, reinterpret, stylize, simplify, enhance, repair, or invent any element. Produce a production-ready isolated artwork suitable for vector tracing, SVG recreation, print production, laser engraving, textile manufacturing, branding, archival documentation, and premium design workflows. Ultra-high resolution, pixel-perfect extraction, museum-quality precision, orthographic front view, exceptionally sharp detail.

---

# NEGATIVE PROMPT

generation instead of extraction, redesign, reinterpretation, artistic variation, different composition, altered proportions, added elements, removed elements, AI-generated modifications, style transfer, illustration, painting, watercolor, sketch, cartoon, anime, CGI, fantasy elements, distorted geometry, perspective distortion, shadows, reflections, lighting gradients, background textures, environment, furniture, hands, people, props, packaging, frames, borders, decorative objects, text, watermark, logo not part of the artwork, cropping, blur, low resolution, compression artifacts, noisy edges, jagged outlines, missing details, oversharpening, oversaturation, HDR glow, color shifts, incomplete extraction, synthetic textures, plastic appearance.

