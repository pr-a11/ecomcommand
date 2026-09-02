'use client';
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Tag } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const categoryColors: Record<string, string> = {
  Necklace: 'bg-violet-100 text-violet-700',
  Combo: 'bg-cyan-100 text-cyan-700',
  Earring: 'bg-pink-100 text-pink-700',
  Ring: 'bg-amber-100 text-amber-700',
  Bangle: 'bg-orange-100 text-orange-700',
  Bracelet: 'bg-gray-100 text-gray-700',
};

export default function TopSkusPanel() {
  const { topSkusData } = useSalesData();
  const maxSales = Math.max(...topSkusData.map((s) => s.netSales));

  return (
    <div className="chart-card">
      <SectionHeader icon={<Tag size={14} />} label="Top SKUs by Net Sales" />
      <p className="text-xs text-muted-foreground mb-4">Shopify + Marketplace · Last 30 days</p>

      <div className="space-y-3">
        {topSkusData.map((sku) => (
          <div key={`sku-${sku.sku}`} className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <span className="rank-badge flex-shrink-0 mt-0.5">{sku.rank}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-600 text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {sku.sku}
                    </span>
                    <span
                      className={`text-xs font-500 px-1.5 py-0.5 rounded-full ${categoryColors[sku.category] || 'bg-muted text-muted-foreground'}`}
                    >
                      {sku.category}
                    </span>
                  </div>
                  <p className="text-sm font-500 text-foreground mt-0.5 truncate">{sku.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sku.units}u · {sku.orders}o
                  </p>
                </div>
              </div>
              <span className="text-sm font-700 tabular-nums text-foreground flex-shrink-0">
                {formatINR(sku.netSales)}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden ml-7">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${(sku.netSales / maxSales) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
