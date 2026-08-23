import { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

import { useProducts, deleteCustomProduct } from '@/lib/storage';
import { getAnalyticsData, getTotalClicks, resetAnalytics } from '@/lib/analytics';
import { AdminAddDealModal } from '@/components/AdminAddDealModal';
import { SEO } from '@/components/SEO';
import { formatPHP } from '@/lib/format';

export function AdminPage() {
  const products = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(getAnalyticsData);
  const [totalClicks, setTotalClicks] = useState(getTotalClicks);

  useEffect(() => {
    const handleUpdate = () => {
      setAnalytics(getAnalyticsData());
      setTotalClicks(getTotalClicks());
    };
    window.addEventListener('tajie_analytics_updated', handleUpdate);
    return () => window.removeEventListener('tajie_analytics_updated', handleUpdate);
  }, []);

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(products, null, 2),
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `tajie-products-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <SEO title="Creator Admin & Analytics | Tajie's Sulit Deals" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-600 text-white font-black">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Creator Hub & Deal Manager
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Track outbound affiliate clicks and manage live product inventory
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-black shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Deal</span>
            </button>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-400">
              Total Outbound Clicks
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-orange-600">{totalClicks}</span>
              <span className="text-xs text-slate-500 font-bold">Shopee redirects</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-400">
              Active Products
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{products.length}</span>
              <span className="text-xs text-slate-500 font-bold">in catalog</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-400">
              Viral TikTok Items
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-500">
                {products.filter((p) => p.isTikTokViral).length}
              </span>
              <span className="text-xs text-slate-500 font-bold">tested finds</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-400">
              Glitch Deals ⚡
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-600">
                {products.filter((p) => p.isGlitchPrice).length}
              </span>
              <span className="text-xs text-slate-500 font-bold">active drops</span>
            </div>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="mt-8 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Live Product Catalog</h2>
              <p className="text-xs text-slate-500">All active deals and click records</p>
            </div>

            <button
              type="button"
              onClick={resetAnalytics}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-600"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Click Analytics</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[0.6875rem] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Deal Price</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 text-center">Shopee Clicks</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((item) => {
                  const clickCount = analytics[item.id]?.count ?? 0;
                  const isCustom = item.id.startsWith('custom-');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                            <span className="text-[0.6875rem] text-slate-400 block truncate">{item.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{item.category}</td>
                      <td className="p-4 font-black text-orange-600">{formatPHP(item.price)}</td>
                      <td className="p-4 font-bold text-red-600">-{item.discountPercentage}%</td>
                      <td className="p-4">
                        {item.badge ? (
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[0.625rem] font-bold text-slate-800">
                            {item.badge}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-center font-black text-slate-900">
                        <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs text-orange-700 font-black">
                          {clickCount}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {isCustom ? (
                          <button
                            type="button"
                            onClick={() => deleteCustomProduct(item.id)}
                            className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                            title="Delete custom product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-[0.625rem] text-slate-400 italic">Built-in</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Deal Modal */}
      <AdminAddDealModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
