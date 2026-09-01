'use client';
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
} from 'recharts';
import { Info, Settings2 } from 'lucide-react';

const TREND_DATA = [
  { date: '4 Aug', metaSpend: 3100, googleSpend: 1400, sales: 5800, roas: 1.42, anomaly: null },
  { date: '6 Aug', metaSpend: 3400, googleSpend: 1550, sales: 6200, roas: 1.55, anomaly: null },
  { date: '8 Aug', metaSpend: 2900, googleSpend: 1300, sales: 5100, roas: 1.38, anomaly: null },
  { date: '10 Aug', metaSpend: 3600, googleSpend: 1600, sales: 7200, roas: 1.68, anomaly: null },
  { date: '12 Aug', metaSpend: 4200, googleSpend: 1800, sales: 9800, roas: 1.82, anomaly: null },
  { date: '14 Aug', metaSpend: 5100, googleSpend: 2100, sales: 14200, roas: 2.12, anomaly: null },
  { date: '16 Aug', metaSpend: 3264, googleSpend: 1585, sales: 6437, roas: 1.97, anomaly: 1.97 },
  { date: '18 Aug', metaSpend: 6800, googleSpend: 2800, sales: 22000, roas: 2.48, anomaly: 2.48 },
  { date: '20 Aug', metaSpend: 8200, googleSpend: 3400, sales: 34000, roas: 3.12, anomaly: 3.12 },
  { date: '22 Aug', metaSpend: 9100, googleSpend: 3800, sales: 38000, roas: 3.28, anomaly: null },
  { date: '24 Aug', metaSpend: 4200, googleSpend: 1900, sales: 8200, roas: 1.48, anomaly: null },
  { date: '26 Aug', metaSpend: 3100, googleSpend: 1400, sales: 5400, roas: 1.32, anomaly: null },
  { date: '28 Aug', metaSpend: 2800, googleSpend: 1200, sales: 4800, roas: 1.28, anomaly: null },
  { date: '30 Aug', metaSpend: 2400, googleSpend: 1100, sales: 3900, roas: 1.18, anomaly: null },
  { date: '1 Sept', metaSpend: 2100, googleSpend: 980, sales: 3200, roas: 1.10, anomaly: null },
];

const fmt = (v: number) => {
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const metaSpend = payload.find((p: any) => p.dataKey === 'metaSpend');
  const googleSpend = payload.find((p: any) => p.dataKey === 'googleSpend');
  const sales = payload.find((p: any) => p.dataKey === 'sales');
  const roas = payload.find((p: any) => p.dataKey === 'roas');

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[175px]">
      <p className="text-xs font-bold text-gray-700 mb-2">{label}</p>
      {metaSpend && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-red-500">Meta Spend</span>
          <span className="text-xs font-bold text-red-600">{fmt(metaSpend.value)}</span>
        </div>
      )}
      {googleSpend && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-blue-500">Google Spend</span>
          <span className="text-xs font-bold text-blue-600">{fmt(googleSpend.value)}</span>
        </div>
      )}
      {sales && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-amber-600">Sales</span>
          <span className="text-xs font-bold text-amber-700">{fmt(sales.value)}</span>
        </div>
      )}
      {roas && (
        <div className="flex justify-between gap-4">
          <span className="text-xs text-emerald-600">ROAS</span>
          <span className="text-xs font-bold text-emerald-700">{roas.value.toFixed(2)}x</span>
        </div>
      )}
    </div>
  );
};

export default function MarketingTrendChart() {
  return (
    <div className="bs-chart-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="bs-chart-title">Marketing Trend</h3>
          <Info size={12} className="text-gray-300" />
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings2 size={13} className="text-gray-400" />
        </button>
      </div>
      <p className="bs-chart-subtitle mb-4">Meta + Google · Spend · Sales · ROAS over time</p>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={TREND_DATA} margin={{ top: 8, right: 48, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            domain={[0, 42000]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v.toFixed(1)}x`}
            domain={[0, 4.5]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Meta Spend - solid red */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="metaSpend"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: '#ef4444' }}
            isAnimationActive
            animationDuration={900}
          />
          {/* Google Spend - dashed blue */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="googleSpend"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 3, fill: '#3b82f6' }}
            isAnimationActive
            animationDuration={1000}
          />
          {/* Sales - solid amber */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 3, fill: '#f59e0b' }}
            isAnimationActive
            animationDuration={1100}
          />
          {/* ROAS - dashed green on right axis */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="roas"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 3, fill: '#10b981' }}
            isAnimationActive
            animationDuration={1200}
          />
          {/* Anomaly dots */}
          <Scatter
            yAxisId="right"
            dataKey="anomaly"
            fill="#f97316"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              if (!payload?.anomaly) return <g />;
              return (
                <circle cx={cx} cy={cy} r={5} fill="#f97316" stroke="#fff" strokeWidth={1.5} />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-red-500 flex-shrink-0" />
          <span className="text-xs text-gray-400">Meta Spend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 border-t-2 border-dashed border-blue-500 flex-shrink-0" />
          <span className="text-xs text-gray-400">Google Spend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-amber-500 flex-shrink-0" />
          <span className="text-xs text-gray-400">Sales</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 border-t-2 border-dashed border-emerald-500 flex-shrink-0" />
          <span className="text-xs text-gray-400">ROAS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0" />
          <span className="text-xs text-gray-400">Anomaly</span>
        </div>
      </div>
    </div>
  );
}
