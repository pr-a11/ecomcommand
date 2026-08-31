import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardKpiGrid from './components/DashboardKpiGrid';
import SalesByChannelChart from './components/SalesByChannelChart';
import NetSalesVsMarginChart from './components/NetSalesVsMarginChart';
import SalesSummaryTable from './components/SalesSummaryTable';
import ChannelMixPanel from './components/ChannelMixPanel';
import TopSkusPanel from './components/TopSkusPanel';
import ReturnsByChannelTable from './components/ReturnsByChannelTable';
import GeographicSalesPanel from './components/GeographicSalesPanel';
import CodPrepaidCard from './components/CodPrepaidCard';

export default function DashboardPage() {
  return (
    <AppLayout currentPath="/">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Aug 1 – Aug 29, 2026 · All Channels</p>
          </div>
          <a
            href="#funnel"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-600 hover:bg-primary/20 transition-colors"
          >
            Sales Journey →
          </a>
        </div>

        {/* KPI Grid */}
        <DashboardKpiGrid />

        {/* COD vs Prepaid + Channel Mix */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <CodPrepaidCard />
          <ChannelMixPanel />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <SalesByChannelChart />
          <NetSalesVsMarginChart />
        </div>

        {/* Sales Summary + Top SKUs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <SalesSummaryTable />
          </div>
          <div className="lg:col-span-2">
            <TopSkusPanel />
          </div>
        </div>

        {/* Geographic */}
        <GeographicSalesPanel />

        {/* Returns */}
        <ReturnsByChannelTable />
      </div>
    </AppLayout>
  );
}