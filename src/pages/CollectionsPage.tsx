import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

import { COLLECTIONS } from '@/data/collections';
import { PRODUCTS } from '@/data/products';
import { SEO } from '@/components/SEO';
import { formatPHP } from '@/lib/format';

export function CollectionsPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO
        title="Curated Themed Setups & Lookbooks | Tajie's Sulit Deals"
        description="Explore itemized aesthetic WFH desk setups, under-₱299 cheap finds, home cafe gear, and viral TikTok collections on Shopee."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-800">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated Lookbooks</span>
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Themed Setups & Curated Collections
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Complete aesthetic bundles tested for synergy, build quality, and maximum Shopee value.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {COLLECTIONS.map((col) => {
            const colProducts = PRODUCTS.filter((p) => col.productIds.includes(p.id));
            const totalPrice = colProducts.reduce((acc, p) => acc + p.price, 0);

            return (
              <div
                key={col.id}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Banner Image */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={col.bannerImage}
                    alt={col.title}
                    className="h-full w-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-2xl">{col.icon}</span>
                      <h2 className="text-lg sm:text-xl font-black text-white leading-tight mt-1">
                        {col.title}
                      </h2>
                    </div>
                    <span className="rounded-full bg-orange-500 text-slate-950 font-black px-2.5 py-0.5 text-xs shadow-md">
                      {col.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs font-bold text-orange-600">{col.tagline}</p>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {col.description}
                    </p>

                    {/* Preview thumbnails */}
                    <div className="mt-4 flex items-center gap-2">
                      {colProducts.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                          title={item.title}
                        >
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {colProducts.length > 4 && (
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center text-xs font-bold text-slate-600">
                          +{colProducts.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[0.625rem] font-bold uppercase text-slate-400">
                        Total Bundle Est.
                      </span>
                      <span className="font-black text-base text-slate-900">
                        {formatPHP(totalPrice)}
                      </span>
                    </div>

                    <Link
                      to={`/collections/${col.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white px-4 py-2 text-xs font-bold transition-colors shadow-xs"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
