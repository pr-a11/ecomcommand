'use client';
import React from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import { Info } from 'lucide-react';
import * as mockMarketing from '@/data/mock/marketing';

const FUNNEL_COLORS = [
  { from: '#8b5cf6', to: '#7c3aed', label: 'Sessions', textColor: '#5b21b6' },
  { from: '#a78bfa', to: '#8b5cf6', label: 'Add to Cart', textColor: '#4c1d95' },
  { from: '#f472b6', to: '#ec4899', label: 'Checkouts', textColor: '#9d174d' },
  { from: '#fbbf24', to: '#f59e0b', label: 'Purchases', textColor: '#92400e' },
];

export default function ConversionFunnelChart() {
  const { conversionFunnelData: hookData } = useMarketingData();

  const data = hookData && hookData?.length > 0 ? hookData : mockMarketing?.conversionFunnelData;

  const sessToCart = data?.[0]?.value
    ? ((data?.[1]?.value / data?.[0]?.value) * 100)?.toFixed(2)
    : '0';
  const cartToCheckout = data?.[1]?.value
    ? ((data?.[2]?.value / data?.[1]?.value) * 100)?.toFixed(2)
    : '0';
  const checkoutToPurchase = data?.[2]?.value
    ? ((data?.[3]?.value / data?.[2]?.value) * 100)?.toFixed(2)
    : '0';
  const overall = data?.[0]?.value
    ? ((data?.[3]?.value / data?.[0]?.value) * 100)?.toFixed(2)
    : '0';

  const svgW = 220;
  const svgH = 200;
  const n = Math.max(data?.length ?? 4, 1);
  const gap = 4;
  const layerH = (svgH - gap * (n - 1)) / n;
  const topW = 200;
  const botW = 52;
  const cx = svgW / 2;

  const layers = data?.map((stage, i) => {
    const t = i / n;
    const b = (i + 1) / n;
    const tw = topW - (topW - botW) * t;
    const bw = topW - (topW - botW) * b;
    const y = i * (layerH + gap);
    const pct = i === 0 ? 100 : (stage?.value / data?.[0]?.value) * 100;
    return {
      x1t: cx - tw / 2,
      x2t: cx + tw / 2,
      x1b: cx - bw / 2,
      x2b: cx + bw / 2,
      y,
      midY: y + layerH / 2,
      stage,
      color: FUNNEL_COLORS?.[i],
      pct,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-gray-900">Conversion Funnel</h3>
        <Info size={13} className="text-gray-400" />
      </div>
      <p className="text-xs text-gray-400 mb-4">GA4 · Sessions → Cart → Checkout → Purchases</p>

      {/* Funnel SVG */}
      <div className="flex items-center justify-center gap-2 flex-1">
        {/* Left % labels */}
        <div className="flex flex-col" style={{ height: svgH }}>
          {layers?.map((l, i) => (
            <div
              key={`pct-${i}`}
              className="flex items-center justify-end"
              style={{ height: layerH, marginBottom: i < n - 1 ? gap : 0 }}
            >
              <span className="text-[10px] text-gray-400 tabular-nums font-semibold">
                {l?.pct?.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* SVG Funnel */}
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <defs>
            {layers?.map((l, i) => (
              <linearGradient key={`grad-${i}`} id={`fgrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l?.color?.from} stopOpacity="1" />
                <stop offset="100%" stopColor={l?.color?.to} stopOpacity="0.9" />
              </linearGradient>
            ))}
            {/* Shine overlay */}
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0.15" />
              <stop offset="50%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          {layers?.map((l, i) => (
            <g key={`layer-${i}`}>
              {/* Main trapezoid */}
              <polygon
                points={`${l?.x1t},${l?.y} ${l?.x2t},${l?.y} ${l?.x2b},${l?.y + layerH} ${l?.x1b},${l?.y + layerH}`}
                fill={`url(#fgrad${i})`}
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))',
                }}
              />
              {/* Shine overlay */}
              <polygon
                points={`${l?.x1t},${l?.y} ${l?.x2t},${l?.y} ${l?.x2b},${l?.y + layerH} ${l?.x1b},${l?.y + layerH}`}
                fill="url(#shine)"
              />
              {/* Value label */}
              <text
                x={cx}
                y={l?.midY + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="white"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              >
                {l?.stage?.value?.toLocaleString('en-IN')}
              </text>
            </g>
          ))}
        </svg>

        {/* Right stage labels */}
        <div className="flex flex-col" style={{ height: svgH }}>
          {FUNNEL_COLORS?.map((c, i) => (
            <div
              key={`label-${c?.label}`}
              className="flex items-center gap-1.5"
              style={{ height: layerH, marginBottom: i < n - 1 ? gap : 0 }}
            >
              <div
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${c?.from}, ${c?.to})` }}
              />
              <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                {c?.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
        {[
          { label: 'SESS → CART', value: `${sessToCart}%`, color: 'text-violet-600' },
          { label: 'CART → CHECK', value: `${cartToCheckout}%`, color: 'text-pink-600' },
          { label: 'CHECK → BUY', value: `${checkoutToPurchase}%`, color: 'text-amber-600' },
          { label: 'OVERALL CONV', value: `${overall}%`, color: 'text-gray-700' },
        ]?.map((stat) => (
          <div key={stat?.label} className="text-center">
            <p className="text-[9px] text-gray-400 mb-0.5 font-semibold tracking-wide">
              {stat?.label}
            </p>
            <p className={`text-sm font-bold tabular-nums ${stat?.color}`}>{stat?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
