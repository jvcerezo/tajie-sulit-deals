import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Heart,
  Menu,
  Plus,
  Settings,
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
    { label: 'Curated Catalog', path: '/', icon: Sparkles },
    { label: 'Themed Lookbooks', path: '/collections', icon: Compass },
    { label: 'Shopee Vouchers', path: '/vouchers', icon: Ticket, badge: 'Daily' },
    { label: 'Curated Bag', path: '/wishlist', icon: Heart, count: wishlist.length },
    { label: 'TikTok Bio', path: '/bio', icon: Smartphone, highlight: true },
  ];

  return (
    <>
      {/* Top Editorial Ticker */}
      <div className="bg-[#141312] text-[#FAF9F6] text-[0.6875rem] py-1.5 px-4 text-center border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 truncate">
          <span className="flex h-1.5 w-1.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89358] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B89358]" />
          </span>
          <span className="tracking-wide text-neutral-300 font-sans">
            Independent Shopee Testing & Curated Vouchers · 100% Star & Mall Verified Sellers
          </span>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E8E6E1] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Monogram & Title */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-[#141312] text-[#FAF9F6] grid place-items-center font-serif font-bold text-lg shadow-sm group-hover:bg-[#262524] transition-colors">
                T
              </div>
              <div>
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#141312] flex items-center gap-1.5">
                  Tajie <span className="font-normal italic text-neutral-500">Studio</span>
                </span>
                <span className="block text-[0.5625rem] font-semibold text-neutral-400 tracking-widest uppercase -mt-0.5 font-sans">
                  Curated Shopee Vault
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                      link.highlight
                        ? 'bg-neutral-100 text-[#141312] border border-neutral-300 hover:bg-neutral-200'
                        : isActive
                        ? 'bg-[#141312] text-white shadow-xs'
                        : 'text-neutral-600 hover:text-[#141312] hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#B89358]' : 'text-neutral-400'}`} />
                    <span>{link.label}</span>

                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="ml-1 rounded-full bg-[#9B381E] px-1.5 py-0.2 text-[0.5625rem] font-bold text-white">
                        {link.count}
                      </span>
                    )}

                    {link.badge && (
                      <span className="ml-0.5 rounded bg-[#B89358] text-[#141312] px-1 py-0.2 text-[0.5rem] font-bold uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="h-4 w-px bg-neutral-200 mx-2" />

              {/* Add Deal Button */}
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
                title="Add New Curated Deal"
              >
                <Plus className="h-3.5 w-3.5 text-[#9B381E]" />
                <span className="hidden lg:inline">Add Item</span>
              </button>

              {/* Admin Hub Link */}
              <Link
                to="/admin"
                className="h-8 w-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 grid place-items-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-2xs"
                title="Admin Hub & Analytics"
              >
                <Settings className="h-3.5 w-3.5" />
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/wishlist"
                className="relative h-9 w-9 rounded-full border border-neutral-300 bg-white grid place-items-center text-neutral-700"
              >
                <Heart className="h-4 w-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#9B381E] text-white text-[0.5625rem] font-bold grid place-items-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 rounded-full border border-neutral-300 bg-white grid place-items-center text-neutral-700 hover:text-neutral-900 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E6E1] bg-[#FAF9F6] px-4 pt-3 pb-5 shadow-lg">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#141312] text-white'
                        : 'bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#B89358]' : 'text-neutral-500'}`} />
                      <span>{link.label}</span>
                    </div>
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="rounded-full bg-[#9B381E] px-2 py-0.5 text-[0.625rem] font-bold text-white">
                        {link.count}
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
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#141312] text-white text-xs font-semibold shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Find</span>
                </button>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-xl border border-neutral-300 bg-white grid place-items-center text-neutral-700"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Admin Add Deal Modal */}
      <AdminAddDealModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
}
