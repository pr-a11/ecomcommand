'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMarketingData } from '@/hooks/useMarketingData';
import SectionHeader from '@/components/ui/SectionHeader';
import { Megaphone, ArrowUpDown, ExternalLink } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

type SortKey = 'spend' | 'attributedSales' | 'roas' | 'orders';
type SortDir = 'asc' | 'desc';

function StatusBadge({ status }: { status: 'Scale' | 'Hold' | 'Cut' }) {
  if (status === 'Scale') return <span className="status-scale">{status}</span>;
  if (status === 'Hold') return <span className="status-hold">{status}</span>;
  return <span className="status-cut">{status}</span>;
}

function RoasBadge({ roas }: { roas: number }) {
  if (roas >= 3) return <span className="text-sm font-700 text-primary tabular-nums">{roas.toFixed(2)}x</span>;
  if (roas >= 1.5) return <span className="text-sm font-700 text-amber-600 tabular-nums">{roas.toFixed(2)}x</span>;
  return <span className="text-sm font-700 text-negative tabular-nums">{roas.toFixed(2)}x</span>;
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === 'meta') {
    return (
      <span className="text-xs font-700 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">M</span>
    );
  }
  return (
    <span className="text-xs font-700 px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">G</span>
  );
}

export default function CampaignPerformanceTable() {
  const { campaignData } = useMarketingData();
  const [sortKey, setSortKey] = useState<SortKey>('attributedSales');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...campaignData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const totalSpend = campaignData.reduce((s, c) => s + c.spend, 0);
  const totalAttrSales = campaignData.reduce((s, c) => s + c.attributedSales, 0);
  const totalOrders = campaignData.reduce((s, c) => s + c.orders, 0);
  const blendedRoas = totalAttrSales / totalSpend;

  return (
    <div className="chart-card">
      <SectionHeader
        icon={<Megaphone size={14} />}
        label="Campaign Performance"
        action={
          <button className="flex items-center gap-1 text-xs text-primary font-500 hover:underline">
            View detail <ExternalLink size={10} />
          </button>
        }
      />
      <p className="text-xs text-muted-foreground mb-4">
        All channels · {campaignData.length} campaigns · Spend {formatINR(totalSpend)} · Attr. Sales {formatINR(totalAttrSales)} · Blended ROAS {blendedRoas.toFixed(2)}x · reported by Meta/Google
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-600 text-muted-foreground pb-2 pr-4 min-w-[180px]">
                Campaign
              </th>
              <th
                className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('spend')}
              >
                <span className="flex items-center justify-end gap-1">
                  Spend <ArrowUpDown size={10} className={sortKey === 'spend' ? 'text-primary' : ''} />
                </span>
              </th>
              <th
                className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('attributedSales')}
              >
                <span className="flex items-center justify-end gap-1">
                  Attr. Sales <ArrowUpDown size={10} className={sortKey === 'attributedSales' ? 'text-primary' : ''} />
                </span>
              </th>
              <th
                className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('orders')}
              >
                <span className="flex items-center justify-end gap-1">
                  Orders <ArrowUpDown size={10} className={sortKey === 'orders' ? 'text-primary' : ''} />
                </span>
              </th>
              <th
                className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('roas')}
              >
                <span className="flex items-center justify-end gap-1">
                  ROAS <ArrowUpDown size={10} className={sortKey === 'roas' ? 'text-primary' : ''} />
                </span>
              </th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-border/50 hover:bg-muted/40 transition-colors group"
              >
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={row.platform} />
                    <span className="text-sm font-500 text-foreground truncate max-w-[160px]">{row.name}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm text-muted-foreground">
                  {formatINR(row.spend)}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm font-600 text-foreground">
                  {formatINR(row.attributedSales)}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sm text-muted-foreground">
                  {row.orders}
                </td>
                <td className="py-2.5 pr-4 text-right">
                  <RoasBadge roas={row.roas} />
                </td>
                <td className="py-2.5 text-right">
                  <StatusBadge status={row.status} />
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/20">
              <td className="py-2.5 pr-4 text-sm font-700 text-foreground">Total</td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-sm font-600 text-foreground">{formatINR(totalSpend)}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-sm font-700 text-foreground">{formatINR(totalAttrSales)}</td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-sm font-600 text-foreground">{totalOrders}</td>
              <td className="py-2.5 pr-4 text-right">
                <RoasBadge roas={blendedRoas} />
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}