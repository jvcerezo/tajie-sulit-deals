import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Search,
  Sparkles,
  Ticket,
  ChevronDown,
  ShieldCheck,
  Award,
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

const HOMEPAGE_FAQS = [
  {
    question: 'How are Shopee items curated on Tajie Studio?',
    answer:
      'Every product featured on Tajie Studio undergoes a strict vetting benchmark: 1) Star or Mall seller authentication to avoid counterfeits, 2) Sentiment analysis across thousands of verified customer reviews, 3) Physical acoustic and build quality testing for keyboards and desk lighting, and 4) Highest discount-to-price ratio in the Philippine market.',
  },
  {
    question: 'What is the best creamy sounding mechanical keyboard on Shopee under ₱2,500?',
    answer:
      'The AULA F75 Wireless Mechanical Keyboard (TTC Reaper Switches) is our highest-rated pre-built keyboard for 2026. With 5-layer sound dampening, a gasket-mount structure, and pre-lubed switches straight out of the box, it outperforms keyboards that cost three times as much.',
  },
  {
    question: 'How do I stack Shopee discount vouchers with ₱0 minimum spend free shipping?',
    answer:
      'In the Shopee App checkout screen, you can combine: 1) One Shopee Platform Mega Voucher (up to 15% OFF capped at ₱1,000), 2) One Free Shipping Voucher (₱0 Min. Spend), and 3) One Shop/Store Follower Voucher to achieve maximum combined savings.',
  },
  {
    question: 'Are all product links safe and direct to Shopee Philippines?',
    answer:
      'Yes. Every outbound link forwards directly to official Shopee Philippines listings with verified seller credentials, COD availability, and Shopee Guarantee return protection.',
  },
  {
    question: 'How often are Shopee voucher promo codes updated?',
    answer:
      'Our voucher hub is refreshed daily to capture midnight flash drops, Payday sales, Double Digit promotions (9.9, 10.10, 11.11, 12.12), and active 0% SPayLater merchant offers.',
  },
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
    <div className="bg-[#FAF9F6] min-h-screen text-[#141312] pb-24">
      <SEO
        title="Tajie Studio — Curated Shopee Budol Finds & Verified Tech Vault"
        description="The independent editorial authority on tested Shopee mechanical keyboards, minimalist WFH desk setups, home cafe tools, and verified discount promo vouchers in the Philippines."
        products={products}
        faqs={HOMEPAGE_FAQS}
        breadcrumbs={[
          { name: 'Home', item: 'https://tajiedeals.vercel.app/' },
          { name: 'Curated Catalog', item: 'https://tajiedeals.vercel.app/#all-finds' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Luxury Hero Header */}
        <header className="relative border-b border-[#E8E6E1] pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E8E6E1] px-3.5 py-1 text-[0.625rem] font-semibold uppercase tracking-widest text-neutral-600 shadow-2xs font-sans mb-4">
                <Award className="h-3 w-3 text-[#B89358]" />
                <span>Independent Shopee Testing & Curation</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141312] leading-[1.1]">
                The Independent Guide to <br className="hidden sm:block" />
                <span className="italic font-normal text-[#9B381E]">Shopee Excellence.</span>
              </h1>
              <p className="mt-4 text-xs sm:text-sm md:text-base text-neutral-600 max-w-2xl leading-relaxed font-sans font-normal">
                Rigorous testing of pre-built mechanical keyboards, ergonomic workspace fixtures, and home cafe gear. Verified Star & Mall merchant links, real acoustic recordings, and zero low-grade clones.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-[#E8E6E1] p-3 shadow-2xs">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="text-[0.6875rem] font-sans">
                  <strong className="block text-[#141312] font-semibold">100% Mall & Star Verified</strong>
                  <span className="text-neutral-500">Official Shopee Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 1. Interactive Concierge Engine */}
        <section id="matchmaker">
          <CozyMatchmaker onProductClick={(p) => setQuickViewProduct(p)} />
        </section>

        {/* 2. Curated Themed Lookbooks Showcase */}
        <section aria-labelledby="lookbooks-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8E6E1] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#9B381E]" />
                <h2 id="lookbooks-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#141312] tracking-tight">
                  Curated Themed Lookbooks
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Complete aesthetic setups tested for spatial harmony and acoustic synergy.
              </p>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#141312] hover:text-[#9B381E] transition-colors font-sans"
            >
              <span>Explore all lookbooks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTIONS.slice(0, 3).map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-[#E8E6E1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#141312]/20 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <img
                    src={col.bannerImage}
                    alt={`${col.title} lookbook on Shopee`}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="rounded-full bg-white/20 backdrop-blur-md text-white text-[0.5625rem] font-semibold uppercase tracking-wider px-2 py-0.5 border border-white/20">
                      {col.productIds.length} Verified Pieces
                    </span>
                    <h3 className="mt-1 font-serif text-base sm:text-lg font-bold leading-snug">{col.title}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-sans">
                    {col.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-[#141312] group-hover:text-[#9B381E] transition-colors">
                      View Lookbook Dossier →
                    </span>
                    <span className="text-[0.625rem] text-neutral-400 font-medium uppercase tracking-wider">{col.tagline}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Full Curated Vault */}
        <section id="all-finds" aria-labelledby="catalog-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6E1] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B89358]" />
                <h2 id="catalog-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#141312] tracking-tight">
                  The Curated Catalog
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Every listing is individually benchmarked for acoustic profile, durability, and seller reputation.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keyboards, light bars, coffee gear..."
                className="w-full rounded-full bg-white border border-[#E8E6E1] py-2 pl-9 pr-4 text-xs font-medium text-[#141312] placeholder:text-neutral-400 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#141312]"
              />
            </div>
          </div>

          {/* Category Tabs & Quick Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#141312] text-white shadow-xs'
                      : 'bg-white border border-[#E8E6E1] text-neutral-600 hover:text-[#141312] hover:bg-neutral-50'
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
                className="rounded-full bg-white border border-[#E8E6E1] px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#141312] cursor-pointer"
              >
                <option value="popular">🔥 Most Verified Orders</option>
                <option value="discount-high">⚡ Highest Discount</option>
                <option value="price-low">💸 Valuation: Low to High</option>
                <option value="price-high">👑 Valuation: High to Low</option>
                <option value="rating">⭐ Highest Review Sentiment</option>
                <option value="newest">✨ Newly Benchmarked</option>
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
            <div className="text-center py-16 rounded-3xl bg-white border border-[#E8E6E1] p-8">
              <Sparkles className="mx-auto h-8 w-8 text-neutral-400" />
              <h3 className="mt-3 text-sm font-semibold text-neutral-800 font-sans">No matching items in active catalog</h3>
              <p className="mt-1 text-xs text-neutral-500 font-sans">
                Try loosening your search keywords or resetting the category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedPrice('all');
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#141312] text-white text-xs font-semibold px-4 py-2 hover:bg-[#262524] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* 4. Shopee Voucher Promo Tray */}
        <section id="vouchers" aria-labelledby="vouchers-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8E6E1] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-[#9B381E]" />
                <h2 id="vouchers-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#141312] tracking-tight">
                  Active Shopee Promo Codes & Vouchers
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Stackable at checkout for up to 15% instant reduction on verified orders.
              </p>
            </div>
            <Link
              to="/vouchers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#141312] hover:text-[#9B381E] transition-colors font-sans"
            >
              <span>View all active codes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VOUCHERS.slice(0, 4).map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </section>

        {/* 5. SEO Editorial FAQ Section (Google Rich Result Booster) */}
        <section aria-labelledby="faq-heading" className="border-t border-[#E8E6E1] pt-12 space-y-6">
          <div className="max-w-2xl">
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#B89358] font-sans">
              Frequently Asked Questions
            </span>
            <h2 id="faq-heading" className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#141312] tracking-tight">
              Shopee Curation & Voucher Guide
            </h2>
            <p className="mt-1 text-xs text-neutral-500 font-sans">
              Key insights into our testing protocols, voucher stacking methods, and affiliate transparency.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl font-sans">
            {HOMEPAGE_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8E6E1] bg-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9F6] transition-colors"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#141312]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#141312]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 bg-[#FAF9F6]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
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
