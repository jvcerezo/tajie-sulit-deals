# 🛍️ Tajie's Sulit Deals — Curated Shopee Budol & Tech Vault

A high-converting, viral Shopee Affiliate Hub & Creator Link-in-Bio platform built with **React 19 + TypeScript + Vite + Tailwind CSS v4**.

---

## ⚡ Key Features

1. **🔥 High-CTR Deals Feed (`/`)**:
   - Real-time instant search with suggestions and keyword filters.
   - Category navigation: *Tech & Setup*, *Home & Living*, *Kitchen & Coffee*, *Fashion & Accessories*, *Viral TikTok*.
   - Price range filters (*Under ₱299*, *₱300 - ₱999*, *₱1,000 - ₱2,499*, *₱2,500+*).
   - High-contrast clickbait badges (*Tajie's Top Pick ⭐*, *Glitch Price ⚡*, *TikTok Viral 🔥*, *Under ₱299 💸*).
   - Instant Quick View modal with item specs, pros, and verified Shopee links.

2. **📱 Mobile Link-in-Bio Mode (`/bio` or `/links`)**:
   - Tailor-made for TikTok & Instagram bio profiles.
   - Fast, vertical, tap-to-buy layout with instant deep-linking.

3. **💻 Curated Setup Lookbooks (`/collections` & `/collections/:slug`)**:
   - Themed lookbooks (e.g. *The Clean Aesthetic WFH Desk Setup*, *Home Cafe & Coffee Gear*, *Under ₱299 Dangerously Cheap*).
   - Automatic bundle price estimation and itemized breakdown.

4. **🎟️ Shopee Voucher Promo Hub (`/vouchers`)**:
   - Daily 15% OFF Mega Vouchers, ₱0 Min. Spend Free Shipping, and 0% SPayLater promo codes with 1-click clipboard copying and confetti celebrations.

5. **🔗 Smart Affiliate Gateway (`/go/:slug`)**:
   - Clean short links with automatic outbound click counter tracking in `localStorage`.
   - 2-second countdown with fallback redirect.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti

---

## 🚀 How to Add New Products

To add a new product or Shopee affiliate link, edit `src/data/products.ts`:

```typescript
{
  id: 'your-product-id',
  slug: 'your-product-slug',
  title: 'Product Title',
  tagline: 'Short high-CTR benefit hook',
  description: 'Detailed product description...',
  price: 999,
  originalPrice: 1999,
  discountPercentage: 50,
  rating: 4.9,
  reviewCount: 1200,
  salesCount: '5.2k sold',
  category: 'Tech & Setup',
  subCategory: 'Keyboards',
  tags: ['TikTok Viral', 'Under ₱1k'],
  image: 'https://images.unsplash.com/...',
  shopeeUrl: 'https://shopee.ph/...',
  affiliateUrl: 'https://shopee.ph/...',
  badge: "Tajie's Top Pick ⭐",
  reviewQuote: 'Short quote from Tajie',
  addedDate: '2026-08-23',
}
```

---

## 💻 Development & Deployment

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

Deployable with $0 cost to **Cloudflare Pages**, **Vercel**, **Netlify**, or **GitHub Pages**.


See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
