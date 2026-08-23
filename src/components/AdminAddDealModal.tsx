import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import confetti from 'canvas-confetti';

import type { Category, Product, ProductBadge } from '@/types';
import { saveCustomProduct } from '@/lib/storage';

interface AdminAddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminAddDealModal({ isOpen, onClose }: AdminAddDealModalProps) {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState<Category>('Tech & Setup');
  const [subCategory, setSubCategory] = useState('');
  const [image, setImage] = useState('');
  const [shopeeUrl, setShopeeUrl] = useState('');
  const [badge, setBadge] = useState<ProductBadge>("Tajie's Top Pick ⭐");
  const [reviewQuote, setReviewQuote] = useState('');
  const [isTikTokViral, setIsTikTokViral] = useState(false);
  const [isGlitchPrice, setIsGlitchPrice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !shopeeUrl) return;

    const numPrice = Number(price);
    const numOriginal = Number(originalPrice) || numPrice;
    const discount = Math.round(((numOriginal - numPrice) / numOriginal) * 100);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      slug: slug || `deal-${Date.now()}`,
      title,
      tagline: tagline || title,
      description: description || tagline || title,
      price: numPrice,
      originalPrice: numOriginal,
      discountPercentage: discount > 0 ? discount : 0,
      rating: 4.9,
      reviewCount: 150,
      salesCount: '1.2k sold',
      category,
      subCategory: subCategory || undefined,
      tags: [badge, category, isTikTokViral ? 'TikTok Viral' : 'Hot Deal'],
      image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      shopeeUrl,
      affiliateUrl: shopeeUrl,
      badge,
      reviewQuote,
      isTikTokViral,
      isGlitchPrice,
      addedDate: new Date().toISOString().split('T')[0],
    };

    saveCustomProduct(newProduct);
    confetti({
      particleCount: 50,
      spread: 80,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-slate-600 hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-orange-600 text-white grid place-items-center">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Add New Shopee Budol Deal</h2>
            <p className="text-xs text-slate-500">Quickly drop a new product link into the vault</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AULA F75 Wireless Mechanical Keyboard"
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catchy Tagline / Hook</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. The #1 Creamiest Pre-Built Keyboard Under ₱3k"
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Features, switches, keycaps, battery life..."
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-slate-200 p-2 font-medium focus:border-orange-500 focus:outline-hidden"
              >
                <option value="Tech & Setup">Tech & Setup</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Kitchen & Coffee">Kitchen & Coffee</option>
                <option value="Fashion & Accessories">Fashion & Accessories</option>
                <option value="Grooming & Personal Care">Grooming & Personal Care</option>
                <option value="Viral TikTok">Viral TikTok</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Keyboards"
                className="w-full rounded-xl border border-slate-200 p-2 font-medium focus:border-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as ProductBadge)}
                className="w-full rounded-xl border border-slate-200 p-2 font-medium focus:border-orange-500 focus:outline-hidden"
              >
                <option value="Tajie's Top Pick ⭐">Tajie's Top Pick ⭐</option>
                <option value="Glitch Price ⚡">Glitch Price ⚡</option>
                <option value="TikTok Viral 🔥">TikTok Viral 🔥</option>
                <option value="Under ₱299 💸">Under ₱299 💸</option>
                <option value="Shopee Choice 🏆">Shopee Choice 🏆</option>
                <option value="Best Seller 🚀">Best Seller 🚀</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Deal Price (PHP) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2399"
                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-orange-600 focus:border-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Original Price (PHP)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="4299"
                className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Image URL (Unsplash or Shopee)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Shopee Affiliate Link *</label>
            <input
              type="url"
              required
              value={shopeeUrl}
              onChange={(e) => setShopeeUrl(e.target.value)}
              placeholder="https://shope.ee/..."
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tajie's Review Quote</label>
            <input
              type="text"
              value={reviewQuote}
              onChange={(e) => setReviewQuote(e.target.value)}
              placeholder="e.g. Legit creamy thock sound right out of the box."
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isTikTokViral}
                onChange={(e) => setIsTikTokViral(e.target.checked)}
                className="h-4 w-4 rounded accent-orange-600"
              />
              <span>TikTok Viral</span>
            </label>
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isGlitchPrice}
                onChange={(e) => setIsGlitchPrice(e.target.checked)}
                className="h-4 w-4 rounded accent-red-600"
              />
              <span>Glitch Price Alert ⚡</span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black py-3 shadow-md shadow-orange-500/20 text-xs transition-colors cursor-pointer"
            >
              Add Product to Live Deals Feed 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
