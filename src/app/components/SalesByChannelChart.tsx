'use client';
import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useSalesData } from '@/hooks/useSalesData';
import { Info, Settings2 } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

type Channel = 'all' | 'shopify' | 'amazon' | 'flipkart' | 'myntra' | 'eternz';

const channelConfig = [
  { key: 'shopify' as const, label: 'Shopify', color: '#22c55e' },
  { key: 'amazon' as const, label: 'Amazon', color: '#f97316' },
  { key: 'flipkart' as const, label: 'Flipkart', color: '#f59e0b' },
  { key: 'myntra' as const, label: 'Myntra', color: '#ec4899' },
  { key: 'eternz' as const, label: 'Eternz', color: '#14b8a6' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={`tt-${p.dataKey}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: p.fill }}
            />
            <span className="text-xs text-gray-500 capitalize">{p.dataKey}</span>
          </div>
          <span className="text-xs font-semibold text-gray-800">{formatINR(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
        <span className="text-xs font-semibold text-gray-600">Total</span>
        <span className="text-xs font-bold text-gray-900">{formatINR(total)}</span>
      </div>
    </div>
  );
};

export default function SalesByChannelChart() {
  const { salesByChannelData } = useSalesData();
  const [activeChannel, setActiveChannel] = useState<Channel>('all');

  const displayData = salesByChannelData.filter((_, i) => i % 2 === 0);

  return (
    <div className="bs-chart-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="bs-chart-title">Sales by Channel (Invoiced Sales)</h3>
          <Info size={12} className="text-gray-300" />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-500 font-medium hover:text-gray-800 transition-colors">
            View detail →
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings2 size={13} className="text-gray-400" />
          </button>
        </div>
      </div>
      <p className="bs-chart-subtitle mb-4">All channels · Daily · Last 30 days</p>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={displayData} barSize={14} barGap={1} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          {channelConfig.map((ch) => (
            <Bar
              key={`bar-${ch.key}`}
              dataKey={ch.key}
              stackId="a"
              fill={ch.color}
              opacity={activeChannel === 'all' || activeChannel === ch.key ? 1 : 0.12}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Channel filter pills — Brandstack exact style */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => setActiveChannel('all')}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
            activeChannel === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          All
        </button>
        {channelConfig.map((ch) => (
          <button
            key={`pill-${ch.key}`}
            onClick={() => setActiveChannel(activeChannel === ch.key ? 'all' : ch.key)}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5"
            style={
              activeChannel === ch.key
                ? {
                    backgroundColor: ch.color + '18',
                    color: ch.color,
                    borderColor: ch.color + '50',
                  }
                : { backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
            }
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: ch.color }}
            />
            {ch.label}
          </button>
        ))}
      </div>
    </div>
  );
}
