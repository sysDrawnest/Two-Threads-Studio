const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'frontend', 'src', 'assets', 'svgs');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Global SVG attributes
const attrs = `xmlns="http://www.w3.org/2000/svg" stroke="#C8A97E" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;

function saveSvg(name, viewBox, paths) {
  const content = `<svg viewBox="${viewBox}" ${attrs}>\n  ${paths.join('\n  ')}\n</svg>`;
  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.svg`), content);
}

// 1. Horizontal Thread Paths (8)
const waves = [
  // Gentle wave
  `<path d="M 0,50 Q 50,20 100,50 T 200,50 T 300,50 T 400,50" />`,
  // Long sweeping curve
  `<path d="M -10,10 C 150,150 250,-50 410,90" />`,
  // Looping thread horizontal
  `<path d="M 0,50 C 100,50 120,100 150,80 C 180,60 160,20 120,40 C 80,60 150,100 400,50" />`,
  // Loose s-shape
  `<path d="M 0,20 C 150,-20 150,120 400,80" />`,
  // Double intersecting (single path)
  `<path d="M 0,80 C 100,80 150,20 200,50 C 250,80 300,20 400,20 M 0,20 C 100,20 150,80 200,50 C 250,20 300,80 400,80" />`,
  // Delicate trailing thread
  `<path d="M 0,10 Q 50,50 150,50 T 300,30 T 400,60" />`,
  // Needle attached at end
  `<path d="M 0,50 Q 150,20 300,50 T 380,50" /><path d="M 380,50 L 398,50 L 395,48 M 398,50 L 395,52" stroke-width="1" />`,
  // Organic knot
  `<path d="M 0,50 C 150,50 180,10 200,30 C 220,50 180,70 190,50 C 200,20 250,50 400,50" />`
];
waves.forEach((p, i) => saveSvg(`thread-wave-0${i+1}`, "0 0 400 100", [p]));

// 2. Vertical Thread Paths (6)
const verticals = [
  // Gentle drop
  `<path d="M 50,0 Q 20,50 50,100 T 50,200 T 50,300 T 50,400" />`,
  // Long sweep
  `<path d="M 10,-10 C 150,150 -50,250 90,410" />`,
  // Drop with loop
  `<path d="M 50,0 C 50,100 100,120 80,150 C 60,180 20,160 40,120 C 60,80 100,150 50,400" />`,
  // Loose s-shape vertical
  `<path d="M 20,0 C -20,150 120,150 80,400" />`,
  // Trailing vertical
  `<path d="M 10,0 Q 50,50 50,150 T 30,300 T 60,400" />`,
  // Organic knot vertical
  `<path d="M 50,0 C 50,150 10,180 30,200 C 50,220 70,180 50,190 C 20,200 50,250 50,400" />`
];
verticals.forEach((p, i) => saveSvg(`thread-vertical-0${i+1}`, "0 0 100 400", [p]));

// 3. Corner Decorations (5)
const corners = [
  // Top left sweep
  `<path d="M 0,100 C 0,50 50,0 100,0" />`,
  // Bottom right organic
  `<path d="M 0,100 C 50,100 100,50 100,0" />`,
  // Top right double
  `<path d="M 0,0 C 50,0 100,50 100,100 M 20,0 C 60,0 100,40 100,80" />`,
  // Bottom left knot
  `<path d="M 100,100 C 50,100 50,80 25,80 C 0,80 0,50 0,0" />`,
  // Top left elegant loop
  `<path d="M 0,100 C 20,100 20,40 50,40 C 80,40 80,20 50,20 C 20,20 20,80 80,80 C 100,80 100,0 100,0" />`
];
corners.forEach((p, i) => saveSvg(`thread-corner-0${i+1}`, "0 0 100 100", [p]));
// Renaming specific ones as requested
saveSvg(`thread-corner-top-left`, "0 0 100 100", [corners[0]]);
saveSvg(`thread-corner-bottom-right`, "0 0 100 100", [corners[1]]);


