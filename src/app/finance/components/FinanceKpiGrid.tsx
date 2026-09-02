'use client';
import React from 'react';

import KpiCard from '@/components/ui/KpiCard';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useSalesData } from '@/hooks/useSalesData';

export default function FinanceKpiGrid() {
  const { financeKpiData } = useFinanceData();
  const { kpiData } = useSalesData();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiCard
        label={financeKpiData?.grossSales?.label}
        value={financeKpiData?.grossSales?.value}
        change={financeKpiData?.grossSales?.change}
        sparkline={kpiData?.grossSales?.sparkline}
        caption={financeKpiData?.grossSales?.caption}
        isCurrency
        index={0}
      />
      <KpiCard
        label={financeKpiData?.returningCustomerRate?.label}
        value={financeKpiData?.returningCustomerRate?.value}
        change={financeKpiData?.returningCustomerRate?.change}
        sparkline={kpiData?.returningCustomerRate?.sparkline}
        caption={financeKpiData?.returningCustomerRate?.caption}
        isPercent
        index={1}
      />
      <KpiCard
        label={financeKpiData?.orders?.label}
        value={financeKpiData?.orders?.value}
        change={financeKpiData?.orders?.change}
        sparkline={kpiData?.orders?.sparkline}
        badge={financeKpiData?.orders?.badge}
        index={2}
      />
      <KpiCard
        label={financeKpiData?.adsSpend?.label}
        value={financeKpiData?.adsSpend?.value}
        change={financeKpiData?.adsSpend?.change}
        sparkline={kpiData?.adsSpend?.sparkline}
        caption={financeKpiData?.adsSpend?.caption}
        isCurrency
        alert
        index={3}
      />
      <KpiCard
        label={financeKpiData?.attributedROAS?.label}
        value={financeKpiData?.attributedROAS?.value}
        change={financeKpiData?.attributedROAS?.change}
        sparkline={kpiData?.attributedROAS?.sparkline}
        caption={financeKpiData?.attributedROAS?.caption}
        isMultiplier
        index={4}
      />
      <KpiCard
        label={financeKpiData?.contributionMargin?.label}
        value={financeKpiData?.contributionMargin?.value}
        change={financeKpiData?.contributionMargin?.change}
        sparkline={kpiData?.contributionMargin?.sparkline}
        isPercent
        index={5}
      />
    </div>
  );
}
