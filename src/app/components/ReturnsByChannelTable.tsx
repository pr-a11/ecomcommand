'use client';
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { RotateCcw } from 'lucide-react';

const channelColors: Record<string, string> = {
  Shopify: 'var(--channel-shopify)',
  Amazon: 'var(--channel-amazon)',
  Flipkart: 'var(--channel-flipkart)',
  Myntra: 'var(--channel-myntra)',
  Eternz: 'var(--channel-eternz)',
};

function ReturnPctBadge({ pct }: { pct: number }) {
  if (pct === 0) return <span className="text-xs font-600 text-primary">0%</span>;
  if (pct < 6)
    return (
      <span className="text-xs font-600 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
        {pct}%
      </span>
    );
  return (
    <span className="text-xs font-600 text-negative bg-red-50 px-1.5 py-0.5 rounded">{pct}%</span>
  );
}

export default function ReturnsByChannelTable() {
  const { returnsByChannelData } = useSalesData();

  return (
    <div className="chart-card">
      <SectionHeader icon={<RotateCcw size={14} />} label="Returns by Channel" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-600 text-muted-foreground pb-2 pr-6">
                Channel
              </th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-6">
                Returned Orders
              </th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2">Return %</th>
            </tr>
          </thead>
          <tbody>
            {returnsByChannelData.map((row) => (
              <tr
                key={`ret-${row.channel}`}
                className="border-b border-border/50 hover:bg-muted/40 transition-colors"
              >
                <td className="py-2.5 pr-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: channelColors[row.channel] || 'var(--muted-foreground)',
                      }}
                    />
                    <span className="text-sm font-500 text-foreground">{row.channel}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-6 text-right tabular-nums text-sm text-muted-foreground">
                  {row.returned}
                </td>
                <td className="py-2.5 text-right">
                  <ReturnPctBadge pct={row.returnPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state for no returns */}
      {returnsByChannelData.every((r) => r.returned === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-sm font-500">No returns in this period</p>
        </div>
      )}
    </div>
  );
}