// 4. Circular Embroidery Hoop Loops (4)
const loops = [
  // Simple imperfect circle
  `<path d="M 50,10 C 80,10 90,40 90,50 C 90,80 60,90 50,90 C 20,90 10,60 10,50 C 10,20 40,10 60,10" />`,
  // Double overlapped circle
  `<path d="M 50,5 C 85,5 95,40 95,50 C 95,85 60,95 50,95 C 15,95 5,60 5,50 C 5,15 40,5 50,5 M 45,10 C 75,10 85,35 85,50 C 85,75 55,85 45,85 C 15,85 10,60 10,50 C 10,20 35,10 45,10" />`,
  // Loop with trailing ends
  `<path d="M 0,10 C 20,20 30,10 50,10 C 80,10 90,40 90,50 C 90,80 60,90 50,90 C 20,90 10,60 10,50 C 10,30 30,20 100,20" />`,
  // Elliptical organic
  `<path d="M 10,50 C 10,20 50,10 90,50 C 130,90 130,30 90,30 C 50,30 10,70 50,90" />`
];
loops.forEach((p, i) => saveSvg(`thread-loop-0${i+1}`, "0 0 100 100", [p]));

// 5. Decorative Dividers (6)
const dividers = [
  // Straight with center dip
  `<path d="M 0,20 L 180,20 C 190,20 195,30 200,30 C 205,30 210,20 220,20 L 400,20" />`,
  // Straight with center knot
  `<path d="M 0,20 L 190,20 C 195,20 200,15 205,20 C 210,25 195,25 200,20 C 205,15 210,20 220,20 L 400,20" />`,
  // Subtle wave divider
  `<path d="M 0,20 C 100,20 150,25 200,20 C 250,15 300,20 400,20" />`,
  // Long dash effect
  `<path d="M 0,20 L 80,20 M 100,20 L 300,20 M 320,20 L 400,20" />`,
  // Geometric step divider
  `<path d="M 0,20 L 180,20 L 190,25 L 210,15 L 220,20 L 400,20" />`,
  // Hand-drawn straight line (slight imperfections)
  `<path d="M 0,20 Q 50,19 100,20 T 200,21 T 300,19 T 400,20" />`
];
dividers.forEach((p, i) => saveSvg(`thread-divider-0${i+1}`, "0 0 400 40", [p]));

// 6. Needle Graphics (5)
const needles = [
  // Minimal sewing needle
  `<path d="M 10,90 L 85,15 C 88,12 90,10 90,10 C 92,12 92,15 90,18 L 15,95 Z" /><path d="M 82,18 L 86,14" />`,
  // Gold embroidery needle (solid)
  `<path d="M 5,95 L 90,10 A 2,2 0 0,1 95,15 L 10,100 Z" fill="#C8A97E" stroke="none" /><ellipse cx="88" cy="18" rx="1.5" ry="4" transform="rotate(45 88 18)" fill="#FAF9F7" />`,
  // Outline version
  `<path d="M 10,90 L 85,15 C 88,12 90,10 90,10 C 92,12 92,15 90,18 L 15,95 Z" /><ellipse cx="85" cy="18" rx="1" ry="3" transform="rotate(45 85 18)" />`,
  // Tiny realistic needle
  `<path d="M 40,60 L 58,42 C 59,41 60,40 60,40 C 61,41 61,42 60,43 L 42,61 Z" /><line x1="56" y1="44" x2="57" y2="43" />`,
  // Needle with threaded eye
  `<path d="M 20,80 L 85,15 A 2,2 0 0,1 90,20 L 25,85 Z" /><path d="M 82,22 C 70,30 60,10 40,20 C 20,30 10,50 5,40" />`
];
needles.forEach((p, i) => saveSvg(`needle-0${i+1}`, "0 0 100 100", [p]));
saveSvg(`needle-gold`, "0 0 100 100", [needles[1]]);
saveSvg(`needle-outline`, "0 0 100 100", [needles[2]]);

console.log("Successfully generated all SVGs in " + OUTPUT_DIR);
