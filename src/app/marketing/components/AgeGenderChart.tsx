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
import { useMarketingData } from '@/hooks/useMarketingData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Users } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover p-3 min-w-[180px]">
      <p className="text-xs font-600 text-muted-foreground mb-2">Age {label}</p>
      {payload.map((p: any) => (
        <div key={`ag-${p.dataKey}`} className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-muted-foreground capitalize">{p.name}</span>
          <span className="text-xs font-600 text-foreground">
            {p.dataKey === 'visitors' ? p.value.toLocaleString('en-IN') : formatINR(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AgeGenderChart() {
  const { ageGenderData } = useMarketingData();

  return (
    <div className="chart-card">
      <SectionHeader icon={<Users size={14} />} label="Buyer Persona — Age & Gender" />
      <p className="text-xs text-muted-foreground mb-4">
        Meta Ads spend + attributed sales (left axis) · GA4 visitors (right axis) by age bracket
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={ageGenderData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="spend"
            name="Ad Spend"
            fill="var(--channel-meta)"
            opacity={0.7}
            barSize={18}
            isAnimationActive
            animationDuration={800}
          />
          <Bar
            yAxisId="left"
            dataKey="sales"
            name="Attr. Sales"
            fill="var(--primary)"
            opacity={0.85}
            barSize={18}
            isAnimationActive
            animationDuration={900}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="visitors"
            name="visitors"
            stroke="var(--channel-amazon)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--channel-amazon)' }}
            isAnimationActive
            animationDuration={1000}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Gender split */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-3">
          Gender Split (Meta Ads buyers)
        </p>
        <div className="space-y-2">
          {[
            {
              label: 'Female',
              value: ageGenderData.reduce((s, d) => s + d.female, 0),
              color: 'var(--channel-myntra)',
            },
            {
              label: 'Male',
              value: ageGenderData.reduce((s, d) => s + d.male, 0),
              color: 'var(--channel-flipkart)',
            },
          ].map((g) => {
            const total = ageGenderData.reduce((s, d) => s + d.female + d.male, 0);
            const pct = ((g.value / total) * 100).toFixed(0);
            return (
              <div key={`gender-${g.label}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-500 text-foreground">{g.label}</span>
                  <span className="tabular-nums text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
