export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Kit" | "Pattern" | "Bundle" | "Material";
  collection: "Botanical" | "Cottage" | "Linen" | "Seasonal";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  badge?: "New" | "Best Seller" | "Limited";
  images: string[];
  description: string;
  story: string;
  materialsIncluded: string[];
  estimatedTime: string;
  reviews: Review[];
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Meadow Floral Hoop Kit",
    price: 42,
    category: "Kit",
    collection: "Botanical",
    difficulty: "Beginner",
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A perfect introduction to floral embroidery, featuring a warm palette inspired by sun-drenched meadows.",
    story: "Designed after a late summer walk through the French countryside, this kit brings the warmth of the meadow into your hands. Every stitch is a meditation on the fleeting beauty of wildflowers.",
    materialsIncluded: [
      "6\" Bamboo embroidery hoop",
      "Pre-printed linen blend fabric",
      "DMC Cotton embroidery floss (6 colors)",
      "2x Size 5 embroidery needles",
      "Illustrated stitch guide"
    ],
    estimatedTime: "4 - 6 hours",
    reviews: [
      { id: "r1", author: "Claire M.", rating: 5, text: "Absolutely loved this! The instructions were incredibly clear for a beginner.", date: "May 12, 2026" },
      { id: "r2", author: "Elena R.", rating: 5, text: "The linen quality is superb. It looks so premium hanging on my wall.", date: "April 28, 2026" }
    ]
  },
  {
    id: "p2",
    name: "Winter Pine Pattern",
    price: 18,
    category: "Pattern",
    collection: "Seasonal",
    difficulty: "Intermediate",
    badge: "New",
    images: [
      "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A minimalist digital pattern for creating a serene winter pine motif.",
    story: "Inspired by the quiet stillness of snow-covered forests, this pattern uses subtle thread blending to create depth and texture.",
    materialsIncluded: [
      "Downloadable PDF Pattern",
      "Color and stitch guide",
      "Transfer instructions"
    ],
    estimatedTime: "3 - 5 hours",
    reviews: []
  },
  {
    id: "p3",
    name: "Cottage Garden Bundle",
    price: 85,
    category: "Bundle",
    collection: "Cottage",
    difficulty: "Advanced",
    badge: "Limited",
    images: [
      "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Our comprehensive bundle for the dedicated artisan, featuring complex cottage core designs.",
    story: "This bundle encapsulates the essence of a rambling English cottage garden. It challenges you with varied stitches and a dense, lush composition that feels like a labor of love.",
    materialsIncluded: [
      "3x Premium wooden hoops (various sizes)",
      "3x Pre-printed premium linen fabrics",
      "DMC Cotton embroidery floss (24 colors)",
      "Premium needle set in a wooden tube",
      "Detailed spiral-bound instruction book"
    ],
    estimatedTime: "20 - 30 hours",
    reviews: [
      { id: "r3", author: "Sophia T.", rating: 5, text: "A massive project but incredibly rewarding. The packaging was a joy to open.", date: "January 15, 2026" }
    ]
  },
  {
    id: "p4",
    name: "Pure Linen Starter Fabric",
    price: 24,
    category: "Material",
    collection: "Linen",
    difficulty: "Beginner",
    images: [
      "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Three half-yard cuts of our signature unbleached linen.",
    story: "Sourced from a multi-generational mill in Belgium, our linen offers the perfect tension and weave for precision embroidery. It's the blank canvas your art deserves.",
    materialsIncluded: [
      "3x Half-yard pure linen cuts (Oat, Sage, Natural)"
    ],
    estimatedTime: "N/A",
    reviews: [
      { id: "r4", author: "Emma W.", rating: 4, text: "Beautiful texture, slightly looser weave than I'm used to but wonderful to work with.", date: "March 10, 2026" }
    ]
  },
  {
    id: "p5",
    name: "Autumn Harvest Kit",
    price: 45,
    category: "Kit",
    collection: "Seasonal",
    difficulty: "Intermediate",
    images: [
      "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Rich burgundies and golds bring this seasonal squash and leaf motif to life.",
    story: "Capture the crisp air and changing colors of autumn. This kit focuses on blending techniques to create realistic shading on leaves and gourds.",
    materialsIncluded: [
      "7\" Beechwood hoop",
      "Pre-printed cotton/linen blend",
      "DMC Floss (12 colors)",
      "2x Needles",
      "Color map and guide"
    ],
    estimatedTime: "8 - 10 hours",
    reviews: []
  },
  {
    id: "p6",
    name: "Minimalist Fern Pattern",
    price: 15,
    category: "Pattern",
    collection: "Botanical",
    difficulty: "Beginner",
    images: [
      "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A striking, single-color fern design perfect for modern homes.",
    story: "Simplicity is the ultimate sophistication. This pattern relies entirely on variations of the backstitch to create an elegant, textured piece that fits anywhere.",
    materialsIncluded: [
      "Downloadable PDF Pattern",
      "Transfer guide"
    ],
    estimatedTime: "2 - 3 hours",
    reviews: [
      { id: "r5", author: "Liam J.", rating: 5, text: "Finished this in one evening. Looks amazing in a black frame.", date: "June 01, 2026" }
    ]
  }
];

export const collectionsData = [
  {
    id: "c1",
    name: "Botanical",
    image: "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=1200&auto=format&fit=crop",
    description: "Inspired by wild meadows and curated gardens. Flora that lasts forever."
  },
  {
    id: "c2",
    name: "Cottage",
    image: "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=1200&auto=format&fit=crop",
    description: "Cozy, dense designs reflecting the charm of English countryside living."
  },
  {
    id: "c3",
    name: "Linen",
    image: "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=1200&auto=format&fit=crop",
    description: "Premium materials and minimalist designs where the fabric is the star."
  },
  {
    id: "c4",
    name: "Seasonal",
    image: "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=1200&auto=format&fit=crop",
    description: "Limited edition kits and patterns celebrating the turning of the wheel."
  }
];
