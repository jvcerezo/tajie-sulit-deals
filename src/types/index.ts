export type Category =
  | 'All'
  | 'Tech & Setup'
  | 'Home & Living'
  | 'Kitchen & Coffee'
  | 'Fashion & Accessories'
  | 'Grooming & Personal Care'
  | 'Viral TikTok';

export type ProductBadge =
  | "Tajie's Top Pick ⭐"
  | 'Glitch Price ⚡'
  | 'TikTok Viral 🔥'
  | 'Under ₱299 💸'
  | 'Shopee Choice 🏆'
  | 'Best Seller 🚀';

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  salesCount: string;
  category: Category;
  subCategory?: string;
  tags: string[];
  image: string;
  gallery?: string[];
  shopeeUrl: string;
  affiliateUrl: string;
  featured?: boolean;
  isTikTokViral?: boolean;
  isGlitchPrice?: boolean;
  badge?: ProductBadge;
  reviewQuote?: string;
  pros?: string[];
  theCatch?: string; // Honest drawback/caveat
  specs?: Record<string, string>;
  keyFeatures?: string[];
  sellerBadge?: 'Shopee Mall' | 'Shopee Star+' | 'Shopee Star';
  addedDate: string;
  clicksCount?: number;
  rank?: number;
  rankRole?: string;
  whyRanked?: string;
  bestFor?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minSpend: string;
  cap?: string;
  expiresAt: string;
  category: 'Mega Discount' | 'Free Shipping' | 'SpayLater' | 'Store Special';
  shopeeClaimUrl: string;
  isHot?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bannerImage: string;
  icon: string;
  badge: string;
  productIds: string[];
}

export type SortOption =
  | 'popular'
  | 'discount-high'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'newest';

export type PriceFilterRange = 'all' | 'under-299' | '300-999' | '1000-2499' | '2500-plus';
