'use client';
import React from 'react';
import { motion } from 'framer-motion';
import TrendPill from './TrendPill';
import SparklineChart from './SparklineChart';
import { formatINR } from './FormatINR';

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

  const formatValue = (v?: number) => {
    if (v == null) return '—';
    if (isPercent) return `${v.toFixed(1)}%`;
    if (isMultiplier) return `${v.toFixed(2)}x`;
    if (isCurrency) return formatINR(v);
    return v.toLocaleString('en-IN');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className={`kpi-card flex flex-col gap-2 ${alert ? 'border-warning/40 bg-amber-50/40' : ''}`}
    >
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="text-2xl font-800 text-foreground tabular-nums leading-none">
          {formatValue(value)}
        </span>
      </div>

      {/* Trend + caption */}
      <div className="flex items-center gap-2">
        <TrendPill value={change ?? 0} />
        {caption && (
          <span className={`text-xs ${alert ? 'text-warning font-semibold' : 'text-muted-foreground'}`}>
            {caption}
          </span>
        )}
      </div>

      {/* Sparkline */}
      <div className="mt-auto pt-1 -mx-1">
        <SparklineChart data={sparkline} positive={isPositive} height={32} />
      </div>
    </motion.div>
  );
}