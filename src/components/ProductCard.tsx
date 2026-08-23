import { useState } from 'react';
import {
  Check,
  Eye,
  Flame,
  Heart,
  Share2,
  Star,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import type { Product } from '@/types';
import { formatPHP } from '@/lib/format';
import { trackAffiliateClick } from '@/lib/analytics';
import { useWishlist, toggleWishlist } from '@/lib/storage';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [copied, setCopied] = useState(false);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.includes(product.id);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/go/${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffiliateClick = () => {
    trackAffiliateClick(product.id);
  };

  // Badge styling
  const badgeColors: Record<string, string> = {
    "Tajie's Top Pick ⭐": 'bg-amber-500 text-slate-950 font-black',
    'Glitch Price ⚡': 'bg-red-600 text-white font-black animate-pulse-subtle',
    'TikTok Viral 🔥': 'bg-rose-500 text-white font-black',
    'Under ₱299 💸': 'bg-emerald-600 text-white font-bold',
    'Shopee Choice 🏆': 'bg-orange-600 text-white font-bold',
    'Best Seller 🚀': 'bg-indigo-600 text-white font-bold',
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:shadow-xl hover:border-orange-300 transition-all duration-300">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span
              className={`rounded-md px-2 py-0.5 text-[0.625rem] tracking-wide uppercase shadow-sm ${
                badgeColors[product.badge] ?? 'bg-slate-900 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="rounded-md bg-red-600 px-1.5 py-0.5 text-[0.625rem] font-black text-white shadow-sm">
              -{product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Heart Wishlist Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 h-8 w-8 rounded-full grid place-items-center transition-all cursor-pointer shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'bg-white/80 backdrop-blur-xs text-slate-500 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to My Budol List'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-md backdrop-blur-xs cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Ratings */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="text-[0.6875rem] font-bold text-orange-600 uppercase tracking-wider">
              {product.subCategory ?? product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs">{product.rating}</span>
              <span className="text-[0.625rem] text-slate-400">({product.salesCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>

          {/* Tajie Review Snippet */}
          {product.reviewQuote && (
            <p className="mt-1.5 text-[0.6875rem] italic text-slate-500 line-clamp-1 bg-slate-50 border-l-2 border-orange-400 pl-1.5 py-0.5 rounded-r">
              "{product.reviewQuote}"
            </p>
          )}
        </div>

        {/* Price & Actions Row */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-1 mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-lg sm:text-xl text-orange-600 tracking-tight">
                {formatPHP(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPHP(product.originalPrice)}
                </span>
              )}
            </div>
            {product.isGlitchPrice && (
              <span className="inline-flex items-center gap-0.5 text-[0.625rem] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                <Zap className="h-2.5 w-2.5 fill-red-600" /> Glitch
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5">
            <a
              href={`/go/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={handleAffiliateClick}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black py-2.5 px-3 shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Budol on Shopee ↗</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy direct share link"
              className={`h-9 w-9 rounded-xl border grid place-items-center transition-colors cursor-pointer shrink-0 ${
                copied
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
