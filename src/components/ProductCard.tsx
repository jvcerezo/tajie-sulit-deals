import { useState } from 'react';
import {
  Check,
  Eye,
  Heart,
  Share2,
  Star,
  ArrowUpRight,
  ShieldCheck,
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
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffiliateClick = () => {
    trackAffiliateClick(product.id);
  };

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className="group relative flex flex-col rounded-2xl border border-[#E8E6E1] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#141312]/20 transition-all duration-300"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F4F0]">
        <img
          itemProp="image"
          src={product.image}
          alt={`${product.title} - Curated Shopee review by Tajie`}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="rounded-full bg-[#141312]/90 backdrop-blur-md text-[#FAF9F6] px-2.5 py-0.5 text-[0.5625rem] font-semibold tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="rounded-full bg-[#9B381E] text-white px-2 py-0.5 text-[0.5625rem] font-bold tracking-tight shadow-xs">
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
          className={`absolute top-2.5 right-2.5 z-20 h-8 w-8 rounded-full grid place-items-center transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'bg-white/90 backdrop-blur-xs text-neutral-500 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to Curated Bag'}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#141312]/90 hover:bg-[#141312] text-white text-[0.6875rem] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md backdrop-blur-xs cursor-pointer"
          >
            <Eye className="h-3 w-3" />
            <span>Dossier Specs</span>
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Ratings Micro-Bar */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="text-[0.625rem] font-semibold tracking-widest uppercase text-[#9B381E]">
              {product.subCategory ?? product.category}
            </span>
            <div className="flex items-center gap-1 text-neutral-700">
              <Star className="h-3 w-3 fill-[#B89358] text-[#B89358]" />
              <span className="text-xs font-semibold">{product.rating}</span>
              <span className="text-[0.625rem] text-neutral-400">({product.salesCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            itemProp="name"
            className="font-medium text-xs sm:text-sm text-[#141312] line-clamp-2 leading-snug group-hover:text-[#9B381E] transition-colors"
          >
            {product.title}
          </h3>

          {/* Editorial Note Quote */}
          {product.reviewQuote && (
            <div className="mt-2.5 rounded-lg bg-[#FAF9F6] border-l-2 border-[#B89358] p-2 text-[0.6875rem] italic text-neutral-600 leading-snug font-serif">
              <span className="not-italic font-sans font-semibold text-[#141312] block text-[0.5625rem] uppercase tracking-wider mb-0.5">
                Curator Verdict:
              </span>
              "{product.reviewQuote}"
            </div>
          )}
        </div>

        {/* Price & Actions Row */}
        <div className="mt-4 pt-3 border-t border-[#E8E6E1]/80">
          <div className="flex items-baseline justify-between gap-1 mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base sm:text-lg text-[#141312] tracking-tight">
                {formatPHP(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through font-normal">
                  {formatPHP(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[0.5625rem] font-medium uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
              <ShieldCheck className="h-2.5 w-2.5" /> Shopee Mall/Star
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <a
              href={`/go/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={handleAffiliateClick}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-[#141312] hover:bg-[#262524] text-white text-xs font-semibold py-2.5 px-3 shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>Check Deal on Shopee</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy verified direct share link"
              className={`h-9 w-9 rounded-xl border grid place-items-center transition-colors cursor-pointer shrink-0 ${
                copied
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                  : 'border-[#E8E6E1] bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
