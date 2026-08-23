import { useEffect } from 'react';
import {
  CheckCircle2,
  Star,
  X,
  ExternalLink,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#FAF7F2] shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-700 shadow-md hover:bg-white hover:text-stone-900 transition-all cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Image */}
            <div className="space-y-3">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white border border-stone-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {product.gallery && product.gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200 bg-white">
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
                  <span className="rounded-md bg-orange-100 text-[#C8522C] px-2 py-0.5 text-xs font-bold uppercase">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="rounded-md bg-stone-900 text-white px-2 py-0.5 text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                  {product.title}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1 font-bold text-stone-800">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{product.reviewCount} reviews</span>
                  <span>·</span>
                  <span className="text-[#C8522C] font-bold">{product.salesCount}</span>
                </div>

                {/* Price block */}
                <div className="mt-4 flex items-baseline gap-2 bg-white border border-stone-200 rounded-2xl p-3.5 shadow-2xs">
                  <span className="font-extrabold text-2xl text-[#C8522C]">
                    {formatPHP(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPHP(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="ml-auto rounded-md bg-[#C8522C] text-white px-2 py-0.5 text-xs font-bold">
                      -{product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Pros */}
                {product.pros && product.pros.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-stone-200/80 pt-3">
                    <span className="text-[0.6875rem] font-bold text-stone-500 uppercase tracking-wider">
                      Why Tajie Recommends This:
                    </span>
                    {product.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="pt-4 border-t border-stone-200/80 flex flex-col gap-2">
                <a
                  href={`/go/${product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleAffiliateClick}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#C8522C] hover:bg-[#B34420] text-white text-sm font-bold py-3 px-6 shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  <span>View Product on Shopee</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <span className="text-[0.625rem] text-stone-400 text-center">
                  Direct verified Star/Mall seller link with voucher eligibility
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
