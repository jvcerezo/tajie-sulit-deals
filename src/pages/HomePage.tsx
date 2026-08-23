import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Heart,
  Laptop,
  Coffee,
  Sparkles,
  PiggyBank,
  ShieldCheck,
  Star,
  Award,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types';
import { formatPHP } from '@/lib/format';
import { trackAffiliateClick } from '@/lib/analytics';
import { useWishlist, toggleWishlist } from '@/lib/storage';
import { SEO } from '@/components/SEO';
import { QuickViewModal } from '@/components/QuickViewModal';

interface CategoryTab {
  id: string;
  name: string;
  subtitle: string;
  icon: typeof Laptop;
  filterFn: (p: Product) => boolean;
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    id: 'desk',
    name: 'Top 5 Desk & Setup',
    subtitle: 'Mechanical keyboards, lighting & workspace ergonomics',
    icon: Laptop,
    filterFn: (p) => p.category === 'Tech & Setup',
  },
  {
    id: 'coffee',
    name: 'Top 5 Home Cafe & Coffee',
    subtitle: 'Precision grinders, portable espresso & barista gear',
    icon: Coffee,
    filterFn: (p) => p.category === 'Kitchen & Coffee',
  },
  {
    id: 'living',
    name: 'Top 5 Room & Lifestyle',
    subtitle: 'Aroma diffusers, orthopedic cushions & ambient lights',
    icon: Sparkles,
    filterFn: (p) => p.category === 'Home & Living',
  },
  {
    id: 'under300',
    name: 'Top 5 Sub-₱300 Hidden Gems',
    subtitle: 'Dangerously cheap items with 5x perceived quality',
    icon: PiggyBank,
    filterFn: (p) => (p.price <= 300 && p.tags.includes('Under ₱299 💸')) || p.id.includes('sub300'),
  },
];

const HOMEPAGE_FAQS = [
  {
    question: 'Why only 5 products per category?',
    answer:
      'Online shopping is broken because marketplaces force you to scroll through hundreds of fake reviews and counterfeit clones. We eliminate decision fatigue by testing and handpicking only the undisputed Top 5 benchmark products in each category.',
  },
  {
    question: 'What makes the #1 ranked item win in each category?',
    answer:
      'Our #1 overall pick represents the highest acoustic/build benchmark, lowest failure rate, and best overall user sentiment across verified Shopee Star/Mall merchants.',
  },
  {
    question: 'How do I stack Shopee discount vouchers with free shipping?',
    answer:
      'In the Shopee App checkout screen, combine 1 Shopee Platform Mega Voucher (up to 15% OFF) + 1 Free Shipping Voucher (₱0 Min. Spend) + 1 Shop Follower Voucher to achieve maximum combined savings.',
  },
  {
    question: 'Are all links direct to verified Shopee merchants?',
    answer:
      'Yes. Every single outbound link routes straight to official Shopee Philippines Star or Mall sellers with active COD, official return policies, and Shopee Guarantee protection.',
  },
];

