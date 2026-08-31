'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useMarketingData } from '@/hooks/useMarketingData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Filter } from 'lucide-react';

export default function ConversionFunnelChart() {
  const { conversionFunnelData } = useMarketingData();

  const sessToCart = ((conversionFunnelData?.[1]?.value / conversionFunnelData?.[0]?.value) * 100)?.toFixed(1);
  const cartToCheckout = ((conversionFunnelData?.[2]?.value / conversionFunnelData?.[1]?.value) * 100)?.toFixed(1);
  const checkoutToPurchase = ((conversionFunnelData?.[3]?.value / conversionFunnelData?.[2]?.value) * 100)?.toFixed(1);
  const overall = ((conversionFunnelData?.[3]?.value / conversionFunnelData?.[0]?.value) * 100)?.toFixed(2);

  const stageColors = ['var(--channel-flipkart)', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <div className="chart-card h-full flex flex-col">
      <SectionHeader icon={<Filter size={14} />} label="Conversion Funnel" />
      <p className="text-xs text-muted-foreground mb-4">GA4 · Sessions → Cart → Checkout → Purchases</p>

      {/* Funnel bars */}
      <div className="flex flex-col gap-2 flex-1">
        {conversionFunnelData?.map((stage, i) => {
          const widthPct = (stage?.value / conversionFunnelData?.[0]?.value) * 100;
          return (
            <div key={`funnel-${stage?.stage}`} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-500 text-foreground">{stage?.stage}</span>
                <span className="tabular-nums font-600 text-foreground">{stage?.value?.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-8 bg-muted rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-lg flex items-center px-2"
                  style={{ backgroundColor: stageColors?.[i] }}
                >
                  <span className="text-xs font-700 text-white">{stage?.pct}%</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
        {[
          { label: 'Sess → Cart', value: `${sessToCart}%` },
          { label: 'Cart → Checkout', value: `${cartToCheckout}%` },
          { label: 'Checkout → Buy', value: `${checkoutToPurchase}%` },
          { label: 'Overall Conv.', value: `${overall}%` },
        ]?.map((stat) => (
          <div key={`fstat-${stat?.label}`} className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">{stat?.label}</p>
            <p className="text-sm font-700 text-foreground tabular-nums">{stat?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}