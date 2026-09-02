'use client';

export const marketplaceKpis = {
  amazon: {
    revenue: { value: 243800, change: 18.4, label: 'Revenue' },
    orders: { value: 312, change: 22.1, label: 'Orders' },
    returns: { value: 8.2, change: -1.3, label: 'Return Rate', isPercent: true },
    rating: { value: 4.6, change: 0.1, label: 'Avg Rating' },
    listingHealth: 84,
  },
  flipkart: {
    revenue: { value: 166200, change: 9.7, label: 'Revenue' },
    orders: { value: 241, change: 11.2, label: 'Orders' },
    returns: { value: 11.4, change: 2.1, label: 'Return Rate', isPercent: true },
    rating: { value: 4.3, change: -0.1, label: 'Avg Rating' },
    listingHealth: 71,
  },
  myntra: {
    revenue: { value: 141300, change: 31.8, label: 'Revenue' },
    orders: { value: 198, change: 28.4, label: 'Orders' },
    returns: { value: 6.8, change: -3.2, label: 'Return Rate', isPercent: true },
    rating: { value: 4.7, change: 0.2, label: 'Avg Rating' },
    listingHealth: 91,
  },
};

export const bsrData = [
  { day: '1 Aug', product1: 12400, product2: 18200, product3: 24100 },
  { day: '5 Aug', product1: 11800, product2: 17400, product3: 22800 },
  { day: '10 Aug', product1: 10200, product2: 15800, product3: 21400 },
  { day: '15 Aug', product1: 9400, product2: 14200, product3: 19800 },
  { day: '20 Aug', product1: 8800, product2: 13600, product3: 18200 },
  { day: '25 Aug', product1: 8200, product2: 12800, product3: 17400 },
  { day: '30 Aug', product1: 7600, product2: 12100, product3: 16800 },
];

export const listingHealthMetrics = {
  amazon: [
    { metric: 'Title Optimization', score: 92, status: 'green' },
    { metric: 'Image Quality', score: 88, status: 'green' },
    { metric: 'Bullet Points', score: 76, status: 'yellow' },
    { metric: 'A+ Content', score: 65, status: 'yellow' },
    { metric: 'Review Count', score: 84, status: 'green' },
    { metric: 'Price Competitiveness', score: 71, status: 'yellow' },
    { metric: 'Inventory Level', score: 90, status: 'green' },
    { metric: 'Keyword Ranking', score: 68, status: 'yellow' },
  ],
};

export const crossPlatformData = [
  { platform: 'Amazon', revenue: 243800, orders: 312, returns: 8.2, color: '#F97316' },
  { platform: 'Flipkart', revenue: 166200, orders: 241, returns: 11.4, color: '#3B82F6' },
  { platform: 'Myntra', revenue: 141300, orders: 198, returns: 6.8, color: '#EC4899' },
];

export const inventorySyncData = [
  {
    product: 'Kundan Layered Necklace Set',
    sku: 'NKL-GLD-001',
    shopify: 24,
    amazon: 18,
    flipkart: 12,
    myntra: 8,
    total: 62,
    status: 'In Stock',
  },
  {
    product: 'Bridal Combo Set',
    sku: 'CMB-WED-004',
    shopify: 8,
    amazon: 4,
    flipkart: 3,
    myntra: 2,
    total: 17,
    status: 'Low Stock',
  },
  {
    product: 'Oxidised Jhumka Earrings',
    sku: 'ERG-OXD-008',
    shopify: 84,
    amazon: 62,
    flipkart: 48,
    myntra: 36,
    total: 230,
    status: 'In Stock',
  },
  {
    product: 'Silver Toe Ring Set',
    sku: 'RNG-SLV-012',
    shopify: 42,
    amazon: 28,
    flipkart: 0,
    myntra: 14,
    total: 84,
    status: 'OOS on Flipkart',
  },
  {
    product: 'Choker Pearl Necklace',
    sku: 'NKL-CHK-016',
    shopify: 16,
    amazon: 12,
    flipkart: 8,
    myntra: 6,
    total: 42,
    status: 'In Stock',
  },
  {
    product: 'Glass Bangle Set',
    sku: 'BNG-GLS-021',
    shopify: 124,
    amazon: 84,
    flipkart: 62,
    myntra: 48,
    total: 318,
    status: 'In Stock',
  },
  {
    product: 'Gold-plated Charm Bracelet',
    sku: 'BRC-GLD-025',
    shopify: 3,
    amazon: 2,
    flipkart: 1,
    myntra: 0,
    total: 6,
    status: 'Critical Low',
  },
  {
    product: 'Meenakari Stud Earrings',
    sku: 'ERG-MNK-031',
    shopify: 38,
    amazon: 24,
    flipkart: 18,
    myntra: 14,
    total: 94,
    status: 'In Stock',
  },
];

function mockMarketplace(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: mockMarketplace is not implemented yet.', args);
  return null;
}

export default mockMarketplace;
