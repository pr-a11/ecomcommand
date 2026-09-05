'use client';
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import { Info } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const CHANNEL_COLORS: Record<string, string> = {
  Shopify: '#22c55e',
  Myntra: '#ec4899',
  Eternz: '#14b8a6',
  Amazon: '#f97316',
  Flipkart: '#eab308',
};

const CHANNEL_MARGINS: Record<string, number> = {
  Shopify: 68.7,
  Myntra: 58.7,
  Eternz: 58.2,
  Amazon: 58.9,
  Flipkart: 59.0,
};

export default function ChannelMixPanel() {
  const { channelMixData } = useSalesData();
  const maxSales = Math.max(...(channelMixData?.map((c) => c?.netSales) ?? [1]));
  const totalSales = channelMixData?.reduce((s, c) => s + (c?.netSales ?? 0), 0) ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Channel Mix</h3>
          <Info size={13} className="text-gray-400" />
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1">
          Open Scorecard <span className="text-gray-400">›</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        {channelMixData?.length ?? 0} channels · {formatINR(totalSales)} net sales
      </p>

      <div className="space-y-4">
        {channelMixData?.map((ch) => {
          const color = CHANNEL_COLORS[ch?.channel] ?? '#94a3b8';
          const margin = CHANNEL_MARGINS[ch?.channel] ?? 58.0;
          const barWidth = (ch?.netSales / maxSales) * 100;
          return (
            <div key={ch?.channel}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-gray-800">{ch?.channel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800 tabular-nums">
                    {formatINR(ch?.netSales)}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 w-12 text-right tabular-nums">
                    {margin}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}