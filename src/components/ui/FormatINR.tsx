import React from 'react';

export function formatINR(value: number): string {
  if (value >= 10000000) {
    const cr = value / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    const lakh = value / 100000;
    return `₹${lakh.toFixed(2)} L`;
  }
  // Indian comma grouping
  const str = Math.abs(Math.round(value)).toString();
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.slice(-3);
    const rest = str.slice(0, -3);
    const groups = [];
    for (let i = rest.length; i > 0; i -= 2) {
      groups.unshift(rest.slice(Math.max(0, i - 2), i));
    }
    result = groups.join(',') + ',' + last3;
  }
  return `₹${value < 0 ? '-' : ''}${result}`;
}

interface FormatINRProps {
  value: number;
  className?: string;
}

export default function FormatINR({ value, className = '' }: FormatINRProps) {
  return <span className={`tabular-nums ${className}`}>{formatINR(value)}</span>;
}
