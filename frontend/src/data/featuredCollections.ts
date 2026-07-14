export interface FeaturedCollection {
  id: string;
  slug: string;
  title: string;
  description: string;
  productsSummary: string;
  image: string;
  badge?: "NEW" | "LIMITED" | "BESTSELLER" | "EDITOR'S PICK";
  featured?: boolean;
}

export const featuredCollections: FeaturedCollection[] = [
  {
    id: "fc_botanical",
    slug: "botanical",
    title: "Botanical Collection",
    description: "Inspired by wildflowers, leaves, forests and slow botanical illustrations.",
    productsSummary: "Floral embroidery kits, Botanical hoops, Nature inspired décor",
    image: "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
    badge: "BESTSELLER",
    featured: true
  },
  {
    id: "fc_heritage",
    slug: "heritage",
    title: "Heritage Collection",
    description: "Traditional Indian craftsmanship blended with contemporary interiors.",
    productsSummary: "Heritage embroidery, Folk-inspired designs, Artisan décor",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop",
    badge: "NEW"
  },
  {
    id: "fc_minimal",
    slug: "modern-minimal",
    title: "Modern Minimal",
    description: "Simple geometric forms, neutral palettes and timeless aesthetics.",
    productsSummary: "Minimal hoops, Contemporary wall art, Clean interior accents",
    image: "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "fc_portraits",
    slug: "personalized-portraits",
    title: "Personalized Portraits",
    description: "Custom embroidered artwork made from customer memories.",
    productsSummary: "Couple portraits, Family portraits, Pet portraits",
    image: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=800&auto=format&fit=crop",
    badge: "EDITOR'S PICK"
  },
  {
    id: "fc_wedding",
    slug: "wedding-keepsakes",
    title: "Wedding Keepsakes",
    description: "Luxury handcrafted gifts celebrating weddings and anniversaries.",
    productsSummary: "Ring hoops, Wedding portraits, Personalized keepsakes",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    badge: "LIMITED",
    featured: true
  },
  {
    id: "fc_seasonal",
    slug: "seasonal-editions",
    title: "Seasonal Editions",
    description: "Limited seasonal releases available only during specific collections.",
    productsSummary: "Christmas, Autumn, Spring, Festival editions",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    badge: "NEW"
  }
];
