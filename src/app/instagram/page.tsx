'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { useInstagramData } from '@/hooks/useInstagramData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Info, Eye, Bookmark, Heart, MessageCircle, Share2, Play, Image as ImageIcon } from 'lucide-react';

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  change,
  isPercent,
  sub,
}: {
  label: string;
  value: number;
  change: number;
  isPercent?: boolean;
  sub?: string;
}) {
  const isPositive = change >= 0;
  const formatted = isPercent
    ? `${value.toFixed(1)}%`
    : value >= 1000000
    ? `${(value / 100000).toFixed(1)}L`
    : value >= 1000
    ? `${(value / 1000).toFixed(1)}K`
    : value.toString();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 min-w-[150px] flex-1">
      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{formatted}</p>
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
          isPositive ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-600'
        }`}
      >
        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
      </span>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Growth & Reach multi-line data ────────────────────────────────────────────
const growthData = Array.from({ length: 17 }, (_, i) => {
  const date = new Date('2026-08-02');
  date.setDate(date.getDate() + i);
  const d = date.toISOString().slice(0, 10);
  return {
    date: d,
    Reach: 1948 + Math.floor(Math.sin(i * 0.6) * 600 + i * 80),
    Views: 3230 + Math.floor(Math.cos(i * 0.5) * 800 + i * 120),
    Followers: 25193 + i * 10,
  };
});

// ── Engagement multi-line data ────────────────────────────────────────────────
const engagementData = Array.from({ length: 17 }, (_, i) => {
  const date = new Date('2026-08-02');
  date.setDate(date.getDate() + i);
  const d = date.toISOString().slice(0, 10);
  return {
    date: d,
    Saves: 240 + Math.floor(Math.sin(i * 0.7) * 60),
    Likes: 80 + Math.floor(Math.cos(i * 0.5) * 20),
    Comments: 20 + Math.floor(Math.sin(i * 0.9) * 8),
    Shares: 15 + Math.floor(Math.cos(i * 0.8) * 6),
  };
});

// ── Content Performance mock data ─────────────────────────────────────────────
const CONTENT_POSTS = [
  { id: 1, type: 'Post', date: '2026-08-16', engRate: 9.8, reach: 33900, saves: 709, likes: 2400, comments: 52, shares: 108, views: 43700 },
  { id: 2, type: 'Reel', date: '2026-08-10', engRate: 9.2, reach: 25500, saves: 375, likes: 1700, comments: 53, shares: 190, views: 22300 },
  { id: 3, type: 'Post', date: '2026-08-07', engRate: 11.3, reach: 22700, saves: 257, likes: 2100, comments: 67, shares: 98, views: 39600 },
  { id: 4, type: 'Post', date: '2026-08-13', engRate: 11.6, reach: 14100, saves: 192, likes: 1300, comments: 10, shares: 85, views: 20600 },
  { id: 5, type: 'Post', date: '2026-08-04', engRate: 15.1, reach: 9300, saves: 198, likes: 1100, comments: 22, shares: 95, views: 20000 },
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function ContentPostCard({ post }: { post: typeof CONTENT_POSTS[0] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-shrink-0 w-[220px]">
      {/* Type badge */}
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 bg-gray-800/80 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            {post.type === 'Reel' ? <Play size={10} fill="white" /> : <ImageIcon size={10} />}
            {post.type}
          </span>
        </div>
        {/* Thumbnail placeholder */}
        <div className="h-[160px] bg-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <ImageIcon size={28} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Date + Engagement */}
      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
        <span className="text-xs text-gray-500">{post.date}</span>
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-gray-800">
          <span className="text-gray-400">↗</span> {post.engRate}% ENG
        </span>
      </div>

      {/* Stats grid */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-x-2 gap-y-1.5">
        <div className="flex items-center gap-1">
          <Eye size={11} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{formatNum(post.reach)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Reach</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Bookmark size={11} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{formatNum(post.saves)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Saves</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Heart size={11} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{formatNum(post.likes)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Likes</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={11} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{post.comments}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Comments</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Share2 size={11} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{post.shares}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Shares</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Play size={11} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{formatNum(post.views)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Views</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomGrowthTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-3 mb-0.5">
          <span style={{ color: p.color }}>{p.dataKey}</span>
          <span className="font-semibold text-gray-800">{p.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function InstagramPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'posts' | 'stories' | 'hashtags'>('posts');
  const [contentFilter, setContentFilter] = useState<'Reach' | 'Recent'>('Reach');
  const { postPerformanceData, topHashtagsData, isLoading, error } = useInstagramData();

  const postingTimesHeatmap = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      const peakHours = [9, 12, 18, 20, 21];
      const peakDays = [3, 4, 5];
      const isPeak = peakHours.includes(hour) && peakDays.includes(day);
      const isGood = hour >= 8 && hour <= 22 && day >= 1 && day <= 5;
      const base = isPeak ? 80 : isGood ? 40 : 10;
      return { engagement: base + Math.floor(Math.random() * 20) };
    })
  );

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
        {/* KPI Row */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          <KpiCard label="FOLLOWERS" value={25329} change={0.5} sub="↑ 136 new followers" />
          <KpiCard label="REACH" value={30019} change={-29.5} sub="vs prior period" />
          <KpiCard label="PROFILE VISITS" value={3075} change={-29.5} sub="vs prior period" />
          <KpiCard label="ENGAGEMENT RATE" value={19.0} change={0.0} isPercent sub="vs prior period" />
          <KpiCard label="CONTENT PUBLISHED" value={5} change={-50.0} sub="vs prior period" />
          <KpiCard label="AVG REEL WATCH" value={6.6} change={-37.0} sub="vs prior period" />
          <KpiCard label="FB FOLLOWERS" value={7777} change={0} sub="Facebook Page · organic" />
        </div>

        {/* Growth & Reach + Engagement */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Growth & Reach */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-gray-900">Growth &amp; Reach</h3>
              <Info size={13} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mb-4">Instagram · organic</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomGrowthTooltip />} />
                <Legend
                  iconType="line"
                  iconSize={16}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="Reach" stroke="#d97706" strokeWidth={2} dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="Views" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="Followers" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Engagement</h3>
                <Info size={13} className="text-gray-400" />
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                View detail ›
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Interactions · saves = buy-intent</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomGrowthTooltip />} />
                <Legend iconType="line" iconSize={16} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="Saves" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Likes" stroke="#d97706" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Comments" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Shares" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Content Performance ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Content Performance</h3>
              <Info size={13} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                {(['Reach', 'Recent'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setContentFilter(f)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      contentFilter === f
                        ? 'bg-gray-900 text-white' :'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-0.5">
                View all ›
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Top posts &amp; reels by reach</p>

          {/* Horizontal scrollable cards */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CONTENT_POSTS.map((post) => (
              <ContentPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {(['posts', 'stories', 'hashtags'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {postPerformanceData?.map((post: any) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-semibold bg-black/30 px-2 py-0.5 rounded-full">
                    {post.type}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.caption}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {(post.likes / 1000).toFixed(1)}K
                      </p>
                      <p className="text-xs text-gray-400">Likes</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">{post.comments}</p>
                      <p className="text-xs text-gray-400">Comments</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">{post.engRate}%</p>
                      <p className="text-xs text-gray-400">Eng Rate</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between text-xs text-gray-400">
                    <span>Reach: {(post.reach / 1000).toFixed(1)}K</span>
                    <span>Saved: {post.saved}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Story Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Completion Rate', value: '68.4%', color: 'text-gray-900' },
                { label: 'Swipe-Up Rate', value: '4.2%', color: 'text-blue-600' },
                { label: 'Replies', value: '284', color: 'text-purple-600' },
                { label: 'Exit Rate', value: '31.6%', color: 'text-red-500' },
              ].map((m) => (
                <div key={m.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Top Performing Hashtags</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Hashtag', 'Posts Used', 'Avg Reach', 'Avg Engagement'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topHashtagsData?.map((row: any) => (
                    <tr key={row.tag} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-pink-600">{row.tag}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.posts}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {(row.avgReach / 1000).toFixed(1)}K
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-800">{row.avgEng}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posting Times Heatmap */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Best Posting Times</h3>
          <p className="text-xs text-gray-400 mb-4">Engagement heatmap by day &amp; hour</p>
          <div className="overflow-x-auto">
            <div className="flex gap-1 mb-1">
              <div className="w-10" />
              {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
                <div key={h} className="flex-1 text-center text-xs text-gray-400">
                  {h}h
                </div>
              ))}
            </div>
            {postingTimesHeatmap.map((dayData, dayIdx) => (
              <div key={dayIdx} className="flex gap-1 mb-1">
                <div className="w-10 text-xs text-gray-500 flex items-center">{DAYS[dayIdx]}</div>
                {dayData.map((cell, hourIdx) => (
                  <div
                    key={hourIdx}
                    className="flex-1 h-5 rounded-sm"
                    style={{ backgroundColor: `rgba(236, 72, 153, ${cell.engagement / 100})` }}
                    title={`${DAYS[dayIdx]} ${hourIdx}:00 — ${cell.engagement}% engagement`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
