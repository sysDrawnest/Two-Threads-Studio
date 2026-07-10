export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  productName?: string;
  verified?: boolean;
  photo?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  category: "Kit" | "Pattern" | "Bundle" | "Material" | "Finished Hoop" | "Crochet" | "Macramé" | "Lippan Art" | "Gift Set" | "Candles";
  productCategory?: "Embroidery" | "Crochet" | "Macramé" | "Gift Sets" | "Lippan Art" | "Home Decor" | "Candles";
  collection: "Botanical" | "Cottage" | "Linen" | "Seasonal" | "Wellness";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  badge?: "New" | "Best Seller" | "Limited" | "Editor's Choice" | "Trending";
  images: string[];
  description: string;
  story: string;
  materialsIncluded: string[];
  estimatedTime: string;
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
  stock?: "In Stock" | "Low Stock" | "Out of Stock";
  isPersonalizable?: boolean;
  isHandmade?: boolean;
  isSustainable?: boolean;
  occasion?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
  featured?: boolean;
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  icon: string;
}

export const mockCategories: Category[] = [
  {
    id: "cat1",
    name: "Embroidery Kits",
    slug: "embroidery-kits",
    image: "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
    count: 48,
    featured: true,
  },
  {
    id: "cat2",
    name: "Crochet",
    slug: "crochet",
    image: "https://images.unsplash.com/photo-1617896848219-aab8a02eed8c?q=80&w=800&auto=format&fit=crop",
    count: 32,
  },
  {
    id: "cat3",
    name: "Lippan Art",
    slug: "lippan-art",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop",
    count: 18,
  },
  {
    id: "cat4",
    name: "Macramé",
    slug: "macrame",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    count: 26,
  },
  {
    id: "cat5",
    name: "Botanical Candles",
    slug: "botanical-candles",
    image: "https://images.unsplash.com/photo-1608405021200-e14fc75338cd?q=80&w=800&auto=format&fit=crop",
    count: 21,
  },
  {
    id: "cat6",
    name: "DIY Kits",
    slug: "diy-kits",
    image: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop",
    count: 15,
  },
  {
    id: "cat7",
    name: "Home Decor",
    slug: "home-decor",
    image: "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop",
    count: 39,
  },
  {
    id: "cat8",
    name: "Gift Collection",
    slug: "gifts",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    count: 27,
  },
];

