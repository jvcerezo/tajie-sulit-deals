import { useState } from 'react';
import {
  Check,
  Eye,
  Heart,
  Share2,
  Star,
  ExternalLink,
  Sparkles,
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
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffiliateClick = () => {
    trackAffiliateClick(product.id);
  };

  // Editorial Badge styling
  const badgeStyles: Record<string, string> = {
    "Tajie's Top Pick ⭐": 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
    'Glitch Price ⚡': 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold animate-pulse-subtle',
    'TikTok Viral 🔥': 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold',
    'Under ₱299 💸': 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    'Shopee Choice 🏆': 'bg-stone-100 text-stone-800 border-stone-300 font-bold',
    'Best Seller 🚀': 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
  };

  return (
    <div className="group relative flex flex-col rounded-3xl border border-stone-200/90 bg-white p-4 shadow-2xs hover:shadow-xl hover:border-amber-700/30 transition-all duration-300">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F6F1EA]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.625rem] tracking-wide border shadow-2xs ${
                badgeStyles[product.badge] ?? 'bg-stone-900 text-white font-bold'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="rounded-full bg-[#C8522C] px-2 py-0.5 text-[0.625rem] font-black text-white shadow-2xs">
              -{product.discountPercentage}%
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
          className={`absolute top-3 right-3 z-20 h-8 w-8 rounded-full grid place-items-center transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'bg-white/80 backdrop-blur-xs text-stone-500 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to Cozy Bag'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md backdrop-blur-xs cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Ratings */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="text-[0.6875rem] font-bold text-[#C8522C] uppercase tracking-wider">
              {product.subCategory ?? product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-stone-700">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-xs">{product.rating}</span>
              <span className="text-[0.625rem] text-stone-400">({product.salesCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-stone-900 line-clamp-2 leading-snug group-hover:text-[#C8522C] transition-colors">
            {product.title}
          </h3>

          {/* Tajie Honest Review Snippet */}
          {product.reviewQuote && (
            <div className="mt-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7] p-2 text-[0.6875rem] italic text-stone-700 leading-snug">
              <span className="font-bold not-italic text-stone-900 block text-[0.625rem]">
                💬 Tajie's Note:
              </span>
              "{product.reviewQuote}"
            </div>
          )}
        </div>

        {/* Price & Actions Row */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between gap-1 mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-[#C8522C] tracking-tight">
                {formatPHP(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPHP(product.originalPrice)}
                </span>
              )}
            </div>
            {product.isGlitchPrice && (
              <span className="inline-flex items-center gap-0.5 text-[0.625rem] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                <Sparkles className="h-2.5 w-2.5" /> Glitch Price
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <a
              href={`/go/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={handleAffiliateClick}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#C8522C] hover:bg-[#B34420] text-white text-xs font-bold py-2.5 px-3 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <span>View on Shopee</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy direct share link"
              className={`h-9 w-9 rounded-xl border grid place-items-center transition-colors cursor-pointer shrink-0 ${
                copied
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
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
