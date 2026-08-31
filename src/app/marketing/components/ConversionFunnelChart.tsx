'use client';
import React from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import { Info } from 'lucide-react';

const FUNNEL_COLORS = ['#a78bfa', '#818cf8', '#f9a8d4', '#fbbf24'];
const FUNNEL_LABELS = ['Sessions', 'Add to Cart', 'Checkouts', 'Purchases'];

export default function ConversionFunnelChart() {
  const { conversionFunnelData } = useMarketingData();

  const data = conversionFunnelData ?? [
    { stage: 'Sessions', value: 7321, pct: 100 },
    { stage: 'Add to Cart', value: 222, pct: 3.0 },
    { stage: 'Checkouts', value: 89, pct: 1.2 },
    { stage: 'Purchases', value: 38, pct: 0.5 },
  ];

  const sessToCart = data?.[0]?.value ? ((data?.[1]?.value / data?.[0]?.value) * 100)?.toFixed(2) : '0';
  const cartToCheckout = data?.[1]?.value ? ((data?.[2]?.value / data?.[1]?.value) * 100)?.toFixed(2) : '0';
  const checkoutToPurchase = data?.[2]?.value ? ((data?.[3]?.value / data?.[2]?.value) * 100)?.toFixed(2) : '0';
  const overall = data?.[0]?.value ? ((data?.[3]?.value / data?.[0]?.value) * 100)?.toFixed(2) : '0';

  const maxVal = data?.[0]?.value ?? 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Conversion Funnel</h3>
        <Info size={13} className="text-gray-400" />
      </div>
      <p className="text-xs text-gray-400 mb-5">GA4 · Sessions → Cart → Checkout → Purchases</p>

      {/* Funnel visual */}
      <div className="flex flex-col items-center gap-1 flex-1 justify-center">
        {data?.map((stage, i) => {
          const widthPct = Math.max(20, (stage?.value / maxVal) * 100);
          return (
            <div key={stage?.stage} className="w-full flex items-center gap-3">
              <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
                {i === 0 ? '100%' : `${((stage?.value / maxVal) * 100)?.toFixed(1)}%`}
              </span>
              <div className="flex-1 flex justify-center">
                <div
                  className="flex items-center justify-center rounded-sm transition-all duration-700 py-2.5"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: FUNNEL_COLORS?.[i],
                    minWidth: '60px',
                  }}
                >
                  <span className="text-xs font-bold text-white">
                    {stage?.value?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="w-20 flex-shrink-0">
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {FUNNEL_LABELS?.[i]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion stats */}
      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-100">
        {[
          { label: 'SESS → CART', value: `${sessToCart}%`, color: 'text-violet-600' },
          { label: 'CART → CHECKOUT', value: `${cartToCheckout}%`, color: 'text-pink-600' },
          { label: 'CHECK → PURCHASE', value: `${checkoutToPurchase}%`, color: 'text-amber-600' },
          { label: 'OVERALL CONV', value: `${overall}%`, color: 'text-gray-700' },
        ]?.map((stat) => (
          <div key={stat?.label} className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">{stat?.label}</p>
            <p className={`text-sm font-bold tabular-nums ${stat?.color}`}>{stat?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}