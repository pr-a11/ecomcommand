'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { useOperationsData } from '@/hooks/useOperationsData';

const deliveryByStateData = [
  { state: 'Maharashtra', deliveries: 284, onTime: 94.2 },
  { state: 'Delhi', deliveries: 241, onTime: 91.8 },
  { state: 'Karnataka', deliveries: 198, onTime: 96.1 },
  { state: 'Tamil Nadu', deliveries: 164, onTime: 93.4 },
  { state: 'Gujarat', deliveries: 142, onTime: 95.2 },
  { state: 'Rajasthan', deliveries: 128, onTime: 89.6 },
  { state: 'West Bengal', deliveries: 112, onTime: 88.4 },
  { state: 'Telangana', deliveries: 98, onTime: 92.8 },
];

function StatCard({ label, value, sub, change, isAlert }: {
  label: string; value: number; sub?: string; change?: number; isAlert?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 ${isAlert ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
      <p className={`text-xs font-medium mb-1 ${isAlert ? 'text-red-500' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-3xl font-bold mb-1 ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      {change !== undefined && (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full mt-1 ${change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}{typeof change === 'number' && change < 5 ? '' : '%'}
        </span>
      )}
    </div>
  );
}

const urgencyColor = (u: string) => {
  if (u === 'critical') return 'bg-red-100 text-red-700';
  if (u === 'high') return 'bg-orange-100 text-orange-700';
  if (u === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

export default function OperationsPage() {
  const pathname = usePathname();
  const { operationsKpis, courierData, orderFunnelData, ndrData, inventoryAlerts, isLoading, error } = useOperationsData();

  const maxDeliveries = Math.max(...deliveryByStateData.map((d) => d.deliveries));

  if (isLoading) {
    return (
      <AppLayout currentPath={pathname}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout currentPath={pathname}>
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPath={pathname}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Shipping, courier & inventory management</p>
        </div>

        {/* KPI Grid */}
        {operationsKpis && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard label={operationsKpis.dispatched.label} value={operationsKpis.dispatched.value} sub={operationsKpis.dispatched.sub} />
            <StatCard label={operationsKpis.pending.label} value={operationsKpis.pending.value} sub={operationsKpis.pending.sub} isAlert />
            <StatCard label={operationsKpis.inTransit.label} value={operationsKpis.inTransit.value} sub={operationsKpis.inTransit.sub} />
            <StatCard label={operationsKpis.deliveredToday.label} value={operationsKpis.deliveredToday.value} change={operationsKpis.deliveredToday.change} />
            <StatCard label={operationsKpis.returnRequests.label} value={operationsKpis.returnRequests.value} change={operationsKpis.returnRequests.change} />
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">{operationsKpis.avgDeliveryDays.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{operationsKpis.avgDeliveryDays.value}</p>
              <p className="text-xs text-gray-400">days avg</p>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full mt-1 bg-emerald-50 text-emerald-700">
                ↓ {Math.abs(operationsKpis.avgDeliveryDays.change ?? 0)} days
              </span>
            </div>
          </div>
        )}

        {/* Order Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Order Fulfilment Funnel</h3>
          <div className="flex items-end gap-2 overflow-x-auto pb-2">
            {orderFunnelData?.map((stage: any, i: number) => (
              <div key={stage.stage} className="flex flex-col items-center flex-1 min-w-[80px]">
                <span className="text-sm font-bold text-gray-900 mb-1">{stage.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(stage.pct / 100) * 120}px`,
                    backgroundColor: `hsl(${160 - i * 20}, 70%, ${45 + i * 5}%)`,
                  }}
                />
                <p className="text-xs text-gray-500 mt-1 text-center">{stage.stage}</p>
                <p className="text-xs font-semibold text-gray-700">{stage.pct}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Courier Performance */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Courier Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Courier', 'Shipments', 'Delivered %', 'Avg Days', 'NDR Rate', 'Cost/Ship'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {courierData?.map((row: any) => (
                    <tr key={row.courier} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.courier}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.shipments}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${row.deliveredPct >= 95 ? 'text-emerald-600' : row.deliveredPct >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                          {row.deliveredPct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.avgDays}d</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${row.ndrRate <= 3 ? 'text-emerald-600' : row.ndrRate <= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                          {row.ndrRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹{row.costPerShipment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery by State */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Delivery by State</h3>
            <div className="space-y-2.5">
              {deliveryByStateData.map((row) => (
                <div key={row.state} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-28 flex-shrink-0">{row.state}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-teal-500 transition-all"
                      style={{ width: `${(row.deliveries / maxDeliveries) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{row.deliveries}</span>
                  <span className={`text-xs font-semibold w-12 text-right ${row.onTime >= 95 ? 'text-emerald-600' : row.onTime >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                    {row.onTime}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NDR Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Non-Delivery Reports (NDR)</h3>
            <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">{ndrData?.length ?? 0} active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Order ID', 'Customer', 'City', 'Courier', 'Attempts', 'Reason', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ndrData?.map((row: any) => (
                  <tr key={row.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">{row.orderId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.city}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.courier}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-gray-700">{row.attempts}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px] truncate">{row.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.status === 'RTO' ? 'bg-red-100 text-red-700' : row.status === 'Reattempt' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-teal-600 font-semibold hover:text-teal-800 transition-colors">Resolve</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Inventory Alerts & Reorder Suggestions</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {inventoryAlerts?.map((item: any) => (
              <div key={item.sku} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${urgencyColor(item.urgency)}`}>{item.urgency}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product}</p>
                  <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.stock} units</p>
                  <p className="text-xs text-gray-400">Reorder at {item.reorderPoint}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Suggested order</p>
                  <p className="text-sm font-bold text-teal-600">{item.suggested} units</p>
                </div>
                <button className="text-xs bg-teal-50 text-teal-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
