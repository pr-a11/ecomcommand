import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useOperationsData() {
  const [operationsKpis, setOperationsKpis] = useState<any>(null);
  const [courierData, setCourierData] = useState<any[]>([]);
  const [orderFunnelData, setOrderFunnelData] = useState<any[]>([]);
  const [ndrData, setNdrData] = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAll() {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }

        const [kpiRes, courierRes, ndrRes, alertsRes] = await Promise.all([
          supabase.from('operations_kpis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('courier_performance').select('*').eq('user_id', user.id).order('shipments', { ascending: false }),
          supabase.from('ndr_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('inventory_alerts').select('*').eq('user_id', user.id),
        ]);

        if (kpiRes.data) {
          const k = kpiRes.data;
          setOperationsKpis({
            dispatched: { value: k.dispatched, label: 'Dispatched Today', sub: 'orders' },
            pending: { value: k.pending, label: 'Pending Dispatch', sub: 'urgent', isAlert: true },
            inTransit: { value: k.in_transit, label: 'In Transit', sub: 'active' },
            deliveredToday: { value: k.delivered_today, label: 'Delivered Today', change: k.delivered_today_change },
            returnRequests: { value: k.return_requests, label: 'Return Requests', change: k.return_requests_change },
            avgDeliveryDays: { value: k.avg_delivery_days, label: 'Avg Delivery Time', sub: 'days', change: k.avg_delivery_days_change },
          });

          // Derive order funnel from dispatched count
          setOrderFunnelData([
            { stage: 'Placed', count: k.dispatched + k.pending, pct: 100 },
            { stage: 'Confirmed', count: Math.round((k.dispatched + k.pending) * 0.979), pct: 97.9 },
            { stage: 'Packed', count: Math.round((k.dispatched + k.pending) * 0.958), pct: 95.8 },
            { stage: 'Dispatched', count: k.dispatched, pct: Math.round((k.dispatched / (k.dispatched + k.pending)) * 100 * 10) / 10 },
            { stage: 'In Transit', count: k.in_transit, pct: Math.round((k.in_transit / (k.dispatched + k.pending)) * 100 * 10) / 10 },
            { stage: 'Delivered', count: k.delivered_today, pct: Math.round((k.delivered_today / (k.dispatched + k.pending)) * 100 * 10) / 10 },
          ]);
        }

        if (courierRes.data) {
          setCourierData(courierRes.data.map((r: any) => ({
            courier: r.courier, shipments: r.shipments, deliveredPct: r.delivered_pct,
            avgDays: r.avg_days, ndrRate: r.ndr_rate, costPerShipment: r.cost_per_shipment,
          })));
        }

        if (ndrRes.data) {
          setNdrData(ndrRes.data.map((r: any) => ({
            orderId: r.order_id, customer: r.customer, city: r.city,
            courier: r.courier, attempts: r.attempts, reason: r.reason, status: r.status,
          })));
        }

        if (alertsRes.data) {
          setInventoryAlerts(alertsRes.data.map((r: any) => ({
            product: r.product, sku: r.sku, stock: r.stock,
            reorderPoint: r.reorder_point, suggested: r.suggested, urgency: r.urgency,
          })));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load operations data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();

    const channel = supabase
      .channel('operations_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'operations_kpis' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ndr_orders' }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { operationsKpis, courierData, orderFunnelData, ndrData, inventoryAlerts, isLoading, error };
}
