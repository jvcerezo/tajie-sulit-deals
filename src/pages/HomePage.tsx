import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Flame,
  Search,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  Zap,
} from 'lucide-react';

import { useProducts } from '@/lib/storage';
import { VOUCHERS } from '@/data/vouchers';
import { COLLECTIONS } from '@/data/collections';
import type { Category, PriceFilterRange, Product, SortOption } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { VoucherCard } from '@/components/VoucherCard';
import { QuickViewModal } from '@/components/QuickViewModal';
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
  const [onlyGlitches, setOnlyGlitches] = useState(false);
  const [onlyTajiePicks, setOnlyTajiePicks] = useState(false);
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

      // Badges
      if (onlyGlitches && !item.isGlitchPrice) return false;
      if (onlyTajiePicks && item.badge !== "Tajie's Top Pick ⭐") return false;

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
  }, [searchQuery, selectedCategory, selectedPrice, sortOption, onlyGlitches, onlyTajiePicks]);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <SEO />

      {/* ------------------------------------------------------------ */}
      {/* 🚀 Hero Section & Live Deal Finder                          */}
      {/* ------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-slate-50 py-10 sm:py-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/70 px-3.5 py-1 text-xs font-black text-orange-900 shadow-2xs">
              <Flame className="h-3.5 w-3.5 text-orange-600 fill-orange-600" />
              <span>Tajie's Verified Shopee Vault</span>
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              <span className="text-orange-700">Updated Daily</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Shopee Budol Finds &
              <br />
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Secret Price Drops
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
              Curated viral tech gadgets, aesthetic desk setups, home upgrades, and exclusive 0% SPayLater & free shipping voucher codes.
            </p>

            {/* Instant Search Bar */}
            <div className="mt-6 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search mechanical keyboards, desk lamps, GaN chargers, mugs…"
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-lg shadow-orange-500/5 focus:border-orange-500 focus:outline-hidden focus:ring-4 focus:ring-orange-500/15 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 rounded-lg px-2 py-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold text-[0.6875rem]">Popular:</span>
                {[
                  { label: 'AULA F75', q: 'AULA' },
                  { label: 'Under ₱299', q: 'under ₱299' },
                  { label: 'Desk Lights', q: 'Monitor Light Bar' },
                  { label: 'Espresso', q: 'Espresso' },
                  { label: 'Glitches ⚡', q: 'Glitch' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSearchQuery(item.q)}
                    className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[0.6875rem] font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors cursor-pointer shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 🎟️ Active Shopee Vouchers Spotlight                         */}
      {/* ------------------------------------------------------------ */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-100 text-orange-600 font-black">
                <Ticket className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-black text-slate-900">Today's Shopee Voucher Codes</h2>
                <p className="text-xs text-slate-500">1-Click copy & apply in your Shopee App checkout</p>
              </div>
            </div>
            <Link
              to="/vouchers"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View all vouchers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VOUCHERS.slice(0, 4).map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 💻 Curated Themed Lookbooks                                  */}
      {/* ------------------------------------------------------------ */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-700 font-black">
                <Compass className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-black text-slate-900">Curated Setup Lookbooks</h2>
                <p className="text-xs text-slate-500">Complete itemized themes tested for aesthetic & value</p>
              </div>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore all lookbooks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs hover:shadow-lg hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{col.icon}</span>
                  <span className="rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-[0.625rem] font-bold text-orange-700">
                    {col.badge}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {col.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {col.tagline}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[0.6875rem] font-bold text-orange-600">
                  <span>{col.productIds.length} Curated Items</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 🛍️ Deal Feed & Multi-Filter Toolbar                         */}
      {/* ------------------------------------------------------------ */}
      <section className="py-10 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:text-slate-900'
                }`}
              >
                {cat === 'Viral TikTok' && '🔥 '}
                {cat}
              </button>
            ))}
          </div>

          {/* Filters & Sorting Sub-Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Price Filter Select */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                <span>Price:</span>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value as PriceFilterRange)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="under-299">Under ₱299 💸</option>
                  <option value="300-999">₱300 - ₱999</option>
                  <option value="1000-2499">₱1,000 - ₱2,499</option>
                  <option value="2500-plus">₱2,500+</option>
                </select>
              </div>

              {/* Quick Filter Toggles */}
              <button
                type="button"
                onClick={() => setOnlyTajiePicks(!onlyTajiePicks)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  onlyTajiePicks
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Tajie's Picks Only</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyGlitches(!onlyGlitches)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  onlyGlitches
                    ? 'bg-red-100 text-red-900 border border-red-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Zap className="h-3 w-3 text-red-600 fill-red-600" />
                <span>Glitch Prices Only</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 ml-auto">
              <span>Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="popular">Most Popular 🔥</option>
                <option value="discount-high">Biggest Discount %</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>
          </div>

          {/* Product Feed Grid */}
          {filteredProducts.length === 0 ? (
            <div className="mt-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <span className="text-3xl">🔍</span>
              <h3 className="mt-3 text-base font-bold text-slate-900">No matching deals found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try clearing your search query or adjusting your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedPrice('all');
                  setOnlyGlitches(false);
                  setOnlyTajiePicks(false);
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-semibold">
                <span>Showing <strong>{filteredProducts.length}</strong> vetted Shopee deals</span>
                <span>All prices in PHP (₱)</span>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
