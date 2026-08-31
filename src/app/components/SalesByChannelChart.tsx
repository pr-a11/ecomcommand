'use client';
import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  } from 'recharts';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { BarChart2 } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

type Channel = 'all' | 'shopify' | 'amazon' | 'flipkart' | 'myntra' | 'eternz';

const channelConfig = [
  { key: 'shopify' as const, label: 'Shopify', color: 'var(--channel-shopify)' },
  { key: 'amazon' as const, label: 'Amazon', color: 'var(--channel-amazon)' },
  { key: 'flipkart' as const, label: 'Flipkart', color: 'var(--channel-flipkart)' },
  { key: 'myntra' as const, label: 'Myntra', color: 'var(--channel-myntra)' },
  { key: 'eternz' as const, label: 'Eternz', color: 'var(--channel-eternz)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover p-3 min-w-[160px]">
      <p className="text-xs font-600 text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={`tt-${p.dataKey}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
            <span className="text-xs text-muted-foreground capitalize">{p.dataKey}</span>
          </div>
          <span className="text-xs font-600 text-foreground">{formatINR(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-border mt-2 pt-2 flex justify-between">
        <span className="text-xs font-600 text-foreground">Total</span>
        <span className="text-xs font-700 text-foreground">{formatINR(total)}</span>
      </div>
    </div>
  );
};

export default function SalesByChannelChart() {
  const { salesByChannelData } = useSalesData();
  const [activeChannel, setActiveChannel] = useState<Channel>('all');

  // Sample every 3rd date for readability
  const displayData = salesByChannelData.filter((_, i) => i % 2 === 0);

  return (
    <div className="chart-card">
      <SectionHeader
        icon={<BarChart2 size={14} />}
        label="Sales by Channel (Invoiced Sales)"
        action={
          <button className="text-xs text-primary font-500 hover:underline">View detail →</button>
        }
      />
      <p className="text-xs text-muted-foreground mb-4">All channels · Daily · Last 30 days</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={displayData} barSize={10} barGap={1}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          {channelConfig.map((ch) => (
            <Bar
              key={`bar-${ch.key}`}
              dataKey={ch.key}
              stackId="a"
              fill={ch.color}
              opacity={activeChannel === 'all' || activeChannel === ch.key ? 1 : 0.25}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Channel filter pills */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
        <button
          onClick={() => setActiveChannel('all')}
          className={`text-xs px-2.5 py-1 rounded-full font-500 transition-colors ${
            activeChannel === 'all' ?'bg-foreground text-card' :'bg-muted text-muted-foreground hover:bg-border'
          }`}
        >
          All
        </button>
        {channelConfig.map((ch) => (
          <button
            key={`pill-${ch.key}`}
            onClick={() => setActiveChannel(activeChannel === ch.key ? 'all' : ch.key)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-500 transition-colors ${
              activeChannel === ch.key ? 'text-card' : 'bg-muted text-muted-foreground hover:bg-border'
            }`}
            style={activeChannel === ch.key ? { backgroundColor: ch.color } : {}}
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