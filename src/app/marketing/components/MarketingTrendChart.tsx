'use client';
import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Scatter,  } from 'recharts';
import { Info, Settings2 } from 'lucide-react';

const TREND_DATA = [
  { date: '3 Aug', metaSpend: 3100, googleSpend: 1400, sales: 5800, roas: 1.42, anomaly: null },
  { date: '5 Aug', metaSpend: 3400, googleSpend: 1550, sales: 6200, roas: 1.55, anomaly: null },
  { date: '7 Aug', metaSpend: 2900, googleSpend: 1300, sales: 5100, roas: 1.38, anomaly: null },
  { date: '9 Aug', metaSpend: 3600, googleSpend: 1600, sales: 7200, roas: 1.68, anomaly: null },
  { date: '11 Aug', metaSpend: 4200, googleSpend: 1800, sales: 9800, roas: 1.82, anomaly: null },
  { date: '13 Aug', metaSpend: 5100, googleSpend: 2100, sales: 14200, roas: 2.12, anomaly: null },
  { date: '15 Aug', metaSpend: 3264, googleSpend: 1585, sales: 6437, roas: 1.97, anomaly: 1.97 },
  { date: '17 Aug', metaSpend: 6800, googleSpend: 2800, sales: 22000, roas: 2.48, anomaly: 2.48 },
  { date: '19 Aug', metaSpend: 8200, googleSpend: 3400, sales: 34000, roas: 3.12, anomaly: 3.12 },
  { date: '21 Aug', metaSpend: 9100, googleSpend: 3800, sales: 38000, roas: 3.28, anomaly: null },
  { date: '23 Aug', metaSpend: 4200, googleSpend: 1900, sales: 8200, roas: 1.48, anomaly: null },
  { date: '25 Aug', metaSpend: 3100, googleSpend: 1400, sales: 5400, roas: 1.32, anomaly: null },
  { date: '27 Aug', metaSpend: 2800, googleSpend: 1200, sales: 4800, roas: 1.28, anomaly: null },
  { date: '29 Aug', metaSpend: 2400, googleSpend: 1100, sales: 3900, roas: 1.18, anomaly: null },
  { date: '31 Aug', metaSpend: 2100, googleSpend: 980, sales: 3200, roas: 1.10, anomaly: null },
];

const formatCurrency = (v: number) => {
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[180px]">
      <p className="text-xs font-700 text-gray-700 mb-2">{label}</p>
      {metaSpend && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-red-500 font-500">Meta Spend:</span>
          <span className="text-xs font-700 text-red-600">{formatCurrency(metaSpend.value)}</span>
        </div>
      )}
      {googleSpend && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-blue-500 font-500">Google Spend:</span>
          <span className="text-xs font-700 text-blue-600">{formatCurrency(googleSpend.value)}</span>
        </div>
      )}
      {sales && (
        <div className="flex justify-between gap-4 mb-1">
          <span className="text-xs text-amber-600 font-500">Sales:</span>
          <span className="text-xs font-700 text-amber-700">{formatCurrency(sales.value)}</span>
        </div>
      )}
      {roas && (
        <div className="flex justify-between gap-4">
          <span className="text-xs text-emerald-600 font-500">ROAS:</span>
          <span className="text-xs font-700 text-emerald-700">{roas.value.toFixed(2)}x</span>
        </div>
      )}
    </div>
  );
};

const CustomLegend = () => (
  <div className="flex items-center gap-4 flex-wrap justify-center mt-2">
    <div className="flex items-center gap-1.5">
      <div className="w-6 h-0.5 bg-red-500" />
      <span className="text-xs text-gray-500">Meta Spend</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-6 border-t-2 border-dashed border-blue-500" />
      <span className="text-xs text-gray-500">Google Spend</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-6 h-0.5 bg-amber-500" />
      <span className="text-xs text-gray-500">Sales</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-6 border-t-2 border-dashed border-emerald-500" />
      <span className="text-xs text-gray-500">ROAS</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-orange-400" />
      <span className="text-xs text-gray-500">Anomaly</span>
    </div>
  </div>
);

export default function MarketingTrendChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Marketing Trend</h3>
          <Info size={13} className="text-gray-400" />
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings2 size={14} className="text-gray-400" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-4">Meta + Google · Spend · Sales · ROAS over time</p>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={TREND_DATA} margin={{ top: 10, right: 50, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          {/* Left Y axis - currency */}
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            domain={[0, 40000]}
          />
          {/* Right Y axis - ROAS multiplier */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v.toFixed(1)}x`}
            domain={[0, 4]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Meta Spend - solid red line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="metaSpend"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444' }}
            isAnimationActive
            animationDuration={1000}
          />
          {/* Google Spend - dashed blue line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="googleSpend"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
            isAnimationActive
            animationDuration={1100}
          />
          {/* Sales - solid amber/orange line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b' }}
            isAnimationActive
            animationDuration={1200}
          />
          {/* ROAS - dashed green line on right axis */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="roas"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
            isAnimationActive
            animationDuration={1300}
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
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="#f97316"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
}
