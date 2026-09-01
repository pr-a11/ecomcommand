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
} from 'recharts';
import { useSalesData } from '@/hooks/useSalesData';
import { Info, Settings2 } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const netSales = payload.find((p: any) => p.dataKey === 'netSales');
  const netMargin = payload.find((p: any) => p.dataKey === 'netMargin');
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[180px]">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      {netSales && (
        <div className="flex justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: '#d4b896' }} />
            <span className="text-xs text-gray-500">Net Sales</span>
          </div>
          <span className="text-xs font-semibold text-gray-800">{formatINR(netSales.value)}</span>
        </div>
      )}
      {netMargin && (
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-emerald-500 flex-shrink-0" />
            <span className="text-xs text-gray-500">Net Margin</span>
          </div>
          <span className="text-xs font-semibold text-emerald-600">{formatINR(netMargin.value)}</span>
        </div>
      )}
      {netSales && netMargin && netSales.value > 0 && (
        <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
          <span className="text-xs text-gray-400">Margin %</span>
          <span className="text-xs font-bold text-emerald-600">
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
    <div className="bs-chart-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="bs-chart-title">Net Sales vs Net Margin</h3>
          <Info size={12} className="text-gray-300" />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-500 font-medium hover:text-gray-800 transition-colors">
            Open Order P&L →
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings2 size={13} className="text-gray-400" />
          </button>
        </div>
      </div>
      <p className="bs-chart-subtitle mb-4">
        Net Sales (after returns & RTO) · ₹5,84,721 · ₹3,70,641 margin (63.4%) over 29 days
      </p>

      <ResponsiveContainer width="100%" height={230}>
        <ComposedChart data={netSalesVsMarginData} barCategoryGap="32%">
          <defs>
            <linearGradient id="netSalesBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4b896" stopOpacity={1} />
              <stop offset="100%" stopColor="#d4b896" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar
            yAxisId="left"
            dataKey="netSales"
            fill="url(#netSalesBarGrad)"
            barSize={18}
            isAnimationActive
            animationDuration={700}
            radius={[2, 2, 0, 0]}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="netMargin"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive
            animationDuration={900}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#d4b896' }} />
          <span className="text-xs text-gray-400">Net Sales</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-emerald-500 flex-shrink-0" />
          <span className="text-xs text-gray-400">Net Margin</span>
        </div>
      </div>
    </div>
  );
}