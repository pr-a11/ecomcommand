'use client';
import React from 'react';
import KpiCard from '@/components/ui/KpiCard';
import { useSalesData } from '@/hooks/useSalesData';

export default function DashboardKpiGrid() {
  const { kpiData } = useSalesData();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
      <KpiCard
        label={kpiData?.grossSales?.label}
        value={kpiData?.grossSales?.value}
        change={kpiData?.grossSales?.change}
        sparkline={kpiData?.grossSales?.sparkline}
        isCurrency
        index={0}
      />
      <KpiCard
        label={kpiData?.invoicedSales?.label}
        value={kpiData?.invoicedSales?.value}
        change={kpiData?.invoicedSales?.change}
        sparkline={kpiData?.invoicedSales?.sparkline}
        isCurrency
        index={1}
      />
      <KpiCard
        label={kpiData?.netSales?.label}
        value={kpiData?.netSales?.value}
        change={kpiData?.netSales?.change}
        sparkline={kpiData?.netSales?.sparkline}
        isCurrency
        index={2}
      />
      <KpiCard
        label={kpiData?.orders?.label}
        value={kpiData?.orders?.value}
        change={kpiData?.orders?.change}
        sparkline={kpiData?.orders?.sparkline}
        badge={kpiData?.orders?.badge}
        index={3}
      />
      <KpiCard
        label={kpiData?.aov?.label}
        value={kpiData?.aov?.value}
        change={kpiData?.aov?.change}
        sparkline={kpiData?.aov?.sparkline}
        isCurrency
        index={4}
      />
      <KpiCard
        label={kpiData?.contributionMargin?.label}
        value={kpiData?.contributionMargin?.value}
        change={kpiData?.contributionMargin?.change}
        sparkline={kpiData?.contributionMargin?.sparkline}
        isPercent
        index={5}
      />
      <KpiCard
        label={kpiData?.returningCustomerRate?.label}
        value={kpiData?.returningCustomerRate?.value}
        change={kpiData?.returningCustomerRate?.change}
        sparkline={kpiData?.returningCustomerRate?.sparkline}
        isPercent
        index={6}
      />
      <KpiCard
        label={kpiData?.adsSpend?.label}
        value={kpiData?.adsSpend?.value}
        change={kpiData?.adsSpend?.change}
        sparkline={kpiData?.adsSpend?.sparkline}
        isCurrency
        alert
        index={7}
      />
      <KpiCard
        label={kpiData?.attributedROAS?.label}
        value={kpiData?.attributedROAS?.value}
        change={kpiData?.attributedROAS?.change}
        sparkline={kpiData?.attributedROAS?.sparkline}
        isMultiplier
        index={8}
      />
    </div>
  );
}
