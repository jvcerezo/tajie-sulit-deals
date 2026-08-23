export interface ClickRecord {
  productId: string;
  count: number;
  lastClicked: string;
}

const CLICKS_KEY = 'tajie_affiliate_analytics';

/** Track an affiliate link click with timestamp */
export function trackAffiliateClick(productId: string): void {
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    const records: Record<string, { count: number; lastClicked: string }> = raw ? JSON.parse(raw) : {};

    const current = records[productId] ?? { count: 0, lastClicked: '' };
    records[productId] = {
      count: current.count + 1,
      lastClicked: new Date().toISOString(),
    };

    localStorage.setItem(CLICKS_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('tajie_analytics_updated'));
  } catch (err) {
    console.error('Analytics track error', err);
  }
}

/** Get all click records */
export function getAnalyticsData(): Record<string, { count: number; lastClicked: string }> {
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Get total outbound clicks */
export function getTotalClicks(): number {
  const data = getAnalyticsData();
  return Object.values(data).reduce((acc, curr) => acc + curr.count, 0);
}

/** Reset all click data */
export function resetAnalytics(): void {
  localStorage.removeItem(CLICKS_KEY);
  window.dispatchEvent(new Event('tajie_analytics_updated'));
}
