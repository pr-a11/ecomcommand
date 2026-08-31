'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { useInstagramData } from '@/hooks/useInstagramData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

function KpiCard({ label, value, change, isPercent, sparkline }: {
  label: string; value: number; change: number; isPercent?: boolean; sparkline: number[];
}) {
  const isPositive = change >= 0;
  const formatted = isPercent
    ? `${value.toFixed(2)}%`
    : value >= 1000000
    ? `${(value / 100000).toFixed(1)}L`
    : value >= 1000
    ? `${(value / 1000).toFixed(1)}K`
    : value.toString();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 min-w-[160px] flex-1">
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{formatted}</p>
      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
      </span>
    </div>
  );
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function InstagramPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'posts' | 'stories' | 'hashtags'>('posts');
  const { instagramKpis, postPerformanceData, topHashtagsData, isLoading, error } = useInstagramData();

  const storyPerformanceData = {
    completionRate: 72.4,
    swipeUpRate: 18.6,
    replies: 340,
    impressions: 52000,
    exits: 27.6,
  };

  const followerGrowthData = Array.from({ length: 90 }, (_, i) => ({
    day: i + 1,
    followers: 45000 + Math.floor(Math.random() * 500) * (i + 1),
  }));

  const postingTimesHeatmap = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ engagement: Math.floor(Math.random() * 100) }))
  );

  const storyDonutData = [
    { name: 'Completed', value: storyPerformanceData.completionRate, color: '#10B981' },
    { name: 'Exited', value: storyPerformanceData.exits, color: '#E5E7EB' },
  ];

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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instagram Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Content performance & audience insights</p>
        </div>

        {/* KPI Row */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {instagramKpis && Object.values(instagramKpis).map((kpi: any) => (
            <KpiCard key={kpi.label} {...kpi} sparkline={kpi.sparkline} />
          ))}
        </div>

        {/* Follower Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Follower Growth</h3>
          <p className="text-xs text-gray-400 mb-4">Last 90 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={followerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => `Day ${v}`} interval={14} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [v.toLocaleString('en-IN'), 'Followers']} />
              <Line type="monotone" dataKey="followers" stroke="#EC4899" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {(['posts', 'stories', 'hashtags'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {postPerformanceData?.map((post: any) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-32 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                  <span className="text-white text-xs font-semibold bg-black/30 px-2 py-0.5 rounded-full">{post.type}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.caption}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-base font-bold text-gray-900">{(post.likes / 1000).toFixed(1)}K</p><p className="text-xs text-gray-400">Likes</p></div>
                    <div><p className="text-base font-bold text-gray-900">{post.comments}</p><p className="text-xs text-gray-400">Comments</p></div>
                    <div><p className="text-base font-bold text-emerald-600">{post.engRate}%</p><p className="text-xs text-gray-400">Eng Rate</p></div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Story Completion Rate</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={storyDonutData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {storyDonutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-3xl font-bold text-gray-900">{storyPerformanceData.completionRate}%</p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Story Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Swipe-Up Rate', value: `${storyPerformanceData.swipeUpRate}%`, color: 'text-teal-600' },
                  { label: 'Replies', value: storyPerformanceData.replies.toString(), color: 'text-blue-600' },
                  { label: 'Impressions', value: `${(storyPerformanceData.impressions / 1000).toFixed(1)}K`, color: 'text-purple-600' },
                  { label: 'Exit Rate', value: `${storyPerformanceData.exits}%`, color: 'text-red-500' },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">{m.label}</span>
                    <span className={`text-lg font-bold ${m.color}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Top Performing Hashtags</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Hashtag', 'Posts Used', 'Avg Reach', 'Avg Engagement'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topHashtagsData?.map((row: any) => (
                    <tr key={row.tag} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-pink-600">{row.tag}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.posts}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{(row.avgReach / 1000).toFixed(1)}K</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-emerald-600">{row.avgEng}%</span>
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
          <h3 className="text-base font-semibold text-gray-900 mb-1">Best Posting Times</h3>
          <p className="text-xs text-gray-400 mb-4">Engagement heatmap by day & hour</p>
          <div className="overflow-x-auto">
            <div className="flex gap-1 mb-1">
              <div className="w-10" />
              {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
                <div key={h} className="flex-1 text-center text-xs text-gray-400">{h}h</div>
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
