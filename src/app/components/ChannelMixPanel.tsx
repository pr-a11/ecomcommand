'use client';
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { PieChart } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

export default function ChannelMixPanel() {
  const { channelMixData } = useSalesData();
  const maxSales = Math.max(...channelMixData?.map((c) => c?.netSales));

  return (
    <div className="chart-card h-full">
      <SectionHeader icon={<PieChart size={14} />} label="Channel Mix" />
      <p className="text-xs text-muted-foreground mb-4">Net Sales · All Channels</p>
      <div className="space-y-3">
        {channelMixData?.map((ch, i) => (
          <div key={`cm-${ch?.channel}`} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rank-badge">{i + 1}</span>
                <span className="text-sm font-500 text-foreground">{ch?.channel}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{ch?.pct}%</span>
                <span className="text-sm font-600 text-foreground tabular-nums">{formatINR(ch?.netSales)}</span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(ch?.netSales / maxSales) * 100}%`,
                  backgroundColor: ch?.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}