import { useState } from 'react';
import { Info, Ticket } from 'lucide-react';

import { VOUCHERS } from '@/data/vouchers';
import { VoucherCard } from '@/components/VoucherCard';
import { SEO } from '@/components/SEO';

export function VouchersPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Mega Discount', 'Free Shipping', 'SpayLater', 'Store Special'];

  const filtered = VOUCHERS.filter((v) => {
    if (activeCategory === 'All') return true;
    return v.category === activeCategory;
  });

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen text-stone-900">
      <SEO
        title="Live Shopee Voucher Codes & Promo Stack | Tajie's Sulit Deals"
        description="Exclusive Shopee discount codes, 15% off Mega Vouchers, 0% interest SPayLater deals, and ₱0 min. spend Free Shipping vouchers."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
            <Ticket className="h-3.5 w-3.5" />
            <span>Shopee Promo Hub</span>
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Today's Active Shopee Vouchers
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Copy these promo codes and paste them in your Shopee checkout before they hit their daily redemption cap!
          </p>
        </div>

        {/* Tip Banner */}
        <div className="mt-8 max-w-3xl mx-auto rounded-2xl bg-white border border-stone-200 p-4 flex items-start gap-3 text-xs text-stone-800 shadow-sm">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900">Pro-Tip for Maximum Shopee Savings:</span>
            <p className="mt-0.5 text-stone-600 leading-relaxed">
              You can stack <strong>1 Shopee Platform Mega Voucher</strong> + <strong>1 Free Shipping Voucher</strong> + <strong>1 Shop Voucher</strong> in a single checkout to slash up to 70% off!
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vouchers Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {filtered.map((voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      </div>
    </div>
  );
}
