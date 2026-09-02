'use client';
import React from 'react';
import SparklineChart from './SparklineChart';
import { formatINR } from './FormatINR';
import { Info, ChevronRight } from 'lucide-react';

interface KpiCardProps {
  label?: string;
  value?: number;
  change?: number;
  sparkline?: number[];
  badge?: string;
  caption?: string;
  isPercent?: boolean;
  isCurrency?: boolean;
  isMultiplier?: boolean;
  alert?: boolean;
  index?: number;
}

export default function KpiCard({
  label,
  value,
  change,
  sparkline,
  badge,
  caption,
  isPercent = false,
  isCurrency = false,
  isMultiplier = false,
  alert = false,
  index = 0,
}: KpiCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const isNeutral = change === 0 || change == null;

  const formatValue = (v?: number) => {
    if (v == null) return '—';
    if (isPercent) return `${v.toFixed(1)}%`;
    if (isMultiplier) return `${v.toFixed(2)}x`;
    if (isCurrency) return formatINR(v);
    return v.toLocaleString('en-IN');
  };

  const changeAbs = Math.abs(change ?? 0);
  const changeStr = `${isPositive ? '↑' : '↓'} ${changeAbs.toFixed(1)}%`;

  return (
    <div className="bs-kpi-card group" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="bs-kpi-label truncate">{label}</span>
          <Info size={9} className="text-gray-300 flex-shrink-0" />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {badge && (
            <span className="text-xs font-medium text-gray-400 flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {badge}
            </span>
          )}
          <ChevronRight
            size={11}
            className="text-gray-200 group-hover:text-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Value + trend pill */}
      <div className="flex items-end justify-between gap-1 mb-0.5">
        <span className="bs-kpi-value">{formatValue(value)}</span>
        {!isNeutral && (
          <span
            className={`bs-trend-pill flex-shrink-0 ${
              alert
                ? isPositive
                  ? 'bs-trend-positive'
                  : 'bs-trend-negative'
                : isPositive
                  ? 'bs-trend-positive'
                  : 'bs-trend-negative'
            }`}
          >
            {changeStr}
          </span>
        )}
        {isNeutral && change === 0 && (
          <span className="bs-trend-pill bs-trend-neutral flex-shrink-0">→ 0.0%</span>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p
          className={`text-xs mt-0.5 truncate leading-tight ${alert ? 'text-amber-600 font-medium' : 'text-gray-400'}`}
        >
          {caption}
        </p>
      )}

      {/* Sparkline at bottom — Brandstack style */}
      <div className="mt-2 -mx-1">
        <SparklineChart data={sparkline} positive={isPositive} height={30} />
      </div>
    </div>
  );
}
