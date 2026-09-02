'use client';
import React from 'react';
import KpiCard from '@/components/ui/KpiCard';
import { useMarketingData } from '@/hooks/useMarketingData';
import { useSalesData } from '@/hooks/useSalesData';

export default function MarketingKpiGrid() {
  const { marketingKpiData } = useMarketingData();
  const { kpiData } = useSalesData();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-7 gap-3">
      <KpiCard
        label={marketingKpiData?.grossSales?.label}
        value={marketingKpiData?.grossSales?.value}
        change={marketingKpiData?.grossSales?.change}
        sparkline={kpiData?.grossSales?.sparkline}
        caption={marketingKpiData?.grossSales?.caption}
        isCurrency
        index={0}
      />
      <KpiCard
        label={marketingKpiData?.totalAdSpend?.label}
        value={marketingKpiData?.totalAdSpend?.value}
        change={marketingKpiData?.totalAdSpend?.change}
        sparkline={kpiData?.adsSpend?.sparkline}
        caption={marketingKpiData?.totalAdSpend?.caption}
        isCurrency
        alert={marketingKpiData?.totalAdSpend?.alert}
        index={1}
      />
      <KpiCard
        label={marketingKpiData?.blendedROAS?.label}
        value={marketingKpiData?.blendedROAS?.value}
        change={marketingKpiData?.blendedROAS?.change}
        sparkline={[12, 13, 14, 13.5, 13.8, 13.2, 13.7]}
        caption={marketingKpiData?.blendedROAS?.caption}
        isMultiplier
        index={2}
      />
      <KpiCard
        label={marketingKpiData?.attributedSales?.label}
        value={marketingKpiData?.attributedSales?.value}
        change={marketingKpiData?.attributedSales?.change}
        sparkline={[18000, 22000, 19000, 24000, 21000, 23000, 22000]}
        caption={marketingKpiData?.attributedSales?.caption}
        isCurrency
        index={3}
      />
      <KpiCard
        label={marketingKpiData?.attributedROAS?.label}
        value={marketingKpiData?.attributedROAS?.value}
        change={marketingKpiData?.attributedROAS?.change}
        sparkline={kpiData?.attributedROAS?.sparkline}
        caption={marketingKpiData?.attributedROAS?.caption}
        isMultiplier
        index={4}
      />
      <KpiCard
        label={marketingKpiData?.adSpendPct?.label}
        value={marketingKpiData?.adSpendPct?.value}
        change={marketingKpiData?.adSpendPct?.change}
        sparkline={[8.1, 7.8, 7.5, 7.4, 7.6, 7.2, 7.3]}
        caption={marketingKpiData?.adSpendPct?.caption}
        isPercent
        index={5}
      />
      <KpiCard
        label={marketingKpiData?.cac?.label}
        value={marketingKpiData?.cac?.value}
        change={marketingKpiData?.cac?.change}
        sparkline={[1200, 1280, 1350, 1400, 1480, 1460, 1472]}
        caption={marketingKpiData?.cac?.caption}
        isCurrency
        alert={marketingKpiData?.cac?.alert}
        index={6}
      />
    </div>
  );
}
