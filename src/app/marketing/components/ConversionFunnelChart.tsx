'use client';
import React from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import { Info } from 'lucide-react';

const FUNNEL_LAYERS = [
  { fill: '#c4b5fd', label: 'Sessions', labelColor: '#5b21b6' },
  { fill: '#a78bfa', label: 'Add to Cart', labelColor: '#4c1d95' },
  { fill: '#f9a8d4', label: 'Checkouts', labelColor: '#9d174d' },
  { fill: '#fcd34d', label: 'Purchases', labelColor: '#92400e' },
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

  // SVG funnel — wider top, narrower bottom, matching reference
  const svgW = 240;
  const svgH = 220;
  const n = data?.length ?? 4;
  const gap = 3;
  const layerH = (svgH - gap * (n - 1)) / n;
  const topW = 200;
  const botW = 48;
  const cx = svgW / 2;

  const layers = data?.map((stage, i) => {
    const t = i / n;
    const b = (i + 1) / n;
    const tw = topW - (topW - botW) * t;
    const bw = topW - (topW - botW) * b;
    const y = i * (layerH + gap);
    return {
      x1t: cx - tw / 2, x2t: cx + tw / 2,
      x1b: cx - bw / 2, x2b: cx + bw / 2,
      y, midY: y + layerH / 2,
      stage, color: FUNNEL_LAYERS?.[i],
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Conversion Funnel</h3>
        <Info size={13} className="text-gray-400" />
      </div>
      <p className="text-xs text-gray-400 mb-4">GA4 · Sessions → Cart → Checkout → Purchases</p>

      {/* Funnel SVG + Labels */}
      <div className="flex items-center justify-center gap-3 flex-1">
        {/* Left % labels */}
        <div className="flex flex-col gap-0" style={{ height: svgH }}>
          {data?.map((stage, i) => {
            const y = i * (layerH + gap);
            const pct = i === 0 ? '100%' : `${((stage?.value / data?.[0]?.value) * 100)?.toFixed(1)}%`;
            return (
              <div
                key={stage?.stage}
                className="flex items-center justify-end"
                style={{ height: layerH, marginBottom: i < n - 1 ? gap : 0 }}
              >
                <span className="text-[11px] text-gray-400 tabular-nums font-medium">{pct}</span>
              </div>
            );
          })}
        </div>

        {/* SVG Funnel */}
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <defs>
            {layers?.map((l, i) => (
              <linearGradient key={i} id={`fgl${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l?.color?.fill} stopOpacity="1" />
                <stop offset="100%" stopColor={l?.color?.fill} stopOpacity="0.82" />
              </linearGradient>
            ))}
          </defs>
          {layers?.map((l, i) => (
            <g key={i}>
              <polygon
                points={`${l?.x1t},${l?.y} ${l?.x2t},${l?.y} ${l?.x2b},${l?.y + layerH} ${l?.x1b},${l?.y + layerH}`}
                fill={`url(#fgl${i})`}
                rx="2"
              />
              {/* Value label */}
              <text
                x={cx}
                y={l?.midY + 5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={l?.color?.labelColor}
              >
                {l?.stage?.value?.toLocaleString('en-IN')}
              </text>
            </g>
          ))}
        </svg>

        {/* Right stage labels */}
        <div className="flex flex-col gap-0" style={{ height: svgH }}>
          {FUNNEL_LAYERS?.map((c, i) => (
            <div
              key={c?.label}
              className="flex items-center gap-1.5"
              style={{ height: layerH, marginBottom: i < n - 1 ? gap : 0 }}
            >
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: c?.fill }} />
              <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">{c?.label}</span>
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
            <p className="text-[10px] text-gray-400 mb-0.5">{stat?.label}</p>
            <p className={`text-sm font-bold tabular-nums ${stat?.color}`}>{stat?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}