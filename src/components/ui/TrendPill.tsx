import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendPillProps {
  value: number;
  suffix?: string;
}

export default function TrendPill({ value, suffix = '%' }: TrendPillProps) {
  if (value > 0) {
    return (
      <span className="trend-pill-positive">
        <TrendingUp size={10} />
        {value.toFixed(1)}
        {suffix}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="trend-pill-negative">
        <TrendingDown size={10} />
        {Math.abs(value).toFixed(1)}
        {suffix}
      </span>
    );
  }
  return (
    <span className="trend-pill-neutral">
      <Minus size={10} />0{suffix}
    </span>
  );
}
