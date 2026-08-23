/** Format PHP currency */
export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString('en-PH')}`;
}

/** Calculate percentage savings */
export function calculateSavings(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Builds a Shopee affiliate link with custom Sub-ID tracking parameters.
 * Allows tracking conversions from specific sources (e.g. tiktok, bio, deals, lookbook).
 */
export function buildShopeeAffiliateUrl(baseUrl: string, source = 'tajie_web'): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('sub_id', source);
    url.searchParams.set('utm_source', 'tajie_sulit_deals');
    return url.toString();
  } catch {
    return baseUrl;
  }
}

