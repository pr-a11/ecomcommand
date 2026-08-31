import React from 'react';
import AppLayout from '@/components/AppLayout';
import FinanceKpiGrid from './components/FinanceKpiGrid';
import PlWaterfallChart from './components/PlWaterfallChart';
import NetSalesOverTimeChart from './components/NetSalesOverTimeChart';
import ContributionMarginChart from './components/ContributionMarginChart';
import GeographicSalesFinance from './components/GeographicSalesFinance';
import ChannelProfitabilityTable from './components/ChannelProfitabilityTable';
import MarketplaceFeeTable from './components/MarketplaceFeeTable';

export default function FinancePage() {
  return (
    <AppLayout currentPath="/finance">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Finance</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Aug 1 – Aug 29, 2026 · P&L Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors font-500 text-foreground">
              Export CSV
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors font-500 text-foreground">
              Export PDF
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <FinanceKpiGrid />

        {/* P&L Waterfall + Net Sales Over Time */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <PlWaterfallChart />
          <NetSalesOverTimeChart />
        </div>

        {/* Contribution Margin + Geographic */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2">
            <ContributionMarginChart />
          </div>
          <div className="lg:col-span-3">
            <GeographicSalesFinance />
          </div>
        </div>

        {/* Channel Profitability + Fee Leakage */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ChannelProfitabilityTable />
          <MarketplaceFeeTable />
        </div>
      </div>
    </AppLayout>
  );
}