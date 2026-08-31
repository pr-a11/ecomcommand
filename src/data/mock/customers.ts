'use client';

export const customersKpis = {
  totalCustomers: { value: 8432, change: 12.3, label: 'Total Customers', sparkline: [7200, 7400, 7600, 7700, 7850, 7980, 8100, 8200, 8280, 8350, 8400, 8432] },
  newCustomers: { value: 342, change: 8.2, label: 'New This Month', sparkline: [280, 295, 310, 298, 320, 315, 330, 325, 338, 340, 341, 342] },
  returningRate: { value: 34.2, change: 8.1, label: 'Returning Rate', isPercent: true, sparkline: [28, 29, 30, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.1, 34.2] },
  avgLtv: { value: 18420, change: 5.7, label: 'Avg LTV', sparkline: [16000, 16400, 16800, 17100, 17400, 17600, 17800, 18000, 18100, 18200, 18350, 18420] },
  nps: { value: 72, change: 4, label: 'NPS Score', sparkline: [62, 64, 65, 66, 67, 68, 69, 70, 70, 71, 71, 72] },
  avgRating: { value: 4.6, change: 0.1, label: 'Avg Rating', sparkline: [4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6] },
};

export const customerSegmentsData = [
  { name: 'New', value: 42, color: '#3B82F6' },
  { name: 'Returning', value: 34, color: '#374151' },
  { name: 'VIP', value: 14, color: '#8B5CF6' },
  { name: 'At-Risk', value: 10, color: '#EF4444' },
];

export const rfmData = Array.from({ length: 80 }, (_, i) => ({
  recency: Math.floor(Math.random() * 90) + 1,
  frequency: Math.floor(Math.random() * 12) + 1,
  monetary: Math.floor(Math.random() * 50000) + 5000,
  segment: ['VIP', 'Returning', 'New', 'At-Risk']?.[Math.floor(Math.random() * 4)],
}));

export const reviewsData = [
  { id: 1, customer: 'Priya Sharma', rating: 5, product: 'Kundan Layered Necklace Set', text: 'Absolutely stunning piece! The craftsmanship is exceptional and it arrived beautifully packaged. Got so many compliments at my cousin\'s wedding!', platform: 'Google', date: '28 Aug 2024', sentiment: 'Positive' },
  { id: 2, customer: 'Anita Gupta', rating: 4, product: 'Bridal Combo Set', text: 'Beautiful jewellery, exactly as shown in photos. Delivery was a bit delayed but the quality makes up for it. Would definitely order again.', platform: 'Amazon', date: '26 Aug 2024', sentiment: 'Positive' },
  { id: 3, customer: 'Kavya Reddy', rating: 5, product: 'Oxidised Jhumka Earrings', text: 'Love these earrings! Perfect weight, great finish. The oxidised look is very authentic and traditional.', platform: 'Shopify', date: '25 Aug 2024', sentiment: 'Positive' },
  { id: 4, customer: 'Meera Patel', rating: 3, product: 'Glass Bangle Set', text: 'Bangles are pretty but one broke during shipping. Customer service was helpful and sent a replacement quickly.', platform: 'Flipkart', date: '24 Aug 2024', sentiment: 'Neutral' },
  { id: 5, customer: 'Sunita Verma', rating: 5, product: 'Choker Pearl Necklace', text: 'Gorgeous choker! The pearls look very real and the clasp is sturdy. Perfect for both casual and formal occasions.', platform: 'Myntra', date: '23 Aug 2024', sentiment: 'Positive' },
  { id: 6, customer: 'Ritu Singh', rating: 2, product: 'Silver Toe Ring Set', text: 'The rings are smaller than expected. The size guide on the website is misleading. Returning these.', platform: 'Amazon', date: '22 Aug 2024', sentiment: 'Negative' },
  { id: 7, customer: 'Deepa Nair', rating: 5, product: 'Gold-plated Charm Bracelet', text: 'Excellent quality gold plating! Doesn\'t tarnish even after regular use. Very happy with this purchase.', platform: 'Google', date: '21 Aug 2024', sentiment: 'Positive' },
  { id: 8, customer: 'Pooja Agarwal', rating: 4, product: 'Meenakari Stud Earrings', text: 'Beautiful meenakari work, very detailed. The colours are vibrant. Slightly pricey but worth it for the quality.', platform: 'Shopify', date: '20 Aug 2024', sentiment: 'Positive' },
];

export const sentimentData = [
  { sentiment: 'Positive', count: 78, color: '#111827' },
  { sentiment: 'Neutral', count: 14, color: '#F59E0B' },
  { sentiment: 'Negative', count: 8, color: '#EF4444' },
];

export const topCustomersData = [
  { rank: 1, name: 'Priya Sharma', orders: 12, totalSpend: 84200, lastOrder: '28 Aug', segment: 'VIP' },
  { rank: 2, name: 'Anita Gupta', orders: 9, totalSpend: 62400, lastOrder: '26 Aug', segment: 'VIP' },
  { rank: 3, name: 'Kavya Reddy', orders: 8, totalSpend: 54800, lastOrder: '25 Aug', segment: 'VIP' },
  { rank: 4, name: 'Meera Patel', orders: 7, totalSpend: 48200, lastOrder: '24 Aug', segment: 'Returning' },
  { rank: 5, name: 'Sunita Verma', orders: 6, totalSpend: 42100, lastOrder: '23 Aug', segment: 'Returning' },
  { rank: 6, name: 'Deepa Nair', orders: 5, totalSpend: 36800, lastOrder: '21 Aug', segment: 'Returning' },
  { rank: 7, name: 'Pooja Agarwal', orders: 4, totalSpend: 28400, lastOrder: '20 Aug', segment: 'Returning' },
  { rank: 8, name: 'Ritu Singh', orders: 3, totalSpend: 18200, lastOrder: '22 Aug', segment: 'New' },
];

export const customerJourneyData = [
  { stage: 'Awareness', count: 124800, icon: '👁️' },
  { stage: 'Consideration', count: 48230, icon: '🤔' },
  { stage: 'Purchase', count: 8432, icon: '💳' },
  { stage: 'Retention', count: 2884, icon: '🔄' },
  { stage: 'Advocacy', count: 842, icon: '📣' },
];
