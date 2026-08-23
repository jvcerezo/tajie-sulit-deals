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
  Coffee,
} from 'lucide-react';

import { useWishlist } from '@/lib/storage';
import { AdminAddDealModal } from '@/components/AdminAddDealModal';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const location = useLocation();
  const wishlist = useWishlist();

  const navLinks = [
    { label: 'Holy Grail Finds', path: '/', icon: Sparkles },
    { label: 'Aesthetic Setups', path: '/collections', icon: Compass },
    { label: 'Shopee Vouchers', path: '/vouchers', icon: Ticket, badge: 'Daily' },
    { label: 'Cozy Bag', path: '/wishlist', icon: Heart, count: wishlist.length },
    { label: 'TikTok Links', path: '/bio', icon: Smartphone, highlight: true },
  ];

  return (
    <>
      {/* Warm Ambient Announcement Header */}
      <div className="bg-[#231F1D] text-[#FAF7F2] text-xs font-medium py-2 px-4 text-center border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 truncate">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="tracking-wide text-stone-300">
            ✨ <strong className="text-white font-semibold">Tajie's Note:</strong> All items are 100% verified Star/Mall sellers with active Shopee voucher stacks.
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE3D7] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#C8522C] to-amber-600 text-white grid place-items-center shadow-md shadow-orange-950/10 group-hover:scale-105 transition-transform">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 flex items-center gap-1.5">
                  Tajie's <span className="text-[#C8522C]">Sulit Deals</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                </span>
                <span className="block text-[0.625rem] font-bold text-stone-500 tracking-wider uppercase -mt-0.5">
                  Curated Tech & Cozy Aesthetic Finds
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
                        ? 'bg-amber-100/70 text-amber-900 border border-amber-300 hover:bg-amber-200/70'
                        : isActive
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                    <span>{link.label}</span>

                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="ml-1 rounded-full bg-[#C8522C] px-1.5 py-0.2 text-[0.625rem] font-black text-white">
                        {link.count}
                      </span>
                    )}

                    {link.badge && (
                      <span className="ml-0.5 rounded bg-amber-500 text-stone-950 px-1 py-0.2 text-[0.5625rem] font-black uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="h-4 w-px bg-stone-300 mx-1" />

              {/* Add Deal Button */}
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-300 bg-white/80 hover:bg-white text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Add New Curated Deal"
              >
                <Plus className="h-3.5 w-3.5 text-[#C8522C]" />
                <span className="hidden lg:inline">Add Find</span>
              </button>

              {/* Admin Hub Link */}
              <Link
                to="/admin"
                className="h-8 w-8 rounded-full border border-stone-300 bg-white/80 hover:bg-white grid place-items-center text-stone-600 hover:text-stone-900 transition-colors shadow-2xs"
                title="Admin Hub & Analytics"
              >
                <Settings className="h-3.5 w-3.5" />
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/wishlist"
                className="relative h-9 w-9 rounded-full border border-stone-300 bg-white grid place-items-center text-stone-700"
              >
                <Heart className="h-4 w-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#C8522C] text-white text-[0.5625rem] font-bold grid place-items-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 rounded-full border border-stone-300 bg-white grid place-items-center text-stone-700 hover:text-stone-900 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EBE3D7] bg-[#FAF7F2] px-4 pt-3 pb-5 shadow-lg">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-[#C8522C]'}`} />
                      <span>{link.label}</span>
                    </div>
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="rounded-full bg-[#C8522C] px-2 py-0.5 text-[0.625rem] font-bold text-white">
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
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#C8522C] text-white text-xs font-bold shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Find</span>
                </button>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-2xl border border-stone-300 bg-white grid place-items-center text-stone-700"
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
