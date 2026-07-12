import { ProductStatus, ProductType, BadgeType, DifficultyLevel } from '@prisma/client';
import prisma from '../src/prisma/index';

async function main() {
  console.log('🌱 Seeding Phase 3 catalog data...');

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'embroidery-kits' }, create: { id: 'cat1', name: 'Embroidery Kits', slug: 'embroidery-kits', image: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 1 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'crochet' }, create: { id: 'cat2', name: 'Crochet', slug: 'crochet', image: 'https://images.unsplash.com/photo-1617896848219-aab8a02eed8c?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 2 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'lippan-art' }, create: { id: 'cat3', name: 'Lippan Art', slug: 'lippan-art', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 3 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'macrame' }, create: { id: 'cat4', name: 'Macramé', slug: 'macrame', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 4 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'botanical-candles' }, create: { id: 'cat5', name: 'Botanical Candles', slug: 'botanical-candles', image: 'https://images.unsplash.com/photo-1608405021200-e14fc75338cd?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 5 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'diy-kits' }, create: { id: 'cat6', name: 'DIY Kits', slug: 'diy-kits', image: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 6 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'home-decor' }, create: { id: 'cat7', name: 'Home Decor', slug: 'home-decor', image: 'https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 7 }, update: {} }),
    prisma.category.upsert({ where: { slug: 'gifts' }, create: { id: 'cat8', name: 'Gift Collection', slug: 'gifts', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', isActive: true, sortOrder: 8 }, update: {} }),
  ]);
  console.log(`✅ ${categories.length} categories seeded`);

  // ─── Collections ────────────────────────────────────────────────────────────
  const collections = await Promise.all([
    prisma.collection.upsert({ where: { slug: 'botanical' }, create: { id: 'col1', name: 'Botanical', slug: 'botanical', description: 'Inspired by wild meadows and curated gardens. Flora that lasts forever.', bannerImage: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=1200&auto=format&fit=crop', isActive: true, sortOrder: 1 }, update: {} }),
    prisma.collection.upsert({ where: { slug: 'cottage' }, create: { id: 'col2', name: 'Cottage', slug: 'cottage', description: 'Cozy, dense designs reflecting the charm of English countryside living.', bannerImage: 'https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=1200&auto=format&fit=crop', isActive: true, sortOrder: 2 }, update: {} }),
    prisma.collection.upsert({ where: { slug: 'linen' }, create: { id: 'col3', name: 'Linen', slug: 'linen', description: 'Premium materials and minimalist designs where the fabric is the star.', bannerImage: 'https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=1200&auto=format&fit=crop', isActive: true, sortOrder: 3 }, update: {} }),
    prisma.collection.upsert({ where: { slug: 'seasonal' }, create: { id: 'col4', name: 'Seasonal', slug: 'seasonal', description: 'Limited edition kits celebrating the turning of the wheel.', bannerImage: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=1200&auto=format&fit=crop', isActive: true, sortOrder: 4 }, update: {} }),
    prisma.collection.upsert({ where: { slug: 'wellness' }, create: { id: 'col5', name: 'Wellness', slug: 'wellness', description: 'Slow-craft pieces for mindful living and intentional spaces.', isActive: true, sortOrder: 5 }, update: {} }),
  ]);
  console.log(`✅ ${collections.length} collections seeded`);

  // ─── Tags ────────────────────────────────────────────────────────────────────
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'best-seller' },    create: { id: 'tag-bs',  name: 'Best Seller',    slug: 'best-seller' },    update: {} }),
    prisma.tag.upsert({ where: { slug: 'new-arrival' },    create: { id: 'tag-new', name: 'New Arrival',    slug: 'new-arrival' },    update: {} }),
    prisma.tag.upsert({ where: { slug: 'limited' },        create: { id: 'tag-ltd', name: 'Limited',        slug: 'limited' },        update: {} }),
    prisma.tag.upsert({ where: { slug: 'editors-choice' }, create: { id: 'tag-ec',  name: "Editor's Choice", slug: 'editors-choice' }, update: {} }),
    prisma.tag.upsert({ where: { slug: 'trending' },       create: { id: 'tag-tr',  name: 'Trending',       slug: 'trending' },       update: {} }),
    prisma.tag.upsert({ where: { slug: 'handmade' },       create: { id: 'tag-hm',  name: 'Handmade',       slug: 'handmade' },       update: {} }),
    prisma.tag.upsert({ where: { slug: 'sustainable' },    create: { id: 'tag-sus', name: 'Sustainable',    slug: 'sustainable' },    update: {} }),
    prisma.tag.upsert({ where: { slug: 'personalizable' }, create: { id: 'tag-per', name: 'Personalizable', slug: 'personalizable' }, update: {} }),
    prisma.tag.upsert({ where: { slug: 'gift-ready' },     create: { id: 'tag-gft', name: 'Gift Ready',     slug: 'gift-ready' },     update: {} }),
    prisma.tag.upsert({ where: { slug: 'beginner' },       create: { id: 'tag-beg', name: 'Beginner',       slug: 'beginner' },       update: {} }),
  ]);
  console.log(`✅ ${tags.length} tags seeded`);

  // ─── Products ────────────────────────────────────────────────────────────────
  type ProductSeed = {
    id: string; name: string; slug: string; description: string; shortDescription?: string;
    categoryId: string; collectionId?: string; price: number; comparePrice?: number;
    stockQuantity: number; status: ProductStatus; type: ProductType;
    badge?: BadgeType; difficulty?: DifficultyLevel;
    featured: boolean; isHandmade: boolean; isSustainable: boolean;
    isPersonalizable?: boolean; estimatedTime?: string;
    materialsIncluded: string[]; origin: string;
    images: { url: string; isPrimary: boolean; sortOrder: number }[];
    tagIds: string[];
  };

  const productSeeds: ProductSeed[] = [
    {
      id: 'prod-p1', name: 'Meadow Floral Hoop Kit', slug: 'meadow-floral-hoop-kit',
      description: 'A perfect introduction to floral embroidery, featuring a warm palette inspired by sun-drenched meadows. Designed after a late summer walk through the French countryside, this kit brings the warmth of the meadow into your hands.',
      shortDescription: 'A beginner embroidery kit with warm floral palette.',
      categoryId: 'cat1', collectionId: 'col1', price: 3500, comparePrice: 4200,
      stockQuantity: 50, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.BEST_SELLER, difficulty: DifficultyLevel.BEGINNER,
      featured: true, isHandmade: true, isSustainable: true, estimatedTime: '4 - 6 hours',
      materialsIncluded: ['6" Bamboo embroidery hoop', 'Pre-printed linen blend fabric', 'DMC Cotton embroidery floss (6 colors)', '2x Size 5 embroidery needles', 'Illustrated stitch guide'],
      origin: 'Handmade in Bengaluru, India',
      images: [
        { url: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop', isPrimary: false, sortOrder: 1 },
      ],
      tagIds: ['tag-bs', 'tag-hm', 'tag-sus', 'tag-beg'],
    },
    {
      id: 'prod-p2', name: 'Winter Pine Pattern', slug: 'winter-pine-pattern',
      description: 'A minimalist digital pattern for creating a serene winter pine motif. Inspired by the quiet stillness of snow-covered forests, this pattern uses subtle thread blending to create depth and texture.',
      shortDescription: 'Minimalist digital embroidery pattern for winter pine.',
      categoryId: 'cat1', collectionId: 'col4', price: 1500, comparePrice: 1800,
      stockQuantity: 999, status: ProductStatus.ACTIVE, type: ProductType.DIGITAL,
      badge: BadgeType.NEW, difficulty: DifficultyLevel.INTERMEDIATE,
      featured: false, isHandmade: false, isSustainable: true, estimatedTime: '3 - 5 hours',
      materialsIncluded: ['Downloadable PDF Pattern', 'Color and stitch guide', 'Transfer instructions'],
      origin: 'Digitally created in India',
      images: [{ url: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-new', 'tag-sus'],
    },
    {
      id: 'prod-p3', name: 'Cottage Garden Bundle', slug: 'cottage-garden-bundle',
      description: 'Our comprehensive bundle for the dedicated artisan, featuring complex cottage core designs. This bundle encapsulates the essence of a rambling English cottage garden.',
      shortDescription: 'Advanced embroidery bundle with cottage core designs.',
      categoryId: 'cat1', collectionId: 'col2', price: 7000, comparePrice: 9500,
      stockQuantity: 8, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.LIMITED, difficulty: DifficultyLevel.ADVANCED,
      featured: true, isHandmade: true, isSustainable: true, estimatedTime: '20 - 30 hours',
      materialsIncluded: ['3x Premium wooden hoops', '3x Pre-printed premium linen fabrics', 'DMC Cotton embroidery floss (24 colors)', 'Premium needle set', 'Detailed spiral-bound instruction book'],
      origin: 'Handmade in Bengaluru, India',
      images: [
        { url: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop', isPrimary: false, sortOrder: 1 },
      ],
      tagIds: ['tag-ltd', 'tag-hm', 'tag-sus'],
    },
    {
      id: 'prod-p4', name: 'Pure Linen Starter Fabric', slug: 'pure-linen-starter-fabric',
      description: 'Three half-yard cuts of our signature unbleached linen. Sourced from a multi-generational mill in Belgium, our linen offers the perfect tension and weave for precision embroidery.',
      shortDescription: 'Three half-yard cuts of premium unbleached linen.',
      categoryId: 'cat1', collectionId: 'col3', price: 2000, comparePrice: 2400,
      stockQuantity: 120, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      difficulty: DifficultyLevel.BEGINNER,
      featured: false, isHandmade: false, isSustainable: true, estimatedTime: 'N/A',
      materialsIncluded: ['3x Half-yard pure linen cuts (Oat, Sage, Natural)'],
      origin: 'Sourced from Belgium, packaged in India',
      images: [{ url: 'https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-sus'],
    },
    {
      id: 'prod-p5', name: 'Autumn Harvest Kit', slug: 'autumn-harvest-kit',
      description: 'Rich burgundies and golds bring this seasonal squash and leaf motif to life. This kit focuses on blending techniques to create realistic shading on leaves and gourds.',
      shortDescription: 'Seasonal embroidery kit with autumn tones.',
      categoryId: 'cat1', collectionId: 'col4', price: 3800, comparePrice: 4500,
      stockQuantity: 35, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.TRENDING, difficulty: DifficultyLevel.INTERMEDIATE,
      featured: false, isHandmade: true, isSustainable: false, estimatedTime: '8 - 10 hours',
      materialsIncluded: ['7" Beechwood hoop', 'Pre-printed cotton/linen blend', 'DMC Floss (12 colors)', '2x Needles', 'Color map and guide'],
      origin: 'Handmade in Bengaluru, India',
      images: [{ url: 'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-tr', 'tag-hm'],
    },
    {
      id: 'prod-p6', name: 'Minimalist Fern Pattern', slug: 'minimalist-fern-pattern',
      description: 'A striking, single-color fern design perfect for modern homes. Simplicity is the ultimate sophistication — relies entirely on variations of the backstitch.',
      shortDescription: 'Single-color fern embroidery pattern for beginners.',
      categoryId: 'cat1', collectionId: 'col1', price: 1200, comparePrice: 1500,
      stockQuantity: 999, status: ProductStatus.ACTIVE, type: ProductType.DIGITAL,
      difficulty: DifficultyLevel.BEGINNER,
      featured: false, isHandmade: false, isSustainable: true, estimatedTime: '2 - 3 hours',
      materialsIncluded: ['Downloadable PDF Pattern', 'Transfer guide'],
      origin: 'Digitally created in India',
      images: [{ url: 'https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-sus', 'tag-beg'],
    },
    {
      id: 'prod-p7', name: 'Wildflower Sanctuary Hoop', slug: 'wildflower-sanctuary-hoop',
      description: 'A meticulously hand-embroidered 8-inch hoop featuring a dense wildflower meadow. Over 40 hours of hand stitching. Each piece is individually crafted — no two are identical.',
      shortDescription: 'Heirloom hand-embroidered wildflower hoop, 40+ hours of work.',
      categoryId: 'cat7', collectionId: 'col1', price: 18000, comparePrice: 22000,
      stockQuantity: 3, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.LIMITED, difficulty: DifficultyLevel.ADVANCED,
      featured: true, isHandmade: true, isSustainable: true, isPersonalizable: true, estimatedTime: '40 hours',
      materialsIncluded: ['8" Walnut-stained hoop', 'Hand-embroidered linen art piece', 'Signed certificate of authenticity'],
      origin: 'Handcrafted in Bengaluru, India',
      images: [
        { url: 'https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop', isPrimary: false, sortOrder: 1 },
      ],
      tagIds: ['tag-ltd', 'tag-hm', 'tag-sus', 'tag-per'],
    },
    {
      id: 'prod-p8', name: 'Midnight Forest Hoop', slug: 'midnight-forest-hoop',
      description: 'A stunning night sky forest silhouette stitched in pure silk and metallic threads on charcoal Belgian linen. Delicate French knots and satin stitches using silk-blend threads.',
      shortDescription: 'Silk and metallic thread forest silhouette on Belgian linen.',
      categoryId: 'cat7', collectionId: 'col3', price: 22000, comparePrice: 26000,
      stockQuantity: 2, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.EDITORS_CHOICE, difficulty: DifficultyLevel.ADVANCED,
      featured: true, isHandmade: true, isSustainable: true, isPersonalizable: true, estimatedTime: '55 hours',
      materialsIncluded: ['10" Oak-stained hoop', 'Hand-stitched silk and linen artwork', 'Wall-mounting hardware'],
      origin: 'Handcrafted in Bengaluru, India',
      images: [
        { url: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=800&auto=format&fit=crop', isPrimary: false, sortOrder: 1 },
      ],
      tagIds: ['tag-ec', 'tag-hm', 'tag-sus', 'tag-per'],
    },
    {
      id: 'prod-p9', name: 'Boho Macramé Wall Hanging', slug: 'boho-macrame-wall-hanging',
      description: 'Handknotted cotton macramé wall art. Natural, organic, and endlessly elegant. Inspired by the earthy textures of Rajasthan, each piece is hand-knotted by our artisan collective.',
      shortDescription: 'Handknotted cotton macramé wall art.',
      categoryId: 'cat4', collectionId: 'col2', price: 4200, comparePrice: 5500,
      stockQuantity: 40, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.BEST_SELLER, difficulty: DifficultyLevel.BEGINNER,
      featured: true, isHandmade: true, isSustainable: true, estimatedTime: 'Ready to hang',
      materialsIncluded: ['Handknotted macramé piece', 'Driftwood rod', 'Hanging cord'],
      origin: 'Handknotted in Rajasthan, India',
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-bs', 'tag-hm', 'tag-sus'],
    },
    {
      id: 'prod-p10', name: 'Personalized Name Hoop', slug: 'personalized-name-hoop',
      description: 'A custom embroidered name hoop with floral accents. Each hoop is individually stitched with the recipient\'s name surrounded by hand-embroidered botanicals. A gift that lasts forever.',
      shortDescription: 'Custom embroidered name hoop with floral accents.',
      categoryId: 'cat7', collectionId: 'col1', price: 2800, comparePrice: 3500,
      stockQuantity: 25, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.NEW, difficulty: DifficultyLevel.BEGINNER,
      featured: false, isHandmade: true, isSustainable: false, isPersonalizable: true,
      estimatedTime: '5 - 7 business days',
      materialsIncluded: ['Custom 6" bamboo hoop', 'Personalized name embroidery', 'Floral botanical accents', 'Gift-ready packaging'],
      origin: 'Handcrafted to order in Bengaluru, India',
      images: [{ url: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-new', 'tag-hm', 'tag-per', 'tag-gft'],
    },
    {
      id: 'prod-p11', name: 'Crochet Sunset Flower Bunch', slug: 'crochet-sunset-flower-bunch',
      description: 'A bouquet of handcrafted crochet flowers that never wilt. Warm sunset colors that bring joy. Each flower is individually crafted using premium cotton yarn.',
      shortDescription: 'Handcrafted crochet flower bouquet in warm sunset tones.',
      categoryId: 'cat2', collectionId: 'col1', price: 1800, comparePrice: 2200,
      stockQuantity: 60, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.BEST_SELLER, difficulty: DifficultyLevel.BEGINNER,
      featured: false, isHandmade: true, isSustainable: true, estimatedTime: 'Ready to gift',
      materialsIncluded: ['12 crochet flowers', 'Natural raffia wrapping', 'Handwritten gift card'],
      origin: 'Handcrafted in Bengaluru, India',
      images: [{ url: 'https://images.unsplash.com/photo-1617896848219-aab8a02eed8c?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-bs', 'tag-hm', 'tag-sus', 'tag-gft'],
    },
    {
      id: 'prod-p12', name: 'Festival Gift Box', slug: 'festival-gift-box',
      description: 'A beautifully curated festive gift set including an embroidery kit, crochet flowers, and handmade decor. Designed to delight for Diwali, Eid, and Christmas.',
      shortDescription: 'Curated festive gift set with embroidery kit, crochet flowers, and decor.',
      categoryId: 'cat8', collectionId: 'col4', price: 5500, comparePrice: 7000,
      stockQuantity: 15, status: ProductStatus.ACTIVE, type: ProductType.PHYSICAL,
      badge: BadgeType.LIMITED, difficulty: DifficultyLevel.BEGINNER,
      featured: true, isHandmade: true, isSustainable: true, isPersonalizable: true,
      estimatedTime: 'Ready to gift',
      materialsIncluded: ['1x Mini embroidery kit', '6x Crochet flowers', '1x Lippan art coaster set', 'Handcrafted gift box'],
      origin: 'Curated and packaged in India',
      images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', isPrimary: true, sortOrder: 0 }],
      tagIds: ['tag-ltd', 'tag-hm', 'tag-sus', 'tag-per', 'tag-gft'],
    },
  ];

  for (const p of productSeeds) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id:               p.id,
        name:             p.name,
        slug:             p.slug,
        shortDescription: p.shortDescription,
        description:      p.description,
        categoryId:       p.categoryId,
        collectionId:     p.collectionId,
        price:            p.price,
        comparePrice:     p.comparePrice,
        stockQuantity:    p.stockQuantity,
        lowStockThreshold: 5,
        trackInventory:   true,
        status:           p.status,
        type:             p.type,
        badge:            p.badge,
        difficulty:       p.difficulty,
        featured:         p.featured,
        isHandmade:       p.isHandmade,
        isSustainable:    p.isSustainable,
        isPersonalizable: p.isPersonalizable ?? false,
        estimatedTime:    p.estimatedTime,
        materialsIncluded: p.materialsIncluded,
        materials:        [],
        origin:           p.origin,
        images: {
          create: p.images.map(img => ({
            url:       img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
        tags: {
          create: p.tagIds.map(tagId => ({ tagId })),
        },
      },
      update: {}, // Idempotent — skip updates on re-run
    });
    process.stdout.write(`  ✓ ${p.name}\n`);
  }

  console.log(`✅ ${productSeeds.length} products seeded`);
  console.log('🎉 Phase 3 seed complete.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
