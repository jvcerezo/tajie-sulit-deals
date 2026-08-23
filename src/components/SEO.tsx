import { useEffect } from 'react';
import type { Product } from '@/types';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  products?: Product[];
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export function SEO({
  title = "Tajie Studio — Curated Shopee Budol Finds & Aesthetic Tech",
  description = "Independent editorial guide to the highest-rated mechanical keyboards, WFH desk setups, home cafe gear, and verified Shopee promo vouchers in the Philippines.",
  image = 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80',
  url = typeof window !== 'undefined' ? window.location.href : 'https://tajiedeals.vercel.app/',
  type = 'website',
  products = [],
  faqs = [
    {
      question: 'What is Tajie Studio?',
      answer: 'Tajie Studio is a curated, independent editorial catalog of tested Shopee products, viral mechanical keyboards, aesthetic desk setup gear, and verified daily discount vouchers in the Philippines.',
    },
    {
      question: 'How are products tested and selected?',
      answer: 'Every product is handpicked, researched, and vetted for seller authenticity (Shopee Star/Mall verified), real customer review sentiment, acoustic sound profiles, and build quality before inclusion.',
    },
    {
      question: 'How do I stack Shopee discount vouchers for maximum savings?',
      answer: 'You can stack 1 Shopee Mega Discount Voucher (up to 15% OFF) + 1 Free Shipping Voucher (₱0 Min. Spend) + 1 Shop-Specific Voucher in a single checkout on the Shopee App.',
    },
    {
      question: 'Are the product links direct to Shopee?',
      answer: 'Yes, all product buttons link directly to official verified Star and Mall sellers on Shopee Philippines.',
    },
  ],
  breadcrumbs,
}: SEOProps) {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // Helper functions for meta tags
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setOgMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper for canonical link
    const setCanonical = (href: string) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('description', description);
    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:image', image);
    setOgMeta('og:url', url);
    setOgMeta('og:type', type);
    setCanonical(url);

    // 2. Inject JSON-LD Structured Data for Google Rich Results
    const scriptId = 'tajie-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: any[] = [
      // Organization & WebSite
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Tajie Studio',
        url: 'https://tajiedeals.vercel.app/',
        description: description,
        author: {
          '@type': 'Person',
          name: 'Tajie',
          jobTitle: 'Curator & Tech Reviewer',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://tajiedeals.vercel.app/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    // FAQPage Schema for Google SERP Accordions
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    // Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.item,
        })),
      });
    }

    // ItemList Schema for Product Feeds
    if (products && products.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Product',
            name: p.title,
            description: p.description,
            image: p.image,
            sku: p.id,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'PHP',
              price: p.price,
              availability: 'https://schema.org/InStock',
              url: `https://tajiedeals.vercel.app/go/${p.slug}`,
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: p.rating,
              reviewCount: p.reviewCount,
              bestRating: 5,
              worstRating: 1,
            },
            review: p.reviewQuote
              ? {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Tajie',
                  },
                  reviewBody: p.reviewQuote,
                }
              : undefined,
          },
        })),
      });
    }

    scriptTag.textContent = JSON.stringify(schemas);
  }, [title, description, image, url, type, products, faqs, breadcrumbs]);

  return null;
}
