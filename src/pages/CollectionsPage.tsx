import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

import { COLLECTIONS } from '@/data/collections';
import { PRODUCTS } from '@/data/products';
import { SEO } from '@/components/SEO';
import { formatPHP } from '@/lib/format';

export function CollectionsPage() {
  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen text-stone-900">
      <SEO
        title="Curated Aesthetic Setups & Lookbooks | Tajie's Sulit Deals"
        description="Explore itemized aesthetic WFH desk setups, under-₱299 cheap finds, home cafe gear, and viral TikTok collections on Shopee."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated Lookbooks</span>
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Themed Setups & Aesthetic Spaces
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Complete bundles tested for aesthetic harmony, build quality, and maximum Shopee value.
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
                className="group relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Banner Image */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-900">
                  <img
                    src={col.bannerImage}
                    alt={col.title}
                    className="h-full w-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-2xl">{col.icon}</span>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight mt-1">
                        {col.title}
                      </h2>
                    </div>
                    <span className="rounded-full bg-amber-400 text-stone-950 font-bold px-2.5 py-0.5 text-xs shadow-md">
                      {col.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[#C8522C]">{col.tagline}</p>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      {col.description}
                    </p>

                    {/* Preview thumbnails */}
                    <div className="mt-4 flex items-center gap-2">
                      {colProducts.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="h-12 w-12 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0"
                          title={item.title}
                        >
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {colProducts.length > 4 && (
                        <div className="h-12 w-12 rounded-xl bg-stone-100 border border-stone-200 grid place-items-center text-xs font-bold text-stone-600">
                          +{colProducts.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[0.625rem] font-bold uppercase text-stone-400">
                        Total Bundle Est.
                      </span>
                      <span className="font-extrabold text-base text-stone-900">
                        {formatPHP(totalPrice)}
                      </span>
                    </div>

                    <Link
                      to={`/collections/${col.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8522C] hover:bg-[#B34420] text-white px-4 py-2 text-xs font-bold transition-colors shadow-2xs"
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
