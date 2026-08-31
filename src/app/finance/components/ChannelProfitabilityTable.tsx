'use client';
import React from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import SectionHeader from '@/components/ui/SectionHeader';
import { BarChart2, Download } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const channelColors: Record<string, string> = {
  Shopify: 'var(--channel-shopify)',
  Amazon: 'var(--channel-amazon)',
  Flipkart: 'var(--channel-flipkart)',
  Myntra: 'var(--channel-myntra)',
  Eternz: 'var(--channel-eternz)',
};

function MarginBadge({ pct }: { pct: number }) {
  if (pct >= 65) return <span className="text-xs font-600 text-primary bg-green-50 px-2 py-0.5 rounded-full">{pct}%</span>;
  if (pct >= 55) return <span className="text-xs font-600 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{pct}%</span>;
  return <span className="text-xs font-600 text-negative bg-red-50 px-2 py-0.5 rounded-full">{pct}%</span>;
}

export default function ChannelProfitabilityTable() {
  const { channelProfitabilityData } = useFinanceData();

  return (
    <div className="chart-card">
      <SectionHeader
        icon={<BarChart2 size={14} />}
        label="Channel Profitability Scorecard"
        action={
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12} />
            CSV
          </button>
        }
      />
      <p className="text-xs text-muted-foreground mb-4">Net margin % and realisation per channel · Last 30 days</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-600 text-muted-foreground pb-2 pr-4">Channel</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">Gross Sales</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">Fees</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">Net Realisation</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">Take Rate</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2">Net Margin %</th>
            </tr>
          </thead>
          <tbody>
            {channelProfitabilityData.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: channelColors[row.channel] || 'var(--muted-foreground)' }}
                    />
                    <span className="text-sm font-500 text-foreground">{row.channel}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm text-muted-foreground">
                  {formatINR(row.grossSales)}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm text-negative">
                  −{formatINR(row.fees)}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm font-600 text-foreground">
                  {formatINR(row.netRealisation)}
                </td>
                <td className="py-2.5 pr-4 text-right text-sm text-muted-foreground">
                  {row.takeRate}%
                </td>
                <td className="py-2.5 text-right">
                  <MarginBadge pct={row.netMarginPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}