import { Link, useLocation } from 'react-router-dom';
import { Compass, Flame, Heart, Smartphone, Ticket } from 'lucide-react';
import { useWishlist } from '@/lib/storage';

export function BottomNav() {
  const location = useLocation();
  const wishlist = useWishlist();

  const navItems = [
    { label: 'Deals', path: '/', icon: Flame },
    { label: 'Setups', path: '/collections', icon: Compass },
    { label: 'Vouchers', path: '/vouchers', icon: Ticket },
    { label: 'Budol List', path: '/wishlist', icon: Heart, count: wishlist.length },
    { label: 'Bio', path: '/bio', icon: Smartphone, highlight: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                item.highlight
                  ? 'text-orange-600 font-extrabold'
                  : isActive
                    ? 'text-orange-600 font-bold'
                    : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 grid h-4 w-4 place-items-center rounded-full bg-red-600 text-[0.5625rem] font-black text-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[0.625rem] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
