import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { RecentActivityToast } from '@/components/RecentActivityToast';
import { HomePage } from '@/pages/HomePage';
import { LinkInBioPage } from '@/pages/LinkInBioPage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { CollectionDetailPage } from '@/pages/CollectionDetailPage';
import { VouchersPage } from '@/pages/VouchersPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { AdminPage } from '@/pages/AdminPage';
import { RedirectPage } from '@/pages/RedirectPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isBioPage = location.pathname === '/bio' || location.pathname === '/links';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0">
      {!isBioPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isBioPage && <Footer />}
      {!isBioPage && <BottomNav />}
      {!isBioPage && <RecentActivityToast />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bio" element={<LinkInBioPage />} />
          <Route path="/links" element={<LinkInBioPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="/vouchers" element={<VouchersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/go/:slug" element={<RedirectPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


