import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Search,
  Sparkles,
  Ticket,
} from 'lucide-react';

import { useProducts } from '@/lib/storage';
import { VOUCHERS } from '@/data/vouchers';
import { COLLECTIONS } from '@/data/collections';
import type { Category, PriceFilterRange, Product, SortOption } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { VoucherCard } from '@/components/VoucherCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CozyMatchmaker } from '@/components/CozyMatchmaker';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';

const CATEGORIES: Category[] = [
  'All',
  'Tech & Setup',
  'Home & Living',
  'Kitchen & Coffee',
  'Fashion & Accessories',
  'Viral TikTok',
];

export function HomePage() {
  const products = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';
  const initialPrice = (searchParams.get('price') as PriceFilterRange) || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState<PriceFilterRange>(initialPrice);
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTagline = item.tagline.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTagline && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Viral TikTok' && !item.isTikTokViral) return false;
        if (selectedCategory !== 'Viral TikTok' && item.category !== selectedCategory) {
          return false;
        }
      }

      // Price Filter
      if (selectedPrice === 'under-299' && item.price > 299) return false;
      if (selectedPrice === '300-999' && (item.price < 300 || item.price > 999)) return false;
      if (selectedPrice === '1000-2499' && (item.price < 1000 || item.price > 2499)) return false;
      if (selectedPrice === '2500-plus' && item.price < 2500) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'popular') {
        return b.reviewCount - a.reviewCount;
      }
      if (sortOption === 'discount-high') {
        return b.discountPercentage - a.discountPercentage;
      }
      if (sortOption === 'price-low') {
        return a.price - b.price;
      }
      if (sortOption === 'price-high') {
        return b.price - a.price;
      }
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      }
      if (sortOption === 'newest') {
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedPrice, sortOption]);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-stone-900 pb-20">
      <SEO
        title="Tajie's Sulit Deals — Curated Tech & Aesthetic Shopee Finds"
        description="Handpicked Shopee budol finds, viral TikTok tech, cozy home cafe gear, and tested discount codes curated by Tajie."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Creator Intro Greeting */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-white/80 border border-stone-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-tr from-[#C8522C] to-amber-500 p-1 shadow-md">
                <div className="h-full w-full rounded-full bg-[#FAF7F2] grid place-items-center font-extrabold text-xl sm:text-2xl text-[#C8522C]">
                  TJ
                </div>
              </div>
              <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white grid place-items-center text-[0.5625rem] text-white" title="Verified Creator">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  Tajie's Cozy Budol Vault
                </h1>
                <span className="rounded-full bg-amber-100 text-amber-900 text-[0.625rem] font-extrabold px-2 py-0.5 border border-amber-300">
                  Shopee Creator
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                "I spend hours testing keyboards, desk lighting, and coffee gear so you don't end up wasting money on low-quality clones. Everything here is 100% verified."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/bio"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-4 py-2 transition-colors"
            >
              <span>TikTok Bio Mode</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 1. Primary Feature: Interactive Matchmaker */}
        <section id="matchmaker">
          <CozyMatchmaker onProductClick={(p) => setQuickViewProduct(p)} />
        </section>

        {/* 2. Curated Lookbooks Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#C8522C]" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  Curated Aesthetic Lookbooks
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Complete aesthetic setups hand-assembled to save you time and research.
              </p>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C8522C] hover:text-[#B34420] transition-colors"
            >
              <span>View all lookbooks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTIONS.slice(0, 3).map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="group relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                  <img
                    src={col.bannerImage}
                    alt={col.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="rounded-full bg-white/20 backdrop-blur-xs text-white text-[0.625rem] font-bold px-2 py-0.5 border border-white/30">
                      {col.productIds.length} Handpicked Items
                    </span>
                    <h3 className="mt-1 text-base font-bold leading-snug">{col.title}</h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C8522C]">Explore Setup →</span>
                    <span className="text-[0.6875rem] text-stone-400 font-semibold">{col.tagline}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Full Curated Vault */}
        <section id="all-finds" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  The Full Budol Vault
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Search or filter through all individually tested and verified Shopee links.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keyboard, light bar, coffee gear..."
                className="w-full rounded-2xl bg-white border border-stone-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#C8522C]"
              />
            </div>
          </div>

          {/* Category Tabs & Quick Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Quick Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                aria-label="Sort products by"
                className="rounded-full bg-white border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#C8522C] cursor-pointer"
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="discount-high">⚡ Highest Discount</option>
                <option value="price-low">💸 Price: Low to High</option>
                <option value="price-high">👑 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="newest">✨ Newly Added</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl bg-white border border-stone-200/90 p-8">
              <Sparkles className="mx-auto h-8 w-8 text-stone-400" />
              <h3 className="mt-3 text-base font-bold text-stone-800">No matching finds found</h3>
              <p className="mt-1 text-xs text-stone-500">
                Try loosening your search term or resetting the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedPrice('all');
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold px-4 py-2 hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* 4. Shopee Voucher Promo Tray */}
        <section id="vouchers" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-[#C8522C]" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  Today's Active Shopee Vouchers
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                Stack these at checkout to slash up to 15% OFF your cart.
              </p>
            </div>
            <Link
              to="/vouchers"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C8522C] hover:text-[#B34420] transition-colors"
            >
              <span>All voucher codes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VOUCHERS.slice(0, 4).map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
