'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { useMarketplaceData } from '@/hooks/useMarketplaceData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
} from 'recharts';

type Platform = 'amazon' | 'flipkart' | 'myntra';

const PLATFORM_COLORS: Record<Platform, string> = {
  amazon: '#F97316',
  flipkart: '#3B82F6',
  myntra: '#EC4899',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  myntra: 'Myntra',
};

const bsrData = [
  { day: '1 Aug', product1: 12400, product2: 18200, product3: 24100 },
  { day: '5 Aug', product1: 11800, product2: 17400, product3: 22800 },
  { day: '10 Aug', product1: 10200, product2: 15800, product3: 21400 },
  { day: '15 Aug', product1: 9400, product2: 14200, product3: 19800 },
  { day: '20 Aug', product1: 8800, product2: 13600, product3: 18200 },
  { day: '25 Aug', product1: 8200, product2: 12800, product3: 17400 },
  { day: '30 Aug', product1: 7600, product2: 12100, product3: 16800 },
];

const listingHealthMetrics = [
  { metric: 'Title Optimization', score: 92 },
  { metric: 'Image Quality', score: 88 },
  { metric: 'Bullet Points', score: 76 },
  { metric: 'A+ Content', score: 65 },
  { metric: 'Review Count', score: 84 },
  { metric: 'Price Competitiveness', score: 71 },
  { metric: 'Inventory Level', score: 90 },
  { metric: 'Keyword Ranking', score: 68 },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`text-sm ${s <= Math.floor(value) ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm font-semibold text-gray-700 ml-1">{value}</span>
    </div>
  );
}

function HealthBar({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#111827' : score >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-40 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{score}</span>
    </div>
  );
}

export default function MarketplacePage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<Platform>('amazon');
  const { marketplaceKpis, inventorySyncData, isLoading, error } = useMarketplaceData();

  const statusColor = (status: string) => {
    if (status === 'In Stock') return 'text-gray-700 bg-gray-100';
    if (status === 'Low Stock') return 'text-amber-600 bg-amber-50';
    if (status === 'Critical Low') return 'text-red-600 bg-red-50';
    return 'text-orange-600 bg-orange-50';
  };

  if (isLoading) {
    return (
      <AppLayout currentPath={pathname}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout currentPath={pathname}>
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      </AppLayout>
    );
  }

  const kpi = marketplaceKpis?.[activeTab];
  const color = PLATFORM_COLORS[activeTab];

  const crossPlatformData = marketplaceKpis
    ? (['amazon', 'flipkart', 'myntra'] as Platform[]).map((p) => ({
        platform: PLATFORM_LABELS[p],
        revenue: marketplaceKpis[p]?.revenue?.value ?? 0,
        color: PLATFORM_COLORS[p],
      }))
    : [];

  return (
    <AppLayout currentPath={pathname}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-0.5">Amazon, Flipkart & Myntra performance</p>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2">
          {(['amazon', 'flipkart', 'myntra'] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all border ${activeTab === p ? 'text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
              style={activeTab === p ? { backgroundColor: PLATFORM_COLORS[p] } : {}}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        {kpi && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[kpi.revenue, kpi.orders, kpi.returns, kpi.rating].map((metric: any) => {
              const isNegativeGood = metric.label === 'Return Rate';
              const isPositive = isNegativeGood
                ? (metric.change ?? 0) <= 0
                : (metric.change ?? 0) >= 0;
              const val =
                metric.label === 'Avg Rating'
                  ? metric.value.toFixed(1) + '★'
                  : metric.isPercent
                    ? metric.value.toFixed(1) + '%'
                    : metric.value >= 100000
                      ? '₹' + (metric.value / 100000).toFixed(2) + 'L'
                      : metric.value.toString();
              return (
                <div
                  key={metric.label}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
                >
                  <p className="text-xs text-gray-500 font-medium mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{val}</p>
                  {metric.change !== undefined && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-gray-100 text-gray-800' : 'bg-red-50 text-red-600'}`}
                    >
                      {isPositive ? '↑' : '↓'} {Math.abs(metric.change)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BSR Chart (Amazon only) */}
          {activeTab === 'amazon' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Best Seller Rank (Lower = Better)
              </h3>
              <p className="text-xs text-gray-400 mb-4">Top 3 products — last 30 days</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bsrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} reversed />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="product1"
                    name="Kundan Necklace"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="product2"
                    name="Bridal Combo"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="product3"
                    name="Jhumka Earrings"
                    stroke="#374151"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Listing Health */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Listing Health Score</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-4"
                  style={{ borderColor: color }}
                >
                  <span className="text-sm font-bold" style={{ color }}>
                    {kpi?.listingHealth ?? 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {listingHealthMetrics.map((m) => (
                <HealthBar key={m.metric} score={m.score} label={m.metric} />
              ))}
            </div>
          </div>
        </div>

        {/* Cross-Platform Comparison */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Cross-Platform Revenue Comparison
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={crossPlatformData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {crossPlatformData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Sync */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Inventory Sync</h3>
            <span className="text-xs text-gray-400">Live from Supabase</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    'Product',
                    'SKU',
                    'Shopify',
                    'Amazon',
                    'Flipkart',
                    'Myntra',
                    'Total',
                    'Status',
                  ].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inventorySyncData?.map((row: any) => (
                  <tr key={row.sku} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[180px] truncate">
                      {row.product}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{row.sku}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-gray-800">
                      {row.shopify}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-orange-600">
                      {row.amazon}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-blue-600">
                      {row.flipkart}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-pink-600">
                      {row.myntra}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">
                      {row.total}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
