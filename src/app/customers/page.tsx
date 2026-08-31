'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { useCustomersData } from '@/hooks/useCustomersData';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis,
  BarChart, Bar,
} from 'recharts';

const customerSegmentsData = [
  { name: 'New', value: 42, color: '#3B82F6' },
  { name: 'Returning', value: 34, color: '#10B981' },
  { name: 'VIP', value: 14, color: '#8B5CF6' },
  { name: 'At-Risk', value: 10, color: '#EF4444' },
];

const rfmData = Array.from({ length: 80 }, (_, i) => ({
  recency: Math.floor(Math.random() * 90) + 1,
  frequency: Math.floor(Math.random() * 12) + 1,
  monetary: Math.floor(Math.random() * 50000) + 5000,
  segment: ['VIP', 'Returning', 'New', 'At-Risk']?.[Math.floor(i % 4)],
}));

const sentimentData = [
  { sentiment: 'Positive', count: 78, color: '#10B981' },
  { sentiment: 'Neutral', count: 14, color: '#F59E0B' },
  { sentiment: 'Negative', count: 8, color: '#EF4444' },
];

const customerJourneyData = [
  { stage: 'Awareness', count: 124800, icon: '👁️' },
  { stage: 'Consideration', count: 48230, icon: '🤔' },
  { stage: 'Purchase', count: 8432, icon: '💳' },
  { stage: 'Retention', count: 2884, icon: '🔄' },
  { stage: 'Advocacy', count: 842, icon: '📣' },
];

function KpiCard({ label, value, change, isPercent, sparkline }: {
  label: string; value: number; change: number; isPercent?: boolean; sparkline: number[];
}) {
  const isPositive = change >= 0;
  const formatted = isPercent
    ? `${value.toFixed(1)}%`
    : value >= 10000
    ? `₹${(value / 1000).toFixed(1)}K`
    : value >= 1000
    ? value.toLocaleString('en-IN')
    : value.toString();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{formatted}</p>
      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change)}{typeof change === 'number' && Math.abs(change) < 10 ? '' : '%'}
      </span>
    </div>
  );
}

const SEGMENT_COLORS: Record<string, string> = {
  VIP: '#8B5CF6',
  Returning: '#10B981',
  New: '#3B82F6',
  'At-Risk': '#EF4444',
};

const PLATFORM_COLORS: Record<string, string> = {
  Google: '#4285F4',
  Amazon: '#F97316',
  Shopify: '#10B981',
  Flipkart: '#3B82F6',
  Myntra: '#EC4899',
};

export default function CustomersPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'rfm'>('overview');
  const { customersKpis, reviewsData, topCustomersData, isLoading, error } = useCustomersData();

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

  return (
    <AppLayout currentPath={pathname}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers & Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">Customer analytics, LTV & sentiment analysis</p>
        </div>

        {/* KPI Grid */}
        {customersKpis && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Object.values(customersKpis).map((kpi: any) => (
              <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} change={kpi.change} isPercent={kpi.isPercent} sparkline={kpi.sparkline} />
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {(['overview', 'reviews', 'rfm'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'rfm' ? 'RFM Analysis' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Segments Donut */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Segments</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={customerSegmentsData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {customerSegmentsData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Customer Journey */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Journey Funnel</h3>
                <div className="space-y-2">
                  {customerJourneyData.map((stage, i) => {
                    const maxCount = customerJourneyData[0].count;
                    const pct = (stage.count / maxCount) * 100;
                    return (
                      <div key={stage.stage} className="flex items-center gap-3">
                        <span className="text-lg w-8">{stage.icon}</span>
                        <span className="text-sm text-gray-600 w-28">{stage.stage}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="h-6 rounded-full flex items-center pl-3 transition-all"
                            style={{ width: `${pct}%`, backgroundColor: `hsl(${160 - i * 25}, 65%, ${45 + i * 5}%)` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-20 text-right">{stage.count.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Top Customers by LTV</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Rank', 'Customer', 'Orders', 'Total Spend', 'Last Order', 'Segment'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topCustomersData?.map((row: any) => (
                      <tr key={row.rank} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-gray-400">#{row.rank}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{row.orders}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{row.totalSpend.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{row.lastOrder}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${SEGMENT_COLORS[row.segment]}20`, color: SEGMENT_COLORS[row.segment] }}>
                            {row.segment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            {/* Sentiment Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Review Sentiment</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={sentimentData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="sentiment" tick={{ fontSize: 12 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                {sentimentData.map((s) => (
                  <div key={s.sentiment} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl" style={{ backgroundColor: `${s.color}20` }}>
                      {s.sentiment === 'Positive' ? '😊' : s.sentiment === 'Neutral' ? '😐' : '😞'}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{s.count}%</p>
                    <p className="text-xs text-gray-500">{s.sentiment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviewsData?.map((review: any) => (
                <div key={review.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.customer}</p>
                      <p className="text-xs text-gray-400">{review.product}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${PLATFORM_COLORS[review.platform] ?? '#6B7280'}20`, color: PLATFORM_COLORS[review.platform] ?? '#6B7280' }}>
                        {review.platform}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${review.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700' : review.sentiment === 'Negative' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                        {review.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-sm ${s <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                  <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'rfm' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-1">RFM Analysis — Recency vs Frequency</h3>
            <p className="text-xs text-gray-400 mb-4">Bubble size = Monetary value. Hover for details.</p>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="recency" name="Recency (days)" label={{ value: 'Recency (days ago)', position: 'insideBottom', offset: -10, fontSize: 12 }} tick={{ fontSize: 11 }} />
                <YAxis dataKey="frequency" name="Frequency (orders)" label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 11 }} />
                <ZAxis dataKey="monetary" range={[40, 400]} name="Monetary (₹)" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v: number, name: string) => [name === 'Monetary (₹)' ? `₹${v.toLocaleString('en-IN')}` : v, name]} />
                {['VIP', 'Returning', 'New', 'At-Risk'].map((seg) => (
                  <Scatter
                    key={seg}
                    name={seg}
                    data={rfmData.filter((d) => d.segment === seg)}
                    fill={SEGMENT_COLORS[seg]}
                    fillOpacity={0.7}
                  />
                ))}
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
