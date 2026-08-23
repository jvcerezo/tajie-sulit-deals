import { useMemo, useState } from 'react';
import {
  Check,
  ExternalLink,
  Globe,
  Search,
  Share2,
  Sparkles,
  Star,
  Ticket,
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
  }, [searchQuery, selectedTag]);

  const handleShareBio = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    confetti({
      particleCount: 30,
      spread: 60,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 via-amber-500 to-slate-900 pb-16 pt-8 px-4 text-slate-900">
      <SEO
        title="Tajie's Shopee Links | TikTok & Instagram Bio"
        description="Direct Shopee links from Tajie's TikTok & Instagram videos. Tap to shop viral budol finds & discount vouchers."
      />

      <div className="max-w-md mx-auto">
        {/* Profile Card Header */}
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-md p-6 text-center shadow-xl border border-white/40">
          <button
            type="button"
            onClick={handleShareBio}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-slate-600 hover:bg-slate-200 transition-colors"
            title="Share profile link"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          </button>

          {/* Avatar / Brand Icon */}
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 p-1 shadow-lg">
            <div className="h-full w-full rounded-full bg-white grid place-items-center font-black text-2xl text-orange-600">
              TJ
            </div>
          </div>

          <h1 className="mt-3 text-xl font-black text-slate-900 flex items-center justify-center gap-1">
            Tajie's Sulit Deals <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs font-bold text-orange-600">@tajiedeals · Shopee Deals & Tech Reviews</p>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Tap any product below to jump directly to the verified Shopee seller page! 🛍️✨
          </p>

          {/* Social Quick Links */}
          <div className="mt-4 flex items-center justify-center gap-2 pt-3 border-t border-slate-100">
            <a
              href="https://shopee.ph/m/vouchers"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-bold hover:bg-orange-200 transition-colors"
            >
              <Ticket className="h-3 w-3" />
              <span>Claim Shopee Vouchers</span>
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              <Globe className="h-3 w-3" />
              <span>Full Website</span>
            </Link>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product from video..."
              className="w-full rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 py-3 pl-10 pr-4 text-xs font-bold text-slate-900 placeholder:text-slate-400 shadow-md focus:outline-hidden focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Fast Filters */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { label: 'All Items', val: null },
              { label: '🔥 Viral', val: 'Viral' },
              { label: '⚡ Glitch Prices', val: 'Glitches' },
              { label: '💸 Under ₱299', val: 'Under ₱299' },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setSelectedTag(f.val)}
                className={`rounded-full px-3 py-1 text-[0.6875rem] font-black whitespace-nowrap transition-all shadow-xs ${
                  selectedTag === f.val
                    ? 'bg-slate-900 text-white'
                    : 'bg-white/80 backdrop-blur-xs text-slate-800 hover:bg-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Product List for Link-in-Bio */}
        <div className="mt-4 space-y-3">
          {filtered.map((product) => (
            <a
              key={product.id}
              href={`/go/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackAffiliateClick(product.id)}
              className="group flex items-center gap-3.5 rounded-2xl bg-white p-3 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.01] cursor-pointer"
            >
              {/* Product Thumbnail */}
              <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-1 left-1 rounded bg-red-600 px-1 py-0.2 text-[0.5625rem] font-black text-white">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[0.625rem] text-slate-400 font-bold uppercase">
                  <span>{product.category}</span>
                  <span>·</span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="h-2.5 w-2.5 fill-amber-400" /> {product.rating}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                  {product.title}
                </h3>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-black text-sm text-orange-600">
                    {formatPHP(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[0.625rem] text-slate-400 line-through">
                      {formatPHP(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <span className="inline-flex h-8 items-center gap-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 text-[0.6875rem] font-black shadow-xs group-hover:from-orange-600 group-hover:to-amber-600">
                  <span>Shopee</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Home Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 hover:bg-slate-900 transition-all shadow-md"
          >
            <span>Explore Full Website & Lookbooks</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
