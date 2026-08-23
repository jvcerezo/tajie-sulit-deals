import { Link } from 'react-router-dom';
import { ShieldCheck, Ticket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#141312] text-[#FAF9F6] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white text-[#141312] grid place-items-center font-serif font-bold text-lg">
                T
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                Tajie <span className="font-normal italic text-neutral-400">Studio</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              The independent editorial guide to tested Shopee pre-built mechanical keyboards, ergonomic desk setups, home cafe essentials, and verified discount promo vouchers in the Philippines.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>100% Star & Mall Verified Merchant Deep Links</span>
            </div>
          </div>

          {/* Curated Directories */}
          <div>
            <h4 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#B89358]">
              Curated Directories
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/?category=Tech+%26+Setup" className="hover:text-white transition-colors">
                  Minimalist Desk Fixtures
                </Link>
              </li>
              <li>
                <Link to="/?category=Kitchen+%26+Coffee" className="hover:text-white transition-colors">
                  Artisanal Home Cafe
                </Link>
              </li>
              <li>
                <Link to="/?category=Viral+TikTok" className="hover:text-white transition-colors">
                  TikTok Viral Tech Grails
                </Link>
              </li>
              <li>
                <Link to="/?price=under-299" className="hover:text-white transition-colors">
                  Sub-₱300 Hidden Value
                </Link>
              </li>
              <li>
                <Link to="/vouchers" className="hover:text-white transition-colors flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-[#B89358]" /> Shopee Mega Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div>
            <h4 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#B89358]">
              Affiliate Disclosure
            </h4>
            <p className="mt-4 text-[0.6875rem] text-neutral-400 leading-relaxed">
              Tajie Studio participates in the Shopee Affiliate Program. Outbound links on this publication may generate a small merchant commission at no supplementary cost to the purchaser. All reviews reflect genuine hands-on testing.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Tajie Studio. All rights reserved.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <Link to="/bio" className="hover:text-white transition-colors">TikTok Bio</Link>
            <span>·</span>
            <Link to="/collections" className="hover:text-white transition-colors">Lookbooks</Link>
            <span>·</span>
            <Link to="/vouchers" className="hover:text-white transition-colors">Vouchers</Link>
            <span>·</span>
            <Link to="/wishlist" className="hover:text-white transition-colors">Bag</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
