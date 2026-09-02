'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Info,
  Star,
  ChevronRight,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiData = [
  {
    label: 'TOTAL CUSTOMERS',
    value: '50',
    change: '+4.2%',
    sub: 'Growing customer base',
    sparkline: [30, 32, 35, 33, 38, 40, 42, 45, 44, 47, 49, 50],
  },
  {
    label: 'NEW CUSTOMERS',
    value: '45',
    change: '+2.3%',
    sub: 'Shopify D2C · first-time buyers',
    sparkline: [28, 30, 32, 29, 34, 36, 38, 40, 39, 42, 44, 45],
  },
  {
    label: 'RETURNING CUSTOMERS',
    value: '5',
    change: '+25.0%',
    sub: 'Shopify D2C · repeat buyers',
    sparkline: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5],
  },
  {
    label: 'REPEAT RATE',
    value: '10.0%',
    change: '+20.5%',
    sub: 'Below benchmark — focus retention',
    sparkline: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
  },
  {
    label: 'AVG LTV',
    value: '₹6,043',
    change: '+5.7%',
    sub: 'Across 48 customers',
    sparkline: [4200, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5700, 5800, 5950, 6043],
  },
  {
    label: 'STORE RATING',
    value: '★ 4.8',
    change: '',
    sub: '5 reviews · Excellent',
    sparkline: [4.2, 4.3, 4.5, 4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8],
  },
];

const topCustomers = [
  { rank: 1, name: 'Tara Rao', email: 'tar***@example.com', location: 'Chennai, Tamil Nadu' },
  { rank: 2, name: 'Riya Joshi', email: 'riy***@example.com', location: 'Lucknow, Uttar Pra...' },
  { rank: 3, name: 'Diya Nair', email: 'diy***@example.com', location: 'Jaipur, Rajasthan' },
  { rank: 4, name: 'Sara Nair', email: 'sar***@example.com', location: 'Jaipur, Rajasthan' },
  { rank: 5, name: 'Priya Sharma', email: 'pri***@example.com', location: 'Mumbai, Maharashtra' },
  { rank: 6, name: 'Anita Gupta', email: 'ani***@example.com', location: 'Delhi, NCR' },
];

const retentionStats = [
  { label: 'REPEAT PURCHASE RATE', value: '1.8%', sub: '1 of 57 bought again', highlight: true },
  { label: 'AVG ORDERS / CUSTOMER', value: '1.02', sub: 'lifetime, D2C', highlight: false },
  {
    label: '2ND ORDER ≤ 90 DAYS',
    value: '1.8%',
    sub: 'bought again within 3 months',
    highlight: false,
  },
  {
    label: 'AVG DAYS TO 2ND ORDER',
    value: '9 days',
    sub: 'for returning customers',
    highlight: false,
  },
];

const cohortData = [
  { cohort: 'All cohorts', customers: '57 customers', m0: '100%', m1: '0.0%', m0Highlight: false },
  { cohort: 'Aug 2026', customers: '57 customers', m0: '100%', m1: '0.0%', m0Highlight: true },
];

const ratingBreakdown = [
  { stars: 5, count: 4, pct: 80 },
  { stars: 4, count: 1, pct: 20 },
  { stars: 3, count: 0, pct: 0 },
  { stars: 2, count: 0, pct: 0 },
  { stars: 1, count: 0, pct: 0 },
];

const ratingDonutData = [
  { name: '5★', value: 80, color: '#111827' },
  { name: '4★', value: 20, color: '#d1d5db' },
];

const reviewsData = [
  {
    id: 1,
    stars: 5,
    verified: true,
    date: '14 Aug',
    title: "Bought this for my sister's wedding and everyone asked where",
    body: "Bought this for my sister's wedding and everyone asked where it was from.",
    reviewer: 'Sara Chopra',
  },
  {
    id: 2,
    stars: 5,
    verified: true,
    date: '14 Aug',
    title: 'The jhumkas are gorgeous and the finish is perfect.',
    body: 'The jhumkas are gorgeous and the finish is perfect.',
    reviewer: 'Nisha Nair',
  },
  {
    id: 3,
    stars: 4,
    verified: true,
    date: '08 Aug',
    title: 'Very nice piece, though slightly smaller than I expected.',
    body: 'Very nice piece, though slightly smaller than I expected.',
    reviewer: 'Meera Patel',
  },
  {
    id: 4,
    stars: 5,
    verified: true,
    date: '05 Aug',
    title: 'Absolutely stunning. Even better than the photos.',
    body: 'Absolutely stunning. Even better than the photos.',
    reviewer: 'Kavya Reddy',
  },
  {
    id: 5,
    stars: 5,
    verified: true,
    date: '01 Aug',
    title: 'Perfect for the occasion, great packaging too.',
    body: 'Perfect for the occasion, great packaging too.',
    reviewer: 'Priya Sharma',
  },
];

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

