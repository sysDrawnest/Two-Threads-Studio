import botanicalImg from '../assets/portrait_of_a_botanical_collection_for_a_luxur.png';
import heritageImg from '../assets/portrait_of_a_heritage_collection_for_a_luxury.png';
import minimalImg from '../assets/portrait_of_a_modern_minimal_collection_for_a_luxury.png';
import culturalImg from '../assets/portrait_of_personalized_portraits_for_a_luxur.png';
import weddingImg from '../assets/portrait_of_wedding_keepsakes_for_a_luxury_em.png';
import seasonalImg from '../assets/portrait_of_seasonal_editions_for_a_luxury_em.png';

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
    image: botanicalImg,
    badge: "BESTSELLER",
    featured: true
  },
  {
    id: "fc_heritage",
    slug: "heritage",
    title: "Heritage Collection",
    description: "Traditional Indian craftsmanship blended with contemporary interiors.",
    productsSummary: "Heritage embroidery, Folk-inspired designs, Artisan décor",
    image: heritageImg,
    badge: "NEW"
  },
  {
    id: "fc_minimal",
    slug: "modern-minimal",
    title: "Modern Minimal",
    description: "Simple geometric forms, neutral palettes and timeless aesthetics.",
    productsSummary: "Minimal hoops, Contemporary wall art, Clean interior accents",
    image: minimalImg
  },
  {
    id: "fc_cultural",
    slug: "cultural",
    title: "Cultural Collection",
    description: "Traditional Indian folk art, Lippan art hoops, and hand-embroidered regional motifs.",
    productsSummary: "Lippan art, Kutch work kits, Folk art hoops",
    image: culturalImg,
    badge: "EDITOR'S PICK"
  },
  {
    id: "fc_wedding",
    slug: "wedding-keepsakes",
    title: "Wedding Keepsakes",
    description: "Luxury handcrafted gifts celebrating weddings and anniversaries.",
    productsSummary: "Ring hoops, Wedding portraits, Personalized keepsakes",
    image: weddingImg,
    badge: "LIMITED",
    featured: true
  },
  {
    id: "fc_seasonal",
    slug: "seasonal-editions",
    title: "Seasonal Editions",
    description: "Limited seasonal releases available only during specific collections.",
    productsSummary: "Christmas, Autumn, Spring, Festival editions",
    image: seasonalImg,
    badge: "NEW"
  }
];
