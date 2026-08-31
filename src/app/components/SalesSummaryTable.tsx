'use client';
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import SectionHeader from '@/components/ui/SectionHeader';
import { FileText } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

export default function SalesSummaryTable() {
  const { salesSummaryData } = useSalesData();

  return (
    <div className="chart-card h-full">
      <SectionHeader icon={<FileText size={14} />} label="Sales Summary" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-600 text-muted-foreground pb-2 pr-4">Item</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2 pr-4">Orders</th>
              <th className="text-right text-xs font-600 text-muted-foreground pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesSummaryData?.map((row) => (
              <tr
                key={`ss-${row?.label}`}
                className={`border-b border-border/50 hover:bg-muted/40 transition-colors ${
                  row?.isTotal ? 'bg-muted/30 font-700' : row?.isSubtotal ? 'bg-muted/20 font-600' : ''
                }`}
              >
                <td className={`py-2.5 pr-4 text-sm ${row?.isTotal ? 'font-700 text-foreground' : row?.isSubtotal ? 'font-600' : 'text-foreground'}`}>
                  {row?.label}
                </td>
                <td className={`py-2.5 pr-4 text-right tabular-nums text-sm ${row?.isTotal || row?.isSubtotal ? 'font-600' : 'text-muted-foreground'}`}>
                  {row?.orders}
                </td>
                <td
                  className={`py-2.5 text-right tabular-nums text-sm font-600 ${
                    row?.isTotal ? 'text-primary text-base font-700' : row?.isSubtotal ?'text-foreground': !row?.isPositive ?'text-negative' : 'text-foreground'
                  }`}
                >
                  {row?.amount < 0 ? `−${formatINR(Math.abs(row?.amount))}` : formatINR(row?.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}