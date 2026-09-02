'use client';
import React from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Globe } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const channelColors: Record<string, string> = {
  'Organic Search': 'var(--primary)',
  Direct: 'var(--muted-foreground)',
  'Meta Ads': 'var(--channel-meta)',
  'Google Ads': 'var(--channel-google)',
};

export default function ChannelSessionsTable() {
  const { channelSessionsData } = useMarketingData();
  const maxSessions = Math.max(...channelSessionsData.map((c) => c.sessions));

  return (
    <div className="chart-card">
      <SectionHeader icon={<Globe size={14} />} label="Channel Performance" />
      <p className="text-xs text-muted-foreground mb-4">
        GA4 · Sessions, orders, sales, and conversion rate by traffic source
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-600 text-muted-foreground pb-2 pr-4">
                Channel
              </th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">
                Sessions
              </th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">
                Orders
              </th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">Sales</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2">Conv. %</th>
            </tr>
          </thead>
          <tbody>
            {channelSessionsData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/50 hover:bg-muted/40 transition-colors"
              >
                <td className="py-2.5 pr-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: channelColors[row.channel] || 'var(--muted-foreground)',
                        }}
                      />
                      <span className="text-sm font-500 text-foreground">{row.channel}</span>
                    </div>
                    {/* Inline session bar */}
                    <div className="h-1 bg-muted rounded-full overflow-hidden ml-4">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(row.sessions / maxSessions) * 100}%`,
                          backgroundColor: channelColors[row.channel] || 'var(--muted-foreground)',
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm text-muted-foreground">
                  {row.sessions.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm text-muted-foreground">
                  {row.orders}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm font-600 text-foreground">
                  {formatINR(row.sales)}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`text-xs font-700 px-2 py-0.5 rounded-full ${
                      row.convRate >= 1.8
                        ? 'bg-gray-100 text-primary'
                        : row.convRate >= 1.4
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-negative'
                    }`}
                  >
                    {row.convRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
