import { useEffect } from 'react';
import {
  CheckCircle2,
  Flame,
  Star,
  X,
} from 'lucide-react';

import type { Product } from '@/types';
import { formatPHP } from '@/lib/format';
import { trackAffiliateClick } from '@/lib/analytics';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAffiliateClick = () => {
    trackAffiliateClick(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white hover:text-slate-900 transition-all cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Image */}
            <div className="space-y-3">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {product.gallery && product.gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-orange-100 text-orange-800 px-2 py-0.5 text-xs font-bold uppercase">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="rounded bg-slate-900 text-white px-2 py-0.5 text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{product.reviewCount} customer reviews</span>
                  <span>·</span>
                  <span className="text-orange-600 font-bold">{product.salesCount}</span>
                </div>

                {/* Price block */}
                <div className="mt-4 flex items-baseline gap-2 bg-orange-50/70 border border-orange-200 rounded-xl p-3">
                  <span className="font-black text-2xl text-orange-600">
                    {formatPHP(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPHP(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="ml-auto rounded bg-red-600 text-white px-2 py-0.5 text-xs font-black">
                      -{product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Pros */}
                {product.pros && product.pros.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                    <span className="text-[0.6875rem] font-bold text-slate-500 uppercase tracking-wider">
                      Why Tajie Recommends This:
                    </span>
                    {product.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={`/go/${product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleAffiliateClick}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black py-3 px-6 shadow-md shadow-orange-500/25 transition-all hover:scale-101 cursor-pointer"
                >
                  <Flame className="h-4 w-4" />
                  <span>Check Current Deal on Shopee ↗</span>
                </a>
                <span className="text-[0.625rem] text-slate-400 text-center">
                  Direct Shopee link with verified seller guarantee & voucher eligibility
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
