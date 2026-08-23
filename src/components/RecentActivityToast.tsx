import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

const CITIES = ['Quezon City', 'Makati', 'Cebu City', 'Davao City', 'Manila', 'Taguig', 'Pampanga', 'Iloilo', 'Laguna'];

export function RecentActivityToast() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ product: PRODUCTS[0], city: 'Quezon City', time: '1 min ago' });

  useEffect(() => {
    // Show every 20-30 seconds
    const interval = setInterval(() => {
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const randomTime = `${Math.floor(Math.random() * 5) + 1} mins ago`;

      setData({ product: randomProduct, city: randomCity, time: randomTime });
      setVisible(true);

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 22000);

    // Initial trigger after 4s
    const initialTimer = setTimeout(() => {
      const randomProduct = PRODUCTS[0];
      setData({ product: randomProduct, city: 'Manila', time: 'Just now' });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!visible || !data.product) return null;

  return (
    <div className="fixed bottom-18 md:bottom-6 left-4 z-40 max-w-xs animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
        <img
          src={data.product.image}
          alt=""
          className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-100"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-bold text-slate-900 truncate">
            Someone in <span className="text-orange-600 font-extrabold">{data.city}</span>
          </p>
          <p className="text-[0.625rem] text-slate-500 truncate">
            viewed <strong>{data.product.title}</strong>
          </p>
          <span className="text-[0.5625rem] text-slate-400 font-medium">{data.time}</span>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