export function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('desk');
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const wishlist = useWishlist();

  const currentTab = CATEGORY_TABS.find((t) => t.id === activeTab) ?? CATEGORY_TABS[0];

  // Exactly Top 5 ranked products for the selected category
  const top5Products = useMemo(() => {
    return PRODUCTS.filter(currentTab.filterFn)
      .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
      .slice(0, 5);
  }, [currentTab]);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#141312] pb-24 font-sans">
      <SEO
        title="Tajie Studio — Top 5 Handpicked Shopee Finds (Zero Bloat)"
        description="Stop doom-scrolling 500 Shopee pages. We test and rank the definitive Top 5 mechanical keyboards, desk setups, home cafe tools, and under-₱300 hidden gems."
        products={PRODUCTS}
        faqs={HOMEPAGE_FAQS}
        breadcrumbs={[
          { name: 'Home', item: 'https://tajiedeals.vercel.app/' },
          { name: currentTab.name, item: `https://tajiedeals.vercel.app/#${currentTab.id}` },
        ]}
      />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Streamlined Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E8E6E1] px-4 py-1 text-[0.6875rem] font-semibold tracking-wider uppercase text-neutral-600 shadow-2xs">
            <Award className="h-3.5 w-3.5 text-[#B89358]" />
            <span>The Anti-Doomscroll Shopee Guide</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312] leading-[1.15]">
            Only the <span className="italic font-normal text-[#9B381E]">Top 5</span> in Every Category. <br className="hidden sm:block" />
            Pick in 30 Seconds.
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Online shopping has become an endless scroll of 10,000 low-quality clones. We test, filter, and rank the exact <strong>5 best pieces</strong> worth your money. Zero fluff.
          </p>

          {/* Quick Active Voucher Banner */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-white border border-[#E8E6E1] p-2 sm:px-4 sm:py-2 text-xs shadow-2xs">
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <Ticket className="h-3.5 w-3.5 text-[#9B381E]" />
              <span>Today's Voucher:</span>
              <strong className="text-[#141312] font-mono bg-neutral-100 px-1.5 py-0.5 rounded">
                MEGA15OFF
              </strong>
            </div>
            <button
              type="button"
              onClick={() => handleCopyVoucher('MEGA15OFF')}
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[0.6875rem] font-semibold transition-colors cursor-pointer ${
                copiedVoucher === 'MEGA15OFF'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#141312] hover:bg-[#262524] text-white'
              }`}
            >
              {copiedVoucher === 'MEGA15OFF' ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* 1. Category Switcher (The Control Center) */}
        <section aria-label="Select Top 5 Category" className="sticky top-20 z-30 bg-[#FAF9F6]/95 backdrop-blur-md py-2 border-b border-[#E8E6E1]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#141312] text-white border-[#141312] shadow-md'
                      : 'bg-white text-neutral-800 border-[#E8E6E1] hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#B89358]' : 'text-neutral-500'}`} />
                    {isActive && (
                      <span className="text-[0.5625rem] font-bold uppercase tracking-widest bg-white/20 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs leading-snug">{tab.name}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. The Ranked Top 5 Cards Stack */}
        <section aria-label={currentTab.name} className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#E8E6E1] pb-3">
            <div>
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#B89358]">
                Ranked & Tested by Tajie
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141312]">
                {currentTab.name}
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              5 of 5 Selected
            </span>
          </div>

          <div className="space-y-4">
            {top5Products.map((product, idx) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <article
                  key={product.id}
                  className="group relative rounded-3xl bg-white border border-[#E8E6E1] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] hover:border-[#141312]/30 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* Rank Number Badge */}
                  <div className="shrink-0 flex md:flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-2xl bg-[#141312] text-[#FAF9F6] grid place-items-center font-serif font-bold text-xl shadow-xs">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  <div
                    onClick={() => setQuickViewProduct(product)}
                    className="relative aspect-square w-full md:w-36 shrink-0 rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer border border-[#E8E6E1]"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-2 left-2 rounded-md bg-[#9B381E] text-white text-[0.5625rem] font-bold px-1.5 py-0.5">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Product Details & Editorial Verdict */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-neutral-100 text-[#141312] px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider border border-neutral-200">
                        {product.rankRole ?? `#${idx + 1} Selected`}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-neutral-600">
                        <Star className="h-3 w-3 fill-[#B89358] text-[#B89358]" />
                        <span className="font-semibold text-neutral-900">{product.rating}</span>
                        <span className="text-neutral-400">({product.salesCount})</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[0.5625rem] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        <ShieldCheck className="h-3 w-3" /> Shopee Star/Mall
                      </span>
                    </div>

                    <h3
                      onClick={() => setQuickViewProduct(product)}
                      className="font-serif text-base sm:text-lg font-bold text-[#141312] leading-snug cursor-pointer hover:text-[#9B381E] transition-colors"
                    >
                      {product.title}
                    </h3>

                    {/* Why Ranked & Who It's For */}
                    <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {product.whyRanked && (
                        <div className="rounded-xl bg-[#FAF9F6] p-2.5 border border-[#E8E6E1]">
                          <strong className="block text-[0.5625rem] uppercase tracking-wider text-[#9B381E] font-semibold mb-0.5">
                            Why it made the Top 5:
                          </strong>
                          <span className="text-neutral-700 leading-snug">{product.whyRanked}</span>
                        </div>
                      )}
                      {product.bestFor && (
                        <div className="rounded-xl bg-[#FAF9F6] p-2.5 border border-[#E8E6E1]">
                          <strong className="block text-[0.5625rem] uppercase tracking-wider text-neutral-500 font-semibold mb-0.5">
                            Best for:
                          </strong>
                          <span className="text-neutral-700 leading-snug">{product.bestFor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Primary Call to Action */}
                  <div className="w-full md:w-44 shrink-0 flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    <div className="text-left md:text-right">
                      <div className="flex items-baseline gap-1.5 md:justify-end">
                        <span className="font-bold text-lg sm:text-xl text-[#141312]">
                          {formatPHP(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPHP(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[0.625rem] text-neutral-400 block">
                        Verified Shopee price
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-auto md:w-full">
                      <a
                        href={`/go/${product.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackAffiliateClick(product.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-[#141312] hover:bg-[#262524] text-white text-xs font-semibold py-2.5 px-4 shadow-xs transition-transform hover:scale-[1.01] cursor-pointer"
                      >
                        <span>Check Shopee</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className={`h-9 w-9 rounded-xl border grid place-items-center transition-colors cursor-pointer shrink-0 ${
                          isWishlisted
                            ? 'border-rose-300 bg-rose-50 text-rose-600'
                            : 'border-neutral-200 bg-white text-neutral-500 hover:text-rose-600'
                        }`}
                        title={isWishlisted ? 'Remove from bag' : 'Save to bag'}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. The 30-Second Decision Matrix (Comparison Table) */}
        <section aria-labelledby="matrix-heading" className="rounded-3xl bg-white border border-[#E8E6E1] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#B89358]">
              Decision Matrix
            </span>
            <h3 id="matrix-heading" className="font-serif text-xl sm:text-2xl font-bold text-[#141312]">
              Compare All 5 at a Glance
            </h3>
            <p className="text-xs text-neutral-500">
              Pick the exact match that fits your space and budget in seconds.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E6E1] text-[0.6875rem] uppercase tracking-wider text-neutral-400">
                  <th className="py-2.5 pr-3 font-semibold">Rank</th>
                  <th className="py-2.5 px-3 font-semibold">Product</th>
                  <th className="py-2.5 px-3 font-semibold">Price</th>
                  <th className="py-2.5 px-3 font-semibold">Best For</th>
                  <th className="py-2.5 pl-3 font-semibold text-right">Direct Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]/60">
                {top5Products.map((p, i) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 pr-3 font-serif font-bold text-[#141312]">
                      #{i + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-neutral-900 max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#141312] whitespace-nowrap">
                      {formatPHP(p.price)}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 text-[0.6875rem]">
                      {p.bestFor ?? p.tagline}
                    </td>
                    <td className="py-3 pl-3 text-right whitespace-nowrap">
                      <a
                        href={`/go/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackAffiliateClick(p.id)}
                        className="inline-flex items-center gap-1 font-semibold text-[#9B381E] hover:underline"
                      >
                        <span>Shopee ↗</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. SEO Editorial FAQ Section (Google Rich Snippets) */}
        <section aria-labelledby="faq-heading" className="border-t border-[#E8E6E1] pt-12 space-y-6">
          <div className="max-w-2xl">
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#B89358]">
              Frequently Asked Questions
            </span>
            <h2 id="faq-heading" className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-[#141312] tracking-tight">
              Shopee Curation & Voucher Guide
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Key insights into our testing protocols, voucher stacking methods, and affiliate transparency.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
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
