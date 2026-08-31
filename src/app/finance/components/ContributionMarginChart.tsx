'use client';
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useFinanceData } from '@/hooks/useFinanceData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Percent } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover p-3">
      <p className="text-xs font-600 text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-700 text-primary">{payload[0].value.toFixed(1)}%</p>
    </div>
  );
};

export default function ContributionMarginChart() {
  const { contributionMarginTrendData } = useFinanceData();

  return (
    <div className="chart-card h-full">
      <SectionHeader icon={<Percent size={14} />} label="Contribution Margin % Trend" />
      <p className="text-xs text-muted-foreground mb-2">Net margin after all variable costs</p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-800 text-foreground tabular-nums">63.4%</span>
        <span className="trend-pill-positive">↗ 4.5%</span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={contributionMarginTrendData}>
          <defs>
            <linearGradient id="cmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            domain={[55, 70]}
            tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="margin"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#cmGrad)"
            isAnimationActive
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}