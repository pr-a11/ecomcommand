'use client';
import React, { useState } from 'react';
import { useMarketingData } from '@/hooks/useMarketingData';
import { Info, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

type SortKey = 'spend' | 'attributedSales' | 'roas' | 'orders';
type SortDir = 'asc' | 'desc';

function StatusBadge({ status }: { status: 'Scale' | 'Hold' | 'Cut' }) {
  if (status === 'Scale') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Scale
      </span>
    );
  }
  if (status === 'Hold') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Hold
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      Cut
    </span>
  );
}

function RoasValue({ roas }: { roas: number }) {
  if (roas >= 3)
    return (
      <span className="text-sm font-bold tabular-nums text-emerald-600">{roas.toFixed(2)}x</span>
    );
  if (roas >= 1.5)
    return (
      <span className="text-sm font-bold tabular-nums text-amber-600">{roas.toFixed(2)}x</span>
    );
  return <span className="text-sm font-bold tabular-nums text-red-600">{roas.toFixed(2)}x</span>;
}

function PlatformBadge({ platform }: { platform: string }) {
  if (platform === 'meta') {
    return (
      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 flex-shrink-0">
        M
      </span>
    );
  }
  return (
    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 flex-shrink-0">
      G
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronDown size={9} className="text-gray-300" />;
  return dir === 'desc' ? (
    <ChevronDown size={9} className="text-gray-700" />
  ) : (
    <ChevronUp size={9} className="text-gray-700" />
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
  const blendedRoas = totalSpend > 0 ? totalAttrSales / totalSpend : 0;

  return (
    <div className="bs-chart-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="bs-chart-title">Campaign Performance</h3>
          <Info size={12} className="text-gray-300" />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            All channels ▾
          </button>
          <button className="text-xs text-gray-500 font-medium hover:text-gray-800 transition-colors">
            View detail →
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings2 size={13} className="text-gray-400" />
          </button>
        </div>
      </div>
      <p className="bs-chart-subtitle mb-3">
        All channels · {campaignData.length} campaigns · Spend {formatINR(totalSpend)} · Attributed
        Sales {formatINR(totalAttrSales)} · Attributed ROAS {blendedRoas.toFixed(2)}x · reported by
        Meta Ads + Google Ads
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2.5 pr-3 min-w-[180px]">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Campaign
                </span>
              </th>
              <th
                className="text-right pb-2.5 pr-3 cursor-pointer select-none"
                onClick={() => handleSort('spend')}
              >
                <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Spend <SortIcon active={sortKey === 'spend'} dir={sortDir} />
                </span>
              </th>
              <th
                className="text-right pb-2.5 pr-3 cursor-pointer select-none"
                onClick={() => handleSort('attributedSales')}
              >
                <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Attr. Sales <SortIcon active={sortKey === 'attributedSales'} dir={sortDir} />
                </span>
              </th>
              <th
                className="text-right pb-2.5 pr-3 cursor-pointer select-none"
                onClick={() => handleSort('orders')}
              >
                <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Orders <SortIcon active={sortKey === 'orders'} dir={sortDir} />
                </span>
              </th>
              <th
                className="text-right pb-2.5 pr-3 cursor-pointer select-none"
                onClick={() => handleSort('roas')}
              >
                <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">
                  ROAS <SortIcon active={sortKey === 'roas'} dir={sortDir} />
                </span>
              </th>
              <th className="text-right pb-2.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </span>
              </th>
            </tr>
          </thead>
        </table>
        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
          <table className="w-full min-w-[520px]">
            <tbody>
              {sorted.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-2.5 pr-3 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={row.platform} />
                      <span className="text-sm text-gray-800 truncate max-w-[155px]">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-sm text-gray-500">
                    {formatINR(row.spend)}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-sm font-semibold text-gray-800">
                    {formatINR(row.attributedSales)}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-sm text-gray-500">
                    {row.orders}
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <RoasValue roas={row.roas} />
                  </td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer totals */}
        <table className="w-full min-w-[520px]">
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50/50">
              <td className="py-2.5 pr-3 text-sm font-bold text-gray-800 min-w-[180px]">Total</td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-sm font-semibold text-gray-700">
                {formatINR(totalSpend)}
              </td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-sm font-bold text-gray-800">
                {formatINR(totalAttrSales)}
              </td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-sm font-semibold text-gray-700">
                {totalOrders}
              </td>
              <td className="py-2.5 pr-3 text-right">
                <RoasValue roas={blendedRoas} />
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
