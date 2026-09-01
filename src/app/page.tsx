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
      <div className="space-y-5">
        {/* Page header - Brandstack style */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <a
            href="#funnel"
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-gray-600"
          >
            Sales Journey →
          </a>
        </div>

        {/* KPI Grid */}
        <DashboardKpiGrid />

        {/* OVERVIEW section */}
        <div className="bs-section-divider">
          <span className="text-gray-300 text-sm">✦</span>
          <span className="bs-section-label">Overview</span>
          <div className="bs-section-line" />
        </div>

        {/* Charts row - Sales by Channel + Net Sales vs Margin */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SalesByChannelChart />
          <NetSalesVsMarginChart />
        </div>

        {/* PERFORMANCE section */}
        <div className="bs-section-divider">
          <span className="text-gray-300 text-sm">✦</span>
          <span className="bs-section-label">Performance</span>
          <div className="bs-section-line" />
        </div>

        {/* COD vs Prepaid + Channel Mix */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CodPrepaidCard />
          <ChannelMixPanel />
        </div>

        {/* Sales Summary + Top SKUs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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