export const mockOccasions: Occasion[] = [
  {
    id: "occ1",
    name: "Housewarming",
    slug: "housewarming",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop",
    description: "Warm their new home with handmade art",
    icon: "🏡",
  },
  {
    id: "occ2",
    name: "Wedding",
    slug: "wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    description: "Timeless gifts for the happy couple",
    icon: "💍",
  },
  {
    id: "occ3",
    name: "Birthday",
    slug: "birthday",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop",
    description: "A gift as special as they are",
    icon: "🎂",
  },
  {
    id: "occ4",
    name: "Anniversary",
    slug: "anniversary",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
    description: "Celebrate love with lasting art",
    icon: "✨",
  },
  {
    id: "occ5",
    name: "Festive",
    slug: "festive",
    image: "https://images.unsplash.com/photo-1574314985989-74cf05d31e42?q=80&w=600&auto=format&fit=crop",
    description: "Handcrafted joy for every celebration",
    icon: "🪔",
  },
  {
    id: "occ6",
    name: "Corporate Gifts",
    slug: "corporate",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    description: "Thoughtful gifting at scale",
    icon: "🤝",
  },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Meadow Floral Hoop Kit",
    price: 3500,
    mrp: 4200,
    category: "Kit",
    productCategory: "Embroidery",
    collection: "Botanical",
    difficulty: "Beginner",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 248,
    stock: "In Stock",
    isHandmade: true,
    isSustainable: true,
    occasion: ["Birthday", "Housewarming"],
    images: [
      "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "A perfect introduction to floral embroidery, featuring a warm palette inspired by sun-drenched meadows.",
    story:
      "Designed after a late summer walk through the French countryside, this kit brings the warmth of the meadow into your hands. Every stitch is a meditation on the fleeting beauty of wildflowers.",
    materialsIncluded: [
      '6" Bamboo embroidery hoop',
      "Pre-printed linen blend fabric",
      "DMC Cotton embroidery floss (6 colors)",
      "2x Size 5 embroidery needles",
      "Illustrated stitch guide",
    ],
    estimatedTime: "4 - 6 hours",
    reviews: [
      {
        id: "r1",
        author: "Claire M.",
        rating: 5,
        text: "Absolutely loved this! The instructions were incredibly clear for a beginner.",
        date: "May 12, 2026",
        verified: true,
        productName: "Meadow Floral Hoop Kit",
        photo:
          "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=200&auto=format&fit=crop",
      },
      {
        id: "r2",
        author: "Elena R.",
        rating: 5,
        text: "The linen quality is superb. It looks so premium hanging on my wall.",
        date: "April 28, 2026",
        verified: true,
        productName: "Meadow Floral Hoop Kit",
      },
    ],
  },
  {
    id: "p2",
    name: "Winter Pine Pattern",
    price: 1500,
    mrp: 1800,
    category: "Pattern",
    productCategory: "Embroidery",
    collection: "Seasonal",
    difficulty: "Intermediate",
    badge: "New",
    rating: 4.7,
    reviewCount: 54,
    stock: "In Stock",
    isHandmade: false,
    isSustainable: true,
    images: [
      "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A minimalist digital pattern for creating a serene winter pine motif.",
    story:
      "Inspired by the quiet stillness of snow-covered forests, this pattern uses subtle thread blending to create depth and texture.",
    materialsIncluded: [
      "Downloadable PDF Pattern",
      "Color and stitch guide",
      "Transfer instructions",
    ],
    estimatedTime: "3 - 5 hours",
    reviews: [],
  },
  {
    id: "p3",
    name: "Cottage Garden Bundle",
    price: 7000,
    mrp: 9500,
    category: "Bundle",
    productCategory: "Embroidery",
    collection: "Cottage",
    difficulty: "Advanced",
    badge: "Limited",
    rating: 4.9,
    reviewCount: 87,
    stock: "Low Stock",
    isHandmade: true,
    isSustainable: true,
    occasion: ["Anniversary", "Wedding"],
    images: [
      "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "Our comprehensive bundle for the dedicated artisan, featuring complex cottage core designs.",
    story:
      "This bundle encapsulates the essence of a rambling English cottage garden. It challenges you with varied stitches and a dense, lush composition that feels like a labor of love.",
    materialsIncluded: [
      "3x Premium wooden hoops (various sizes)",
      "3x Pre-printed premium linen fabrics",
      "DMC Cotton embroidery floss (24 colors)",
      "Premium needle set in a wooden tube",
      "Detailed spiral-bound instruction book",
    ],
    estimatedTime: "20 - 30 hours",
    reviews: [
      {
        id: "r3",
        author: "Sophia T.",
        rating: 5,
        text: "A massive project but incredibly rewarding. The packaging was a joy to open.",
        date: "January 15, 2026",
        verified: true,
        productName: "Cottage Garden Bundle",
        photo:
          "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=200&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "p4",
    name: "Pure Linen Starter Fabric",
    price: 2000,
    mrp: 2400,
    category: "Material",
    productCategory: "Embroidery",
    collection: "Linen",
    difficulty: "Beginner",
    rating: 4.6,
    reviewCount: 139,
    stock: "In Stock",
    isSustainable: true,
    images: [
      "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Three half-yard cuts of our signature unbleached linen.",
    story:
      "Sourced from a multi-generational mill in Belgium, our linen offers the perfect tension and weave for precision embroidery.",
    materialsIncluded: ["3x Half-yard pure linen cuts (Oat, Sage, Natural)"],
    estimatedTime: "N/A",
    reviews: [
      {
        id: "r4",
        author: "Emma W.",
        rating: 4,
        text: "Beautiful texture, slightly looser weave than I'm used to but wonderful to work with.",
        date: "March 10, 2026",
        verified: true,
        productName: "Pure Linen Starter Fabric",
      },
    ],
  },
  {
    id: "p5",
    name: "Autumn Harvest Kit",
    price: 3800,
    mrp: 4500,
    category: "Kit",
    productCategory: "Embroidery",
    collection: "Seasonal",
    difficulty: "Intermediate",
    badge: "Trending",
    rating: 4.8,
    reviewCount: 63,
    stock: "In Stock",
    isHandmade: true,
    occasion: ["Birthday", "Festive"],
    images: [
      "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Rich burgundies and golds bring this seasonal squash and leaf motif to life.",
    story:
      "Capture the crisp air and changing colors of autumn. This kit focuses on blending techniques to create realistic shading on leaves and gourds.",
    materialsIncluded: [
      '7" Beechwood hoop',
      "Pre-printed cotton/linen blend",
      "DMC Floss (12 colors)",
      "2x Needles",
      "Color map and guide",
    ],
    estimatedTime: "8 - 10 hours",
    reviews: [],
  },
  {
    id: "p6",
    name: "Minimalist Fern Pattern",
    price: 1200,
    mrp: 1500,
    category: "Pattern",
    productCategory: "Embroidery",
    collection: "Botanical",
    difficulty: "Beginner",
    rating: 4.9,
    reviewCount: 201,
    stock: "In Stock",
    isSustainable: true,
    images: [
      "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A striking, single-color fern design perfect for modern homes.",
    story:
      "Simplicity is the ultimate sophistication. This pattern relies entirely on variations of the backstitch.",
    materialsIncluded: ["Downloadable PDF Pattern", "Transfer guide"],
    estimatedTime: "2 - 3 hours",
    reviews: [
      {
        id: "r5",
        author: "Liam J.",
        rating: 5,
        text: "Finished this in one evening. Looks amazing in a black frame.",
        date: "June 01, 2026",
        verified: true,
        productName: "Minimalist Fern Pattern",
      },
    ],
  },
  {
    id: "p7",
    name: "Wildflower Sanctuary Hoop",
    price: 18000,
    mrp: 22000,
    category: "Finished Hoop",
    productCategory: "Embroidery",
    collection: "Botanical",
    difficulty: "Advanced",
    badge: "Limited",
    rating: 5.0,
    reviewCount: 12,
    stock: "Low Stock",
    isHandmade: true,
    isSustainable: true,
    isPersonalizable: true,
    occasion: ["Anniversary", "Wedding", "Housewarming"],
    images: [
      "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "A meticulously hand-embroidered 8-inch hoop featuring a dense wildflower meadow. Over 40 hours of hand stitching.",
    story:
      "Each Wildflower Sanctuary hoop is individually crafted by our master embroiderer. No two pieces are identical, making this a true heirloom.",
    materialsIncluded: [
      '8" Walnut-stained hoop',
      "Hand-embroidered linen art piece",
      "Signed certificate of authenticity",
    ],
    estimatedTime: "40 hours",
    reviews: [],
  },
  {
    id: "p8",
    name: "Midnight Forest Hoop",
    price: 22000,
    mrp: 26000,
    category: "Finished Hoop",
    productCategory: "Embroidery",
    collection: "Linen",
    difficulty: "Advanced",
    badge: "Editor's Choice",
    rating: 4.9,
    reviewCount: 8,
    stock: "Low Stock",
    isHandmade: true,
    isPersonalizable: true,
    isSustainable: true,
    occasion: ["Anniversary", "Corporate"],
    images: [
      "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "A stunning night sky forest silhouette stitched in pure silk and metallic threads on charcoal Belgian linen.",
    story:
      "Capturing the quiet mystery of a winter forest at night. This piece features delicate French knots and satin stitches using silk-blend threads.",
    materialsIncluded: [
      '10" Oak-stained hoop',
      "Hand-stitched silk and linen artwork",
      "Wall-mounting hardware",
    ],
    estimatedTime: "55 hours",
    reviews: [],
  },
  {
    id: "p9",
    name: "Boho Macramé Wall Hanging",
    price: 4200,
    mrp: 5500,
    category: "Macramé",
    productCategory: "Macramé",
    collection: "Cottage",
    difficulty: "Beginner",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 176,
    stock: "In Stock",
    isHandmade: true,
    isSustainable: true,
    occasion: ["Housewarming", "Birthday"],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Handknotted cotton macramé wall art. Natural, organic, and endlessly elegant.",
    story:
      "Inspired by the earthy textures of Rajasthan, each piece is hand-knotted by our artisan collective using sustainably sourced cotton rope.",
    materialsIncluded: ["Handknotted macramé piece", "Driftwood rod", "Hanging cord"],
    estimatedTime: "Ready to hang",
    reviews: [
      {
        id: "r9",
        author: "Priya S.",
        rating: 5,
        text: "Absolutely stunning! The quality is exceptional and it transformed my living room wall.",
        date: "May 28, 2026",
        verified: true,
        productName: "Boho Macramé Wall Hanging",
        photo:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=200&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "p10",
    name: "Personalized Name Hoop",
    price: 2800,
    mrp: 3500,
    category: "Finished Hoop",
    productCategory: "Embroidery",
    collection: "Botanical",
    difficulty: "Beginner",
    badge: "New",
    rating: 4.9,
    reviewCount: 93,
    stock: "In Stock",
    isHandmade: true,
    isPersonalizable: true,
    occasion: ["Birthday", "Wedding", "Anniversary"],
    images: [
      "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A custom embroidered name hoop with floral accents. The perfect personalized gift.",
    story:
      "Each hoop is individually stitched with the recipient's name surrounded by hand-embroidered botanicals. A gift that lasts forever.",
    materialsIncluded: [
      'Custom 6" bamboo hoop',
      "Personalized name embroidery",
      "Floral botanical accents",
      "Gift-ready packaging",
    ],
    estimatedTime: "5 - 7 business days",
    reviews: [],
  },
  {
    id: "p11",
    name: "Crochet Sunset Flower Bunch",
    price: 1800,
    mrp: 2200,
    category: "Crochet",
    productCategory: "Crochet",
    collection: "Botanical",
    difficulty: "Beginner",
    badge: "Best Seller",
    rating: 4.7,
    reviewCount: 312,
    stock: "In Stock",
    isHandmade: true,
    isSustainable: true,
    occasion: ["Birthday", "Housewarming"],
    images: [
      "https://images.unsplash.com/photo-1617896848219-aab8a02eed8c?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "A bouquet of handcrafted crochet flowers that never wilt. Warm sunset colors that bring joy.",
    story:
      "Each flower is individually crafted using premium cotton yarn. Unlike fresh flowers, these bloom forever — a perpetual reminder of care.",
    materialsIncluded: ["12 crochet flowers", "Natural raffia wrapping", "Handwritten gift card"],
    estimatedTime: "Ready to gift",
    reviews: [],
  },
  {
    id: "p12",
    name: "Festival Gift Box",
    price: 5500,
    mrp: 7000,
    category: "Gift Set",
    productCategory: "Gift Sets",
    collection: "Seasonal",
    difficulty: "Beginner",
    badge: "Limited",
    rating: 4.9,
    reviewCount: 44,
    stock: "Low Stock",
    isHandmade: true,
    isSustainable: true,
    isPersonalizable: true,
    occasion: ["Festive", "Corporate", "Birthday"],
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "A beautifully curated festive gift set including an embroidery kit, crochet flowers, and handmade decor.",
    story:
      "Designed to delight. Our festival box pairs the joy of creating with the beauty of gifting — perfect for Diwali, Eid, and Christmas.",
    materialsIncluded: [
      "1x Mini embroidery kit",
      "6x Crochet flowers",
      "1x Lippan art coaster set",
      "Handcrafted gift box",
    ],
    estimatedTime: "Ready to gift",
    reviews: [],
  },
];

export const collectionsData = [
  {
    id: "c1",
    name: "Botanical",
    image:
      "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=1200&auto=format&fit=crop",
    description: "Inspired by wild meadows and curated gardens. Flora that lasts forever.",
  },
  {
    id: "c2",
    name: "Cottage",
    image:
      "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=1200&auto=format&fit=crop",
    description: "Cozy, dense designs reflecting the charm of English countryside living.",
  },
  {
    id: "c3",
    name: "Linen",
    image:
      "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=1200&auto=format&fit=crop",
    description: "Premium materials and minimalist designs where the fabric is the star.",
  },
  {
    id: "c4",
    name: "Seasonal",
    image:
      "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=1200&auto=format&fit=crop",
    description: "Limited edition kits and patterns celebrating the turning of the wheel.",
  },
];
