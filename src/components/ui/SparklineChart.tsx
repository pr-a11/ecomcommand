'use client';
import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface SparklineChartProps {
  data?: number[];
  positive?: boolean;
  height?: number;
}

export default function SparklineChart({ data, positive = true, height = 36 }: SparklineChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ height }} />;
  }
  const chartData = data.map((v, i) => ({ i, v }));
  const strokeColor = positive ? 'var(--channel-shopify)' : 'var(--negative)';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={strokeColor}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}