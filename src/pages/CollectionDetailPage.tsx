import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

import { COLLECTIONS } from '@/data/collections';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { SEO } from '@/components/SEO';
import { formatPHP } from '@/lib/format';

export function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const collection = COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <div className="py-24 text-center bg-[#FAF7F2] min-h-screen text-stone-900">
        <h1 className="text-2xl font-bold text-stone-900">Lookbook Not Found</h1>
        <p className="mt-2 text-sm text-stone-600">The requested lookbook collection does not exist.</p>
        <Link
          to="/collections"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all collections</span>
        </Link>
      </div>
    );
  }

  const collectionProducts = PRODUCTS.filter((p) => collection.productIds.includes(p.id));
  const totalPrice = collectionProducts.reduce((acc, p) => acc + p.price, 0);
  const totalOriginal = collectionProducts.reduce((acc, p) => acc + p.originalPrice, 0);
  const totalSaved = totalOriginal - totalPrice;

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen text-stone-900">
      <SEO
        title={`${collection.title} | Tajie's Sulit Deals`}
        description={collection.description}
        image={collection.bannerImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#C8522C] transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to all lookbooks</span>
        </Link>

        {/* Collection Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white p-6 sm:p-10 shadow-xl">
          <img
            src={collection.bannerImage}
            alt={collection.title}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-stone-950 font-bold px-3 py-1 text-xs">
              <span>{collection.icon}</span>
              <span>{collection.badge}</span>
            </span>
            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {collection.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              {collection.description}
            </p>

            {/* Savings stats */}
            <div className="mt-6 flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-md">
              <div>
                <span className="block text-[0.625rem] uppercase text-stone-400 font-bold">Bundle Total</span>
                <span className="font-extrabold text-xl text-amber-400">{formatPHP(totalPrice)}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="block text-[0.625rem] uppercase text-stone-400 font-bold">Total Saved</span>
                <span className="font-extrabold text-xl text-emerald-400">{formatPHP(totalSaved)}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="block text-[0.625rem] uppercase text-stone-400 font-bold">Items</span>
                <span className="font-extrabold text-xl text-white">{collectionProducts.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Products Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#C8522C]" />
              <span>Itemized Products in This Lookbook</span>
            </h2>
            <span className="text-xs text-stone-500 font-medium">Tap any item for specs & Shopee links</span>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