function MiniSparkline({ data, positive = true }: { data: number[]; positive?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const color = positive ? '#111827' : '#dc2626';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const pathname = usePathname();
  const [reviewFilter, setReviewFilter] = useState<'all' | 'latest'>('all');

  return (
    <AppLayout currentPath={pathname}>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers &amp; Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Customer analytics, retention &amp; reputation
          </p>
        </div>

        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpiData.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between min-h-[120px]"
            >
              <div className="flex items-center gap-1 mb-1">
                <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase leading-tight">
                  {kpi.label}
                </p>
                <Info size={10} className="text-gray-300 flex-shrink-0" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                {kpi.change && (
                  <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{kpi.sub}</p>
              <div className="mt-2">
                <MiniSparkline data={kpi.sparkline} positive />
              </div>
            </div>
          ))}
        </div>

        {/* ── Customer Identity ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Customer Identity — Shopify D2C
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Customers Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Top Customers</h3>
                    <Info size={13} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Shopify D2C · Highest spend this period
                  </p>
                </div>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                  View detail <ChevronRight size={13} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 w-8">
                        #
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 px-3 py-3">
                        CUSTOMER
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 px-3 py-3">
                        LOCATION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topCustomers.map((c) => (
                      <tr key={c.rank} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm font-bold text-gray-400">{c.rank}</td>
                        <td className="px-3 py-3">
                          <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500">{c.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Retention */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      Customer Retention &amp; Repeat Purchase
                    </h3>
                    <Info size={13} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Repeat purchase is tracked for Shopify D2C only — marketplaces anonymise buyers.
                    Each row is customers who first bought that month; each cell is the % who bought
                    again that many months later (darker = stickier).
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <RefreshCw size={13} />
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800">
                    <Download size={12} /> CSV
                  </button>
                </div>
              </div>

              {/* Retention Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {retentionStats.map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-lg p-3 ${s.highlight ? 'bg-gray-50 border border-gray-200' : 'bg-gray-50'}`}
                  >
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      {s.label}
                    </p>
                    <p
                      className={`text-lg font-bold mt-0.5 ${s.highlight ? 'text-gray-900' : 'text-gray-900'}`}
                    >
                      {s.value}
                    </p>
                    <p className="text-[10px] text-gray-400">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Cohort Table */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Repeat Purchase — Shopify D2C
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-semibold text-gray-400 py-2 pr-4">COHORT</th>
                      <th className="text-center font-semibold text-gray-400 py-2 px-3">M0</th>
                      <th className="text-center font-semibold text-gray-400 py-2 px-3">M1</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cohortData.map((row) => (
                      <tr key={row.cohort}>
                        <td className="py-2 pr-4">
                          <p className="font-semibold text-gray-900">{row.cohort}</p>
                          <p className="text-gray-400">{row.customers}</p>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded font-bold ${row.m0Highlight ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                          >
                            {row.m0}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center text-gray-500">{row.m1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews & Reputation ─────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Reviews &amp; Reputation
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
              <AlertCircle size={12} />
              Marketplace reviews unavailable — Shopify / Judge.me only.
            </div>
          </div>

          {/* Rating Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Rating Summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">Judge.me · Overall score breakdown</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <RefreshCw size={13} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Donut */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-28 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={52}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                      >
                        {ratingDonutData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">4.8</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">5 reviews</p>
                <p className="text-xs text-red-500 font-medium mt-0.5">↓ 0.50 trend</p>
              </div>

              {/* Star Breakdown */}
              <div className="flex-1 space-y-1.5">
                {ratingBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4 text-right">{row.stars}★</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${row.pct}%`,
                          backgroundColor:
                            row.stars >= 4 ? '#111827' : row.stars === 3 ? '#d97706' : '#dc2626',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{row.count}</span>
                    <span className="text-xs text-gray-400 w-8 text-right">{row.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                <div className="text-center border-r border-gray-100 pr-4">
                  <p className="text-lg font-bold text-gray-900">100%</p>
                  <p className="text-[10px] text-gray-400">Positive</p>
                  <p className="text-[10px] text-gray-400">4–5★</p>
                </div>
                <div className="text-center border-r border-gray-100 pr-4">
                  <p className="text-lg font-bold text-gray-900">0%</p>
                  <p className="text-[10px] text-gray-400">Negative</p>
                  <p className="text-[10px] text-gray-400">1–2★</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">0%</p>
                  <p className="text-[10px] text-gray-400">With</p>
                  <p className="text-[10px] text-gray-400">photos</p>
                </div>
              </div>
            </div>

            {/* No negative notice */}
            <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
              <span className="text-amber-500">💡</span>
              <p className="text-xs text-amber-700 font-medium">
                No negative reviews in this period
              </p>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Recent Reviews</h3>
                <p className="text-xs text-gray-400 mt-0.5">Judge.me · Latest customer feedback</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                View detail <ChevronRight size={13} />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mt-3 mb-4">
              <button
                onClick={() => setReviewFilter('all')}
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${reviewFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
              >
                All reviews <span className="text-[10px] opacity-70">▾</span>
              </button>
              <button
                onClick={() => setReviewFilter('latest')}
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${reviewFilter === 'latest' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
              >
                Latest first <span className="text-[10px] opacity-70">▾</span>
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-3">{reviewsData.length} reviews</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviewsData.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StarRow count={review.stars} />
                      {review.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          <CheckCircle size={9} className="text-gray-500" /> Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                    {review.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{review.body}</p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">{review.reviewer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
