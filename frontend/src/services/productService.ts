import { Product, Category } from '../data/products';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

/** Helper to map API products to frontend Product interface */
export function mapApiProductToFrontend(apiProd: any): Product {
  // Convert pricing from string (Decimal) to number
  const price = typeof apiProd.price === 'string' ? parseFloat(apiProd.price) : Number(apiProd.price || 0);
  const mrp = apiProd.comparePrice 
    ? (typeof apiProd.comparePrice === 'string' ? parseFloat(apiProd.comparePrice) : Number(apiProd.comparePrice))
    : undefined;

  // Map difficulty level capitalization
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  if (apiProd.difficulty) {
    const diff = apiProd.difficulty.toLowerCase();
    if (diff === 'intermediate') difficulty = 'Intermediate';
    else if (diff === 'advanced') difficulty = 'Advanced';
  }

  // Map badge capitalization
  let badge: Product['badge'] = undefined;
  if (apiProd.badge) {
    const b = apiProd.badge.toLowerCase();
    if (b === 'new') badge = 'New';
    else if (b === 'best_seller') badge = 'Best Seller';
    else if (b === 'limited') badge = 'Limited';
    else if (b === 'editors_choice') badge = "Editor's Choice";
    else if (b === 'trending') badge = 'Trending';
  }

  // Map stock status
  let stock: Product['stock'] = 'In Stock';
  if (apiProd.status === 'OUT_OF_STOCK' || apiProd.stockQuantity <= 0) {
    stock = 'Out of Stock';
  } else if (apiProd.stockQuantity <= (apiProd.lowStockThreshold || 5)) {
    stock = 'Low Stock';
  }

  // Map images
  let images: string[] = [];
  if (Array.isArray(apiProd.images)) {
    images = apiProd.images.map((img: any) => img.url);
  }
  // Fallback to primary image URL if list is empty
  if (images.length === 0 && apiProd.imageUrl) {
    images = [apiProd.imageUrl];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop'];
  }

  // Map reviews
  const reviews = Array.isArray(apiProd.reviews) ? apiProd.reviews.map((rev: any) => ({
    id: rev.id,
    author: `${rev.user?.firstName || 'Anonymous'} ${rev.user?.lastName || ''}`.trim(),
    avatar: rev.user?.avatarUrl || undefined,
    rating: rev.rating,
    text: rev.comment,
    date: new Date(rev.createdAt).toLocaleDateString(),
    verified: true
  })) : [];

  // Compute rating and reviewCount
  const reviewCount = apiProd.reviewCount !== undefined ? apiProd.reviewCount : reviews.length;
  let rating = 0;
  if (reviews.length > 0) {
    rating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
  } else if (apiProd.rating !== undefined) {
    rating = apiProd.rating;
  } else {
    rating = 4.8; // Default fallback rating if none
  }

  // Category and Product Category mappings
  const categoryName = apiProd.category?.name || 'Kit';
  
  return {
    id: apiProd.slug || apiProd.id,
    name: apiProd.name,
    price,
    mrp,
    category: categoryName as any,
    productCategory: apiProd.category?.name as any,
    collection: (apiProd.collection?.name || 'Botanical') as any,
    difficulty,
    badge,
    images,
    description: apiProd.description || '',
    story: apiProd.shortDescription || apiProd.description || '',
    materialsIncluded: apiProd.materialsIncluded || [],
    estimatedTime: apiProd.estimatedTime || 'Self-paced',
    reviews,
    rating,
    reviewCount,
    stock,
    isPersonalizable: apiProd.isPersonalizable || false,
    isHandmade: apiProd.isHandmade ?? true,
    isSustainable: apiProd.isSustainable || false,
  };
}

export const productService = {
  /**
   * Get all products with filters
   */
  getProducts: async (filters: {
    category?: string;
    collection?: string;
    tag?: string;
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ products: Product[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.collection) params.append('collection', filters.collection);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch products');
    }

    const { products, total } = result.data;
    return {
      products: products.map(mapApiProductToFrontend),
      total
    };
  },

  /**
   * Get a single product by slug
   */
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Product not found');
    }

    return mapApiProductToFrontend(result.data.product);
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }

    const result = await response.json();
    return (result.data.products || []).map(mapApiProductToFrontend);
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/new-arrivals`);
    if (!response.ok) {
      throw new Error('Failed to fetch new arrivals');
    }

    const result = await response.json();
    return (result.data.products || []).map(mapApiProductToFrontend);
  },

  /**
   * Get best sellers
   */
  getBestSellers: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/best-sellers`);
    if (!response.ok) {
      throw new Error('Failed to fetch best sellers');
    }

    const result = await response.json();
    return (result.data.products || []).map(mapApiProductToFrontend);
  },

  /**
   * Get categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const result = await response.json();
    return (result.data.categories || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image || '',
      count: c._count?.products || 0,
      featured: c.isActive
    }));
  }
};
