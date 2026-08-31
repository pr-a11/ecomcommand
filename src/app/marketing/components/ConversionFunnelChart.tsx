'use client';
import React from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import { Info } from 'lucide-react';

const FUNNEL_COLORS = [
  { fill: '#a78bfa', label: 'Sessions' },
  { fill: '#818cf8', label: 'Add to Cart' },
  { fill: '#f9a8d4', label: 'Checkouts' },
  { fill: '#fbbf24', label: 'Purchases' },
];

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

  // SVG funnel dimensions
  const svgWidth = 260;
  const svgHeight = 200;
  const topWidth = 220;
  const bottomWidth = 60;
  const layerHeight = svgHeight / data?.length;
  const centerX = svgWidth / 2;

  const layers = data?.map((stage, i) => {
    const topW = topWidth - (topWidth - bottomWidth) * (i / data?.length);
    const botW = topWidth - (topWidth - bottomWidth) * ((i + 1) / data?.length);
    const y = i * layerHeight;
    const x1Top = centerX - topW / 2;
    const x2Top = centerX + topW / 2;
    const x1Bot = centerX - botW / 2;
    const x2Bot = centerX + botW / 2;
    return { x1Top, x2Top, x1Bot, x2Bot, y, stage, color: FUNNEL_COLORS?.[i] };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Conversion Funnel</h3>
        <Info size={13} className="text-gray-400" />
      </div>
      <p className="text-xs text-gray-400 mb-4">GA4 · Sessions → Cart → Checkout → Purchases</p>

      {/* Funnel SVG + Labels */}
      <div className="flex items-center justify-center gap-4 flex-1">
        {/* Left pct labels */}
        <div className="flex flex-col justify-around" style={{ height: svgHeight }}>
          {data?.map((stage, i) => (
            <div key={stage?.stage} className="text-right">
              <span className="text-xs text-gray-400 tabular-nums">
                {i === 0 ? '100%' : `${((stage?.value / data?.[0]?.value) * 100)?.toFixed(1)}%`}
              </span>
            </div>
          ))}
        </div>

        {/* SVG Funnel */}
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <defs>
            {layers?.map((l, i) => (
              <linearGradient key={i} id={`fg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l?.color?.fill} stopOpacity="1" />
                <stop offset="100%" stopColor={l?.color?.fill} stopOpacity="0.75" />
              </linearGradient>
            ))}
          </defs>
          {layers?.map((l, i) => (
            <g key={i}>
              <polygon
                points={`${l?.x1Top},${l?.y} ${l?.x2Top},${l?.y} ${l?.x2Bot},${l?.y + layerHeight - 2} ${l?.x1Bot},${l?.y + layerHeight - 2}`}
                fill={`url(#fg${i})`}
              />
              {/* Value label */}
              <text
                x={centerX}
                y={l?.y + layerHeight / 2 + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="white"
              >
                {stage?.value?.toLocaleString('en-IN')}
              </text>
            </g>
          ))}
        </svg>

        {/* Right stage labels */}
        <div className="flex flex-col justify-around" style={{ height: svgHeight }}>
          {FUNNEL_COLORS?.map((c, i) => (
            <div key={c?.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: c?.fill }} />
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{c?.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
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