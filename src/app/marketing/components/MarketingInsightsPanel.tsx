'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useMarketingData } from '@/hooks/useMarketingData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Sparkles, TrendingUp, AlertTriangle, Activity, Lightbulb } from 'lucide-react';

const insightConfig = {
  best: {
    icon: <TrendingUp size={16} />,
    iconBg: 'bg-gray-100',
    iconColor: 'text-primary',
    labelColor: 'text-primary',
    cardClass: 'insight-best',
  },
  attention: {
    icon: <AlertTriangle size={16} />,
    iconBg: 'bg-red-100',
    iconColor: 'text-negative',
    labelColor: 'text-negative',
    cardClass: 'insight-attention',
  },
  trend: {
    icon: <Activity size={16} />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-channel-flipkart',
    labelColor: 'text-channel-flipkart',
    cardClass: 'insight-trend',
  },
  opportunity: {
    icon: <Lightbulb size={16} />,
    iconBg: 'bg-amber-100',
    iconColor: 'text-warning',
    labelColor: 'text-warning',
    cardClass: 'insight-opportunity',
  },
};

export default function MarketingInsightsPanel() {
  const { marketingInsights } = useMarketingData();

  return (
    <div className="chart-card h-full flex flex-col">
      <SectionHeader
        icon={<Sparkles size={14} />}
        label="Marketing Insights"
      />
      <p className="text-xs text-muted-foreground mb-4">Key performance signals · Last 30 days</p>

      <div className="flex flex-col gap-3 flex-1">
        {marketingInsights?.map((insight, i) => {
          const config = insightConfig?.[insight?.type];
          return (
            <motion.div
              key={insight?.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.35, ease: 'easeOut' }}
              className={`rounded-lg p-3 ${config?.cardClass}`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${config?.iconBg}`}>
                  <span className={config?.iconColor}>{config?.icon}</span>
                </div>
                <div>
                  <p className={`text-xs font-700 uppercase tracking-wider mb-0.5 ${config?.labelColor}`}>
                    {insight?.label}
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{insight?.text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}