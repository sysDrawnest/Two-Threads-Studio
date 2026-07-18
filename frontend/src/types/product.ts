export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
  ARCHIVED = 'ARCHIVED'
}

export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SERVICE = 'SERVICE',
  WORKSHOP = 'WORKSHOP',
  BUNDLE = 'BUNDLE'
}

export enum StudioProductType {
  EMBROIDERY_KIT = 'EMBROIDERY_KIT',
  DIY_KIT = 'DIY_KIT',
  DIGITAL_PATTERN = 'DIGITAL_PATTERN',
  FINISHED_HOOP = 'FINISHED_HOOP',
  HOME_DECOR = 'HOME_DECOR',
  ACCESSORY = 'ACCESSORY',
  FABRIC = 'FABRIC',
  WORKSHOP = 'WORKSHOP',
  GIFT_CARD = 'GIFT_CARD'
}

export enum HomepageSection {
  HERO = 'HERO',
  FEATURED = 'FEATURED',
  NEW_ARRIVALS = 'NEW_ARRIVALS',
  BEST_SELLERS = 'BEST_SELLERS',
  SEASONAL = 'SEASONAL',
  GIFTS = 'GIFTS',
  WORKSHOPS = 'WORKSHOPS',
  KITS = 'KITS',
  PATTERNS = 'PATTERNS',
  BUNDLES = 'BUNDLES'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  MODEL_3D = 'MODEL_3D',
  DOCUMENT = 'DOCUMENT'
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface ProductMedia {
  id: string;
  productId: string;
  type: MediaType;
  url: string;
  thumbnail?: string | null;
  altText?: string | null;
  caption?: string | null;
  sortOrder: number;
  isPrimary: boolean;
  width?: number | null;
  height?: number | null;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  sku?: string | null;
  priceAdjustment: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  bannerImage?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  sku?: string | null;
  categoryId: string;
  collectionId?: string | null;
  
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
  
  stockQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  
  status: ProductStatus;
  type: ProductType;
  difficulty?: DifficultyLevel | null;
  studioType?: StudioProductType | null;
  homepageSections: HomepageSection[];
  
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  isExclusive: boolean;
  isEcoFriendly: boolean;
  isDigitalDownload: boolean;
  
  publishedAt?: string | null;
  isVisible: boolean;
  sortOrder: number;
  
  subtitle?: string | null;
  productStory?: string | null;
  artisanNotes?: string | null;
  whatsIncluded?: string | null;
  barcode?: string | null;
  searchKeywords: string[];
  
  isHandmade: boolean;
  isSustainable: boolean;
  isCustomizable: boolean;
  isPersonalizable: boolean;
  madeToOrder: boolean;
  estimatedProductionDays?: number | null;
  estimatedShippingDays?: number | null;
  estimatedTime?: string | null;
  
  materials: string[];
  materialsIncluded: string[];
  technique?: string | null;
  careInstructions?: string | null;
  origin?: string | null;
  
  weight?: number | null;
  dimensions?: any;
  
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  robotsMeta?: string | null;
  
  allowBackorders: boolean;
  reservedQuantity: number;
  incomingQuantity: number;
  
  taxClass?: string | null;
  hsnCode?: string | null;
  gstPercent?: number | null;
  shippingClass?: string | null;
  isFreeShipping: boolean;
  isFragile: boolean;
  packageSize?: string | null;
  
  allowCod: boolean;
  salesCount: number;
  
  createdAt: string;
  updatedAt: string;

  // Relations
  category?: Category;
  collection?: Collection | null;
  media?: ProductMedia[];
  images?: any[]; // backward compat
  variants?: ProductVariant[];
  tags?: Tag[];
  
  // Computed fields added by service
  averageRating?: number | null;
  reviewCount?: number;
  wishlistCount?: number;
}
