import { Link } from 'react-router-dom';
import { Coffee, Heart, ShieldCheck, Sparkles, Ticket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#E5DBCC] bg-[#211D1A] text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#C8522C] to-amber-500 text-white grid place-items-center">
                <Coffee className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#FAF7F2] flex items-center gap-1.5">
                Tajie's <span className="text-[#E07A5F]">Sulit Deals</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </span>
            </Link>
            <p className="text-xs text-stone-300 leading-relaxed max-w-md">
              A cozy, personal vault for tested Shopee budol finds, viral TikTok mechanical keyboards, aesthetic desk setup upgrades, and verified Shopee discount vouchers.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>100% Tested & Verified Shopee Star/Mall Sellers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Curated Spaces</h4>
            <ul className="mt-3 space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/?category=Tech+%26+Setup" className="hover:text-[#E07A5F] transition-colors">
                  Minimalist Desk Setups
                </Link>
              </li>
              <li>
                <Link to="/?category=Kitchen+%26+Coffee" className="hover:text-[#E07A5F] transition-colors">
                  Home Cafe & Coffee Gear
                </Link>
              </li>
              <li>
                <Link to="/?category=Viral+TikTok" className="hover:text-[#E07A5F] transition-colors">
                  TikTok Viral Must-Haves
                </Link>
              </li>
              <li>
                <Link to="/?price=under-299" className="hover:text-[#E07A5F] transition-colors">
                  Under ₱299 Hidden Gems
                </Link>
              </li>
              <li>
                <Link to="/vouchers" className="hover:text-[#E07A5F] transition-colors flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-amber-400" /> Shopee Mega Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Affiliate Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Affiliate Disclosure</h4>
            <p className="mt-3 text-[0.6875rem] text-stone-400 leading-relaxed">
              Tajie's Sulit Deals participates in the Shopee Affiliate Program. When you purchase through our links, we may earn a small creator commission at zero extra cost to you. This supports honest testing and deal curation!
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Tajie's Sulit Deals. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="h-3.5 w-3.5 text-[#E07A5F] fill-[#E07A5F]" /> for smart Shopee shoppers.
          </p>
        </div>
      </div>
    </footer>
  );
}
