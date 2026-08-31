'use client';
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { MapPin } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

export default function GeographicSalesPanel() {
  const { geographicSalesData } = useSalesData();
  const maxTotal = Math.max(...geographicSalesData?.map((g) => g?.total));

  return (
    <div className="chart-card">
      <SectionHeader
        icon={<MapPin size={14} />}
        label="Geographic Sales (Net Sales)"
        action={<button className="text-xs text-primary font-500 hover:underline">View detail →</button>}
      />
      <p className="text-xs text-muted-foreground mb-4">
        All channels · Realized net sales by state · Shopify + Marketplace
      </p>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-channel-shopify inline-block" />
          <span className="text-xs text-muted-foreground">Shopify</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-foreground inline-block" />
          <span className="text-xs text-muted-foreground">Marketplace</span>
        </div>
      </div>

      <div className="space-y-3">
        {geographicSalesData?.map((row) => {
          const shopifyWidth = (row?.shopify / maxTotal) * 100;
          const marketplaceWidth = (row?.marketplace / maxTotal) * 100;
          return (
            <div key={`geo-${row?.state}`} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rank-badge">{row?.rank}</span>
                  <span className="text-sm font-500 text-foreground">{row?.state}</span>
                </div>
                <span className="text-sm font-600 tabular-nums text-foreground">{formatINR(row?.total)}</span>
              </div>
              <div className="flex gap-0.5 h-2">
                <div
                  className="bg-channel-shopify rounded-l-full transition-all duration-700"
                  style={{ width: `${shopifyWidth}%` }}
                />
                <div
                  className="bg-foreground rounded-r-full transition-all duration-700"
                  style={{ width: `${marketplaceWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}