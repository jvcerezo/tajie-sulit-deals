import { useMemo, useState } from 'react';
import {
  Check,
  Globe,
  Search,
  Share2,
  Star,
  Ticket,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { useProducts } from '@/lib/storage';
import { trackAffiliateClick } from '@/lib/analytics';
import { formatPHP } from '@/lib/format';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';

export function LinkInBioPage() {
  const products = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTagline = p.tagline.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesTags) return false;
      }
      if (selectedTag) {
        if (selectedTag === 'Viral' && !p.isTikTokViral) return false;
        if (selectedTag === 'Glitches' && !p.isGlitchPrice) return false;
        if (selectedTag === 'Under ₱299' && p.price > 299) return false;
      }
      return true;
    });
  }, [products, searchQuery, selectedTag]);

  const handleShareBio = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    confetti({
      particleCount: 25,
      spread: 50,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#141312] pb-20 pt-8 px-4 text-[#FAF9F6] font-sans">
      <SEO
        title="Tajie Studio Links | TikTok & Instagram Curated Vault"
        description="Direct Shopee product deep links from Tajie Studio TikTok and Instagram showcases. 100% verified Mall & Star merchants."
      />

      <div className="max-w-md mx-auto">
        {/* Profile Card Header */}
        <div className="relative rounded-3xl bg-[#1E1C1A] p-6 text-center shadow-2xl border border-neutral-800">
          <button
            type="button"
            onClick={handleShareBio}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 grid place-items-center text-neutral-300 hover:bg-white/20 transition-colors cursor-pointer"
            title="Share profile link"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
          </button>

          {/* Monogram Avatar */}
          <div className="mx-auto h-20 w-20 rounded-2xl bg-white text-[#141312] grid place-items-center font-serif font-bold text-3xl shadow-xl">
            T
          </div>

          <h1 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-1.5">
            Tajie <span className="font-normal italic text-neutral-400">Studio</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B89358]">
            @tajiedeals · Verified Shopee Curator
          </p>
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
            Direct verified Shopee deep links featured in our TikTok reviews. Tap any piece to jump straight to the merchant.
          </p>

          {/* Quick Buttons */}
          <div className="mt-4 flex items-center justify-center gap-2 pt-3 border-t border-neutral-800">
            <a
              href="https://shopee.ph/m/vouchers"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-[#B89358]/20 text-[#B89358] border border-[#B89358]/40 px-3 py-1 text-xs font-semibold hover:bg-[#B89358]/30 transition-colors"
            >
              <Ticket className="h-3 w-3" />
              <span>Shopee Vouchers</span>
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-full bg-white/10 text-neutral-200 px-3 py-1 text-xs font-semibold hover:bg-white/20 transition-colors"
            >
              <Globe className="h-3 w-3" />
              <span>Full Website</span>
            </Link>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product from video..."
              className="w-full rounded-2xl bg-[#1E1C1A] border border-neutral-800 py-3 pl-10 pr-4 text-xs font-medium text-white placeholder:text-neutral-500 shadow-sm focus:outline-hidden focus:ring-1 focus:ring-[#B89358]"
            />
          </div>

          {/* Fast Filters */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { label: 'All Pieces', val: null },
              { label: '🔥 Viral Grails', val: 'Viral' },
              { label: '⚡ Glitch Deals', val: 'Glitches' },
              { label: '💸 Sub-₱300', val: 'Under ₱299' },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setSelectedTag(f.val)}
                className={`rounded-full px-3 py-1 text-[0.6875rem] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === f.val
                    ? 'bg-white text-[#141312]'
                    : 'bg-[#1E1C1A] border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Product List */}
        <div className="mt-4 space-y-2.5">
          {filtered.map((product) => (
            <a
              key={product.id}
              href={`/go/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackAffiliateClick(product.id)}
              className="group flex items-center gap-3.5 rounded-2xl bg-[#1E1C1A] p-3 shadow-md hover:shadow-xl transition-all border border-neutral-800 hover:border-neutral-700 cursor-pointer"
            >
              {/* Product Thumbnail */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-1 left-1 rounded bg-[#9B381E] px-1 py-0.2 text-[0.5625rem] font-bold text-white">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[0.5625rem] text-neutral-400 font-semibold uppercase tracking-wider">
                  <span className="text-[#B89358]">{product.category}</span>
                  <span>·</span>
                  <span className="flex items-center text-amber-400">
                    <Star className="h-2.5 w-2.5 fill-amber-400" /> {product.rating}
                  </span>
                </div>

                <h3 className="font-semibold text-xs text-neutral-100 truncate group-hover:text-[#B89358] transition-colors">
                  {product.title}
                </h3>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-bold text-sm text-white">
                    {formatPHP(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[0.625rem] text-neutral-500 line-through">
                      {formatPHP(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                <span className="inline-flex h-8 w-8 rounded-xl bg-white text-[#141312] items-center justify-center group-hover:bg-[#B89358] group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#141312] text-xs font-semibold px-4 py-2 hover:bg-neutral-200 transition-all shadow-md"
          >
            <span>Explore Full Catalog & Lookbooks</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
