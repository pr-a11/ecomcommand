export const marketingKpiData = {
  grossSales: { value: 1109200, change: -10.1, label: 'Gross Sales', caption: 'Shopify + Marketplace' },
  totalAdSpend: { value: 80963, change: -37.9, label: 'Total Ad Spend', caption: 'Sharp spend cut — check campaigns', alert: true },
  blendedROAS: { value: 13.70, change: 0, label: 'Blended ROAS', caption: 'Strong ROAS' },
  attributedSales: { value: 227682, change: 0, label: 'Attributed Sales', caption: '21% of Gross · reported' },
  attributedROAS: { value: 2.81, change: 51.1, label: 'Attributed ROAS', caption: 'Meta + Google · reported' },
  adSpendPct: { value: 7.3, change: 0, label: 'Ad Spend % of Rev.', caption: 'of Gross Sales', isPercent: true },
  cac: { value: 1472, change: 0, label: 'CAC', caption: 'per new customer · high CAC', alert: true },
};

export const campaignData = [
  { id: 'camp-001', platform: 'meta', name: 'Always-On Prospecting', spend: 18200, attributedSales: 108800, orders: 8, roas: 5.98, status: 'Scale' as const },
  { id: 'camp-002', platform: 'meta', name: 'Retargeting — Recent Visitors', spend: 12400, attributedSales: 48200, orders: 6, roas: 3.89, status: 'Scale' as const },
  { id: 'camp-003', platform: 'meta', name: 'Reels — Video Views', spend: 2817, attributedSales: 8765, orders: 2, roas: 3.11, status: 'Scale' as const },
  { id: 'camp-004', platform: 'google', name: 'Brand Search — Always On', spend: 4364, attributedSales: 7304, orders: 2, roas: 1.67, status: 'Hold' as const },
  { id: 'camp-005', platform: 'google', name: 'Performance Max — Core', spend: 5299, attributedSales: 6778, orders: 2, roas: 1.28, status: 'Cut' as const },
  { id: 'camp-006', platform: 'meta', name: 'Retarget by Occasion — Wedding', spend: 6800, attributedSales: 21400, orders: 4, roas: 3.15, status: 'Scale' as const },
  { id: 'camp-007', platform: 'google', name: 'Shopping — All Products', spend: 4355, attributedSales: 6430, orders: 2, roas: 1.48, status: 'Cut' as const },
  { id: 'camp-008', platform: 'meta', name: 'Catalog / DPA — Retarget', spend: 8900, attributedSales: 12400, orders: 3, roas: 1.39, status: 'Hold' as const },
  { id: 'camp-009', platform: 'google', name: 'Display Remarketing', spend: 2642, attributedSales: 3343, orders: 1, roas: 1.27, status: 'Cut' as const },
  { id: 'camp-010', platform: 'google', name: 'Search — Competitor Conquest', spend: 3004, attributedSales: 2671, orders: 1, roas: 0.89, status: 'Cut' as const },
];

export const conversionFunnelData = [
  { stage: 'Sessions', value: 28400, pct: 100 },
  { stage: 'Add to Cart', value: 4260, pct: 15.0 },
  { stage: 'Checkout', value: 2130, pct: 7.5 },
  { stage: 'Purchases', value: 426, pct: 1.5 },
];

export const channelSessionsData = [
  { id: 'ch-organic', channel: 'Organic Search', sessions: 9840, orders: 184, sales: 218400, convRate: 1.87 },
  { id: 'ch-direct', channel: 'Direct', sessions: 6210, orders: 96, sales: 142800, convRate: 1.55 },
  { id: 'ch-meta', channel: 'Meta Ads', sessions: 8420, orders: 124, sales: 148200, convRate: 1.47 },
  { id: 'ch-google', channel: 'Google Ads', sessions: 3930, orders: 48, sales: 79482, convRate: 1.22 },
];

export const ageGenderData = [
  { age: '18–24', spend: 8200, sales: 24600, visitors: 4200, male: 1800, female: 6400 },
  { age: '25–34', spend: 28400, sales: 84200, visitors: 9800, male: 2400, female: 7400 },
  { age: '35–44', spend: 22100, sales: 68400, visitors: 7200, male: 1800, female: 5400 },
  { age: '45–54', spend: 14200, sales: 38600, visitors: 4100, male: 1200, female: 2900 },
  { age: '55+', spend: 8063, sales: 11882, visitors: 2100, male: 600, female: 1500 },
];

export const marketingInsights = [
  {
    id: 'insight-best',
    type: 'best' as const,
    label: 'BEST PERFORMER',
    text: 'Always-On Prospecting generated 5.98x ROAS on ₹18,200 spend — your top campaign this period.',
  },
  {
    id: 'insight-attention',
    type: 'attention' as const,
    label: 'NEEDS ATTENTION',
    text: 'Performance Max — Core returned 1.28x on ₹5,299 — well below your 2.8x average. Consider pausing.',
  },
  {
    id: 'insight-trend',
    type: 'trend' as const,
    label: 'TREND',
    text: 'Ad spend down 37.9% while attributed sales down only 6% vs the previous period — efficiency improving.',
  },
  {
    id: 'insight-opportunity',
    type: 'opportunity' as const,
    label: 'OPPORTUNITY',
    text: 'Wedding retargeting is beating your 3x average — allocate ₹10,000 more before the peak season.',
  },
];

export const netSalesOverTimeMarketing = [
  { date: 'Aug 1', current: 38200, previous: 19600 },
  { date: 'Aug 4', current: 71200, previous: 36400 },
  { date: 'Aug 7', current: 32100, previous: 16400 },
  { date: 'Aug 10', current: 62800, previous: 32100 },
  { date: 'Aug 13', current: 96200, previous: 49200 },
  { date: 'Aug 16', current: 98800, previous: 50400 },
  { date: 'Aug 19', current: 76400, previous: 39100 },
  { date: 'Aug 22', current: 34200, previous: 17500 },
  { date: 'Aug 25', current: 24200, previous: 12400 },
  { date: 'Aug 29', current: 4100, previous: 2100 },
];