'use client';
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { TrendingUp } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const netSales = payload.find((p: any) => p.dataKey === 'netSales');
  const netMargin = payload.find((p: any) => p.dataKey === 'netMargin');
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover p-3 min-w-[180px]">
      <p className="text-xs font-600 text-muted-foreground mb-2">{label}</p>
      {netSales && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-muted-foreground">Net Sales</span>
          <span className="text-xs font-600 text-foreground">{formatINR(netSales.value)}</span>
        </div>
      )}
      {netMargin && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-muted-foreground">Net Margin</span>
          <span className="text-xs font-600 text-primary">{formatINR(netMargin.value)}</span>
        </div>
      )}
      {netSales && netMargin && (
        <div className="border-t border-border mt-2 pt-2 flex justify-between">
          <span className="text-xs text-muted-foreground">Margin %</span>
          <span className="text-xs font-700 text-primary">
            {((netMargin.value / netSales.value) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default function NetSalesVsMarginChart() {
  const { netSalesVsMarginData } = useSalesData();

  return (
    <div className="chart-card">
      <SectionHeader
        icon={<TrendingUp size={14} />}
        label="Net Sales vs Net Margin"
        action={
          <button className="text-xs text-primary font-500 hover:underline">Open Order P&L →</button>
        }
      />
      <p className="text-xs text-muted-foreground mb-4">
        Net Sales (after returns & RTO) · ₹5,84,721 · ₹3,70,641 margin (63.4%) over 29 days
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={netSalesVsMarginData}>
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4b896" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#d4b896" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
          <Bar
            yAxisId="left"
            dataKey="netSales"
            fill="url(#barFill)"
            barSize={14}
            isAnimationActive
            animationDuration={800}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="netMargin"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={1000}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground capitalize">
                {value === 'netSales' ? 'Net Sales' : 'Net Margin'}
              </span>
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}