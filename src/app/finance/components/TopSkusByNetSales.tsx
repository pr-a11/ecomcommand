'use client';
import React from 'react';
import { Info } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const TOP_SKUS = [
  { rank: 1, sku: 'NM-SET-007', name: 'Polki Wedding Set', revenue: 79196, shopify: 75, marketplace: 60 },
  { rank: 2, sku: 'NM-NEC-001', name: 'Kundan Choker', revenue: 57593, shopify: 65, marketplace: 80 },
  { rank: 3, sku: 'NM-SET-002', name: 'Festive Pearl Set', revenue: 50396, shopify: 55, marketplace: 70 },
  { rank: 4, sku: 'NM-SET-003', name: 'Temple Jewellery Set', revenue: 46797, shopify: 45, marketplace: 65 },
  { rank: 5, sku: 'NM-SET-001', name: 'Bridal Kundan Set', revenue: 44998, shopify: 60, marketplace: 70 },
  { rank: 6, sku: 'NM-NEC-004', name: 'Temple Pendant Set', revenue: 33794, shopify: 50, marketplace: 60 },
  { rank: 7, sku: 'NM-NEC-002', name: 'Pearl Bani Haar', revenue: 20798, shopify: 40, marketplace: 55 },
];

export default function TopSkusByNetSales() {
  const maxBar = 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Top SKUs by Net Sales</h3>
          <Info size={13} className="text-gray-400" />
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
          View detail ›
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        All channels · Top 10 SKUs by realized net sales · Shopify + Marketplace
      </p>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-gray-900 inline-block" />
          <span className="text-xs text-gray-500">Shopify</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-gray-900 inline-block" />
          <span className="text-xs text-gray-500">Marketplace</span>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">
        {TOP_SKUS?.map((sku) => (
          <div key={sku?.sku}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-xs font-bold text-gray-600 flex items-center justify-center flex-shrink-0">
                  {sku?.rank}
                </span>
                <div>
                  <p className="text-xs text-gray-400">{sku?.sku}</p>
                  <p className="text-sm font-medium text-gray-800">{sku?.name}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {formatINR(sku?.revenue)}
              </span>
            </div>
            {/* Dual bars */}
            <div className="space-y-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all duration-700"
                  style={{ width: `${(sku?.shopify / maxBar) * 100}%` }}
                />
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all duration-700"
                  style={{ width: `${(sku?.marketplace / maxBar) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
