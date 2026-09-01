'use client';
import React from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import { Info, Settings2, TrendingUp, AlertTriangle, Activity, Lightbulb } from 'lucide-react';

const insightConfig = {
  best: {
    icon: TrendingUp,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    labelColor: 'text-emerald-700',
    label: 'BEST PERFORMER',
    borderColor: 'border-l-emerald-500',
    cardBg: 'bg-white',
  },
  attention: {
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    labelColor: 'text-red-600',
    label: 'NEEDS ATTENTION',
    borderColor: 'border-l-red-400',
    cardBg: 'bg-white',
  },
  trend: {
    icon: Activity,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    labelColor: 'text-blue-600',
    label: 'TREND',
    borderColor: 'border-l-blue-400',
    cardBg: 'bg-white',
  },
  opportunity: {
    icon: Lightbulb,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    labelColor: 'text-amber-600',
    label: 'OPPORTUNITY',
    borderColor: 'border-l-amber-400',
    cardBg: 'bg-white',
  },
};

export default function MarketingInsightsPanel() {
  const { marketingInsights } = useMarketingData();

  return (
    <div className="bs-chart-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="bs-chart-title">Marketing Insights</h3>
          <Info size={12} className="text-gray-300" />
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings2 size={13} className="text-gray-400" />
        </button>
      </div>
      <p className="bs-chart-subtitle mb-4">Key performance signals · Last 30 days</p>

      <div className="flex flex-col gap-3 flex-1">
        {marketingInsights?.map((insight) => {
          const config = insightConfig?.[insight?.type as keyof typeof insightConfig];
          if (!config) return null;
          const IconComp = config.icon;
          return (
            <div
              key={insight?.id}
              className={`rounded-lg p-3 border border-gray-100 border-l-4 ${config.borderColor} ${config.cardBg}`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                  <IconComp size={14} className={config.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${config.labelColor}`}>
                    {insight?.label || config.label}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">{insight?.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}