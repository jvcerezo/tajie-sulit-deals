/** Format PHP currency */
export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString('en-PH')}`;
}

/** Calculate percentage savings */
export function calculateSavings(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** Log affiliate click in localStorage */
export function trackAffiliateClick(productId: string): void {
  try {
    const key = 'tajie_affiliate_clicks';
    const existing = JSON.parse(localStorage.getItem(key) ?? '{}');
    existing[productId] = (existing[productId] ?? 0) + 1;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

/** Get recorded clicks for a product */
export function getAffiliateClicks(productId: string): number {
  try {
    const key = 'tajie_affiliate_clicks';
    const existing = JSON.parse(localStorage.getItem(key) ?? '{}');
    return existing[productId] ?? 0;
  } catch {
    return 0;
  }
}
