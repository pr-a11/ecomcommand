'use client';
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,  } from 'recharts';
import { useFinanceData } from '@/hooks/useFinanceData';
import SectionHeader from '@/components/ui/SectionHeader';
import { TrendingUp } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover p-3 min-w-[180px]">
      <p className="text-xs font-600 text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={`nst-${p.dataKey}`} className="flex justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 inline-block" style={{ backgroundColor: p.stroke, borderStyle: p.strokeDasharray ? 'dashed' : 'solid' }} />
            <span className="text-xs text-muted-foreground">{p.dataKey === 'current' ? 'Aug 1–29' : 'Jul 2–31'}</span>
          </div>
          <span className="text-xs font-600 text-foreground">{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function NetSalesOverTimeChart() {
  const { netSalesOverTimeData } = useFinanceData();

  return (
    <div className="chart-card">
      <SectionHeader icon={<TrendingUp size={14} />} label="Net Sales Over Time" />
      <p className="text-xs text-muted-foreground mb-2">All channels · Daily net sales</p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-800 text-foreground tabular-nums">₹5,84,721</span>
        <span className="trend-pill-positive text-xs">↗ 95.4%</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={netSalesOverTimeData}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--channel-flipkart)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--channel-flipkart)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="current"
            stroke="var(--channel-flipkart)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="var(--channel-flipkart)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            opacity={0.45}
            isAnimationActive
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 bg-channel-flipkart rounded" />
          <span className="text-xs text-muted-foreground">Aug 1 – Aug 29, 2026</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-px border-t-2 border-dashed border-channel-flipkart opacity-50" />
          <span className="text-xs text-muted-foreground">Jul 2 – Jul 31, 2026</span>
        </div>
      </div>
    </div>
  );
}