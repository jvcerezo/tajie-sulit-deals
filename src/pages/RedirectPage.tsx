import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Flame, ShieldCheck, ShoppingBag } from 'lucide-react';

import { PRODUCTS } from '@/data/products';
import { trackAffiliateClick, formatPHP } from '@/lib/format';
import { SEO } from '@/components/SEO';

export function RedirectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [countdown, setCountdown] = useState(2);

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  useEffect(() => {
    if (!product) return;

    trackAffiliateClick(product.id);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.replace(product.affiliateUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-black text-slate-900">Product Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">The product link you are looking for has expired or moved.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs"
        >
          <span>Browse Active Deals</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <SEO
        title={`Redirecting to ${product.title} | Tajie's Sulit Deals`}
        description={product.tagline}
      />

      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-xl border border-slate-200">
        {/* Animated Icon */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white grid place-items-center shadow-lg shadow-orange-500/25 animate-bounce">
          <ShoppingBag className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-xl font-black text-slate-900 leading-tight">
          Taking you to Shopee Philippines...
        </h1>

        <p className="mt-2 text-xs text-slate-500">
          Redirecting automatically in <strong className="text-orange-600 text-sm font-black">{countdown}s</strong>
        </p>

        {/* Product Card Preview */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-orange-50/70 border border-orange-200 p-3 text-left">
          <img
            src={product.image}
            alt={product.title}
            className="h-16 w-16 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-bold text-slate-900 truncate">
              {product.title}
            </h2>
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
        </div>

        {/* Direct Link Button */}
        <div className="mt-6">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black py-3.5 px-6 shadow-md shadow-orange-500/25 transition-all hover:scale-101 cursor-pointer"
          >
            <Flame className="h-4 w-4" />
            <span>Click Here if Not Redirected ↗</span>
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[0.6875rem] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Verified Shopee Affiliate Gateway · Secure Redirection</span>
        </div>
      </div>
    </div>
  );
}
