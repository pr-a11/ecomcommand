'use client';
import React from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import SectionHeader from '@/components/ui/SectionHeader';
import { AlertTriangle, Download } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const marketplaceColors: Record<string, string> = {
  Amazon: 'var(--channel-amazon)',
  Flipkart: 'var(--channel-flipkart)',
  Myntra: 'var(--channel-myntra)',
  Eternz: 'var(--channel-eternz)',
};

export default function MarketplaceFeeTable() {
  const { marketplaceFeeData } = useFinanceData();

  return (
    <div className="chart-card">
      <SectionHeader
        icon={<AlertTriangle size={14} />}
        label="Marketplace Fee Leakage"
        action={
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12} />
            CSV
          </button>
        }
      />
      <p className="text-xs text-muted-foreground mb-4">Commission + closing + shipping fees eating into gross per channel</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-600 text-muted-foreground pb-2 pr-4">Marketplace</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-3">Referral %</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-3">Closing %</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-3">Shipping %</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-3">Total Fee %</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2">Fee Impact</th>
            </tr>
          </thead>
          <tbody>
            {marketplaceFeeData.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: marketplaceColors[row.marketplace] || 'var(--muted-foreground)' }}
                    />
                    <span className="text-sm font-500 text-foreground">{row.marketplace}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-right text-sm text-muted-foreground">{row.referralFee}%</td>
                <td className="py-2.5 pr-3 text-right text-sm text-muted-foreground">{row.closingFee}%</td>
                <td className="py-2.5 pr-3 text-right text-sm text-muted-foreground">{row.shippingFee}%</td>
                <td className="py-2.5 pr-3 text-right">
                  <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${
                    row.totalFee >= 25 ? 'text-negative bg-red-50' :
                    row.totalFee >= 22 ? 'text-amber-700 bg-amber-50': 'text-muted-foreground bg-muted'
                  }`}>
                    {row.totalFee}%
                  </span>
                </td>
                <td className="py-2.5 text-right tabular-nums text-sm font-600 text-negative">
                  −{formatINR(row.impact)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="py-2.5 pr-4 text-sm font-700 text-foreground" colSpan={5}>Total Fee Leakage</td>
              <td className="py-2.5 text-right tabular-nums text-sm font-700 text-negative">
                −{formatINR(marketplaceFeeData.reduce((s, r) => s + r.impact, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}