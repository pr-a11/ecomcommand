'use client';
import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { ShoppingCart } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

export default function AbandonedCartsCard() {
  // Backend integration point: connect to Shopify Abandoned Checkouts API
  const abandonedCarts = 54;
  const recoverableSales = 186420;

  return (
    <div className="chart-card h-full flex flex-col">
      <SectionHeader icon={<ShoppingCart size={14} />} label="Abandoned Carts" />
      <p className="text-xs text-muted-foreground mb-4">Shopify · Recoverable sales</p>

      <div className="flex flex-col items-center justify-center flex-1 gap-4 py-4">
        <div className="text-center">
          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground mb-1">
            Abandoned Carts
          </p>
          <p className="text-5xl font-800 text-foreground tabular-nums">{abandonedCarts}</p>
        </div>

        <div className="w-full h-px bg-border" />

        <div className="text-center">
          <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground mb-1">
            Recoverable Sales
          </p>
          <p className="text-2xl font-700 text-amber-600 tabular-nums">
            {formatINR(recoverableSales)}
          </p>
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-xs text-amber-700 font-500">
            Send recovery emails to reclaim up to {formatINR(recoverableSales)} in lost sales
          </p>
        </div>
      </div>
    </div>
  );
}
