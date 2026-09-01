'use client';
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Info } from 'lucide-react';

const aovData = [
  { date: '2 Aug', current: 5200, previous: 4800 },
  { date: '4 Aug', current: 8400, previous: 5200 },
  { date: '6 Aug', current: 4800, previous: 4600 },
  { date: '8 Aug', current: 6200, previous: 5000 },
  { date: '10 Aug', current: 18200, previous: 9800 },
  { date: '12 Aug', current: 12400, previous: 7200 },
  { date: '14 Aug', current: 19800, previous: 10200 },
  { date: '16 Aug', current: 9200, previous: 6400 },
  { date: '18 Aug', current: 7400, previous: 5800 },
  { date: '20 Aug', current: 6800, previous: 5200 },
  { date: '22 Aug', current: 5600, previous: 4800 },
  { date: '24 Aug', current: 7200, previous: 5600 },
  { date: '26 Aug', current: 6400, previous: 5000 },
  { date: '28 Aug', current: 5800, previous: 4600 },
  { date: '31 Aug', current: 4200, previous: 3800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs min-w-[180px]">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-0.5 inline-block rounded"
              style={{
                backgroundColor: p.stroke,
                borderStyle: p.strokeDasharray ? 'dashed' : 'solid',
                opacity: p.strokeDasharray ? 0.6 : 1,
              }}
            />
            <span className="text-gray-500">
              {p.dataKey === 'current' ? 'Aug 2 – Aug 31, 2026' : 'Jul 3 – Aug 1, 2026'}
            </span>
          </div>
          <span className="font-semibold text-gray-800">₹{p.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

export default function AovOverTimeChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Average order value over time</h3>
          <Info size={13} className="text-gray-400" />
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-3">All channels · Daily AOV · current vs prev</p>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        AVERAGE ORDER VALUE
      </p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-gray-900">₹6,307.93</span>
        <span className="text-xs font-semibold text-gray-700">↑ 4.0%</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={aovData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#93c5fd"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            opacity={0.7}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 bg-blue-500 rounded inline-block" />
          <span className="text-xs text-gray-500">Aug 2 – Aug 31, 2026</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-px border-t-2 border-dashed border-blue-300 inline-block" />
          <span className="text-xs text-gray-500">Jul 3 – Aug 1, 2026</span>
        </div>
      </div>
    </div>
  );
}
