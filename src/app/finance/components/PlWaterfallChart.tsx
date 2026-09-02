'use client';
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { useFinanceData } from '@/hooks/useFinanceData';
import SectionHeader from '@/components/ui/SectionHeader';
import { ArrowDownUp } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover p-3 min-w-[160px]">
      <p className="text-xs font-600 text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-sm font-700 ${d.payload.type === 'negative' ? 'text-negative' : 'text-primary'}`}
      >
        {d.payload.value < 0 ? '−' : ''}
        {formatINR(Math.abs(d.payload.value))}
      </p>
    </div>
  );
};

export default function PlWaterfallChart() {
  const { plWaterfallData } = useFinanceData();

  const colorMap: Record<string, string> = {
    positive: 'var(--positive)',
    negative: 'var(--negative)',
    subtotal: '#94a3b8',
    total: 'var(--primary)',
  };

  return (
    <div className="chart-card">
      <SectionHeader icon={<ArrowDownUp size={14} />} label="P&L Waterfall" />
      <p className="text-xs text-muted-foreground mb-4">
        Gross Sales → Discounts → Cancellations → Invoiced → Returns → RTO → Net Sales
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={plWaterfallData} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={40}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(Math.abs(v) / 100000).toFixed(1)}L`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
          <Bar dataKey="value" isAnimationActive animationDuration={800} radius={[3, 3, 0, 0]}>
            {plWaterfallData.map((entry) => (
              <Cell
                key={`wf-${entry.label}`}
                fill={colorMap[entry.type]}
                opacity={entry.type === 'negative' ? 0.85 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
        {[
          { color: 'var(--positive)', label: 'Inflow' },
          { color: 'var(--negative)', label: 'Deduction' },
          { color: '#94a3b8', label: 'Subtotal' },
          { color: 'var(--primary)', label: 'Net Result' },
        ].map((l) => (
          <div key={`wfl-${l.label}`} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
