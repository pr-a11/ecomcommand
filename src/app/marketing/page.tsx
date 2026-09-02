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
import ActiveUsersByCountry from './components/ActiveUsersByCountry';
import MarketingTrendChart from './components/MarketingTrendChart';

export default function MarketingPage() {
  return (
    <AppLayout currentPath="/marketing">
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Marketing</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-gray-600">
              All Channels ▾
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <MarketingKpiGrid />

        {/* Campaign Performance + Marketing Insights — Brandstack primary layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <CampaignPerformanceTable />
          </div>
          <div className="xl:col-span-1">
            <MarketingInsightsPanel />
          </div>
        </div>

        {/* Marketing Trend + Active Users by Country */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3">
            <MarketingTrendChart />
          </div>
          <div className="xl:col-span-2">
            <ActiveUsersByCountry />
          </div>
        </div>

        {/* Funnel + Abandoned Carts + Live Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ConversionFunnelChart />
          <AbandonedCartsCard />
          <LiveActiveUsersCard />
        </div>

        {/* Channel Sessions + Age/Gender */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ChannelSessionsTable />
          <AgeGenderChart />
        </div>
      </div>
    </AppLayout>
  );
}
