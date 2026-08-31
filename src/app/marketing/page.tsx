import React from 'react';
import AppLayout from '@/components/AppLayout';
import MarketingKpiGrid from './components/MarketingKpiGrid';
import CampaignPerformanceTable from './components/CampaignPerformanceTable';
import MarketingInsightsPanel from './components/MarketingInsightsPanel';
import ConversionFunnelChart from './components/ConversionFunnelChart';
import ChannelSessionsTable from './components/ChannelSessionsTable';
import AgeGenderChart from './components/AgeGenderChart';
import AbandonedCartsCard from './components/AbandonedCartsCard';
import LiveActiveUsersCard from './components/LiveActiveUsersCard';

export default function MarketingPage() {
  return (
    <AppLayout currentPath="/marketing">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Marketing</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Aug 1 – Aug 29, 2026 · Meta + Google · GA4</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors font-500 text-foreground">
              All Channels ▾
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <MarketingKpiGrid />

        {/* Campaign Table + Insights side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <CampaignPerformanceTable />
          </div>
          <div className="xl:col-span-1">
            <MarketingInsightsPanel />
          </div>
        </div>

        {/* Funnel + Abandoned Carts + Live Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <ConversionFunnelChart />
          </div>
          <div className="md:col-span-1">
            <AbandonedCartsCard />
          </div>
          <div className="md:col-span-1">
            <LiveActiveUsersCard />
          </div>
        </div>

        {/* Channel Sessions + Age/Gender */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ChannelSessionsTable />
          <AgeGenderChart />
        </div>
      </div>
    </AppLayout>
  );
}