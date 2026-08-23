import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Heart, ShoppingBag, Trash2 } from 'lucide-react';

import { useProducts, useWishlist, toggleWishlist } from '@/lib/storage';
import { ProductCard } from '@/components/ProductCard';
import { SEO } from '@/components/SEO';
import { formatPHP } from '@/lib/format';

export function WishlistPage() {
  const allProducts = useProducts();
  const wishlistIds = useWishlist();

  const savedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const totalPrice = savedProducts.reduce((acc, p) => acc + p.price, 0);
  const totalOriginal = savedProducts.reduce((acc, p) => acc + p.originalPrice, 0);
  const totalSaved = totalOriginal - totalPrice;

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen text-stone-900">
      <SEO
        title="My Cozy Bag & Savings Calculator | Tajie's Sulit Deals"
        description="Your saved Shopee items and total cart savings calculator."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-600">
                <Heart className="h-5 w-5 fill-rose-600" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  My Cozy Bag
                </h1>
                <p className="text-xs text-stone-500 font-semibold">
                  {savedProducts.length} {savedProducts.length === 1 ? 'find' : 'finds'} saved for your next Shopee checkout
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:border-[#C8522C]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Explore more finds</span>
          </Link>
        </div>

        {savedProducts.length === 0 ? (
          <div className="mt-16 text-center max-w-md mx-auto rounded-3xl bg-white border border-stone-200/90 p-12 shadow-sm">
            <span className="text-4xl">🪴</span>
            <h2 className="mt-4 text-lg font-bold text-stone-900">Your Cozy Bag is Empty</h2>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
              Tap the heart icon on any curated piece or complete the Matchmaker quiz to save items here!
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C8522C] text-white text-xs font-bold px-6 py-3 shadow-md hover:bg-[#B34420] transition-colors"
            >
              <Coffee className="h-4 w-4" />
              <span>Discover Handpicked Finds</span>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
            {/* Products Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {savedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-5 right-5 z-20 h-8 w-8 rounded-full bg-white/90 shadow-md grid place-items-center text-rose-600 hover:bg-white hover:scale-110 transition-all cursor-pointer"
                    title="Remove from bag"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Summary Sidebar Card */}
            <div className="sticky top-20 rounded-3xl bg-white p-6 border border-stone-200/90 shadow-lg space-y-4">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-[#C8522C]" />
                <span>Estimated Cart Summary</span>
              </h2>

              <div className="space-y-2.5 text-xs pt-3 border-t border-stone-100">
                <div className="flex justify-between text-stone-500">
                  <span>Total Items</span>
                  <span className="font-bold text-stone-900">{savedProducts.length}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Original Total</span>
                  <span className="line-through">{formatPHP(totalOriginal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Total Savings</span>
                  <span>-{formatPHP(totalSaved)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-3 border-t border-stone-100">
                  <span>Checkout Price</span>
                  <span className="text-[#C8522C] text-lg">{formatPHP(totalPrice)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/vouchers"
                  className="block text-center text-xs font-bold text-[#C8522C] bg-orange-50/70 border border-orange-200 py-2.5 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  Apply Shopee Vouchers for Extra 15% Off ↗
                </Link>
              </div>

              <p className="text-[0.6875rem] text-stone-400 text-center leading-relaxed">
                Open each product link to jump directly to the verified Shopee seller page with voucher stacking.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
