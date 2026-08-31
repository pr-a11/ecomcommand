export const financeKpiData = {
  grossSales: { value: 1109200, change: -10.1, label: 'Gross Sales', caption: 'selected period' },
  returningCustomerRate: { value: 15.38, change: -16.9, label: 'Returning Customer Rate', caption: 'Shopify only', isPercent: true },
  orders: { value: 144, change: -5.9, label: 'Orders', badge: '94 fulfilled' },
  adsSpend: { value: 80963, change: -37.9, label: 'Ads Spend', caption: 'Meta + Google' },
  attributedROAS: { value: 2.81, change: 51.1, label: 'Attributed ROAS', caption: 'Meta + Google · reported' },
  contributionMargin: { value: 63.4, change: 4.5, label: 'Contribution Margin %', isPercent: true },
};

export const plWaterfallData = [
  { label: 'Gross Sales', value: 1109200, type: 'positive' as const },
  { label: 'Discounts', value: -124600, type: 'negative' as const },
  { label: 'Cancellations', value: -98400, type: 'negative' as const },
  { label: 'Invoiced Sales', value: 886200, type: 'subtotal' as const },
  { label: 'Returns', value: -124800, type: 'negative' as const },
  { label: 'RTO', value: -176681, type: 'negative' as const },
  { label: 'Net Sales', value: 584721, type: 'total' as const },
];

export const netSalesOverTimeData = [
  { date: 'Aug 1', current: 38200, previous: 19600 },
  { date: 'Aug 3', current: 28400, previous: 14500 },
  { date: 'Aug 5', current: 42100, previous: 21500 },
  { date: 'Aug 7', current: 32100, previous: 16400 },
  { date: 'Aug 9', current: 44200, previous: 22600 },
  { date: 'Aug 11', current: 36400, previous: 18600 },
  { date: 'Aug 13', current: 96200, previous: 49200 },
  { date: 'Aug 15', current: 64100, previous: 32800 },
  { date: 'Aug 17', current: 48200, previous: 24700 },
  { date: 'Aug 19', current: 76400, previous: 39100 },
  { date: 'Aug 21', current: 46100, previous: 23600 },
  { date: 'Aug 23', current: 52400, previous: 26800 },
  { date: 'Aug 25', current: 24200, previous: 12400 },
  { date: 'Aug 27', current: 12100, previous: 6200 },
  { date: 'Aug 29', current: 4100, previous: 2100 },
];

export const contributionMarginTrendData = [
  { date: 'Aug 1', margin: 58.2 },
  { date: 'Aug 3', margin: 60.1 },
  { date: 'Aug 5', margin: 62.4 },
  { date: 'Aug 7', margin: 59.8 },
  { date: 'Aug 9', margin: 61.2 },
  { date: 'Aug 11', margin: 63.1 },
  { date: 'Aug 13', margin: 64.8 },
  { date: 'Aug 15', margin: 62.9 },
  { date: 'Aug 17', margin: 63.4 },
  { date: 'Aug 19', margin: 65.1 },
  { date: 'Aug 21', margin: 63.8 },
  { date: 'Aug 23', margin: 64.2 },
  { date: 'Aug 25', margin: 62.6 },
  { date: 'Aug 27', margin: 63.4 },
  { date: 'Aug 29', margin: 63.4 },
];

export const geographicSalesFinance = [
  { rank: 1, state: 'Rajasthan', shopify: 51200, marketplace: 34119, total: 85319 },
  { rank: 2, state: 'Maharashtra', shopify: 44800, marketplace: 29249, total: 74049 },
  { rank: 3, state: 'Gujarat', shopify: 41600, marketplace: 27667, total: 69267 },
  { rank: 4, state: 'Telangana', shopify: 38400, marketplace: 27189, total: 65589 },
  { rank: 5, state: 'Uttar Pradesh', shopify: 36800, marketplace: 25332, total: 62132 },
  { rank: 6, state: 'Tamil Nadu', shopify: 31200, marketplace: 21891, total: 53091 },
  { rank: 7, state: 'West Bengal', shopify: 28400, marketplace: 19402, total: 47802 },
  { rank: 8, state: 'Karnataka', shopify: 26400, marketplace: 18002, total: 44402 },
];

export const channelProfitabilityData = [
  { id: 'cp-shopify', channel: 'Shopify', grossSales: 536200, fees: 21400, netRealisation: 514800, netMarginPct: 67.2, takeRate: 4.0 },
  { id: 'cp-amazon', channel: 'Amazon', grossSales: 248400, fees: 54600, netRealisation: 193800, netMarginPct: 58.4, takeRate: 22.0 },
  { id: 'cp-flipkart', channel: 'Flipkart', grossSales: 162100, fees: 38900, netRealisation: 123200, netMarginPct: 55.1, takeRate: 24.0 },
  { id: 'cp-myntra', channel: 'Myntra', grossSales: 118600, fees: 33000, netRealisation: 85600, netMarginPct: 52.8, takeRate: 27.8 },
  { id: 'cp-eternz', channel: 'Eternz', grossSales: 43900, fees: 8800, netRealisation: 35100, netMarginPct: 61.4, takeRate: 20.0 },
];

export const marketplaceFeeData = [
  { id: 'mf-amazon', marketplace: 'Amazon', referralFee: 12.0, closingFee: 4.2, shippingFee: 3.8, totalFee: 22.0, impact: 54600 },
  { id: 'mf-flipkart', marketplace: 'Flipkart', referralFee: 14.0, closingFee: 5.1, shippingFee: 4.9, totalFee: 24.0, impact: 38900 },
  { id: 'mf-myntra', marketplace: 'Myntra', referralFee: 18.0, closingFee: 4.8, shippingFee: 5.0, totalFee: 27.8, impact: 33000 },
  { id: 'mf-eternz', marketplace: 'Eternz', referralFee: 12.0, closingFee: 4.0, shippingFee: 4.0, totalFee: 20.0, impact: 8800 },
];