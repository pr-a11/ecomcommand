'use client';
import React from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import SectionHeader from '@/components/ui/SectionHeader';
import { MapPin } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

export default function GeographicSalesFinance() {
  const { geographicSalesFinance } = useFinanceData();
  const geoRows = geographicSalesFinance ?? [];
  const maxTotal = geoRows.length > 0 ? Math.max(...geoRows.map((g) => g?.total ?? 0)) : 0;
  const scale = maxTotal > 0 ? maxTotal : 1;

  return (
    <div className="chart-card h-full">
      <SectionHeader
        icon={<MapPin size={14} />}
        label="Geographic Sales (Net Sales)"
        action={
          <button className="text-xs text-primary font-500 hover:underline">View detail →</button>
        }
      />
      <p className="text-xs text-muted-foreground mb-3">
        All channels · Realized net sales by state · Shopify + Marketplace
      </p>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-10 h-2 rounded-sm bg-channel-shopify inline-block" />
          <span className="text-xs text-muted-foreground">Shopify</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-10 h-2 rounded-sm bg-foreground inline-block" />
          <span className="text-xs text-muted-foreground">Marketplace</span>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-64 pr-1 scrollbar-hide">
        {geoRows.map((row) => {
          const shopifyPct = ((row?.shopify ?? 0) / scale) * 100;
          const mktPct = ((row?.marketplace ?? 0) / scale) * 100;
          return (
            <div key={`gf-${row?.state}`} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rank-badge">{row?.rank}</span>
                  <span className="text-sm font-500 text-foreground">{row?.state}</span>
                </div>
                <span className="text-sm font-600 tabular-nums text-foreground">
                  {formatINR(row?.total)}
                </span>
              </div>
              <div className="flex gap-0.5 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-channel-shopify transition-all duration-700"
                  style={{ width: `${shopifyPct}%` }}
                />
                <div
                  className="bg-foreground transition-all duration-700"
                  style={{ width: `${mktPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
