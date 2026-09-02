'use client';

export const instagramKpis = {
  followers: {
    value: 124830,
    change: 2.3,
    label: 'Followers',
    sparkline: [
      118000, 119200, 120100, 121000, 121800, 122400, 123100, 123600, 124000, 124300, 124600,
      124830,
    ],
  },
  reach: {
    value: 842100,
    change: 15.7,
    label: 'Reach',
    sparkline: [
      620000, 650000, 680000, 700000, 720000, 740000, 760000, 780000, 800000, 815000, 830000,
      842100,
    ],
  },
  impressions: {
    value: 2430000,
    change: 22.1,
    label: 'Impressions',
    sparkline: [
      1800000, 1900000, 2000000, 2050000, 2100000, 2150000, 2200000, 2280000, 2320000, 2370000,
      2410000, 2430000,
    ],
  },
  engagementRate: {
    value: 4.82,
    change: 0.6,
    label: 'Engagement Rate',
    isPercent: true,
    sparkline: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.55, 4.65, 4.7, 4.75, 4.8, 4.82],
  },
  profileVisits: {
    value: 18420,
    change: 31.2,
    label: 'Profile Visits',
    sparkline: [12000, 13000, 13500, 14200, 15000, 15800, 16200, 16800, 17200, 17800, 18100, 18420],
  },
  linkClicks: {
    value: 3241,
    change: 18.9,
    label: 'Link Clicks',
    sparkline: [2200, 2400, 2500, 2600, 2700, 2800, 2850, 2950, 3000, 3100, 3180, 3241],
  },
};

export const followerGrowthData = Array.from({ length: 90 }, (_, i) => {
  const base = 110000;
  const growth = Math.floor(i * 165 + Math.sin(i * 0.3) * 800);
  return { day: i + 1, followers: base + growth };
});

export const postPerformanceData = [
  {
    id: 1,
    type: 'Reel',
    gradient: 'from-pink-400 to-rose-600',
    caption: 'Kundan Bridal Set — Timeless Beauty ✨',
    likes: 4821,
    comments: 312,
    shares: 892,
    reach: 48200,
    engRate: 12.4,
    saved: 1240,
  },
  {
    id: 2,
    type: 'Carousel',
    gradient: 'from-amber-400 to-orange-500',
    caption: 'Wedding Season Collection 2024 💍',
    likes: 3642,
    comments: 241,
    shares: 621,
    reach: 36400,
    engRate: 9.8,
    saved: 980,
  },
  {
    id: 3,
    type: 'Reel',
    gradient: 'from-teal-400 to-cyan-600',
    caption: 'How to style oxidised jewellery 🌿',
    likes: 5214,
    comments: 428,
    shares: 1124,
    reach: 62100,
    engRate: 11.2,
    saved: 1820,
  },
  {
    id: 4,
    type: 'Post',
    gradient: 'from-violet-400 to-purple-600',
    caption: 'Diwali Gifting Guide 🪔',
    likes: 2841,
    comments: 184,
    shares: 412,
    reach: 28400,
    engRate: 7.6,
    saved: 640,
  },
  {
    id: 5,
    type: 'Story',
    gradient: 'from-emerald-400 to-green-600',
    caption: 'Behind the scenes — crafting process',
    likes: 1924,
    comments: 98,
    shares: 214,
    reach: 19200,
    engRate: 6.2,
    saved: 320,
  },
  {
    id: 6,
    type: 'Carousel',
    gradient: 'from-blue-400 to-indigo-600',
    caption: 'Silver Toe Ring Collection 🌸',
    likes: 3182,
    comments: 196,
    shares: 524,
    reach: 31800,
    engRate: 8.4,
    saved: 760,
  },
  {
    id: 7,
    type: 'Reel',
    gradient: 'from-rose-400 to-pink-600',
    caption: 'Trending: Layered Necklace Look 💫',
    likes: 6841,
    comments: 512,
    shares: 1482,
    reach: 84200,
    engRate: 14.1,
    saved: 2240,
  },
  {
    id: 8,
    type: 'Post',
    gradient: 'from-yellow-400 to-amber-500',
    caption: 'Customer Spotlight — Real Brides 👰',
    likes: 2214,
    comments: 162,
    shares: 341,
    reach: 22100,
    engRate: 5.9,
    saved: 480,
  },
  {
    id: 9,
    type: 'Carousel',
    gradient: 'from-cyan-400 to-teal-600',
    caption: 'New Arrivals: Meenakari Collection',
    likes: 3841,
    comments: 248,
    shares: 682,
    reach: 38400,
    engRate: 9.1,
    saved: 920,
  },
];

export const postingTimesHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const peakHours = [9, 12, 18, 20, 21];
    const peakDays = [3, 4, 5]; // Thu, Fri, Sat
    const isPeak = peakHours?.includes(hour) && peakDays?.includes(day);
    const isGood = hour >= 8 && hour <= 22 && day >= 1 && day <= 5;
    const base = isPeak ? 80 : isGood ? 40 : 10;
    return { day, hour, engagement: base + Math.floor(Math.random() * 20) };
  })
);

export const topHashtagsData = [
  { tag: '#indianjewellery', posts: 142, avgReach: 18400, avgEng: 6.2 },
  { tag: '#bridaljewellery', posts: 98, avgReach: 24200, avgEng: 8.4 },
  { tag: '#kundan', posts: 84, avgReach: 21800, avgEng: 7.8 },
  { tag: '#oxidisedjewellery', posts: 76, avgReach: 16400, avgEng: 5.9 },
  { tag: '#silverjewellery', posts: 68, avgReach: 14200, avgEng: 5.1 },
  { tag: '#ethnicjewellery', posts: 62, avgReach: 19800, avgEng: 7.2 },
  { tag: '#weddingjewellery', posts: 54, avgReach: 28400, avgEng: 9.6 },
  { tag: '#jewellerydesign', posts: 48, avgReach: 12800, avgEng: 4.8 },
  { tag: '#handmadejewellery', posts: 42, avgReach: 11200, avgEng: 4.2 },
  { tag: '#diwali2024', posts: 38, avgReach: 32400, avgEng: 11.2 },
];

export const storyPerformanceData = {
  completionRate: 68.4,
  swipeUpRate: 4.2,
  replies: 284,
  impressions: 124800,
  exits: 31.6,
};

function mockInstagram(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: mockInstagram is not implemented yet.', args);
  return null;
}

export default mockInstagram;
