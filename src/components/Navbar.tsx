import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Flame,
  Heart,
  Menu,
  Plus,
  Settings,
  ShoppingBag,
  Sparkles,
  Ticket,
  X,
  Smartphone,
} from 'lucide-react';

import { useWishlist } from '@/lib/storage';
import { AdminAddDealModal } from '@/components/AdminAddDealModal';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const location = useLocation();
  const wishlist = useWishlist();

  const navLinks = [
    { label: 'All Deals', path: '/', icon: Flame },
    { label: 'Curated Setups', path: '/collections', icon: Compass },
    { label: 'Shopee Vouchers', path: '/vouchers', icon: Ticket, badge: 'Hot' },
    { label: 'Budol List', path: '/wishlist', icon: Heart, count: wishlist.length },
    { label: 'Link in Bio', path: '/bio', icon: Smartphone, highlight: true },
  ];

  return (
    <>
      {/* ⚠️ Top Clickbait / Urgency Flash Ticker */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-xs font-bold py-1.5 px-4 text-center shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 truncate">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300" />
          </span>
          <span className="tracking-wide">
            🔥 <strong>PAYDAY / DOUBLE DIGIT GLITCH ALERT:</strong> ₱0 Min. Spend Free Shipping + 15% OFF Mega Vouchers Active Today!
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white grid place-items-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  Tajie's <span className="text-orange-600">Sulit Deals</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </span>
                <span className="block text-[0.625rem] font-bold text-slate-700 tracking-wider uppercase -mt-0.5">
                  Curated Shopee Budol & Tech Vault
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                      link.highlight
                        ? 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                        : isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-orange-400' : 'text-slate-600'}`} />
                    <span>{link.label}</span>
                    {link.count !== undefined && link.count > 0 && (
                      <span className="rounded-full bg-rose-600 text-white px-1.5 py-0.2 text-[0.5625rem] font-black">
                        {link.count}
                      </span>
                    )}
                    {link.badge && (
                      <span className="rounded-full bg-red-600 text-white px-1.5 py-0.2 text-[0.5625rem] font-black uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action CTA */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold shadow-2xs cursor-pointer"
                title="Quick Add Deal (Creator)"
              >
                <Plus className="h-3.5 w-3.5 text-orange-600" />
                <span>Add Deal</span>
              </button>

              <Link
                to="/admin"
                className="h-9 w-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center text-slate-600 hover:text-slate-900 shadow-2xs"
                title="Creator Hub & Analytics"
              >
                <Settings className="h-4 w-4" />
              </Link>

              <a
                href="https://shopee.ph/m/vouchers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold px-4 py-2 shadow-sm shadow-orange-500/25 transition-all hover:scale-102 cursor-pointer"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Claim Vouchers ↗</span>
              </a>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/wishlist"
                className="relative h-10 w-10 rounded-xl border border-slate-200 bg-white grid place-items-center text-slate-700"
              >
                <Heart className="h-4.5 w-4.5 text-rose-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-red-600 text-[0.5625rem] font-black text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-10 w-10 rounded-xl border border-slate-200 bg-white grid place-items-center text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-orange-50 text-orange-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-orange-600" />
                    <span>{link.label}</span>
                  </div>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="rounded-full bg-rose-600 text-white px-2 py-0.5 text-[0.625rem] font-bold">
                      {link.count}
                    </span>
                  )}
                  {link.badge && (
                    <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-[0.625rem] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800"
              >
                <Plus className="h-3.5 w-3.5 text-orange-600" />
                <span>Add Deal</span>
              </button>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800"
              >
                <Settings className="h-3.5 w-3.5 text-slate-600" />
                <span>Creator Hub</span>
              </Link>
            </div>

            <a
              href="https://shopee.ph/m/vouchers"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-2 rounded-xl bg-orange-600 text-white py-2.5 text-xs font-black shadow-md"
            >
              <Flame className="h-4 w-4" />
              <span>Claim Shopee Vouchers ↗</span>
            </a>
          </div>
        )}
      </header>

      {/* Admin Add Deal Modal */}
      <AdminAddDealModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </>
  );
}

