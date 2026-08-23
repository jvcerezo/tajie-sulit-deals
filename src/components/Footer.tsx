import { Link } from 'react-router-dom';
import { Flame, Heart, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white grid place-items-center">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1">
                Tajie's <span className="text-orange-400">Sulit Deals</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Your daily curated vault for legitimate Shopee budol finds, viral TikTok tech, aesthetic desk setup upgrades, and exclusive Shopee discount vouchers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>100% Tested & Verified Shopee Star/Mall Sellers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curated Categories</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/?category=Tech+%26+Setup" className="hover:text-orange-400 transition-colors">
                  Tech & WFH Desk Setups
                </Link>
              </li>
              <li>
                <Link to="/?category=Viral+TikTok" className="hover:text-orange-400 transition-colors">
                  TikTok Viral Must-Haves
                </Link>
              </li>
              <li>
                <Link to="/?price=under-299" className="hover:text-orange-400 transition-colors">
                  Under ₱299 Dangerously Cheap
                </Link>
              </li>
              <li>
                <Link to="/?category=Kitchen+%26+Coffee" className="hover:text-orange-400 transition-colors">
                  Home Cafe & Coffee Gear
                </Link>
              </li>
              <li>
                <Link to="/vouchers" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" /> Shopee Mega Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Affiliate Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Affiliate Disclosure</h4>
            <p className="mt-3 text-[0.6875rem] text-slate-400 leading-relaxed">
              Tajie's Sulit Deals participates in the Shopee Affiliate Program. When you purchase through our links, we may earn a small commission at zero extra cost to you. This supports our honest product reviews and deal hunting!
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Tajie's Sulit Deals. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for smart Shopee shoppers in the Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
}
